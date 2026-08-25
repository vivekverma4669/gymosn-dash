import { Member } from '../models/Member.model';
import { PaymentTransaction, IPaymentTransaction } from '../models/PaymentTransaction.model';
import { AttendanceRecord, IAttendanceRecord } from '../models/AttendanceRecord.model';
import { ApiError } from '../common/ApiError';
import { toDateOnly } from '../utils/date';

export type ReportType = 'payments' | 'members' | 'attendance';

export interface ReportResult {
  columns: string[];
  rows: (string | number)[][];
  summary?: Record<string, string | number>;
}

interface DateRange {
  from?: string;
  to?: string;
}

type PopulatedPayment = IPaymentTransaction & {
  member: { name: string; phone: string } | null;
};

type PopulatedAttendance = IAttendanceRecord & {
  member: { name: string; phone: string } | null;
};

const buildDateFilter = ({ from, to }: DateRange): Record<string, Date> | undefined => {
  if (!from && !to) return undefined;
  const filter: Record<string, Date> = {};
  if (from) filter.$gte = new Date(from);
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    filter.$lte = end;
  }
  return filter;
};

const getPaymentsReport = async (gymId: string, range: DateRange): Promise<ReportResult> => {
  const dateFilter = buildDateFilter(range);
  const query: Record<string, unknown> = { gym: gymId };
  if (dateFilter) query.date = dateFilter;

  const payments = await PaymentTransaction.find(query)
    .populate({ path: 'member', select: 'name phone' })
    .sort({ date: -1 })
    .lean<PopulatedPayment[]>();

  const rows = payments.map((p) => [
    toDateOnly(p.date),
    p.invoiceNo,
    p.member?.name ?? 'Unknown Member',
    p.member?.phone ?? '',
    p.amount,
    p.method,
    p.notes ?? '',
  ]);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return {
    columns: ['Date', 'Invoice No', 'Member', 'Phone', 'Amount', 'Method', 'Notes'],
    rows,
    summary: { 'Total collected': totalAmount, 'Transaction count': payments.length },
  };
};

const getMembersReport = async (gymId: string, range: DateRange): Promise<ReportResult> => {
  const dateFilter = buildDateFilter(range);
  const query: Record<string, unknown> = { gym: gymId };
  if (dateFilter) query.joiningDate = dateFilter;

  const members = await Member.find(query)
    .populate<{ plan: { name: string } | null }>({ path: 'plan', select: 'name' })
    .sort({ joiningDate: -1 })
    .lean();

  const now = Date.now();
  const rows = members.map((m) => [
    m.name,
    m.phone,
    m.plan?.name ?? 'Unknown Plan',
    toDateOnly(m.joiningDate),
    toDateOnly(m.expiryDate),
    !m.isActive ? 'Inactive' : m.expiryDate.getTime() < now ? 'Expired' : 'Active',
    m.agreedPrice,
    m.dueAmount,
  ]);

  return {
    columns: ['Name', 'Phone', 'Plan', 'Joining Date', 'Expiry Date', 'Status', 'Agreed Price', 'Due Amount'],
    rows,
    summary: { 'Total members': members.length, 'Total dues outstanding': members.reduce((s, m) => s + m.dueAmount, 0) },
  };
};

const getAttendanceReport = async (gymId: string, range: DateRange): Promise<ReportResult> => {
  const query: Record<string, unknown> = { gym: gymId };
  const dateFilter: Record<string, string> = {};
  if (range.from) dateFilter.$gte = range.from;
  if (range.to) dateFilter.$lte = range.to;
  if (Object.keys(dateFilter).length > 0) query.date = dateFilter;

  const records = await AttendanceRecord.find(query)
    .populate({ path: 'member', select: 'name phone' })
    .sort({ date: -1, checkInTime: -1 })
    .lean<PopulatedAttendance[]>();

  const rows = records.map((r) => [
    r.date,
    r.member?.name ?? 'Unknown Member',
    r.member?.phone ?? '',
    r.checkInTime.toISOString().slice(11, 16),
    r.status,
  ]);

  return {
    columns: ['Date', 'Member', 'Phone', 'Check-in Time', 'Status'],
    rows,
    summary: { 'Total check-ins': records.length },
  };
};

export const getReport = async (gymId: string, type: ReportType, range: DateRange): Promise<ReportResult> => {
  switch (type) {
    case 'payments':
      return getPaymentsReport(gymId, range);
    case 'members':
      return getMembersReport(gymId, range);
    case 'attendance':
      return getAttendanceReport(gymId, range);
    default:
      throw ApiError.badRequest('Invalid report type');
  }
};

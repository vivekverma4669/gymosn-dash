import { Member } from '../models/Member.model';
import { AttendanceRecord, AttendanceStatus } from '../models/AttendanceRecord.model';
import { ApiError } from '../common/ApiError';
import { toDateOnly } from '../utils/date';
import { phonesMatch } from '../utils/phone';

const LATE_CUTOFF_HOUR = 10; // check-ins after 10:00 AM count as Late

export type AttendanceRowStatus = AttendanceStatus | 'Absent' | 'Not Checked In';

export interface AttendanceRow {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  membershipId: string;
  checkInTime: string;
  date: string;
  status: AttendanceRowStatus;
  trainer: string;
  plan: string;
}

type PopulatedMember = {
  id: string;
  name: string;
  phone: string;
  plan: { name: string } | null;
  trainer: { name: string } | null;
};

export const getAttendanceForDate = async (gymId: string, date: string): Promise<AttendanceRow[]> => {
  const isToday = date === toDateOnly(new Date());

  const members = (await Member.find({ gym: gymId, isActive: true })
    .populate('plan', 'name')
    .populate('trainer', 'name')
    .sort({ name: 1 })) as unknown as PopulatedMember[];

  const records = await AttendanceRecord.find({
    gym: gymId,
    date,
    member: { $in: members.map((m) => m.id) },
  });
  const recordByMember = new Map(records.map((r) => [r.member.toString(), r]));

  return members.map((member) => {
    const record = recordByMember.get(member.id);
    return {
      id: member.id,
      memberId: member.id,
      memberName: member.name,
      phone: member.phone,
      membershipId: member.id,
      checkInTime: record ? record.checkInTime.toISOString() : '-',
      date,
      status: record ? record.status : isToday ? 'Not Checked In' : 'Absent',
      trainer: member.trainer?.name ?? 'Unassigned',
      plan: member.plan?.name ?? 'Unknown Plan',
    };
  });
};

export const checkInMember = async (gymId: string, memberId: string): Promise<AttendanceRow> => {
  const member = await Member.findOne({ _id: memberId, gym: gymId, isActive: true });
  if (!member) {
    throw ApiError.notFound('Active member not found');
  }

  const now = new Date();
  const date = toDateOnly(now);

  const existing = await AttendanceRecord.findOne({ gym: gymId, member: memberId, date });
  if (existing) {
    throw ApiError.conflict(`${member.name} is already checked in today`);
  }

  const status: AttendanceStatus = now.getHours() >= LATE_CUTOFF_HOUR ? 'Late' : 'Present';
  await AttendanceRecord.create({ gym: gymId, member: memberId, date, checkInTime: now, status });

  const rows = await getAttendanceForDate(gymId, date);
  const row = rows.find((r) => r.memberId === memberId);
  if (!row) {
    throw ApiError.internal('Failed to load attendance row after check-in');
  }
  return row;
};

export const checkInMemberByPhone = async (gymId: string, phone: string): Promise<AttendanceRow> => {
  const members = await Member.find({ gym: gymId, isActive: true });
  const match = members.find((m) => phonesMatch(m.phone, phone));
  if (!match) {
    throw ApiError.notFound('No active membership found for this phone number');
  }
  return checkInMember(gymId, match.id);
};

export const undoCheckIn = async (gymId: string, memberId: string): Promise<void> => {
  const date = toDateOnly(new Date());
  const result = await AttendanceRecord.deleteOne({ gym: gymId, member: memberId, date });
  if (result.deletedCount === 0) {
    throw ApiError.notFound('No check-in found for today to undo');
  }
};

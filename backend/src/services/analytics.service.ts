import { Member } from '../models/Member.model';
import { PaymentTransaction } from '../models/PaymentTransaction.model';
import { AttendanceRecord } from '../models/AttendanceRecord.model';
import { toDateOnly } from '../utils/date';

const MONTHS_BACK = 6;
const ATTENDANCE_DAYS_BACK = 30;

const monthKey = (d: Date): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const monthLabel = (d: Date): string => d.toLocaleString('en-US', { month: 'short', year: '2-digit' });

const lastNMonthStarts = (n: number): Date[] => {
  const now = new Date();
  const months: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  }
  return months;
};

export const getAnalytics = async (gymId: string) => {
  const months = lastNMonthStarts(MONTHS_BACK);
  const rangeStart = months[0];
  const now = new Date();

  const [payments, members, attendance] = await Promise.all([
    PaymentTransaction.find({ gym: gymId, date: { $gte: rangeStart } }).select('amount date').lean(),
    Member.find({ gym: gymId }).select('joiningDate expiryDate isActive').lean(),
    AttendanceRecord.find({
      gym: gymId,
      date: { $gte: toDateOnly(new Date(now.getTime() - ATTENDANCE_DAYS_BACK * 24 * 60 * 60 * 1000)) },
    })
      .select('date checkInTime')
      .lean(),
  ]);

  // Revenue trend (collected payments per month)
  const revenueByMonth = new Map<string, number>();
  months.forEach((m) => revenueByMonth.set(monthKey(m), 0));
  payments.forEach((p) => {
    const key = monthKey(p.date);
    if (revenueByMonth.has(key)) revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + p.amount);
  });

  // Member growth (joined this month) & churn (currently-lapsed members whose expiry fell in this month)
  const joinsByMonth = new Map<string, number>();
  const churnByMonth = new Map<string, number>();
  months.forEach((m) => {
    joinsByMonth.set(monthKey(m), 0);
    churnByMonth.set(monthKey(m), 0);
  });
  members.forEach((m) => {
    const joinKey = monthKey(m.joiningDate);
    if (joinsByMonth.has(joinKey)) joinsByMonth.set(joinKey, (joinsByMonth.get(joinKey) ?? 0) + 1);

    if (m.expiryDate.getTime() < now.getTime()) {
      const expiryKey = monthKey(m.expiryDate);
      if (churnByMonth.has(expiryKey)) churnByMonth.set(expiryKey, (churnByMonth.get(expiryKey) ?? 0) + 1);
    }
  });

  const revenueTrend = months.map((m) => ({
    month: monthKey(m),
    label: monthLabel(m),
    total: revenueByMonth.get(monthKey(m)) ?? 0,
  }));
  const memberGrowth = months.map((m) => ({
    month: monthKey(m),
    label: monthLabel(m),
    newMembers: joinsByMonth.get(monthKey(m)) ?? 0,
    churned: churnByMonth.get(monthKey(m)) ?? 0,
  }));

  // Attendance: daily check-ins for the last N days + check-ins by hour-of-day
  const dayBuckets = new Map<string, number>();
  for (let i = ATTENDANCE_DAYS_BACK - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dayBuckets.set(toDateOnly(d), 0);
  }
  const hourBuckets = new Array(24).fill(0) as number[];
  attendance.forEach((a) => {
    if (dayBuckets.has(a.date)) dayBuckets.set(a.date, (dayBuckets.get(a.date) ?? 0) + 1);
    hourBuckets[a.checkInTime.getHours()] += 1;
  });

  const attendanceDaily = Array.from(dayBuckets.entries()).map(([date, count]) => ({ date, count }));
  const attendanceByHour = hourBuckets.map((count, hour) => ({ hour, count }));

  const totalRevenue = revenueTrend.reduce((sum, r) => sum + r.total, 0);
  const totalNewJoins = memberGrowth.reduce((sum, m) => sum + m.newMembers, 0);
  const totalChurned = memberGrowth.reduce((sum, m) => sum + m.churned, 0);
  const activeMembers = members.filter((m) => m.isActive && m.expiryDate.getTime() >= now.getTime()).length;
  const totalMembers = members.length;
  const retentionRate = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 100;
  const totalCheckins = attendanceDaily.reduce((sum, d) => sum + d.count, 0);
  const avgDailyCheckins = Math.round((totalCheckins / ATTENDANCE_DAYS_BACK) * 10) / 10;

  return {
    summary: {
      totalRevenue,
      activeMembers,
      totalMembers,
      retentionRate,
      totalNewJoins,
      totalChurned,
      avgDailyCheckins,
    },
    revenueTrend,
    memberGrowth,
    attendance: { daily: attendanceDaily, byHour: attendanceByHour },
  };
};

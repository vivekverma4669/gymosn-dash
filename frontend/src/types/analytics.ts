export interface RevenuePoint {
  month: string;
  label: string;
  total: number;
}

export interface MemberGrowthPoint {
  month: string;
  label: string;
  newMembers: number;
  churned: number;
}

export interface AttendanceDailyPoint {
  date: string;
  count: number;
}

export interface AttendanceHourPoint {
  hour: number;
  count: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  activeMembers: number;
  totalMembers: number;
  retentionRate: number;
  totalNewJoins: number;
  totalChurned: number;
  avgDailyCheckins: number;
}

export interface AnalyticsDto {
  summary: AnalyticsSummary;
  revenueTrend: RevenuePoint[];
  memberGrowth: MemberGrowthPoint[];
  attendance: {
    daily: AttendanceDailyPoint[];
    byHour: AttendanceHourPoint[];
  };
}

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { StatsCard } from '../components/common/StatsCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart, BarChartDatum } from '../components/charts/BarChart';
import { formatCompact } from '../components/charts/chartUtils';
import { api } from '../lib/apiClient';
import { AnalyticsDto } from '../types/analytics';
import { BarChart3, IndianRupee, Users, UserCheck, CalendarCheck } from 'lucide-react';

const ChartCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm">
    <div className="mb-4">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);

const HOUR_LABEL = (h: number): string => {
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}${period}`;
};

const DAY_LABEL = (isoDate: string): string => {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

export const AnalyticsPage: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['gym', 'analytics'],
    queryFn: () => api.get<AnalyticsDto>('/api/gym/analytics'),
  });

  const hasData = analytics && analytics.memberGrowth.some((m) => m.newMembers > 0 || m.churned > 0);

  const growthData: BarChartDatum[] =
    analytics?.memberGrowth.map((m) => ({
      label: m.label,
      values: { newMembers: m.newMembers, churned: m.churned },
    })) ?? [];

  const hourData: BarChartDatum[] =
    analytics?.attendance.byHour
      .filter((h) => h.hour >= 5 && h.hour <= 22)
      .map((h) => ({ label: HOUR_LABEL(h.hour), values: { count: h.count } })) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue & Growth Analytics"
        description="Revenue trend, member growth vs. churn, and check-in patterns over the last 6 months."
      />

      {isLoading ? (
        <div className="rounded-xl border border-border/80 bg-card p-10 text-center text-sm text-muted-foreground">
          Loading analytics…
        </div>
      ) : !hasData && !analytics?.summary.totalRevenue ? (
        <EmptyState
          title="Not enough data yet"
          description="Analytics fill in automatically as members join, pay, and check in — check back once your gym has some activity logged."
          icon={BarChart3}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Revenue (6mo)"
              value={`₹${formatCompact(analytics!.summary.totalRevenue)}`}
              icon={IndianRupee}
              description="Total collected"
            />
            <StatsCard
              title="Active Members"
              value={analytics!.summary.activeMembers}
              icon={Users}
              description={`of ${analytics!.summary.totalMembers} total`}
            />
            <StatsCard
              title="Retention Rate"
              value={`${analytics!.summary.retentionRate}%`}
              icon={UserCheck}
              description={`${analytics!.summary.totalChurned} churned in 6mo`}
            />
            <StatsCard
              title="Avg Daily Check-ins"
              value={analytics!.summary.avgDailyCheckins}
              icon={CalendarCheck}
              description="Last 30 days"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard title="Monthly Revenue" description="Payments collected per month">
              <LineChart
                data={analytics!.revenueTrend.map((r) => ({ label: r.label, value: r.total }))}
                valueFormatter={(v) => `₹${formatCompact(v)}`}
              />
            </ChartCard>

            <ChartCard title="Member Growth vs. Churn" description="New joins compared to lapsed members, per month">
              <BarChart
                data={growthData}
                series={[
                  { key: 'newMembers', label: 'New Joins', color: 'var(--chart-1)' },
                  { key: 'churned', label: 'Churned', color: 'var(--chart-2)' },
                ]}
              />
            </ChartCard>

            <ChartCard title="Daily Check-ins" description="Attendance volume over the last 30 days">
              <LineChart
                color="var(--chart-3)"
                data={analytics!.attendance.daily.map((d) => ({ label: DAY_LABEL(d.date), value: d.count }))}
                maxXLabels={10}
              />
            </ChartCard>

            <ChartCard title="Peak Hours" description="Check-ins by hour of day, last 30 days">
              <BarChart
                data={hourData}
                series={[{ key: 'count', label: 'Check-ins', color: 'var(--chart-4)' }]}
                maxXLabels={9}
              />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};

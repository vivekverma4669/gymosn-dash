import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { BarChart3, TrendingUp } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue & Growth Analytics"
        description="Comprehensive charts for Monthly Recurring Revenue (MRR), member retention rates, and branch growth."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground shadow-xs hover:bg-accent transition-all">
            <TrendingUp className="h-4 w-4 text-emerald-500" /> Live Forecast
          </button>
        }
      />

      <EmptyState
        title="Analytics Engine Standard Mode"
        description="Interactive revenue charts, churn metrics, and check-in distribution analytics will be visualized here."
        icon={BarChart3}
      />
    </div>
  );
};

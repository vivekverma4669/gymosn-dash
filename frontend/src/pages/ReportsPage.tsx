import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { FileSpreadsheet, Download } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial & Operational Reports"
        description="Generate and export audit-ready financial statements, tax reports, and trainer commission logs."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <Download className="h-4 w-4" /> Generate Report
          </button>
        }
      />

      <EmptyState
        title="No Generated Reports"
        description="Select date range filters to generate downloadable PDF or Excel reports for your gym tenant."
        icon={FileSpreadsheet}
        actionLabel="Create New Report"
        onAction={() => {}}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { api } from '../lib/apiClient';
import { ReportResult, ReportType } from '../types/report';
import { downloadCsv } from '../utils/csv';
import { FileSpreadsheet, Download } from 'lucide-react';

const REPORT_TABS: { value: ReportType; label: string }[] = [
  { value: 'payments', label: 'Payments' },
  { value: 'members', label: 'Members' },
  { value: 'attendance', label: 'Attendance' },
];

const buildQuery = (type: ReportType, from: string, to: string): string => {
  const params = new URLSearchParams({ type });
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  return `/api/gym/reports?${params.toString()}`;
};

export const ReportsPage: React.FC = () => {
  const [type, setType] = useState<ReportType>('payments');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data: report, isLoading } = useQuery({
    queryKey: ['gym', 'reports', type, from, to],
    queryFn: () => api.get<ReportResult>(buildQuery(type, from, to)),
  });

  const handleDownload = () => {
    if (!report || report.rows.length === 0) return;
    const rangeSuffix = from || to ? `_${from || 'start'}_to_${to || 'now'}` : '';
    downloadCsv(`${type}-report${rangeSuffix}.csv`, report.columns, report.rows);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial & Operational Reports"
        description="Filter by date range and export payments, membership, or attendance data as CSV."
        actions={
          <button
            onClick={handleDownload}
            disabled={!report || report.rows.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" /> Download CSV
          </button>
        }
      />

      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-border bg-background p-1">
            {REPORT_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setType(tab.value)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  type === tab.value
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground">From</label>
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-hidden"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground">To</label>
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-hidden"
            />
          </div>
          {(from || to) && (
            <button
              onClick={() => {
                setFrom('');
                setTo('');
              }}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground underline"
            >
              Clear dates
            </button>
          )}
        </div>

        {report?.summary && Object.keys(report.summary).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3 border-t border-border/60 pt-4">
            {Object.entries(report.summary).map(([label, value]) => (
              <div key={label} className="rounded-lg bg-muted/60 px-3 py-1.5 text-xs">
                <span className="text-muted-foreground">{label}: </span>
                <span className="font-bold text-foreground">
                  {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border/80 bg-card p-10 text-center text-sm text-muted-foreground">
          Loading report…
        </div>
      ) : !report || report.rows.length === 0 ? (
        <EmptyState
          title="No records for this range"
          description="Try widening the date range, or switch report type — data appears here as soon as it matches your filters."
          icon={FileSpreadsheet}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {report.columns.map((col) => (
                  <th key={col} className="whitespace-nowrap px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row, i) => (
                <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-accent/40">
                  {row.map((cell, j) => (
                    <td key={j} className="whitespace-nowrap px-4 py-2.5 text-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

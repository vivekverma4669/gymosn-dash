import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, ScrollText } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../lib/apiClient';
import { AuditLogEntry } from '../../types/audit';

const ACTION_LABELS: Record<AuditLogEntry['action'], string> = {
  VIEW_GYM: 'Viewed gym dashboard',
};

export const SuperAdminAuditLogPage: React.FC = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['superadmin', 'audit-logs'],
    queryFn: () => api.get<AuditLogEntry[]>('/api/superadmin/audit-logs'),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Every time a super admin opens a gym's dashboard, it's recorded here."
      />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading audit log...</div>
      ) : !logs || logs.length === 0 ? (
        <EmptyState
          title="No Activity Yet"
          description="Super admin actions like viewing a gym's dashboard will show up here."
          icon={ScrollText}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Super Admin</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Gym</th>
                <th className="px-5 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-foreground">{log.actorName}</div>
                    <div className="text-xs text-muted-foreground">{log.actorEmail}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                      <Eye className="h-3 w-3" />
                      {ACTION_LABELS[log.action]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-foreground">{log.gymName}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

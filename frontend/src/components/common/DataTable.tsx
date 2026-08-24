import React from 'react';
import { TableSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { LucideIcon, Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  className?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are currently no items to display in this table.',
  emptyIcon = Inbox,
  emptyActionLabel,
  onEmptyAction,
  className,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-border bg-card shadow-xs', className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/40 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={cn('px-4 py-3.5', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {data.map((item, rowIdx) => (
            <tr
              key={item.id ?? rowIdx}
              onClick={() => onRowClick && onRowClick(item)}
              className={cn(
                'transition-colors hover:bg-muted/30',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={cn('px-4 py-3.5 text-foreground align-middle', col.className)}>
                  {col.cell
                    ? col.cell(item)
                    : col.accessorKey
                    ? (item[col.accessorKey] as React.ReactNode)
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

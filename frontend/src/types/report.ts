export type ReportType = 'payments' | 'members' | 'attendance';

export interface ReportResult {
  columns: string[];
  rows: (string | number)[][];
  summary?: Record<string, string | number>;
}

import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import { ApiError } from '../common/ApiError';
import * as reportsService from '../services/reports.service';
import { ReportType } from '../services/reports.service';

const REPORT_TYPES: ReportType[] = ['payments', 'members', 'attendance'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const getReport = asyncHandler(async (req: Request, res: Response) => {
  const type = req.query.type;
  if (typeof type !== 'string' || !REPORT_TYPES.includes(type as ReportType)) {
    throw ApiError.badRequest(`type must be one of: ${REPORT_TYPES.join(', ')}`);
  }

  const from = req.query.from;
  const to = req.query.to;
  if (from !== undefined && (typeof from !== 'string' || !DATE_PATTERN.test(from))) {
    throw ApiError.badRequest('from must be in YYYY-MM-DD format');
  }
  if (to !== undefined && (typeof to !== 'string' || !DATE_PATTERN.test(to))) {
    throw ApiError.badRequest('to must be in YYYY-MM-DD format');
  }

  const report = await reportsService.getReport(req.user!.gymId!, type as ReportType, {
    from: from as string | undefined,
    to: to as string | undefined,
  });
  return ApiResponse.success(res, { message: 'Report generated', data: report });
});

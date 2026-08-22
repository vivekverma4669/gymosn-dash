import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import { ApiError } from '../common/ApiError';
import * as attendanceService from '../services/attendance.service';
import { toDateOnly } from '../utils/date';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const getAttendance = asyncHandler(async (req: Request, res: Response) => {
  const rawDate = req.query.date;
  const date = typeof rawDate === 'string' && rawDate ? rawDate : toDateOnly(new Date());

  if (!DATE_PATTERN.test(date)) {
    throw ApiError.badRequest('date must be in YYYY-MM-DD format');
  }

  const rows = await attendanceService.getAttendanceForDate(req.user!.gymId!, date);
  return ApiResponse.success(res, { message: 'Attendance fetched', data: rows });
});

export const checkIn = asyncHandler(async (req: Request, res: Response) => {
  const row = await attendanceService.checkInMember(req.user!.gymId!, req.body.memberId);
  return ApiResponse.created(res, 'Checked in', row);
});

export const undoCheckIn = asyncHandler(async (req: Request, res: Response) => {
  await attendanceService.undoCheckIn(req.user!.gymId!, req.params.memberId);
  return ApiResponse.success(res, { message: 'Check-in undone' });
});

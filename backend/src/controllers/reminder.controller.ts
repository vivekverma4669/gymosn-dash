import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import * as reminderService from '../services/reminder.service';

export const sendReminders = asyncHandler(async (req: Request, res: Response) => {
  const result = await reminderService.sendManualReminders(req.user!.gymId!, req.body);
  return ApiResponse.success(res, { message: 'Reminders processed', data: result });
});

export const listReminderHistory = asyncHandler(async (req: Request, res: Response) => {
  const history = await reminderService.listReminderHistory(req.user!.gymId!);
  return ApiResponse.success(res, { message: 'Reminder history fetched', data: history });
});

import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import * as superadminService from '../services/superadmin.service';
import { runDailyReminders } from '../services/reminderScheduler.service';

export const createGym = asyncHandler(async (req: Request, res: Response) => {
  const result = await superadminService.createGymWithOwner(req.body, req.user!.id);
  return ApiResponse.created(res, 'Gym and owner account created', result);
});

export const listGyms = asyncHandler(async (_req: Request, res: Response) => {
  const gyms = await superadminService.listGyms();
  return ApiResponse.success(res, { message: 'Gyms fetched', data: gyms });
});

export const resetGymOwnerPassword = asyncHandler(async (req: Request, res: Response) => {
  await superadminService.resetGymOwnerPassword(req.params.gymOwnerId, req.body.newPassword);
  return ApiResponse.success(res, { message: 'Gym owner password reset' });
});

export const updateGymOwnerEmail = asyncHandler(async (req: Request, res: Response) => {
  const owner = await superadminService.updateGymOwnerEmail(req.params.gymOwnerId, req.body.newEmail);
  return ApiResponse.success(res, { message: 'Gym owner email updated', data: owner });
});

export const setGymActive = asyncHandler(async (req: Request, res: Response) => {
  await superadminService.setGymActive(req.params.gymId, req.body.isActive);
  return ApiResponse.success(res, { message: 'Gym status updated' });
});

export const setGymTier = asyncHandler(async (req: Request, res: Response) => {
  await superadminService.setGymTier(req.params.gymId, req.body.subscriptionTier);
  return ApiResponse.success(res, { message: 'Gym subscription tier updated' });
});

export const triggerReminders = asyncHandler(async (_req: Request, res: Response) => {
  const tally = await runDailyReminders();
  return ApiResponse.success(res, { message: 'Reminder run complete', data: tally });
});

export const viewGym = asyncHandler(async (req: Request, res: Response) => {
  const result = await superadminService.viewGymAsOwner(req.params.gymId, req.user!.id);
  return ApiResponse.success(res, { message: 'Gym view session created', data: result });
});

export const listAuditLogs = asyncHandler(async (_req: Request, res: Response) => {
  const logs = await superadminService.listAuditLogs();
  return ApiResponse.success(res, { message: 'Audit logs fetched', data: logs });
});

import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import * as trainerService from '../services/trainer.service';

export const createTrainer = asyncHandler(async (req: Request, res: Response) => {
  const gymId = req.user!.gymId!;
  const trainer = await trainerService.createTrainer(gymId, req.body, req.user!.id);
  return ApiResponse.created(res, 'Trainer created', trainer);
});

export const listTrainers = asyncHandler(async (req: Request, res: Response) => {
  const trainers = await trainerService.listTrainers(req.user!.gymId!);
  return ApiResponse.success(res, { message: 'Trainers fetched', data: trainers });
});

export const resetTrainerPassword = asyncHandler(async (req: Request, res: Response) => {
  await trainerService.resetTrainerPassword(req.user!.gymId!, req.params.trainerId, req.body.newPassword);
  return ApiResponse.success(res, { message: 'Trainer password reset' });
});

export const setTrainerActive = asyncHandler(async (req: Request, res: Response) => {
  await trainerService.setTrainerActive(req.user!.gymId!, req.params.trainerId, req.body.isActive);
  return ApiResponse.success(res, { message: 'Trainer status updated' });
});

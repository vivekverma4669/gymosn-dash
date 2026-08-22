import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import * as workoutPlanService from '../services/workoutPlan.service';

export const listWorkoutPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await workoutPlanService.listWorkoutPlans(req.user!.gymId!);
  return ApiResponse.success(res, { message: 'Workout plans fetched', data: plans });
});

export const createWorkoutPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await workoutPlanService.createWorkoutPlan(req.user!.gymId!, req.body);
  return ApiResponse.created(res, 'Workout plan created', plan);
});

export const updateWorkoutPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await workoutPlanService.updateWorkoutPlan(req.user!.gymId!, req.params.planId, req.body);
  return ApiResponse.success(res, { message: 'Workout plan updated', data: plan });
});

export const deleteWorkoutPlan = asyncHandler(async (req: Request, res: Response) => {
  await workoutPlanService.deleteWorkoutPlan(req.user!.gymId!, req.params.planId);
  return ApiResponse.success(res, { message: 'Workout plan deleted' });
});

import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import * as dietPlanService from '../services/dietPlan.service';

export const listDietPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await dietPlanService.listDietPlans(req.user!.gymId!);
  return ApiResponse.success(res, { message: 'Diet plans fetched', data: plans });
});

export const createDietPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await dietPlanService.createDietPlan(req.user!.gymId!, req.body);
  return ApiResponse.created(res, 'Diet plan created', plan);
});

export const updateDietPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await dietPlanService.updateDietPlan(req.user!.gymId!, req.params.planId, req.body);
  return ApiResponse.success(res, { message: 'Diet plan updated', data: plan });
});

export const deleteDietPlan = asyncHandler(async (req: Request, res: Response) => {
  await dietPlanService.deleteDietPlan(req.user!.gymId!, req.params.planId);
  return ApiResponse.success(res, { message: 'Diet plan deleted' });
});

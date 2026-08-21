import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import * as planService from '../services/plan.service';

export const listPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await planService.listPlans(req.user!.gymId!);
  return ApiResponse.success(res, { message: 'Plans fetched', data: plans });
});

export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await planService.createPlan(req.user!.gymId!, req.body);
  return ApiResponse.created(res, 'Plan created', plan);
});

export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await planService.updatePlan(req.user!.gymId!, req.params.planId, req.body);
  return ApiResponse.success(res, { message: 'Plan updated', data: plan });
});

export const deletePlan = asyncHandler(async (req: Request, res: Response) => {
  await planService.deletePlan(req.user!.gymId!, req.params.planId);
  return ApiResponse.success(res, { message: 'Plan deleted' });
});

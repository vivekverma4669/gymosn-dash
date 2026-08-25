import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import * as analyticsService from '../services/analytics.service';

export const getAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const analytics = await analyticsService.getAnalytics(req.user!.gymId!);
  return ApiResponse.success(res, { message: 'Analytics fetched', data: analytics });
});

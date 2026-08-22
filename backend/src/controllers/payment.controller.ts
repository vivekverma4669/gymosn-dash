import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import * as paymentService from '../services/payment.service';

export const listPayments = asyncHandler(async (req: Request, res: Response) => {
  const payments = await paymentService.listPayments(req.user!.gymId!);
  return ApiResponse.success(res, { message: 'Payments fetched', data: payments });
});

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await paymentService.createPayment(req.user!.gymId!, req.body);
  return ApiResponse.created(res, 'Payment recorded', payment);
});

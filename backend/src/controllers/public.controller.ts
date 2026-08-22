import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import { ApiError } from '../common/ApiError';
import { Gym } from '../models/Gym.model';
import { DemoRequest } from '../models/DemoRequest.model';
import * as attendanceService from '../services/attendance.service';

const requireActiveGym = async (gymId: string) => {
  const gym = await Gym.findOne({ _id: gymId, isActive: true });
  if (!gym) {
    throw ApiError.notFound('Gym not found');
  }
  return gym;
};

export const getGymPublicInfo = asyncHandler(async (req: Request, res: Response) => {
  const gym = await requireActiveGym(req.params.gymId);
  return ApiResponse.success(res, { message: 'Gym info', data: { id: gym.id, name: gym.name } });
});

export const publicCheckIn = asyncHandler(async (req: Request, res: Response) => {
  await requireActiveGym(req.params.gymId);
  const row = await attendanceService.checkInMemberByPhone(req.params.gymId, req.body.phone);
  return ApiResponse.created(res, `Checked in — welcome, ${row.memberName}!`, row);
});

const DUPLICATE_DEMO_REQUEST_MESSAGE =
  "We've already received a demo request from this phone number — we'll be in touch soon!";

export const createDemoRequest = asyncHandler(async (req: Request, res: Response) => {
  const normalizedPhone = req.body.phone.replace(/[^0-9]/g, '');

  const existing = await DemoRequest.findOne({ normalizedPhone });
  if (existing) {
    throw ApiError.conflict(DUPLICATE_DEMO_REQUEST_MESSAGE);
  }

  try {
    const demoRequest = await DemoRequest.create({ ...req.body, normalizedPhone });
    return ApiResponse.created(res, 'Demo request received', { id: demoRequest.id });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
      throw ApiError.conflict(DUPLICATE_DEMO_REQUEST_MESSAGE);
    }
    throw error;
  }
});

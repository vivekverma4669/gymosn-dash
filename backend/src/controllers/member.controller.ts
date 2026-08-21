import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import * as memberService from '../services/member.service';

export const listMembers = asyncHandler(async (req: Request, res: Response) => {
  const members = await memberService.listMembers(req.user!.gymId!);
  return ApiResponse.success(res, { message: 'Members fetched', data: members });
});

export const createMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await memberService.createMember(req.user!.gymId!, req.body);
  return ApiResponse.created(res, 'Member created', member);
});

export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await memberService.updateMember(req.user!.gymId!, req.params.memberId, req.body);
  return ApiResponse.success(res, { message: 'Member updated', data: member });
});

export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  await memberService.deleteMember(req.user!.gymId!, req.params.memberId);
  return ApiResponse.success(res, { message: 'Member deleted' });
});

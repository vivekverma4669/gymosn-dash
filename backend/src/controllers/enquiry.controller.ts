import { Request, Response } from 'express';
import { asyncHandler } from '../common/asyncHandler';
import { ApiResponse } from '../common/ApiResponse';
import * as enquiryService from '../services/enquiry.service';

export const listEnquiries = asyncHandler(async (req: Request, res: Response) => {
  const enquiries = await enquiryService.listEnquiries(req.user!.gymId!);
  return ApiResponse.success(res, { message: 'Enquiries fetched', data: enquiries });
});

export const createEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const enquiry = await enquiryService.createEnquiry(req.user!.gymId!, req.body);
  return ApiResponse.created(res, 'Enquiry created', enquiry);
});

export const updateEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const enquiry = await enquiryService.updateEnquiry(req.user!.gymId!, req.params.enquiryId, req.body);
  return ApiResponse.success(res, { message: 'Enquiry updated', data: enquiry });
});

export const deleteEnquiry = asyncHandler(async (req: Request, res: Response) => {
  await enquiryService.deleteEnquiry(req.user!.gymId!, req.params.enquiryId);
  return ApiResponse.success(res, { message: 'Enquiry deleted' });
});

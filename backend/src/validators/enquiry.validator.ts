import { z } from 'zod';

export const createEnquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(6, 'Phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  source: z.enum(['Walk-in', 'Phone Call', 'Instagram', 'Referral', 'Website', 'Facebook']),
  interestedPlan: z.string().optional().default(''),
  visitDate: z.coerce.date(),
  followUpDate: z.coerce.date().optional(),
  assignedTo: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;

export const updateEnquirySchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(6).optional(),
  email: z.string().email().optional().or(z.literal('')),
  source: z.enum(['Walk-in', 'Phone Call', 'Instagram', 'Referral', 'Website', 'Facebook']).optional(),
  interestedPlan: z.string().optional(),
  visitDate: z.coerce.date().optional(),
  followUpDate: z.coerce.date().optional(),
  status: z.enum(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost']).optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;

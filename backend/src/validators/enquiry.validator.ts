import { z } from 'zod';

const phoneSchema = z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits');

export const createEnquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: phoneSchema,
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
  phone: phoneSchema.optional(),
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

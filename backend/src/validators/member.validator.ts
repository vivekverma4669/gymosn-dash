import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const phoneSchema = z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits');

export const createMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: phoneSchema,
  email: z.string().email().optional().or(z.literal('')),
  plan: objectId,
  trainer: objectId.optional(),
  joiningDate: z.coerce.date(),
  dateOfBirth: z.coerce.date().optional(),
  agreedPrice: z.number().min(0).optional(),
  dueAmount: z.number().min(0).optional().default(0),
  gender: z.enum(['Male', 'Female', 'Other']),
  age: z.number().min(0),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = z.object({
  name: z.string().min(2).optional(),
  phone: phoneSchema.optional(),
  email: z.string().email().optional().or(z.literal('')),
  plan: objectId.optional(),
  trainer: objectId.optional().nullable(),
  workoutPlan: objectId.optional().nullable(),
  dietPlan: objectId.optional().nullable(),
  expiryDate: z.coerce.date().optional(),
  dateOfBirth: z.coerce.date().optional(),
  agreedPrice: z.number().min(0).optional(),
  dueAmount: z.number().min(0).optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  age: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

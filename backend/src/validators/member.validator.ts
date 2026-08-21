import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const createMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(6, 'Phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  plan: objectId,
  trainer: objectId.optional(),
  joiningDate: z.coerce.date(),
  agreedPrice: z.number().min(0).optional(),
  dueAmount: z.number().min(0).optional().default(0),
  gender: z.enum(['Male', 'Female', 'Other']),
  age: z.number().min(0),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(6).optional(),
  email: z.string().email().optional().or(z.literal('')),
  plan: objectId.optional(),
  trainer: objectId.optional().nullable(),
  expiryDate: z.coerce.date().optional(),
  agreedPrice: z.number().min(0).optional(),
  dueAmount: z.number().min(0).optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  age: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

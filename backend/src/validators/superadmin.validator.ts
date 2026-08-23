import { z } from 'zod';

const subscriptionTierEnum = z.enum(['BASIC', 'PROFESSIONAL', 'ENTERPRISE']);

export const createGymSchema = z.object({
  gymName: z.string().min(2, 'Gym name is required'),
  ownerName: z.string().min(2, 'Owner name is required'),
  ownerEmail: z.string().email(),
  ownerPassword: z.string().min(8, 'Password must be at least 8 characters'),
  subscriptionTier: subscriptionTierEnum.default('BASIC'),
});

export const updateTierSchema = z.object({
  subscriptionTier: subscriptionTierEnum,
});

export type CreateGymInput = z.infer<typeof createGymSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const setActiveSchema = z.object({
  isActive: z.boolean(),
});

export const updateEmailSchema = z.object({
  newEmail: z.string().email(),
});

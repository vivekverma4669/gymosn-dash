import { z } from 'zod';

export const createTrainerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;

export const setTrainerActiveSchema = z.object({
  isActive: z.boolean(),
});

import { z } from 'zod';

export const publicCheckInSchema = z.object({
  phone: z.string().min(6, 'Enter a valid phone number'),
});

export type PublicCheckInInput = z.infer<typeof publicCheckInSchema>;

export const demoRequestSchema = z.object({
  gymName: z.string().min(2, 'Gym name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().max(1000).optional(),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

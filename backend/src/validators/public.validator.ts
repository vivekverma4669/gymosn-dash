import { z } from 'zod';

const phoneSchema = z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number');

export const publicCheckInSchema = z.object({
  phone: phoneSchema,
});

export type PublicCheckInInput = z.infer<typeof publicCheckInSchema>;

export const demoRequestSchema = z.object({
  gymName: z.string().min(2, 'Gym name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  phone: phoneSchema,
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().max(1000).optional(),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

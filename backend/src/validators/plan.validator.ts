import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().min(2, 'Plan name is required'),
  price: z.number().min(0),
  durationValue: z.number().min(1),
  durationUnit: z.enum(['Days', 'Weeks', 'Months', 'Years']),
  description: z.string().optional().default(''),
  isActive: z.boolean().optional().default(true),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;

export const updatePlanSchema = createPlanSchema.partial();

export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;

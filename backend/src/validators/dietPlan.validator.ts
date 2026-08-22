import { z } from 'zod';

const mealSchema = z.object({
  mealName: z.string().min(1, 'Meal name is required'),
  items: z.array(z.string().min(1)).default([]),
});

export const createDietPlanSchema = z.object({
  name: z.string().min(2, 'Plan name is required'),
  goal: z.enum(['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Maintenance']),
  dailyCalories: z.number().min(0).optional(),
  description: z.string().optional().default(''),
  meals: z.array(mealSchema).default([]),
  isActive: z.boolean().optional().default(true),
});

export type CreateDietPlanInput = z.infer<typeof createDietPlanSchema>;

export const updateDietPlanSchema = createDietPlanSchema.partial();

export type UpdateDietPlanInput = z.infer<typeof updateDietPlanSchema>;

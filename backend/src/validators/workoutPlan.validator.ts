import { z } from 'zod';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().min(1),
  reps: z.string().min(1, 'Reps is required'),
  notes: z.string().optional().default(''),
});

const daySchema = z.object({
  dayName: z.string().min(1, 'Day name is required'),
  exercises: z.array(exerciseSchema).default([]),
});

export const createWorkoutPlanSchema = z.object({
  name: z.string().min(2, 'Plan name is required'),
  goal: z.enum(['Muscle Gain', 'Fat Loss', 'Strength', 'Endurance', 'General Fitness']),
  description: z.string().optional().default(''),
  days: z.array(daySchema).default([]),
  isActive: z.boolean().optional().default(true),
});

export type CreateWorkoutPlanInput = z.infer<typeof createWorkoutPlanSchema>;

export const updateWorkoutPlanSchema = createWorkoutPlanSchema.partial();

export type UpdateWorkoutPlanInput = z.infer<typeof updateWorkoutPlanSchema>;

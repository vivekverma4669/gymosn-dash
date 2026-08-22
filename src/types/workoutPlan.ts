export type WorkoutGoal = 'Muscle Gain' | 'Fat Loss' | 'Strength' | 'Endurance' | 'General Fitness';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

export interface WorkoutDay {
  dayName: string;
  exercises: Exercise[];
}

export interface WorkoutPlanDto {
  id: string;
  name: string;
  goal: WorkoutGoal;
  description: string;
  days: WorkoutDay[];
  isActive: boolean;
  assignedMembers: number;
}

export interface WorkoutPlanFormInput {
  name: string;
  goal: WorkoutGoal;
  description: string;
  days: WorkoutDay[];
  isActive: boolean;
}

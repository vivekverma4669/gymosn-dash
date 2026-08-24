export type DietGoal = 'Weight Loss' | 'Weight Gain' | 'Muscle Gain' | 'Maintenance';

export interface Meal {
  mealName: string;
  items: string[];
}

export interface DietPlanDto {
  id: string;
  name: string;
  goal: DietGoal;
  dailyCalories: number | null;
  description: string;
  meals: Meal[];
  isActive: boolean;
  assignedMembers: number;
}

export interface DietPlanFormInput {
  name: string;
  goal: DietGoal;
  dailyCalories?: number;
  description: string;
  meals: Meal[];
  isActive: boolean;
}

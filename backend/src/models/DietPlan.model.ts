import { Schema, model, Document, Types } from 'mongoose';

export type DietGoal = 'Weight Loss' | 'Weight Gain' | 'Muscle Gain' | 'Maintenance';

export interface IMeal {
  mealName: string;
  items: string[];
}

export interface IDietPlan extends Document {
  gym: Types.ObjectId;
  name: string;
  goal: DietGoal;
  dailyCalories?: number;
  description: string;
  meals: IMeal[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const mealSchema = new Schema<IMeal>(
  {
    mealName: { type: String, required: true, trim: true },
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const dietPlanSchema = new Schema<IDietPlan>(
  {
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true, index: true },
    name: { type: String, required: true, trim: true },
    goal: { type: String, enum: ['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Maintenance'], required: true },
    dailyCalories: { type: Number, min: 0 },
    description: { type: String, default: '', trim: true },
    meals: { type: [mealSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DietPlan = model<IDietPlan>('DietPlan', dietPlanSchema);

import { Schema, model, Document, Types } from 'mongoose';

export type WorkoutGoal = 'Muscle Gain' | 'Fat Loss' | 'Strength' | 'Endurance' | 'General Fitness';

export interface IExercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

export interface IWorkoutDay {
  dayName: string;
  exercises: IExercise[];
}

export interface IWorkoutPlan extends Document {
  gym: Types.ObjectId;
  name: string;
  goal: WorkoutGoal;
  description: string;
  days: IWorkoutDay[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new Schema<IExercise>(
  {
    name: { type: String, required: true, trim: true },
    sets: { type: Number, required: true, min: 1 },
    reps: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const workoutDaySchema = new Schema<IWorkoutDay>(
  {
    dayName: { type: String, required: true, trim: true },
    exercises: { type: [exerciseSchema], default: [] },
  },
  { _id: false }
);

const workoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true, index: true },
    name: { type: String, required: true, trim: true },
    goal: {
      type: String,
      enum: ['Muscle Gain', 'Fat Loss', 'Strength', 'Endurance', 'General Fitness'],
      required: true,
    },
    description: { type: String, default: '', trim: true },
    days: { type: [workoutDaySchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const WorkoutPlan = model<IWorkoutPlan>('WorkoutPlan', workoutPlanSchema);

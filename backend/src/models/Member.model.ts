import { Schema, model, Document, Types } from 'mongoose';

export type Gender = 'Male' | 'Female' | 'Other';

export interface IMember extends Document {
  gym: Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  plan: Types.ObjectId;
  trainer?: Types.ObjectId;
  workoutPlan?: Types.ObjectId;
  dietPlan?: Types.ObjectId;
  joiningDate: Date;
  expiryDate: Date;
  dateOfBirth?: Date;
  agreedPrice: number;
  dueAmount: number;
  lastCheckIn?: Date;
  gender: Gender;
  age: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IMember>(
  {
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
    trainer: { type: Schema.Types.ObjectId, ref: 'User' },
    workoutPlan: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan' },
    dietPlan: { type: Schema.Types.ObjectId, ref: 'DietPlan' },
    joiningDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    dateOfBirth: { type: Date },
    // Actual negotiated price for this member — may differ from Plan.price (discounts, free family/friend passes, etc).
    agreedPrice: { type: Number, required: true, min: 0 },
    dueAmount: { type: Number, default: 0, min: 0 },
    lastCheckIn: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    age: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Member = model<IMember>('Member', memberSchema);

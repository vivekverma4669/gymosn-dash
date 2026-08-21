import { Schema, model, Document, Types } from 'mongoose';

export type DurationUnit = 'Days' | 'Weeks' | 'Months' | 'Years';

export interface IPlan extends Document {
  gym: Types.ObjectId;
  name: string;
  price: number;
  durationValue: number;
  durationUnit: DurationUnit;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    durationValue: { type: Number, required: true, min: 1 },
    durationUnit: { type: String, enum: ['Days', 'Weeks', 'Months', 'Years'], required: true },
    description: { type: String, default: '', trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Plan = model<IPlan>('Plan', planSchema);

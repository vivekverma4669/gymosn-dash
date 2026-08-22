import { Schema, model, Document, Types } from 'mongoose';

export type SubscriptionTier = 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface IGym extends Document {
  name: string;
  slug: string;
  ownerUser: Types.ObjectId;
  isActive: boolean;
  subscriptionTier: SubscriptionTier;
  createdAt: Date;
  updatedAt: Date;
}

const gymSchema = new Schema<IGym>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    ownerUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    // Gates paid-tier automation (WhatsApp renewal reminders + birthday wishes) — only
    // PROFESSIONAL and ENTERPRISE gyms get automated sends from the reminder scheduler.
    subscriptionTier: { type: String, enum: ['BASIC', 'PROFESSIONAL', 'ENTERPRISE'], default: 'BASIC' },
  },
  { timestamps: true }
);

export const Gym = model<IGym>('Gym', gymSchema);

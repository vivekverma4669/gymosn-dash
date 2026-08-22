import { Schema, model, Document } from 'mongoose';

export interface IDemoRequest extends Document {
  gymName: string;
  contactName: string;
  phone: string;
  normalizedPhone: string;
  email?: string;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const demoRequestSchema = new Schema<IDemoRequest>(
  {
    gymName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    // Digits-only form of `phone`, used to de-dupe regardless of spacing/formatting
    // (e.g. "+91 98765 43210" and "9876543210" both collapse to the same key).
    normalizedPhone: { type: String, required: true, unique: true },
    email: { type: String, trim: true, lowercase: true },
    message: { type: String, trim: true },
  },
  { timestamps: true }
);

export const DemoRequest = model<IDemoRequest>('DemoRequest', demoRequestSchema);

import { Schema, model, Document, Types } from 'mongoose';

export type ReminderCategory = 'RENEWAL' | 'BIRTHDAY';
export type ReminderLogStatus = 'sent' | 'skipped' | 'failed';

export interface IReminderLog extends Document {
  gym: Types.ObjectId;
  member: Types.ObjectId;
  category: ReminderCategory;
  status: ReminderLogStatus;
  error?: string;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reminderLogSchema = new Schema<IReminderLog>(
  {
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true, index: true },
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    category: { type: String, enum: ['RENEWAL', 'BIRTHDAY'], required: true },
    status: { type: String, enum: ['sent', 'skipped', 'failed'], required: true },
    error: { type: String },
    sentAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const ReminderLog = model<IReminderLog>('ReminderLog', reminderLogSchema);

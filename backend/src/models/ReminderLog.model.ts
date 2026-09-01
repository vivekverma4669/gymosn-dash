import { Schema, model, Document, Types } from 'mongoose';

// RENEWAL/BIRTHDAY are written by the automated daily cron (reminderScheduler.service);
// FEE_REMINDER/MISSED_ATTENDANCE/CUSTOM are written by the gym owner's manual send from
// the Reminder Center (reminder.service).
export type ReminderCategory = 'RENEWAL' | 'BIRTHDAY' | 'FEE_REMINDER' | 'MISSED_ATTENDANCE' | 'CUSTOM';
export type ReminderLogStatus = 'sent' | 'skipped' | 'failed';

export interface IReminderLog extends Document {
  gym: Types.ObjectId;
  member: Types.ObjectId;
  category: ReminderCategory;
  status: ReminderLogStatus;
  error?: string;
  message?: string;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reminderLogSchema = new Schema<IReminderLog>(
  {
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true, index: true },
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    category: {
      type: String,
      enum: ['RENEWAL', 'BIRTHDAY', 'FEE_REMINDER', 'MISSED_ATTENDANCE', 'CUSTOM'],
      required: true,
    },
    status: { type: String, enum: ['sent', 'skipped', 'failed'], required: true },
    error: { type: String },
    message: { type: String },
    sentAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const ReminderLog = model<IReminderLog>('ReminderLog', reminderLogSchema);

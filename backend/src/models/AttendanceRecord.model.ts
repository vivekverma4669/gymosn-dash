import { Schema, model, Document, Types } from 'mongoose';

export type AttendanceStatus = 'Present' | 'Late';

export interface IAttendanceRecord extends Document {
  gym: Types.ObjectId;
  member: Types.ObjectId;
  date: string; // YYYY-MM-DD, one record per member per calendar day
  checkInTime: Date;
  status: AttendanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true, index: true },
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    date: { type: String, required: true },
    checkInTime: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Late'], required: true },
  },
  { timestamps: true }
);

attendanceRecordSchema.index({ member: 1, date: 1 }, { unique: true });

export const AttendanceRecord = model<IAttendanceRecord>('AttendanceRecord', attendanceRecordSchema);

import { Schema, model, Document, Types } from 'mongoose';

export type AuditAction = 'VIEW_GYM';

export interface IAuditLog extends Document {
  actor: Types.ObjectId;
  action: AuditAction;
  gym: Types.ObjectId;
  gymName: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['VIEW_GYM'], required: true },
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    // Snapshot of the gym name at log time, so the entry stays readable even if the gym is later renamed.
    gymName: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);

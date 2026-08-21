import { Schema, model, Document, Types } from 'mongoose';

export type EnquirySource = 'Walk-in' | 'Phone Call' | 'Instagram' | 'Referral' | 'Website' | 'Facebook';
export type EnquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Lost';

export interface IEnquiry extends Document {
  gym: Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  source: EnquirySource;
  interestedPlan: string;
  visitDate: Date;
  followUpDate?: Date;
  status: EnquiryStatus;
  assignedTo?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    source: {
      type: String,
      enum: ['Walk-in', 'Phone Call', 'Instagram', 'Referral', 'Website', 'Facebook'],
      required: true,
    },
    interestedPlan: { type: String, default: '', trim: true },
    visitDate: { type: Date, required: true },
    followUpDate: { type: Date },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'],
      default: 'New',
    },
    assignedTo: { type: String, trim: true },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

export const Enquiry = model<IEnquiry>('Enquiry', enquirySchema);

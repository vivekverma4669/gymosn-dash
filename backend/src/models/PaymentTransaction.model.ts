import { Schema, model, Document, Types } from 'mongoose';

export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';

export interface IPaymentTransaction extends Document {
  gym: Types.ObjectId;
  member: Types.ObjectId;
  invoiceNo: string;
  amount: number;
  method: PaymentMethod;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentTransactionSchema = new Schema<IPaymentTransaction>(
  {
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true, index: true },
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    invoiceNo: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['UPI', 'Cash', 'Card', 'Bank Transfer'], required: true },
    date: { type: Date, required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const PaymentTransaction = model<IPaymentTransaction>('PaymentTransaction', paymentTransactionSchema);

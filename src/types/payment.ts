export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';

export interface PaymentDto {
  id: string;
  invoiceNo: string;
  memberName: string;
  phone: string;
  plan: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  notes: string;
}

export interface CreatePaymentPayload {
  memberId: string;
  amount: number;
  method: PaymentMethod;
  notes?: string;
}

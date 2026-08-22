import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const createPaymentSchema = z.object({
  memberId: objectId,
  amount: z.number().positive('Amount must be greater than 0'),
  method: z.enum(['UPI', 'Cash', 'Card', 'Bank Transfer']),
  notes: z.string().optional().default(''),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const sendReminderSchema = z.object({
  category: z.enum(['RENEWAL', 'BIRTHDAY', 'FEE_REMINDER', 'MISSED_ATTENDANCE', 'CUSTOM']),
  recipients: z
    .array(
      z.object({
        memberId: objectId,
        message: z.string().min(1, 'Message cannot be empty').max(1000),
      })
    )
    .min(1, 'Select at least one recipient'),
});

export type SendReminderInput = z.infer<typeof sendReminderSchema>;

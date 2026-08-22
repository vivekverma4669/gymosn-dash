import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const checkInSchema = z.object({
  memberId: objectId,
});

export type CheckInInput = z.infer<typeof checkInSchema>;

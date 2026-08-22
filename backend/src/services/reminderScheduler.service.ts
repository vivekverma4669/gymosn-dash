import { Gym } from '../models/Gym.model';
import { Member } from '../models/Member.model';
import { ReminderLog } from '../models/ReminderLog.model';
import { sendWhatsAppMessage } from './whatsapp.service';
import { logger } from '../utils/logger';

const REMINDER_DAYS_BEFORE_EXPIRY = 3;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const daysUntil = (date: Date, from: Date): number => Math.ceil((date.getTime() - from.getTime()) / MS_PER_DAY);

const isBirthdayToday = (dateOfBirth: Date, today: Date): boolean =>
  dateOfBirth.getUTCMonth() === today.getUTCMonth() && dateOfBirth.getUTCDate() === today.getUTCDate();

// Runs once a day. Only PROFESSIONAL/ENTERPRISE gyms get automated WhatsApp sends — this is the
// paid-tier feature the pricing page sells; BASIC gyms are skipped entirely, no log rows written.
export const runDailyReminders = async (): Promise<{ sent: number; skipped: number; failed: number }> => {
  const today = new Date();
  const tally = { sent: 0, skipped: 0, failed: 0 };

  const gyms = await Gym.find({ isActive: true, subscriptionTier: { $in: ['PROFESSIONAL', 'ENTERPRISE'] } });

  for (const gym of gyms) {
    const members = await Member.find({ gym: gym._id, isActive: true });

    for (const member of members) {
      const daysRemaining = daysUntil(member.expiryDate, today);
      if (daysRemaining === REMINDER_DAYS_BEFORE_EXPIRY) {
        const result = await sendWhatsAppMessage({
          to: member.phone,
          templateName: 'renewal_reminder',
          params: { name: member.name, expiry_date: member.expiryDate.toISOString().slice(0, 10) },
        });
        await ReminderLog.create({
          gym: gym._id,
          member: member._id,
          category: 'RENEWAL',
          status: result.status,
          error: result.error,
          sentAt: today,
        });
        tally[result.status] += 1;
      }

      if (member.dateOfBirth && isBirthdayToday(member.dateOfBirth, today)) {
        const result = await sendWhatsAppMessage({
          to: member.phone,
          templateName: 'birthday_wish',
          params: { name: member.name },
        });
        await ReminderLog.create({
          gym: gym._id,
          member: member._id,
          category: 'BIRTHDAY',
          status: result.status,
          error: result.error,
          sentAt: today,
        });
        tally[result.status] += 1;
      }
    }
  }

  logger.info(
    `Daily reminder run complete — sent: ${tally.sent}, skipped: ${tally.skipped}, failed: ${tally.failed}`
  );
  return tally;
};

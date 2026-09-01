import { Member } from '../models/Member.model';
import { ReminderLog, IReminderLog } from '../models/ReminderLog.model';
import { sendWhatsAppMessage } from './whatsapp.service';
import { SendReminderInput } from '../validators/reminder.validator';

type PopulatedLog = IReminderLog & { member: { name: string; phone: string } | null };

const toHistoryDto = (log: PopulatedLog) => ({
  id: log.id,
  recipientName: log.member?.name ?? 'Member',
  phone: log.member?.phone ?? '',
  category: log.category,
  message: log.message ?? '',
  sentAt: log.sentAt.toISOString(),
  status: log.status === 'sent' ? 'Delivered' : log.status === 'skipped' ? 'Skipped' : 'Failed',
});

export const sendManualReminders = async (gymId: string, input: SendReminderInput) => {
  const memberIds = input.recipients.map((r) => r.memberId);
  const members = await Member.find({ _id: { $in: memberIds }, gym: gymId });
  const memberMap = new Map(members.map((m) => [m.id, m]));

  const tally = { sent: 0, skipped: 0, failed: 0 };
  const history: ReturnType<typeof toHistoryDto>[] = [];

  for (const recipient of input.recipients) {
    const member = memberMap.get(recipient.memberId);
    if (!member) continue;

    const result = await sendWhatsAppMessage({
      to: member.phone,
      templateName: 'manual_reminder',
      params: { message: recipient.message },
    });

    const log = await ReminderLog.create({
      gym: gymId,
      member: member._id,
      category: input.category,
      status: result.status,
      error: result.error,
      message: recipient.message,
      sentAt: new Date(),
    });

    tally[result.status] += 1;
    history.push(
      toHistoryDto({ ...log.toObject(), id: log.id, member: { name: member.name, phone: member.phone } } as unknown as PopulatedLog)
    );
  }

  return { tally, history };
};

export const listReminderHistory = async (gymId: string) => {
  const logs = await ReminderLog.find({ gym: gymId })
    .populate('member', 'name phone')
    .sort({ sentAt: -1 })
    .limit(100);

  return (logs as unknown as PopulatedLog[]).map(toHistoryDto);
};

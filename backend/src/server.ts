import cron from 'node-cron';
import { createApp } from './app';
import { env } from './config/env.config';
import { connectDatabase } from './config/database.config';
import { logger } from './utils/logger';
import { runDailyReminders } from './services/reminderScheduler.service';

const bootstrap = async (): Promise<void> => {
  const app = createApp();

  // Bind the port before the DB connects so Render's port scan succeeds even
  // if MongoDB (e.g. Atlas) is slow to respond — Mongoose buffers queries
  // until the connection is ready, so requests just wait instead of failing.
  app.listen(env.PORT, () => {
    logger.info(`Fitdesk backend listening on http://localhost:${env.PORT}`);
  });

  await connectDatabase();

  // Daily at 9:00 AM server time — renewal reminders (3 days before expiry) + birthday wishes,
  // for PROFESSIONAL/ENTERPRISE gyms only. Safe no-op per-message until a WhatsApp provider is configured.
  cron.schedule('0 9 * * *', () => {
    runDailyReminders().catch((error) => logger.error('Daily reminder run failed:', error));
  });
};

bootstrap();

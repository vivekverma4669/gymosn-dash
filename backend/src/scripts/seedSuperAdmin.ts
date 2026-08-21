import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.config';
import { User } from '../models/User.model';
import { logger } from '../utils/logger';

const run = async (): Promise<void> => {
  await mongoose.connect(env.DATABASE_URL);

  const existing = await User.findOne({ email: env.SUPERADMIN_EMAIL.toLowerCase() });
  if (existing) {
    logger.info(`Super Admin already exists: ${existing.email}`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(env.SUPERADMIN_PASSWORD, 10);

  const superAdmin = await User.create({
    name: 'Super Admin',
    email: env.SUPERADMIN_EMAIL.toLowerCase(),
    passwordHash,
    role: 'SUPERADMIN',
  });

  logger.info(`Super Admin created: ${superAdmin.email}`);
  await mongoose.disconnect();
};

run().catch((err) => {
  logger.error('Failed to seed Super Admin', err);
  process.exit(1);
});

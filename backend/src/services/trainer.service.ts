import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { ApiError } from '../common/ApiError';
import { sanitizeUser } from '../utils/sanitizeUser';
import { CreateTrainerInput } from '../validators/trainer.validator';

export const createTrainer = async (gymId: string, input: CreateTrainerInput, creatorId: string) => {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw ApiError.conflict('A user with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const trainer = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
    role: 'TRAINER',
    gym: gymId,
    createdBy: creatorId,
  });

  return sanitizeUser(trainer);
};

export const listTrainers = async (gymId: string) => {
  const trainers = await User.find({ gym: gymId, role: 'TRAINER' }).sort({ createdAt: -1 });
  return trainers.map(sanitizeUser);
};

export const resetTrainerPassword = async (gymId: string, trainerId: string, newPassword: string) => {
  const trainer = await User.findOne({ _id: trainerId, gym: gymId, role: 'TRAINER' });
  if (!trainer) {
    throw ApiError.notFound('Trainer not found');
  }

  trainer.passwordHash = await bcrypt.hash(newPassword, 10);
  trainer.tokenVersion += 1;
  await trainer.save();
};

export const setTrainerActive = async (gymId: string, trainerId: string, isActive: boolean) => {
  const trainer = await User.findOne({ _id: trainerId, gym: gymId, role: 'TRAINER' });
  if (!trainer) {
    throw ApiError.notFound('Trainer not found');
  }
  trainer.isActive = isActive;
  await trainer.save();
};

import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { Gym } from '../models/Gym.model';
import { ApiError } from '../common/ApiError';
import { sanitizeUser } from '../utils/sanitizeUser';
import { CreateGymInput } from '../validators/superadmin.validator';

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const createGymWithOwner = async (input: CreateGymInput, creatorId: string) => {
  const existing = await User.findOne({ email: input.ownerEmail.toLowerCase() });
  if (existing) {
    throw ApiError.conflict('A user with this email already exists');
  }

  const baseSlug = slugify(input.gymName);
  let slug = baseSlug;
  let suffix = 1;
  while (await Gym.findOne({ slug })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const passwordHash = await bcrypt.hash(input.ownerPassword, 10);

  const owner = await User.create({
    name: input.ownerName,
    email: input.ownerEmail.toLowerCase(),
    passwordHash,
    role: 'GYM_OWNER',
    createdBy: creatorId,
  });

  const gym = await Gym.create({
    name: input.gymName,
    slug,
    ownerUser: owner._id,
  });

  owner.gym = gym._id as typeof owner.gym;
  await owner.save();

  return {
    gym: { id: gym.id, name: gym.name, slug: gym.slug, isActive: gym.isActive, createdAt: gym.createdAt },
    owner: sanitizeUser(owner),
  };
};

export const listGyms = async () => {
  const gyms = await Gym.find().populate('ownerUser', 'name email isActive').sort({ createdAt: -1 });
  return gyms.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    isActive: g.isActive,
    createdAt: g.createdAt,
    owner: g.ownerUser,
  }));
};

export const resetGymOwnerPassword = async (gymOwnerId: string, newPassword: string) => {
  const owner = await User.findOne({ _id: gymOwnerId, role: 'GYM_OWNER' });
  if (!owner) {
    throw ApiError.notFound('Gym owner not found');
  }

  owner.passwordHash = await bcrypt.hash(newPassword, 10);
  owner.tokenVersion += 1;
  await owner.save();
};

export const setGymActive = async (gymId: string, isActive: boolean) => {
  const gym = await Gym.findById(gymId);
  if (!gym) {
    throw ApiError.notFound('Gym not found');
  }
  gym.isActive = isActive;
  await gym.save();

  await User.updateMany({ gym: gym._id }, { isActive });
};

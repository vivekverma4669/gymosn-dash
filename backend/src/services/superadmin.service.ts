import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { Gym } from '../models/Gym.model';
import { AuditLog } from '../models/AuditLog.model';
import { ApiError } from '../common/ApiError';
import { sanitizeUser } from '../utils/sanitizeUser';
import { signAccessToken } from '../utils/token';
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
    subscriptionTier: input.subscriptionTier,
  });

  owner.gym = gym._id as typeof owner.gym;
  await owner.save();

  return {
    gym: {
      id: gym.id,
      name: gym.name,
      slug: gym.slug,
      isActive: gym.isActive,
      subscriptionTier: gym.subscriptionTier,
      createdAt: gym.createdAt,
    },
    owner: sanitizeUser(owner),
  };
};

export const listGyms = async () => {
  const gyms = await Gym.find().populate('ownerUser', 'name email isActive').sort({ createdAt: -1 });
  return gyms.map((g) => {
    const owner = g.ownerUser as unknown as
      | { _id: { toString(): string }; name: string; email: string; isActive: boolean }
      | undefined;
    return {
      id: g.id,
      name: g.name,
      slug: g.slug,
      isActive: g.isActive,
      subscriptionTier: g.subscriptionTier,
      createdAt: g.createdAt,
      owner: owner
        ? { id: owner._id.toString(), name: owner.name, email: owner.email, isActive: owner.isActive }
        : null,
    };
  });
};

export const setGymTier = async (gymId: string, subscriptionTier: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE') => {
  const gym = await Gym.findById(gymId);
  if (!gym) {
    throw ApiError.notFound('Gym not found');
  }
  gym.subscriptionTier = subscriptionTier;
  await gym.save();
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

export const updateGymOwnerEmail = async (gymOwnerId: string, newEmail: string) => {
  const owner = await User.findOne({ _id: gymOwnerId, role: 'GYM_OWNER' });
  if (!owner) {
    throw ApiError.notFound('Gym owner not found');
  }

  const normalized = newEmail.toLowerCase();
  const existing = await User.findOne({ email: normalized, _id: { $ne: owner._id } });
  if (existing) {
    throw ApiError.conflict('A user with this email already exists');
  }

  owner.email = normalized;
  await owner.save();

  return sanitizeUser(owner);
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

// Issues a short-lived access token scoped to the gym's owner so a superadmin can inspect
// a tenant's dashboard exactly as its owner sees it, without touching the superadmin's own
// refresh-token cookie (the view session is access-token-only and expires like any other).
export const viewGymAsOwner = async (gymId: string, actorId: string) => {
  const gym = await Gym.findById(gymId);
  if (!gym) {
    throw ApiError.notFound('Gym not found');
  }

  const owner = await User.findOne({ _id: gym.ownerUser, role: 'GYM_OWNER' });
  if (!owner) {
    throw ApiError.notFound('Gym owner account not found');
  }

  const accessToken = signAccessToken({ sub: owner.id, role: owner.role, gymId: gym.id });

  await AuditLog.create({ actor: actorId, action: 'VIEW_GYM', gym: gym._id, gymName: gym.name });

  return {
    accessToken,
    user: sanitizeUser(owner),
    gym: {
      id: gym.id,
      name: gym.name,
      slug: gym.slug,
      isActive: gym.isActive,
      subscriptionTier: gym.subscriptionTier,
    },
  };
};

export const listAuditLogs = async () => {
  const logs = await AuditLog.find()
    .populate('actor', 'name email')
    .sort({ createdAt: -1 })
    .limit(200);

  return logs.map((log) => {
    const actor = log.actor as unknown as { name: string; email: string } | null;
    return {
      id: log.id,
      action: log.action,
      gymName: log.gymName,
      gymId: log.gym.toString(),
      actorName: actor?.name ?? 'Unknown',
      actorEmail: actor?.email ?? 'unknown',
      createdAt: log.createdAt,
    };
  });
};

import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { ApiError } from '../common/ApiError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token';
import { sanitizeUser } from '../utils/sanitizeUser';
import { UpdateProfileInput, ChangePasswordInput } from '../validators/auth.validator';

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  // SUPERADMIN accounts cannot authenticate through the tenant login path,
  // even with a correct password — they must use the dedicated system login.
  if (!user || !user.isActive || user.role === 'SUPERADMIN') {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const gymId = user.gym ? user.gym.toString() : null;
  const accessToken = signAccessToken({ sub: user.id, role: user.role, gymId });
  const refreshToken = signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion });

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const superadminLogin = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.isActive || user.role !== 'SUPERADMIN') {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role, gymId: null });
  const refreshToken = signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion });

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Refresh token is invalid or expired');
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
    throw ApiError.unauthorized('Refresh token is no longer valid');
  }

  const gymId = user.gym ? user.gym.toString() : null;
  const accessToken = signAccessToken({ sub: user.id, role: user.role, gymId });

  return { user: sanitizeUser(user), accessToken };
};

export const logout = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized();
  }
  return sanitizeUser(user);
};

export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized();
  }

  user.name = input.name;
  await user.save();

  return sanitizeUser(user);
};

export const changePassword = async (userId: string, input: ChangePasswordInput): Promise<void> => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized();
  }

  const valid = await user.comparePassword(input.currentPassword);
  if (!valid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.passwordHash = await bcrypt.hash(input.newPassword, 10);
  user.tokenVersion += 1;
  await user.save();
};

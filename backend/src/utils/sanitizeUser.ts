import { IUser } from '../models/User.model';

export const sanitizeUser = (user: IUser) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  gym: user.gym ? user.gym.toString() : null,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

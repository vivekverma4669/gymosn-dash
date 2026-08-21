export type UserRole = 'SUPERADMIN' | 'GYM_OWNER' | 'TRAINER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gym: string | null;
  isActive: boolean;
  createdAt: string;
}

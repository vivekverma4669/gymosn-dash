import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/apiClient';
import { AuthUser } from '../types/auth';
import { User, KeyRound, AlertCircle, CheckCircle2, Building2 } from 'lucide-react';

const ROLE_LABEL: Record<string, string> = {
  GYM_OWNER: 'Gym Owner',
  TRAINER: 'Trainer',
  SUPERADMIN: 'Super Admin',
};

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: (input: { name: string }) => api.patch<AuthUser>('/api/auth/me', input),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      api.post('/api/auth/change-password', input),
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);

    if (name.trim().length < 2) {
      setProfileError('Name must be at least 2 characters');
      return;
    }

    try {
      const updated = await updateProfileMutation.mutateAsync({ name: name.trim() });
      updateUser(updated);
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    }
  };

  const displayName = user?.name ?? '';
  const roleLabel = user ? (ROLE_LABEL[user.role] ?? user.role) : '';
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '-';

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your personal account name and login password."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Identity card */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
              {displayName ? initialsOf(displayName) : <User className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
              <Building2 className="h-3.5 w-3.5" /> {roleLabel}
            </span>
            <p className="text-[10px] text-muted-foreground">Member since {memberSince}</p>
          </div>
        </div>

        {/* Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile details */}
          <form
            onSubmit={handleProfileSubmit}
            className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Profile Details</h3>
            </div>

            {profileError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Profile updated successfully.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setProfileSuccess(false);
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email ?? ''}
                  className="w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground">
                  Contact your gym administrator to change your login email.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border/60">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Change password */}
          <form
            onSubmit={handlePasswordSubmit}
            className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Change Password</h3>
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Password changed. You'll need to sign in again on other devices.
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border/60">
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60"
              >
                {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

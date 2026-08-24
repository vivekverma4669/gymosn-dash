import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GymOwnerSummary } from '../../types/gym';

interface GymCredentialsDialogProps {
  isOpen: boolean;
  owner: GymOwnerSummary | null;
  onClose: () => void;
  onUpdateEmail: (newEmail: string) => Promise<void>;
  onResetPassword: (newPassword: string) => Promise<void>;
}

export const GymCredentialsDialog: React.FC<GymCredentialsDialogProps> = ({
  isOpen,
  owner,
  onClose,
  onUpdateEmail,
  onResetPassword,
}) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  useEffect(() => {
    if (isOpen && owner) {
      setEmail(owner.email);
      setNewPassword('');
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, owner]);

  if (!owner) return null;

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmittingEmail(true);
    try {
      await onUpdateEmail(email);
      setSuccess('Login email updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update email');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmittingPassword(true);
    try {
      await onResetPassword(newPassword);
      setSuccess('Password reset. Share the new password with the gym owner.');
      setNewPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative z-50 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Gym Owner Credentials</h3>
                <p className="text-xs text-muted-foreground">{owner.name}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
              Passwords are one-way encrypted and can never be viewed — set a new one below if the
              owner has forgotten theirs.
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-medium text-emerald-500">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {success}
              </div>
            )}

            <form onSubmit={handleUpdateEmail} className="space-y-2.5 border-t border-border/60 pt-4">
              <label className="text-xs font-semibold text-foreground">Login Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={isSubmittingEmail || email === owner.email}
                  className="shrink-0 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmittingEmail ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>

            <form onSubmit={handleResetPassword} className="space-y-2.5 border-t border-border/60 pt-4">
              <label className="text-xs font-semibold text-foreground">Reset Password</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 8 characters)"
                  className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="shrink-0 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {isSubmittingPassword ? 'Resetting...' : 'Reset'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

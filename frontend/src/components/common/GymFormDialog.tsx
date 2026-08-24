import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, X, AlertCircle } from 'lucide-react';
import { SubscriptionTier } from '../../types/gym';

export interface CreateGymInput {
  gymName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  subscriptionTier: SubscriptionTier;
}

interface GymFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CreateGymInput) => Promise<void>;
}

const emptyForm: CreateGymInput = {
  gymName: '',
  ownerName: '',
  ownerEmail: '',
  ownerPassword: '',
  subscriptionTier: 'BASIC',
};

export const GymFormDialog: React.FC<GymFormDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<CreateGymInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create gym');
    } finally {
      setIsSubmitting(false);
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
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Onboard New Gym</h3>
                <p className="text-xs text-muted-foreground">Creates the gym tenant and its owner login.</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Gym Name</label>
                <input
                  type="text"
                  required
                  value={form.gymName}
                  onChange={(e) => setForm((f) => ({ ...f, gymName: e.target.value }))}
                  placeholder="Apex Fitness Center"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Owner Name</label>
                <input
                  type="text"
                  required
                  value={form.ownerName}
                  onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
                  placeholder="Ravi Kumar"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Owner Email</label>
                <input
                  type="email"
                  required
                  value={form.ownerEmail}
                  onChange={(e) => setForm((f) => ({ ...f, ownerEmail: e.target.value }))}
                  placeholder="ravi@apexfitness.com"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Owner Temporary Password</label>
                <input
                  type="text"
                  required
                  minLength={8}
                  value={form.ownerPassword}
                  onChange={(e) => setForm((f) => ({ ...f, ownerPassword: e.target.value }))}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Subscription Tier</label>
                <select
                  value={form.subscriptionTier}
                  onChange={(e) => setForm((f) => ({ ...f, subscriptionTier: e.target.value as SubscriptionTier }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                >
                  <option value="BASIC">Basic (₹499) — no WhatsApp automation</option>
                  <option value="PROFESSIONAL">Professional (₹999) — automated reminders + birthday wishes</option>
                  <option value="ENTERPRISE">Enterprise (₹1,499) — custom</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating...' : 'Create Gym'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, AlertCircle } from 'lucide-react';
import { Member, MembershipPlan } from '../../constants/mockData';
import { CreateMemberPayload } from '../../types/gymData';
import { AuthUser } from '../../types/auth';

interface MemberFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CreateMemberPayload) => Promise<void>;
  plans: MembershipPlan[];
  trainers: AuthUser[];
}

const todayIsoDate = (): string => new Date().toISOString().slice(0, 10);

const emptyForm: CreateMemberPayload = {
  name: '',
  phone: '',
  email: '',
  plan: '',
  trainer: '',
  joiningDate: todayIsoDate(),
  dateOfBirth: '',
  agreedPrice: 0,
  dueAmount: 0,
  gender: 'Male' as Member['gender'],
  age: 25,
};

export const MemberFormDialog: React.FC<MemberFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  plans,
  trainers,
}) => {
  const [form, setForm] = useState<CreateMemberPayload>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...emptyForm, plan: plans[0]?.id ?? '', agreedPrice: plans[0]?.price ?? 0 });
      setError(null);
    }
  }, [isOpen, plans]);

  const handlePlanChange = (planId: string) => {
    const selectedPlan = plans.find((p) => p.id === planId);
    setForm((f) => ({ ...f, plan: planId, agreedPrice: selectedPlan?.price ?? f.agreedPrice }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSave({
        ...form,
        trainer: form.trainer || undefined,
        email: form.email || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        agreedPrice: Number(form.agreedPrice) || 0,
        dueAmount: Number(form.dueAmount) || 0,
        age: Number(form.age) || 0,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member');
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
            className="relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Add New Member</h3>
                <p className="text-xs text-muted-foreground">Expiry date is calculated from the selected plan.</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {plans.length === 0 ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs font-medium text-amber-600">
                Create a membership plan first before adding members.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Rahul Sharma"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Phone</label>
                    <input
                      type="text"
                      required
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email (optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="rahul@example.com"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Membership Plan</label>
                    <select
                      required
                      value={form.plan}
                      onChange={(e) => handlePlanChange(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                    >
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} (₹{plan.price} / {plan.durationValue} {plan.durationUnit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Trainer (optional)</label>
                    <select
                      value={form.trainer}
                      onChange={(e) => setForm((f) => ({ ...f, trainer: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                    >
                      <option value="">Unassigned</option>
                      {trainers.map((trainer) => (
                        <option key={trainer.id} value={trainer.id}>
                          {trainer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Joining Date</label>
                    <input
                      type="date"
                      required
                      value={form.joiningDate}
                      onChange={(e) => setForm((f) => ({ ...f, joiningDate: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Date of Birth (optional)</label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      max={todayIsoDate()}
                      onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                    />
                    <p className="text-[10px] text-muted-foreground">Used for automated birthday wishes.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as Member['gender'] }))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Age</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={form.age}
                      onChange={(e) => setForm((f) => ({ ...f, age: Number(e.target.value) }))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Agreed Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.agreedPrice}
                      onChange={(e) => setForm((f) => ({ ...f, agreedPrice: Number(e.target.value) }))}
                      placeholder="0"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Defaults to the plan's list price — override for negotiated, discounted, or free (₹0) memberships.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Due Amount (₹, optional)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.dueAmount}
                      onChange={(e) => setForm((f) => ({ ...f, dueAmount: Number(e.target.value) }))}
                      placeholder="0"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
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
                    {isSubmitting ? 'Adding...' : 'Add Member'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

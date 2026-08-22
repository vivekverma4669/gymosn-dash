import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, X, AlertCircle } from 'lucide-react';
import { Member } from '../../constants/mockData';
import { CreatePaymentPayload, PaymentMethod } from '../../types/payment';

interface RecordPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CreatePaymentPayload) => Promise<void>;
  members: Member[];
}

const METHODS: PaymentMethod[] = ['UPI', 'Cash', 'Card', 'Bank Transfer'];

interface FormState {
  memberId: string;
  amount: number;
  method: PaymentMethod;
  notes: string;
}

const emptyForm: FormState = { memberId: '', amount: 0, method: 'UPI', notes: '' };

export const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({ isOpen, onClose, onSave, members }) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const membersWithDue = members.filter((m) => m.dueAmount > 0);
  const defaultMemberList = membersWithDue.length > 0 ? membersWithDue : members;

  useEffect(() => {
    if (isOpen) {
      const first = defaultMemberList[0];
      setForm({ ...emptyForm, memberId: first?.id ?? '', amount: first?.dueAmount ?? 0 });
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, members]);

  const handleMemberChange = (memberId: string) => {
    const selected = members.find((m) => m.id === memberId);
    setForm((f) => ({ ...f, memberId, amount: selected?.dueAmount ?? f.amount }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSave({
        memberId: form.memberId,
        amount: Number(form.amount) || 0,
        method: form.method,
        notes: form.notes,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
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
                <Receipt className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Record Payment</h3>
                <p className="text-xs text-muted-foreground">Logs a transaction and reduces the member's due amount.</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {members.length === 0 ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs font-medium text-amber-600">
                Add a member first before recording a payment.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Member</label>
                  <select
                    required
                    value={form.memberId}
                    onChange={(e) => handleMemberChange(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                  >
                    {defaultMemberList.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} {member.dueAmount > 0 ? `(Due ₹${member.dueAmount.toLocaleString('en-IN')})` : '(No dues)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={form.amount}
                      onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Method</label>
                    <select
                      value={form.method}
                      onChange={(e) => setForm((f) => ({ ...f, method: e.target.value as PaymentMethod }))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                    >
                      {METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Notes (optional)</label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="e.g. Monthly renewal"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
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
                    {isSubmitting ? 'Recording...' : 'Record Payment'}
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

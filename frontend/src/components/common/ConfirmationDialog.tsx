import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
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
            className="relative z-50 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                  variant === 'danger' && 'bg-rose-500/10 text-rose-500',
                  variant === 'warning' && 'bg-amber-500/10 text-amber-500',
                  variant === 'info' && 'bg-blue-500/10 text-blue-500'
                )}
              >
                {variant === 'info' ? (
                  <Info className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                disabled={isLoading}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50',
                  variant === 'danger' && 'bg-rose-600 hover:bg-rose-700',
                  variant === 'warning' && 'bg-amber-600 hover:bg-amber-700',
                  variant === 'info' && 'bg-primary hover:bg-primary/90'
                )}
              >
                {isLoading ? 'Processing...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, Send, X, ExternalLink, CheckCircle } from 'lucide-react';

interface WhatsAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  phone: string;
  defaultMessage?: string;
}

export const WhatsAppDialog: React.FC<WhatsAppDialogProps> = ({
  isOpen,
  onClose,
  recipientName,
  phone,
  defaultMessage = '',
}) => {
  const [message, setMessage] = useState(defaultMessage || `Namaste ${recipientName}! Greetings from Apex Fitness Gym.`);
  const [isSent, setIsSent] = useState(false);

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => {
      window.open(waUrl, '_blank');
      setIsSent(false);
      onClose();
    }, 800);
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
            className="relative z-50 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Send WhatsApp Reminder</h3>
                <p className="text-xs text-muted-foreground">
                  To: <span className="font-semibold text-foreground">{recipientName}</span> ({phone})
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-foreground">Message Preview</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" /> Direct Call
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSent}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSent ? (
                    <>
                      <CheckCircle className="h-4 w-4 animate-bounce" /> Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send WhatsApp
                      <ExternalLink className="h-3 w-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

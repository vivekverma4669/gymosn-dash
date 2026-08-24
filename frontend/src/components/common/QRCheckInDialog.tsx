import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { X, QrCode } from 'lucide-react';

interface QRCheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gymId: string;
}

export const QRCheckInDialog: React.FC<QRCheckInDialogProps> = ({ isOpen, onClose, gymId }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const checkInUrl = `${window.location.origin}/checkin/${gymId}`;

  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(checkInUrl, { width: 320, margin: 2 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [isOpen, checkInUrl]);

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

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
            className="relative z-50 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-center"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Self Check-in QR</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Display this at the entrance. Members scan it with their phone, type their number, and check
              themselves in — no desk staff needed.
            </p>

            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Check-in QR code" className="mx-auto rounded-xl border border-border" />
            ) : (
              <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-xl border border-border bg-muted/30 text-xs text-muted-foreground">
                Generating QR...
              </div>
            )}

            <p className="break-all text-[10px] text-muted-foreground font-mono">{checkInUrl}</p>

            {isLocalhost && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-[11px] font-medium text-amber-600 text-left">
                This page is open at <strong>localhost</strong> — a phone can't reach that. Open the dashboard
                using this computer's LAN IP instead (e.g. http://192.168.x.x:3000) with your phone on the same
                Wi-Fi, then reopen this QR from there.
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

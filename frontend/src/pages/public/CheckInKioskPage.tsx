import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Dumbbell, Phone, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { sanitizePhoneInput } from '../../utils/phone';

interface GymInfo {
  id: string;
  name: string;
}

export const CheckInKioskPage: React.FC = () => {
  const { gymId } = useParams<{ gymId: string }>();
  const [gym, setGym] = useState<GymInfo | null>(null);
  const [gymError, setGymError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!gymId) return;
    fetch(`/api/public/gyms/${gymId}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.success) {
          setGym(body.data);
        } else {
          setGymError(body.message ?? 'Gym not found');
        }
      })
      .catch(() => setGymError('Could not reach the server. Check your connection and try again.'));
  }, [gymId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymId) return;
    setStatus('submitting');
    setMessage(null);
    try {
      const res = await fetch(`/api/public/gyms/${gymId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const body = await res.json();
      if (res.ok && body.success) {
        setStatus('success');
        setMessage(body.message ?? 'Checked in!');
      } else {
        setStatus('error');
        setMessage(body.message ?? 'Check-in failed');
      }
    } catch {
      setStatus('error');
      setMessage('Could not reach the server. Check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Dumbbell className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-foreground">{gym?.name ?? 'Gym Check-in'}</h1>
          <p className="text-xs text-muted-foreground">Enter your registered phone number to check in.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
          {gymError ? (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-sm font-medium text-rose-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {gymError}
            </div>
          ) : status === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <p className="text-sm font-bold text-foreground">{message}</p>
              <button
                onClick={() => {
                  setStatus('idle');
                  setPhone('');
                  setMessage(null);
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Check in another member
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && message && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-500">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {message}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    autoFocus
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting' || !gym}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" />
                {status === 'submitting' ? 'Checking in...' : 'Check In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

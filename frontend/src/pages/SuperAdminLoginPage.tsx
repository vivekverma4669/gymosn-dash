import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApiClientError } from '../lib/apiClient';

export const SuperAdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { systemLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await systemLogin(email, password);
      const from = (location.state as { from?: Location })?.from?.pathname;
      navigate(from ?? '/superadmin/gyms', { replace: true });
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
              <ShieldAlert className="h-6 w-6 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-50">Restricted System Access</h2>
            <p className="text-xs text-zinc-500">
              This console controls every tenant on the platform. Access attempts are logged and rate-limited.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Operator Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@fitdesk.com"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                required
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-9 pr-4 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-zinc-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-60 disabled:active:scale-100"
            >
              {isSubmitting ? 'Verifying...' : 'Enter Console'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

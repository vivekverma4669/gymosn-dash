import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h2>
          <p className="text-xs text-muted-foreground">
            Enter your email to receive password reset instructions
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs text-center space-y-2">
            <p className="font-bold">Reset Link Sent!</p>
            <p className="text-muted-foreground">Check your inbox for step-by-step password recovery.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@apexfitness.com"
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              Send Reset Instructions
            </button>
          </form>
        )}

        <div className="border-t border-border/60 pt-4 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>

      <EmptyState
        title="Password Recovery System"
        description="Secure password reset flow with token-based email verification."
        icon={KeyRound}
      />
    </div>
  );
};

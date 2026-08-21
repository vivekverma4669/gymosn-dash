import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Dumbbell, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col justify-between relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between p-6 z-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Dumbbell className="h-6 w-6 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground flex items-center gap-1">
            Gymosn <Sparkles className="h-4 w-4 text-primary" />
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Auth Card Content */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-muted-foreground z-10 border-t border-border/40">
        &copy; {new Date().getFullYear()} Gymosn SaaS Inc. All rights reserved. Enterprise Gym Management.
      </footer>
    </div>
  );
};

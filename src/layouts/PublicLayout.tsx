import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Dumbbell, Sparkles, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col justify-between">
      {/* Public Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 text-primary-foreground shadow-md shadow-primary/20">
              <Dumbbell className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-tight text-foreground flex items-center gap-1">
              Gymosn <Sparkles className="h-4 w-4 text-primary" />
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-xs font-semibold text-foreground hover:text-primary transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              Register Gym
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Gymosn SaaS</span>
            <span className="text-xs text-muted-foreground">— Multi-tenant Gym CRM Architecture</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Gymosn. Built for scale & high performance.
          </p>
        </div>
      </footer>
    </div>
  );
};

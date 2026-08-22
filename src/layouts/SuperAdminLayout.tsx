import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const SuperAdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/system-console/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="flex items-center justify-between border-b border-border/80 bg-card/80 px-6 py-4 backdrop-blur-md">
        <Link to="/superadmin/gyms" className="flex items-center gap-2.5">
          <BrandLogo className="h-10 w-10" />
          <span className="text-xl font-black tracking-tight text-foreground flex items-center gap-1">
            Fitdesk <Sparkles className="h-4 w-4 text-primary" />
          </span>
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
            <ShieldCheck className="h-3 w-3" /> Super Admin
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-muted-foreground sm:block">{user?.email}</span>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

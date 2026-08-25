import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Building2, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const ROLE_LABEL: Record<string, string> = {
  GYM_OWNER: 'Gym Owner',
  TRAINER: 'Trainer',
  SUPERADMIN: 'Super Admin',
};

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.name ?? 'User';
  const roleLabel = user ? (ROLE_LABEL[user.role] ?? user.role) : '';
  const initials = initialsOf(displayName);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 pr-3 hover:bg-accent transition-all shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-primary/20"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-xs">
          {initials}
        </div>
        <div className="hidden text-left md:block">
          <p className="text-xs font-bold text-foreground leading-none">{displayName}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{roleLabel}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-border bg-card p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in-80 zoom-in-95">
            {/* Header info */}
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl mb-1 border border-border/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                {initials}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                  <Building2 className="h-3 w-3" /> {roleLabel}
                </span>
              </div>
            </div>

            <div className="my-1 border-t border-border/60" />

            {/* Quick Links */}
            <div className="space-y-0.5">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                My Profile
              </Link>
            </div>

            <div className="my-1 border-t border-border/60" />

            {/* Theme switcher inside user menu */}
            <div className="px-3 py-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Appearance
              </p>
              <div className="grid grid-cols-3 gap-1 bg-muted/60 p-1 rounded-xl">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    'flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-medium transition-all',
                    theme === 'light' ? 'bg-card text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Sun className="h-3.5 w-3.5" />
                  Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-medium transition-all',
                    theme === 'dark' ? 'bg-card text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Moon className="h-3.5 w-3.5" />
                  Dark
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={cn(
                    'flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-medium transition-all',
                    theme === 'system' ? 'bg-card text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  Auto
                </button>
              </div>
            </div>

            <div className="my-1 border-t border-border/60" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { isDark, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-all shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-primary/20"
      aria-label="Toggle Theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};

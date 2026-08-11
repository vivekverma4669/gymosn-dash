import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showShortcut?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search anything...',
  className,
  showShortcut = true,
}) => {
  return (
    <div className={cn('relative flex items-center w-full max-w-sm', className)}>
      <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-card/80 pl-10 pr-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs"
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 p-0.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : showShortcut ? (
        <kbd className="absolute right-3 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      ) : null}
    </div>
  );
};

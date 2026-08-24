import React, { useState } from 'react';
import { Filter, Check, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterButtonProps {
  options: FilterOption[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  label?: string;
  className?: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  options,
  selectedValues,
  onSelect,
  label = 'Filter',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative inline-block text-left', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-2xs hover:bg-accent hover:text-accent-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all"
      >
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span>{label}</span>
        {selectedValues.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg ring-1 ring-black/5 animate-in fade-in-80 zoom-in-95">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Filter Options
            </div>
            <div className="my-1 border-t border-border/60" />
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onSelect(option.value);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

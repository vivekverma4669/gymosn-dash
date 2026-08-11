import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 text-center backdrop-blur-xs',
        className
      )}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs ring-8 ring-primary/5">
        <Icon className="h-8 w-8 stroke-[1.75]" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">
        {description}
      </p>
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring active:scale-95"
            >
              <Plus className="h-4 w-4" />
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && (
            <button
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-2xs transition-all hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring active:scale-95"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

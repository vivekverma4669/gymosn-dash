import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  description?: string;
  className?: string;
  iconBgColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend = 'up',
  icon: Icon,
  description,
  className,
  iconBgColor = 'bg-primary/10 text-primary',
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
          </div>
        </div>
        <div className={cn('p-3 rounded-xl flex items-center justify-center', iconBgColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(change || description) && (
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/50 text-xs">
          {change && (
            <div className="flex items-center font-medium">
              {trend === 'up' && (
                <span className="flex items-center text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {change}
                </span>
              )}
              {trend === 'down' && (
                <span className="flex items-center text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full font-semibold">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  {change}
                </span>
              )}
              {trend === 'neutral' && (
                <span className="flex items-center text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  <Minus className="mr-1 h-3 w-3" />
                  {change}
                </span>
              )}
            </div>
          )}
          {description && (
            <span className="text-muted-foreground truncate max-w-[180px]">{description}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

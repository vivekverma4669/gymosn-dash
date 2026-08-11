import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ customItems, className }) => {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard' },
    ];

    let currentPath = '';
    pathnames.forEach((name) => {
      if (name === 'dashboard') return;
      currentPath += `/${name}`;

      const formattedLabel = name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbs.push({
        label: formattedLabel,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const items = getBreadcrumbs();

  return (
    <nav className={cn('flex items-center text-xs font-medium text-muted-foreground', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1.5">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-foreground px-1 py-0.5 rounded-md bg-muted/40">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

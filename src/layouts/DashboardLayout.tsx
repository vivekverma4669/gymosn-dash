import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
} from 'lucide-react';
import { SIDEBAR_NAV_ITEMS } from '../constants/navigation';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { UserMenu } from '../components/common/UserMenu';
import { BrandLogo } from '../components/common/BrandLogo';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';

export const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { gymView, exitGymView } = useAuth();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      {gymView && (
        <div className="flex h-10 shrink-0 items-center justify-center gap-3 bg-primary px-4 text-xs font-semibold text-primary-foreground">
          <Eye className="h-3.5 w-3.5" />
          <span>
            Viewing <strong>{gymView.gymName}</strong> as Super Admin
          </span>
          <button
            onClick={() => {
              exitGymView();
              navigate('/superadmin/gyms');
            }}
            className="ml-2 rounded-md bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide hover:bg-white/25 transition-colors"
          >
            Exit to Super Admin
          </button>
        </div>
      )}
      <div className="flex flex-1 w-full overflow-hidden">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border/80 bg-card transition-all duration-300 md:static md:z-30',
          isSidebarCollapsed ? 'w-20' : 'w-64',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Sidebar Header / Brand */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/60">
          <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <BrandLogo className="h-10 w-10" />
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-lg font-black tracking-tight text-foreground flex items-center gap-1">
                  Fitdesk <Sparkles className="h-3.5 w-3.5 text-primary" />
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Multi-Tenant CRM
                </span>
              </motion.div>
            )}
          </NavLink>

          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-bold'
                    : 'text-muted-foreground hover:bg-accent/80 hover:text-foreground'
                )}
                title={isSidebarCollapsed ? item.title : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1">{item.title}</span>
                )}
                {!isSidebarCollapsed && item.badge && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Collapse Toggle Button (Desktop) */}
        <div className="hidden border-t border-border/60 p-3 md:block">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex w-full items-center justify-center rounded-xl border border-border bg-muted/30 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold">
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse Sidebar</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border/80 bg-card/80 px-4 md:px-6 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Breadcrumb className="hidden sm:flex" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="h-6 w-px bg-border/80 mx-1 hidden sm:block" />
            <UserMenu />
          </div>
        </header>

        {/* Page Content with Framer Motion transitions */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-7xl"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      </div>
    </div>
  );
};

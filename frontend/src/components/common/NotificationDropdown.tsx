import React, { useState } from 'react';
import { Bell, CheckCheck, CreditCard, UserPlus, AlertCircle, Dumbbell } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'member' | 'payment' | 'alert' | 'workout';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'New Member Registration',
    message: 'Sarah Jenkins joined Gold Tier Plan',
    time: '5m ago',
    read: false,
    type: 'member',
  },
  {
    id: '2',
    title: 'Payment Received',
    message: '₹4,500 received from Marcus Vance',
    time: '25m ago',
    read: false,
    type: 'payment',
  },
  {
    id: '3',
    title: 'Membership Expiring',
    message: '3 members have plans expiring in 48 hours',
    time: '2h ago',
    read: false,
    type: 'alert',
  },
  {
    id: '4',
    title: 'New Workout Assigned',
    message: 'Trainer Alex assigned Hypertrophy v2 to 5 members',
    time: '4h ago',
    read: true,
    type: 'workout',
  },
];

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'member':
        return <UserPlus className="h-4 w-4 text-emerald-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-primary" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'workout':
        return <Dumbbell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-all shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-primary/20"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-3 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl ring-1 ring-black/5 animate-in fade-in-80 zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[340px] overflow-y-auto divide-y divide-border/40 p-1">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setNotifications(
                        notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                      );
                    }}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer',
                      !item.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-accent/60'
                    )}
                  >
                    <div className="p-2 rounded-xl bg-card border border-border shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground">{item.title}</p>
                        <span className="text-[10px] text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.message}</p>
                    </div>
                    {!item.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-border/60 text-center bg-muted/20 rounded-b-2xl">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Close notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

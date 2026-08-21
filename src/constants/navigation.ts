import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  CreditCard,
  Receipt,
  Dumbbell,
  Utensils,
  BarChart3,
  FileSpreadsheet,
  Zap,
  Settings,
  User,
  HelpCircle,
  RefreshCw,
  MessageSquare,
  ClipboardList,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of gym metrics and daily operational actions',
  },
  {
    title: 'Members',
    href: '/members',
    icon: Users,
    description: 'Manage active, expired, and pending gym members',
  },
  {
    title: 'Enquiries',
    href: '/enquiries',
    icon: ClipboardList,
    description: 'Track walk-ins and callers who haven\'t joined yet',
  },
  {
    title: 'Renewals',
    href: '/renewals',
    icon: RefreshCw,
    badge: 'Urgent',
    description: 'Quick membership renewals & fee collection hub',
  },
  {
    title: 'Reminder Center',
    href: '/reminders',
    icon: MessageSquare,
    badge: 'WhatsApp',
    description: 'Send automated WhatsApp reminders & wishes',
  },
  {
    title: 'Trainers',
    href: '/trainers',
    icon: UserCheck,
    description: 'Manage gym trainers, schedules, and assignments',
  },
  {
    title: 'Attendance',
    href: '/attendance',
    icon: CalendarCheck,
    description: 'Track daily check-ins and member attendance logs',
  },
  {
    title: 'Memberships',
    href: '/memberships',
    icon: CreditCard,
    description: 'Manage membership tiers, pricing, and renewals',
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: Receipt,
    description: 'Track invoices, UPI transactions, and fee collections',
  },
  {
    title: 'Workout Plans',
    href: '/workout-plans',
    icon: Dumbbell,
    description: 'Custom workout routines and training programs',
  },
  {
    title: 'Diet Plans',
    href: '/diet-plans',
    icon: Utensils,
    description: 'Personalized nutrition and meal plans for members',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'In-depth gym revenue and growth insights',
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileSpreadsheet,
    description: 'Exportable financial and operational reports',
  },
  {
    title: 'Subscription',
    href: '/subscription',
    icon: Zap,
    badge: 'Pro',
    description: 'Manage SaaS plan, tenant billing, and upgrades',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Tenant preferences, branding, and system configs',
  },
];

export const USER_NAV_ITEMS: NavItem[] = [
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Help & Support',
    href: '/settings',
    icon: HelpCircle,
  },
];

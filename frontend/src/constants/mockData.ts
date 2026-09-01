export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  plan: string; // references a custom MembershipPlan name — gyms define their own pricing/duration
  listPrice?: number; // the plan's list price, for comparison against agreedPrice
  agreedPrice?: number; // actual negotiated price for this member — may differ from listPrice (discounts, free passes, etc)
  status: 'Active' | 'Expired' | 'Expiring Soon' | 'Inactive';
  joiningDate: string;
  expiryDate: string;
  dateOfBirth?: string | null;
  dueAmount: number; // in INR ₹
  lastCheckIn: string;
  trainer: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  avatar: string;
}

/* Custom Membership Plans — every gym sets its own pricing & duration, so plans
   are gym-defined records rather than a fixed set of tiers. */
export interface MembershipPlan {
  id: string;
  name: string;
  price: number; // ₹
  durationValue: number;
  durationUnit: 'Days' | 'Weeks' | 'Months' | 'Years';
  description: string;
  activeMembers: number;
  isActive: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: 'Walk-in' | 'Phone Call' | 'Instagram' | 'Referral' | 'Website' | 'Facebook';
  interestedPlan: string;
  visitDate: string;
  followUpDate: string;
  status: 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Lost';
  assignedTo: string;
  notes: string;
}

export interface ReminderTemplate {
  id: string;
  category: 'Membership Expiry' | 'Fee Reminder' | 'Birthday Wishes' | 'Missed Attendance' | 'Custom Reminder';
  title: string;
  templateText: string;
}

export interface ReminderHistoryItem {
  id: string;
  recipientName: string;
  phone: string;
  category: string;
  message: string;
  sentAt: string;
  status: 'Delivered' | 'Sent' | 'Failed' | 'Skipped';
}

/* Canned WhatsApp message templates offered in the Reminder Center's composer.
   Gym-neutral by design — no hardcoded gym name, since every tenant shares these. */
export const MOCK_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'T-01',
    category: 'Membership Expiry',
    title: 'Expiry Alert - Standard Friendly',
    templateText: 'Namaste {name}! Your gym membership is expiring on {expiry_date}. Renew today to continue your workout streak without interruption!',
  },
  {
    id: 'T-02',
    category: 'Fee Reminder',
    title: 'Pending Fee Payment Urgent',
    templateText: 'Hello {name}, your fee payment of ₹{due_amount} for {plan} is pending. Kindly pay via UPI/Cash at the desk to avoid late charges.',
  },
  {
    id: 'T-03',
    category: 'Birthday Wishes',
    title: 'Birthday Celebration & Special Gift',
    templateText: '🎂 Happy Birthday {name}! Wishing you maximum gains, peak health, and joy from our entire gym team! 🎁',
  },
  {
    id: 'T-04',
    category: 'Missed Attendance',
    title: 'We Miss You Workout Check-in',
    templateText: 'Hey {name}! We noticed you haven\'t checked in for the last {days_absent} days. Your trainer {trainer} is waiting for you! Let\'s hit the gym today 💪',
  },
  {
    id: 'T-05',
    category: 'Custom Reminder',
    title: 'Special Gym Event / Announcement',
    templateText: 'Dear Member, we\'re hosting a special event this weekend — register now at reception!',
  },
];

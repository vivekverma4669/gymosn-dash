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

export interface FeeCollectionItem {
  id: string;
  memberName: string;
  phone: string;
  plan: string;
  dueAmount: number; // ₹
  dueDate: string;
}

export interface ExpiringMembershipItem {
  id: string;
  memberName: string;
  phone: string;
  currentPlan: string;
  expiryDate: string;
  daysRemaining: number;
  renewalAmount: number; // ₹
}

export interface BirthdayItem {
  id: string;
  memberName: string;
  phone: string;
  age: number;
  plan: string;
}

export interface AbsentMemberItem {
  id: string;
  memberName: string;
  phone: string;
  lastCheckInDate: string;
  daysAbsent: number;
  assignedTrainer: string;
}

export interface LeadFollowupItem {
  id: string;
  name: string;
  phone: string;
  followUpDate: string;
  status: 'Pending' | 'Contacted' | 'Converted' | 'Lost';
  notes: string;
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

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  phone: string;
  membershipId: string;
  checkInTime: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Not Checked In';
  trainer: string;
  plan: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceNo: string;
  memberName: string;
  phone: string;
  amount: number; // ₹
  date: string;
  status: 'Paid' | 'Pending' | 'Partial' | 'Overdue';
  method: 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';
  plan: string;
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
  status: 'Delivered' | 'Sent' | 'Failed';
}

/* Mock Members Dataset */
export const MOCK_MEMBERS: Member[] = [
  {
    id: 'MEM-101',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.s@gmail.com',
    plan: 'Yearly',
    status: 'Active',
    joiningDate: '2025-01-15',
    expiryDate: '2026-01-15',
    dueAmount: 0,
    lastCheckIn: '2026-08-10 07:30 AM',
    trainer: 'Vikram Malhotra',
    gender: 'Male',
    age: 28,
    avatar: 'RS',
  },
  {
    id: 'MEM-102',
    name: 'Priya Patel',
    phone: '+91 98123 45678',
    email: 'priya.patel@gmail.com',
    plan: 'Quarterly',
    status: 'Expiring Soon',
    joiningDate: '2025-05-12',
    expiryDate: '2026-08-12',
    dueAmount: 2500,
    lastCheckIn: '2026-08-09 06:15 PM',
    trainer: 'Ananya Verma',
    gender: 'Female',
    age: 25,
    avatar: 'PP',
  },
  {
    id: 'MEM-103',
    name: 'Amit Kumar',
    phone: '+91 97654 32109',
    email: 'amit.k@yahoo.in',
    plan: 'Monthly',
    status: 'Expired',
    joiningDate: '2025-07-01',
    expiryDate: '2026-08-01',
    dueAmount: 1800,
    lastCheckIn: '2026-08-02 08:00 AM',
    trainer: 'Rohan Gupta',
    gender: 'Male',
    age: 32,
    avatar: 'AK',
  },
  {
    id: 'MEM-104',
    name: 'Sneha Reddy',
    phone: '+91 99887 76655',
    email: 'sneha.reddy@outlook.com',
    plan: 'Premium',
    status: 'Active',
    joiningDate: '2025-03-20',
    expiryDate: '2026-09-20',
    dueAmount: 0,
    lastCheckIn: '2026-08-10 08:45 AM',
    trainer: 'Vikram Malhotra',
    gender: 'Female',
    age: 29,
    avatar: 'SR',
  },
  {
    id: 'MEM-105',
    name: 'Karan Singh',
    phone: '+91 98989 89898',
    email: 'karan.singh@gmail.com',
    plan: 'Half Yearly',
    status: 'Expiring Soon',
    joiningDate: '2025-02-15',
    expiryDate: '2026-08-15',
    dueAmount: 4500,
    lastCheckIn: '2026-08-04 07:00 AM',
    trainer: 'Rohan Gupta',
    gender: 'Male',
    age: 35,
    avatar: 'KS',
  },
  {
    id: 'MEM-106',
    name: 'Neha Joshi',
    phone: '+91 97766 55443',
    email: 'neha.j@gmail.com',
    plan: 'Personal Training',
    status: 'Active',
    joiningDate: '2025-06-10',
    expiryDate: '2026-10-10',
    dueAmount: 0,
    lastCheckIn: '2026-08-10 09:15 AM',
    trainer: 'Ananya Verma',
    gender: 'Female',
    age: 27,
    avatar: 'NJ',
  },
  {
    id: 'MEM-107',
    name: 'Rajesh Nair',
    phone: '+91 96543 21098',
    email: 'rnair@gmail.com',
    plan: 'Quarterly',
    status: 'Inactive',
    joiningDate: '2025-04-01',
    expiryDate: '2026-07-01',
    dueAmount: 3200,
    lastCheckIn: '2026-07-28 06:00 PM',
    trainer: 'Unassigned',
    gender: 'Male',
    age: 41,
    avatar: 'RN',
  },
];

/* Today's Action Center Datasets */
export const MOCK_UPCOMING_FEES: FeeCollectionItem[] = [
  {
    id: 'FEE-01',
    memberName: 'Priya Patel',
    phone: '+91 98123 45678',
    plan: 'Quarterly Renewal',
    dueAmount: 4500,
    dueDate: 'Today',
  },
  {
    id: 'FEE-02',
    memberName: 'Karan Singh',
    phone: '+91 98989 89898',
    plan: 'Half Yearly Fee',
    dueAmount: 6500,
    dueDate: 'Tomorrow',
  },
  {
    id: 'FEE-03',
    memberName: 'Amit Kumar',
    phone: '+91 97654 32109',
    plan: 'Monthly Dues',
    dueAmount: 1800,
    dueDate: 'Overdue by 9 days',
  },
  {
    id: 'FEE-04',
    memberName: 'Deepak Chopra',
    phone: '+91 99112 23344',
    plan: 'Personal Trainer Add-on',
    dueAmount: 5000,
    dueDate: 'Aug 12',
  },
];

export const MOCK_EXPIRING_MEMBERSHIPS: ExpiringMembershipItem[] = [
  {
    id: 'EXP-01',
    memberName: 'Priya Patel',
    phone: '+91 98123 45678',
    currentPlan: 'Quarterly Plan',
    expiryDate: '2026-08-12',
    daysRemaining: 2,
    renewalAmount: 4500,
  },
  {
    id: 'EXP-02',
    memberName: 'Karan Singh',
    phone: '+91 98989 89898',
    currentPlan: 'Half Yearly Gold',
    expiryDate: '2026-08-15',
    daysRemaining: 5,
    renewalAmount: 7999,
  },
  {
    id: 'EXP-03',
    memberName: 'Suresh Menon',
    phone: '+91 95432 10987',
    currentPlan: 'Monthly Strength',
    expiryDate: '2026-08-11',
    daysRemaining: 1,
    renewalAmount: 2000,
  },
  {
    id: 'EXP-04',
    memberName: 'Ritu Kapoor',
    phone: '+91 98711 22334',
    currentPlan: 'Yearly Platinum',
    expiryDate: '2026-08-17',
    daysRemaining: 7,
    renewalAmount: 14999,
  },
];

export const MOCK_BIRTHDAYS: BirthdayItem[] = [
  {
    id: 'Bday-01',
    memberName: 'Sneha Reddy',
    phone: '+91 99887 76655',
    age: 29,
    plan: 'Premium Gold Member',
  },
  {
    id: 'Bday-02',
    memberName: 'Vikram Malhotra',
    phone: '+91 98221 12233',
    age: 31,
    plan: 'Head Strength Trainer',
  },
  {
    id: 'Bday-03',
    memberName: 'Arjun Das',
    phone: '+91 97112 23344',
    age: 24,
    plan: 'Quarterly Fitness',
  },
];

export const MOCK_ABSENT_MEMBERS: AbsentMemberItem[] = [
  {
    id: 'ABS-01',
    memberName: 'Karan Singh',
    phone: '+91 98989 89898',
    lastCheckInDate: '2026-08-04 (6 days ago)',
    daysAbsent: 6,
    assignedTrainer: 'Rohan Gupta',
  },
  {
    id: 'ABS-02',
    memberName: 'Rajesh Nair',
    phone: '+91 96543 21098',
    lastCheckInDate: '2026-07-28 (13 days ago)',
    daysAbsent: 13,
    assignedTrainer: 'Unassigned',
  },
  {
    id: 'ABS-03',
    memberName: 'Manish Pandey',
    phone: '+91 98334 45566',
    lastCheckInDate: '2026-08-03 (7 days ago)',
    daysAbsent: 7,
    assignedTrainer: 'Vikram Malhotra',
  },
];

export const MOCK_LEAD_FOLLOWUPS: LeadFollowupItem[] = [
  {
    id: 'LEAD-01',
    name: 'Tarun Verma',
    phone: '+91 98777 66554',
    followUpDate: 'Today 04:00 PM',
    status: 'Pending',
    notes: 'Inquired about Annual Membership & Personal Training.',
  },
  {
    id: 'LEAD-02',
    name: 'Meera Deshmukh',
    phone: '+91 98111 44332',
    followUpDate: 'Today 06:30 PM',
    status: 'Pending',
    notes: 'Free trial session requested for Zumba/Cardio batch.',
  },
  {
    id: 'LEAD-03',
    name: 'Gaurav Gill',
    phone: '+91 99554 43322',
    followUpDate: 'Tomorrow 11:00 AM',
    status: 'Contacted',
    notes: 'Quoted ₹12,000 yearly plan rate.',
  },
];

/* Custom Membership Plans Dataset */
export const MOCK_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'PLAN-01',
    name: 'Monthly',
    price: 1800,
    durationValue: 1,
    durationUnit: 'Months',
    description: 'Flexible month-to-month gym access.',
    activeMembers: 1,
    isActive: true,
  },
  {
    id: 'PLAN-02',
    name: 'Quarterly',
    price: 4500,
    durationValue: 3,
    durationUnit: 'Months',
    description: '3-month plan with better value than monthly.',
    activeMembers: 2,
    isActive: true,
  },
  {
    id: 'PLAN-03',
    name: 'Half Yearly',
    price: 7999,
    durationValue: 6,
    durationUnit: 'Months',
    description: '6-month commitment plan for regulars.',
    activeMembers: 1,
    isActive: true,
  },
  {
    id: 'PLAN-04',
    name: 'Yearly',
    price: 14999,
    durationValue: 1,
    durationUnit: 'Years',
    description: 'Best value annual membership, unlimited access.',
    activeMembers: 1,
    isActive: true,
  },
  {
    id: 'PLAN-05',
    name: 'Premium',
    price: 22000,
    durationValue: 1,
    durationUnit: 'Years',
    description: 'Annual plan with premium equipment & spa access.',
    activeMembers: 1,
    isActive: true,
  },
  {
    id: 'PLAN-06',
    name: 'Personal Training',
    price: 5000,
    durationValue: 1,
    durationUnit: 'Months',
    description: 'Add-on 1:1 personal training sessions, billed monthly.',
    activeMembers: 1,
    isActive: true,
  },
  {
    id: 'PLAN-07',
    name: '45-Day Transformation',
    price: 3499,
    durationValue: 45,
    durationUnit: 'Days',
    description: 'Short-term challenge plan for a custom fee & duration.',
    activeMembers: 0,
    isActive: true,
  },
];

/* Enquiry Dataset — visitors who walked in or called but haven't joined yet */
export const MOCK_ENQUIRIES: Enquiry[] = [
  {
    id: 'ENQ-01',
    name: 'Tarun Verma',
    phone: '+91 98777 66554',
    email: 'tarun.verma@gmail.com',
    source: 'Walk-in',
    interestedPlan: 'Yearly',
    visitDate: '2026-08-18',
    followUpDate: 'Today 04:00 PM',
    status: 'Follow-up',
    assignedTo: 'Front Desk',
    notes: 'Inquired about Annual Membership & Personal Training.',
  },
  {
    id: 'ENQ-02',
    name: 'Meera Deshmukh',
    phone: '+91 98111 44332',
    source: 'Instagram',
    interestedPlan: 'Monthly',
    visitDate: '2026-08-19',
    followUpDate: 'Today 06:30 PM',
    status: 'New',
    assignedTo: 'Front Desk',
    notes: 'Free trial session requested for Zumba/Cardio batch.',
  },
  {
    id: 'ENQ-03',
    name: 'Gaurav Gill',
    phone: '+91 99554 43322',
    email: 'gaurav.gill@outlook.com',
    source: 'Referral',
    interestedPlan: 'Yearly',
    visitDate: '2026-08-15',
    followUpDate: 'Tomorrow 11:00 AM',
    status: 'Contacted',
    assignedTo: 'Vikram Malhotra',
    notes: 'Quoted ₹12,000 yearly plan rate. Referred by Rahul Sharma.',
  },
  {
    id: 'ENQ-04',
    name: 'Ishita Bhatt',
    phone: '+91 97223 34455',
    source: 'Website',
    interestedPlan: 'Quarterly',
    visitDate: '2026-08-12',
    followUpDate: '2026-08-13',
    status: 'Converted',
    assignedTo: 'Ananya Verma',
    notes: 'Converted to Quarterly plan, now MEM-108.',
  },
  {
    id: 'ENQ-05',
    name: 'Sameer Joshi',
    phone: '+91 96887 12233',
    source: 'Phone Call',
    interestedPlan: 'Monthly',
    visitDate: '2026-08-05',
    followUpDate: '2026-08-07',
    status: 'Lost',
    assignedTo: 'Rohan Gupta',
    notes: 'Went with a gym closer to home.',
  },
  {
    id: 'ENQ-06',
    name: 'Divya Nair',
    phone: '+91 95667 78899',
    email: 'divya.nair@gmail.com',
    source: 'Facebook',
    interestedPlan: '45-Day Transformation',
    visitDate: '2026-08-19',
    followUpDate: 'Today 05:00 PM',
    status: 'New',
    assignedTo: 'Front Desk',
    notes: 'Asked about the 45-day transformation challenge pricing.',
  },
];

/* Attendance Dataset */
export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'ATT-101',
    memberId: 'MEM-101',
    memberName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    membershipId: 'GYM-8492',
    checkInTime: '07:30 AM',
    date: '2026-08-10',
    status: 'Present',
    trainer: 'Vikram Malhotra',
    plan: 'Yearly',
  },
  {
    id: 'ATT-102',
    memberId: 'MEM-104',
    memberName: 'Sneha Reddy',
    phone: '+91 99887 76655',
    membershipId: 'GYM-9102',
    checkInTime: '08:45 AM',
    date: '2026-08-10',
    status: 'Present',
    trainer: 'Vikram Malhotra',
    plan: 'Premium',
  },
  {
    id: 'ATT-103',
    memberId: 'MEM-106',
    memberName: 'Neha Joshi',
    phone: '+91 97766 55443',
    membershipId: 'GYM-3321',
    checkInTime: '09:15 AM',
    date: '2026-08-10',
    status: 'Present',
    trainer: 'Ananya Verma',
    plan: 'Personal Training',
  },
  {
    id: 'ATT-104',
    memberId: 'MEM-102',
    memberName: 'Priya Patel',
    phone: '+91 98123 45678',
    membershipId: 'GYM-1120',
    checkInTime: '—',
    date: '2026-08-10',
    status: 'Absent',
    trainer: 'Ananya Verma',
    plan: 'Quarterly',
  },
  {
    id: 'ATT-105',
    memberId: 'MEM-105',
    memberName: 'Karan Singh',
    phone: '+91 98989 89898',
    membershipId: 'GYM-5541',
    checkInTime: '10:45 AM',
    date: '2026-08-10',
    status: 'Late',
    trainer: 'Rohan Gupta',
    plan: 'Half Yearly',
  },
];

/* Payments Dataset */
export const MOCK_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'PAY-8901',
    invoiceNo: 'INV-2026-001',
    memberName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    amount: 14999,
    date: '2026-08-10',
    status: 'Paid',
    method: 'UPI',
    plan: 'Yearly Unlimited',
  },
  {
    id: 'PAY-8902',
    invoiceNo: 'INV-2026-002',
    memberName: 'Priya Patel',
    phone: '+91 98123 45678',
    amount: 2500,
    date: '2026-08-10',
    status: 'Partial',
    method: 'Cash',
    plan: 'Quarterly Renewal',
  },
  {
    id: 'PAY-8903',
    invoiceNo: 'INV-2026-003',
    memberName: 'Sneha Reddy',
    phone: '+91 99887 76655',
    amount: 22000,
    date: '2026-08-09',
    status: 'Paid',
    method: 'UPI',
    plan: 'VIP Personal Coaching',
  },
  {
    id: 'PAY-8904',
    invoiceNo: 'INV-2026-004',
    memberName: 'Amit Kumar',
    phone: '+91 97654 32109',
    amount: 1800,
    date: '2026-08-01',
    status: 'Overdue',
    method: 'Bank Transfer',
    plan: 'Monthly Fitness',
  },
  {
    id: 'PAY-8905',
    invoiceNo: 'INV-2026-005',
    memberName: 'Karan Singh',
    phone: '+91 98989 89898',
    amount: 4500,
    date: '2026-08-08',
    status: 'Pending',
    method: 'Cash',
    plan: 'Half Yearly',
  },
];

/* Reminder Templates & History */
export const MOCK_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'T-01',
    category: 'Membership Expiry',
    title: 'Expiry Alert - Standard Friendly',
    templateText: 'Namaste {name}! Your gym membership at Apex Fitness is expiring on {expiry_date}. Renew today to continue your workout streak without interruption! Link: apexfit.in/renew',
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
    templateText: '🎂 Happy Birthday {name}! Wishing you maximum gains, peak health, and joy from the entire Apex Fitness Gym team! Enjoy a free protein shake on us today! 🎁',
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
    templateText: 'Dear Member, Apex Fitness will host a Special Strength Masterclass this Sunday at 8 AM. Register now at reception!',
  },
];

export const MOCK_REMINDER_HISTORY: ReminderHistoryItem[] = [
  {
    id: 'HIST-01',
    recipientName: 'Priya Patel',
    phone: '+91 98123 45678',
    category: 'Membership Expiry',
    message: 'Namaste Priya! Your membership is expiring on 2026-08-12. Renew today!',
    sentAt: 'Today 10:30 AM',
    status: 'Delivered',
  },
  {
    id: 'HIST-02',
    recipientName: 'Sneha Reddy',
    phone: '+91 99887 76655',
    category: 'Birthday Wishes',
    message: '🎂 Happy Birthday Sneha! Wishing you peak health from Apex Fitness!',
    sentAt: 'Today 08:00 AM',
    status: 'Delivered',
  },
  {
    id: 'HIST-03',
    recipientName: 'Karan Singh',
    phone: '+91 98989 89898',
    category: 'Missed Attendance',
    message: 'Hey Karan! We missed you for the last 6 days. Trainer Rohan is waiting!',
    sentAt: 'Yesterday 05:00 PM',
    status: 'Delivered',
  },
];

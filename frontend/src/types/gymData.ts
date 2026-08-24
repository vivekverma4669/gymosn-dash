import { Member, MembershipPlan, Enquiry } from '../constants/mockData';

export type PlanDto = MembershipPlan;
export type MemberDto = Member;
export type EnquiryDto = Enquiry;

export interface CreatePlanPayload {
  name: string;
  price: number;
  durationValue: number;
  durationUnit: MembershipPlan['durationUnit'];
  description: string;
  isActive: boolean;
}

export interface CreateMemberPayload {
  name: string;
  phone: string;
  email?: string;
  plan: string;
  trainer?: string;
  joiningDate: string;
  dateOfBirth?: string;
  agreedPrice?: number;
  dueAmount?: number;
  gender: Member['gender'];
  age: number;
}

export interface CreateEnquiryPayload {
  name: string;
  phone: string;
  email?: string;
  source: Enquiry['source'];
  interestedPlan?: string;
  visitDate: string;
  followUpDate?: string;
  assignedTo?: string;
  notes?: string;
}

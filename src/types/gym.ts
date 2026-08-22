export type SubscriptionTier = 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface GymOwnerSummary {
  name: string;
  email: string;
  isActive: boolean;
}

export interface GymSummary {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  owner: GymOwnerSummary;
}

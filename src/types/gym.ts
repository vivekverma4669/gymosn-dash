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
  createdAt: string;
  owner: GymOwnerSummary;
}

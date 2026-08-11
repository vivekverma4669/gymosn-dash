import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { CreditCard, Plus } from 'lucide-react';

export const MembershipsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Membership Plans"
        description="Configure subscription tiers, recurring billing intervals, peak access hours, and promo codes."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> Create Plan
          </button>
        }
      />

      <EmptyState
        title="No Membership Tiers Configured"
        description="Define membership plans (e.g. Monthly Silver, Annual Gold, VIP Personal Coaching) for your gym branch."
        icon={CreditCard}
        actionLabel="Create First Plan"
        onAction={() => {}}
      />
    </div>
  );
};

import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { Zap, Sparkles } from 'lucide-react';

export const SubscriptionPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gymosn SaaS Billing & Plan"
        description="Manage your tenant subscription plan, add extra branch locations, and update payment methods."
        badge="Enterprise Pro"
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all active:scale-95">
            <Sparkles className="h-4 w-4" /> Upgrade Plan
          </button>
        }
      />

      <EmptyState
        title="SaaS Tenant Subscription Tier"
        description="You are currently on the Pro Tier (₹4,999/mo). Payment method, active billing cycle, and add-ons display here."
        icon={Zap}
        actionLabel="Manage Billing"
        onAction={() => {}}
      />
    </div>
  );
};

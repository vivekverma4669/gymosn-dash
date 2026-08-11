import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { User, Shield } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin User Profile"
        description="Manage your personal account credentials, two-factor authentication, security keys, and session logs."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground shadow-xs hover:bg-accent transition-all">
            <Shield className="h-4 w-4 text-emerald-500" /> Security Log
          </button>
        }
      />

      <EmptyState
        title="User Account Settings"
        description="Alex Morgan (Admin Manager). Personal profile details, avatar upload, and password change controls will render here."
        icon={User}
      />
    </div>
  );
};

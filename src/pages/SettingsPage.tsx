import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { Settings, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gym Tenant Settings"
        description="Configure your gym branding, logo, working hours, tax rates, notification webhooks, and team access permissions."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        }
      />

      <EmptyState
        title="Tenant Preferences Shell"
        description="Custom domain settings, SMS gateway configurations, payment provider keys, and logo branding options populate here."
        icon={Settings}
      />
    </div>
  );
};

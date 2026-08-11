import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { Utensils, Plus } from 'lucide-react';

export const DietPlansPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Diet & Nutrition Plans"
        description="Craft macro-balanced meal charts, nutrition advice, supplement guidelines, and caloric targets."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> Create Diet Plan
          </button>
        }
      />

      <EmptyState
        title="No Diet Plans Created"
        description="Set up personalized nutrition meal plans and calorie goals for gym members."
        icon={Utensils}
        actionLabel="Create Meal Plan"
        onAction={() => {}}
      />
    </div>
  );
};

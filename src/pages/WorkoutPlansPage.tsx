import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { Dumbbell, Plus } from 'lucide-react';

export const WorkoutPlansPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Workout Plans & Routines"
        description="Design training templates, hypertrophy splits, cardio routines, and assign them to members."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> Create Routine
          </button>
        }
      />

      <EmptyState
        title="No Workout Routines Built"
        description="Create reusable workout templates for hypertrophy, fat loss, powerlifting, or endurance."
        icon={Dumbbell}
        actionLabel="Build Workout Routine"
        onAction={() => {}}
      />
    </div>
  );
};

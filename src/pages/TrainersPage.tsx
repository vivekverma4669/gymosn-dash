import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { SearchBar } from '../components/common/SearchBar';
import { FilterButton } from '../components/common/FilterButton';
import { EmptyState } from '../components/common/EmptyState';
import { UserCheck, UserPlus } from 'lucide-react';

export const TrainersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainers & Staff"
        description="Manage personal trainers, shift schedules, client assignments, and performance metrics."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <UserPlus className="h-4 w-4" /> Add Trainer
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search trainers by name or specialization..." />
        <FilterButton
          options={[
            { label: 'Full Time', value: 'fulltime' },
            { label: 'Part Time', value: 'parttime' },
            { label: 'CrossFit Certified', value: 'crossfit' },
          ]}
          selectedValues={filters}
          onSelect={(val) =>
            setFilters((prev) =>
              prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
            )
          }
        />
      </div>

      <EmptyState
        title="No Gym Trainers Added"
        description="Add personal trainers and staff members to assign client workout routines and diet programs."
        icon={UserCheck}
        actionLabel="Add First Trainer"
        onAction={() => {}}
      />
    </div>
  );
};

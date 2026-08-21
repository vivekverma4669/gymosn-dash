import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { SearchBar } from '../components/common/SearchBar';
import { EmptyState } from '../components/common/EmptyState';
import { TrainerFormDialog, CreateTrainerInput } from '../components/common/TrainerFormDialog';
import { ResetPasswordDialog } from '../components/common/ResetPasswordDialog';
import { api } from '../lib/apiClient';
import { AuthUser } from '../types/auth';
import { UserCheck, UserPlus, KeyRound, Power } from 'lucide-react';

export const TrainersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<AuthUser | null>(null);
  const queryClient = useQueryClient();

  const { data: trainers, isLoading } = useQuery({
    queryKey: ['gym', 'trainers'],
    queryFn: () => api.get<AuthUser[]>('/api/gym/trainers'),
  });

  const createTrainerMutation = useMutation({
    mutationFn: (input: CreateTrainerInput) => api.post('/api/gym/trainers', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gym', 'trainers'] }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ trainerId, isActive }: { trainerId: string; isActive: boolean }) =>
      api.patch(`/api/gym/trainers/${trainerId}/active`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gym', 'trainers'] }),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ trainerId, newPassword }: { trainerId: string; newPassword: string }) =>
      api.post(`/api/gym/trainers/${trainerId}/reset-password`, { newPassword }),
  });

  const filteredTrainers = (trainers ?? []).filter((t) =>
    `${t.name} ${t.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainers & Staff"
        description="Manage personal trainers, their logins, and account access."
        actions={
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <UserPlus className="h-4 w-4" /> Add Trainer
          </button>
        }
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Search trainers by name or email..." />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading trainers...</div>
      ) : filteredTrainers.length === 0 ? (
        <EmptyState
          title="No Gym Trainers Added"
          description="Add personal trainers and staff members to assign client workout routines and diet programs."
          icon={UserCheck}
          actionLabel="Add First Trainer"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTrainers.map((trainer) => (
                <tr key={trainer.id}>
                  <td className="px-5 py-3.5 font-semibold text-foreground">{trainer.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{trainer.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={
                        trainer.isActive
                          ? 'inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/20'
                          : 'inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-500 border border-rose-500/20'
                      }
                    >
                      {trainer.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setResetTarget(trainer)}
                        title="Reset password"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          toggleActiveMutation.mutate({ trainerId: trainer.id, isActive: !trainer.isActive })
                        }
                        title={trainer.isActive ? 'Suspend trainer' : 'Reactivate trainer'}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                      >
                        <Power className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TrainerFormDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={async (input) => {
          await createTrainerMutation.mutateAsync(input);
        }}
      />

      <ResetPasswordDialog
        isOpen={resetTarget !== null}
        targetName={resetTarget?.name ?? ''}
        onClose={() => setResetTarget(null)}
        onSave={async (newPassword) => {
          if (!resetTarget) return;
          await resetPasswordMutation.mutateAsync({ trainerId: resetTarget.id, newPassword });
        }}
      />
    </div>
  );
};

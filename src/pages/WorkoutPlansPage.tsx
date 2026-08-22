import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { StatsCard } from '../components/common/StatsCard';
import { WorkoutPlanFormDialog } from '../components/common/WorkoutPlanFormDialog';
import { AssignPlanDialog } from '../components/common/AssignPlanDialog';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { api, ApiClientError } from '../lib/apiClient';
import { WorkoutPlanDto, WorkoutPlanFormInput } from '../types/workoutPlan';
import { Member } from '../constants/mockData';
import { Dumbbell, Plus, Users, ListChecks, Pencil, Trash2, PowerOff, Power, UserPlus } from 'lucide-react';
import { cn } from '../utils/cn';

export const WorkoutPlansPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlanDto | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<WorkoutPlanDto | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [assigningPlan, setAssigningPlan] = useState<WorkoutPlanDto | null>(null);
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['gym', 'workout-plans'],
    queryFn: () => api.get<WorkoutPlanDto[]>('/api/gym/workout-plans'),
  });

  const { data: members } = useQuery({
    queryKey: ['gym', 'members'],
    queryFn: () => api.get<Member[]>('/api/gym/members'),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['gym', 'workout-plans'] });

  const createMutation = useMutation({
    mutationFn: (input: WorkoutPlanFormInput) => api.post('/api/gym/workout-plans', input),
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: WorkoutPlanFormInput }) =>
      api.patch(`/api/gym/workout-plans/${id}`, input),
    onSuccess: invalidate,
  });
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/api/gym/workout-plans/${id}`, { isActive }),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/gym/workout-plans/${id}`),
    onSuccess: () => {
      invalidate();
      setDeletingPlan(null);
    },
    onError: (err) => setDeleteError(err instanceof ApiClientError ? err.message : 'Failed to delete routine'),
  });
  const assignMutation = useMutation({
    mutationFn: ({ memberId, planId }: { memberId: string; planId: string }) =>
      api.patch(`/api/gym/members/${memberId}`, { workoutPlan: planId }),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['gym', 'members'] });
    },
  });

  const planList = plans ?? [];
  const memberList = (members ?? []).filter((m) => m.status !== 'Inactive');
  const activePlans = planList.filter((p) => p.isActive).length;
  const totalAssigned = planList.reduce((sum, p) => sum + p.assignedMembers, 0);

  const openCreate = () => {
    setEditingPlan(null);
    setFormOpen(true);
  };
  const openEdit = (plan: WorkoutPlanDto) => {
    setEditingPlan(plan);
    setFormOpen(true);
  };

  const handleSave = async (input: WorkoutPlanFormInput) => {
    if (editingPlan) {
      await updateMutation.mutateAsync({ id: editingPlan.id, input });
    } else {
      await createMutation.mutateAsync(input);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workout Plans & Routines"
        description="Design training templates, hypertrophy splits, and cardio routines, and assign them to members."
        badge={`${planList.length} Routines`}
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Create Routine
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          title="Active Routines"
          value={activePlans}
          change={`${planList.length - activePlans} inactive`}
          trend="neutral"
          icon={Dumbbell}
          iconBgColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Members Assigned"
          value={totalAssigned}
          change="Across all routines"
          trend="up"
          icon={Users}
          iconBgColor="bg-accent/10 text-accent"
        />
        <StatsCard
          title="Total Routines"
          value={planList.length}
          change="Reusable templates"
          trend="neutral"
          icon={ListChecks}
          iconBgColor="bg-purple-500/10 text-purple-500"
        />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading routines...</div>
      ) : planList.length === 0 ? (
        <EmptyState
          title="No Workout Routines Built"
          description="Create reusable workout templates for hypertrophy, fat loss, powerlifting, or endurance."
          icon={Dumbbell}
          actionLabel="Build Workout Routine"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {planList.map((plan) => {
            const totalExercises = plan.days.reduce((sum, d) => sum + d.exercises.length, 0);
            return (
              <div
                key={plan.id}
                className={cn(
                  'rounded-2xl border bg-card p-6 space-y-4 shadow-sm transition-colors',
                  plan.isActive ? 'border-border hover:border-primary/50' : 'border-border/50 opacity-60'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0',
                      plan.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {plan.goal}
                  </span>
                  {plan.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  {plan.days.length} day{plan.days.length === 1 ? '' : 's'} • {totalExercises} exercise
                  {totalExercises === 1 ? '' : 's'}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {plan.assignedMembers} member{plan.assignedMembers === 1 ? '' : 's'} assigned
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
                  <button
                    onClick={() => setAssigningPlan(plan)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Assign
                  </button>
                  <button
                    onClick={() => openEdit(plan)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent/10 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => toggleActiveMutation.mutate({ id: plan.id, isActive: !plan.isActive })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent/10 transition-colors"
                  >
                    {plan.isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setDeleteError(null);
                      setDeletingPlan(plan);
                    }}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <WorkoutPlanFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialPlan={editingPlan}
      />

      {assigningPlan && (
        <AssignPlanDialog
          isOpen={!!assigningPlan}
          onClose={() => setAssigningPlan(null)}
          planName={assigningPlan.name}
          members={memberList}
          onAssign={async (memberId) => {
            await assignMutation.mutateAsync({ memberId, planId: assigningPlan.id });
          }}
        />
      )}

      <ConfirmationDialog
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        onConfirm={() => deletingPlan && deleteMutation.mutate(deletingPlan.id)}
        title="Delete Workout Routine?"
        description={
          deleteError ?? `"${deletingPlan?.name}" will be removed. This isn't possible while members are still assigned to it.`
        }
        confirmText="Delete Routine"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { StatsCard } from '../components/common/StatsCard';
import { PlanFormDialog } from '../components/common/PlanFormDialog';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { MembershipPlan } from '../constants/mockData';
import { api, ApiClientError } from '../lib/apiClient';
import { CreditCard, Plus, Users, IndianRupee, Pencil, Trash2, PowerOff, Power } from 'lucide-react';
import { cn } from '../utils/cn';

export const MembershipsPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<MembershipPlan | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['gym', 'plans'],
    queryFn: () => api.get<MembershipPlan[]>('/api/gym/plans'),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['gym', 'plans'] });

  const createPlanMutation = useMutation({
    mutationFn: (input: Omit<MembershipPlan, 'id' | 'activeMembers'>) => api.post('/api/gym/plans', input),
    onSuccess: invalidate,
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Omit<MembershipPlan, 'id' | 'activeMembers'> }) =>
      api.patch(`/api/gym/plans/${id}`, input),
    onSuccess: invalidate,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/api/gym/plans/${id}`, { isActive }),
    onSuccess: invalidate,
  });

  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/gym/plans/${id}`),
    onSuccess: () => {
      invalidate();
      setDeletingPlan(null);
    },
    onError: (err) => {
      setDeleteError(err instanceof ApiClientError ? err.message : 'Failed to delete plan');
    },
  });

  const planList = plans ?? [];
  const activePlans = planList.filter((p) => p.isActive).length;
  const totalMembers = planList.reduce((sum, p) => sum + p.activeMembers, 0);
  const avgPrice = planList.length
    ? Math.round(planList.reduce((sum, p) => sum + p.price, 0) / planList.length)
    : 0;

  const openCreate = () => {
    setEditingPlan(null);
    setFormOpen(true);
  };

  const openEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setFormOpen(true);
  };

  const handleSave = async (data: Omit<MembershipPlan, 'id' | 'activeMembers'>) => {
    if (editingPlan) {
      await updatePlanMutation.mutateAsync({ id: editingPlan.id, input: data });
    } else {
      await createPlanMutation.mutateAsync(data);
    }
  };

  const handleDelete = () => {
    if (!deletingPlan) return;
    setDeleteError(null);
    deletePlanMutation.mutate(deletingPlan.id);
  };

  const formatDuration = (plan: MembershipPlan) => `${plan.durationValue} ${plan.durationUnit}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membership Plans"
        description="Every gym prices and structures memberships differently — define your own custom plans instead of fixed tiers."
        badge={`${planList.length} Plans`}
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Create Plan
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          title="Active Plans"
          value={activePlans}
          change={`${planList.length - activePlans} inactive`}
          trend="neutral"
          icon={CreditCard}
          iconBgColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Members on a Plan"
          value={totalMembers}
          change="Across all plans"
          trend="up"
          icon={Users}
          iconBgColor="bg-accent/10 text-accent"
        />
        <StatsCard
          title="Average Plan Price"
          value={`₹${avgPrice.toLocaleString('en-IN')}`}
          change="Custom per gym"
          trend="neutral"
          icon={IndianRupee}
          iconBgColor="bg-amber-500/10 text-amber-500"
        />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading plans...</div>
      ) : planList.length === 0 ? (
        <EmptyState
          title="No Membership Tiers Configured"
          description="Define membership plans (e.g. Monthly Silver, Annual Gold, VIP Personal Coaching) for your gym branch."
          icon={CreditCard}
          actionLabel="Create First Plan"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {planList.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'rounded-2xl border bg-card p-6 space-y-4 shadow-sm transition-colors',
                plan.isActive ? 'border-border hover:border-primary/50' : 'border-border/50 opacity-60'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <CreditCard className="h-5 w-5" />
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
                <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-foreground">₹{plan.price.toLocaleString('en-IN')}</span>
                <span className="text-xs text-muted-foreground">/ {formatDuration(plan)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {plan.activeMembers} member{plan.activeMembers === 1 ? '' : 's'} on this plan
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-border/60">
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
                  {plan.isActive ? 'Deactivate' : 'Activate'}
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
          ))}
        </div>
      )}

      <PlanFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialPlan={editingPlan}
      />

      <ConfirmationDialog
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        onConfirm={handleDelete}
        title="Delete Membership Plan?"
        description={
          deleteError ??
          `"${deletingPlan?.name}" will be removed. This isn't possible while members are still assigned to it — deactivate it instead.`
        }
        confirmText="Delete Plan"
        variant="danger"
        isLoading={deletePlanMutation.isPending}
      />
    </div>
  );
};

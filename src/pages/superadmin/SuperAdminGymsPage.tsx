import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Eye, KeyRound, Plus, Power } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { GymFormDialog, CreateGymInput } from '../../components/common/GymFormDialog';
import { GymCredentialsDialog } from '../../components/common/GymCredentialsDialog';
import { api } from '../../lib/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { GymOwnerSummary, GymSummary, SubscriptionTier } from '../../types/gym';

export const SuperAdminGymsPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingGymId, setViewingGymId] = useState<string | null>(null);
  const [credentialsOwner, setCredentialsOwner] = useState<GymOwnerSummary | null>(null);
  const queryClient = useQueryClient();
  const { viewGymAsOwner } = useAuth();
  const navigate = useNavigate();

  const handleView = async (gymId: string) => {
    setViewingGymId(gymId);
    try {
      await viewGymAsOwner(gymId);
      navigate('/dashboard');
    } finally {
      setViewingGymId(null);
    }
  };

  const { data: gyms, isLoading } = useQuery({
    queryKey: ['superadmin', 'gyms'],
    queryFn: () => api.get<GymSummary[]>('/api/superadmin/gyms'),
  });

  const createGymMutation = useMutation({
    mutationFn: (input: CreateGymInput) => api.post('/api/superadmin/gyms', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['superadmin', 'gyms'] }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ gymId, isActive }: { gymId: string; isActive: boolean }) =>
      api.patch(`/api/superadmin/gyms/${gymId}/active`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['superadmin', 'gyms'] }),
  });

  const updateTierMutation = useMutation({
    mutationFn: ({ gymId, subscriptionTier }: { gymId: string; subscriptionTier: SubscriptionTier }) =>
      api.patch(`/api/superadmin/gyms/${gymId}/tier`, { subscriptionTier }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['superadmin', 'gyms'] }),
  });

  const updateEmailMutation = useMutation({
    mutationFn: ({ gymOwnerId, newEmail }: { gymOwnerId: string; newEmail: string }) =>
      api.patch(`/api/superadmin/gym-owners/${gymOwnerId}/email`, { newEmail }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'gyms'] });
      setCredentialsOwner((prev) => (prev ? { ...prev, email: variables.newEmail } : prev));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ gymOwnerId, newPassword }: { gymOwnerId: string; newPassword: string }) =>
      api.post(`/api/superadmin/gym-owners/${gymOwnerId}/reset-password`, { newPassword }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gym Tenants"
        description="Onboard new gyms and manage their owner accounts across the platform."
        actions={
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Onboard Gym
          </button>
        }
      />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading gyms...</div>
      ) : !gyms || gyms.length === 0 ? (
        <EmptyState
          title="No Gyms Onboarded Yet"
          description="Create the first gym tenant to generate its owner login credentials."
          icon={Building2}
          actionLabel="Onboard First Gym"
          onAction={() => setIsDialogOpen(true)}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Gym</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tier</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {gyms.map((gym) => (
                <tr key={gym.id}>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-foreground">{gym.name}</div>
                    <div className="text-xs text-muted-foreground">/{gym.slug}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-foreground">{gym.owner?.name}</div>
                    <div className="text-xs text-muted-foreground">{gym.owner?.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={
                        gym.isActive
                          ? 'inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/20'
                          : 'inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-500 border border-rose-500/20'
                      }
                    >
                      {gym.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={gym.subscriptionTier}
                      onChange={(e) =>
                        updateTierMutation.mutate({ gymId: gym.id, subscriptionTier: e.target.value as SubscriptionTier })
                      }
                      className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-hidden"
                    >
                      <option value="BASIC">Basic</option>
                      <option value="PROFESSIONAL">Professional</option>
                      <option value="ENTERPRISE">Enterprise</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {new Date(gym.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(gym.id)}
                        disabled={viewingGymId === gym.id}
                        title="View gym dashboard"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {viewingGymId === gym.id ? 'Opening...' : 'View'}
                      </button>
                      <button
                        onClick={() => gym.owner && setCredentialsOwner(gym.owner)}
                        disabled={!gym.owner}
                        title="Manage owner credentials"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        Credentials
                      </button>
                      <button
                        onClick={() =>
                          toggleActiveMutation.mutate({ gymId: gym.id, isActive: !gym.isActive })
                        }
                        title={gym.isActive ? 'Suspend gym' : 'Reactivate gym'}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                      >
                        <Power className="h-3.5 w-3.5" />
                        {gym.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <GymFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={async (input) => {
          await createGymMutation.mutateAsync(input);
        }}
      />

      <GymCredentialsDialog
        isOpen={!!credentialsOwner}
        owner={credentialsOwner}
        onClose={() => setCredentialsOwner(null)}
        onUpdateEmail={async (newEmail) => {
          if (!credentialsOwner) return;
          await updateEmailMutation.mutateAsync({ gymOwnerId: credentialsOwner.id, newEmail });
        }}
        onResetPassword={async (newPassword) => {
          if (!credentialsOwner) return;
          await resetPasswordMutation.mutateAsync({ gymOwnerId: credentialsOwner.id, newPassword });
        }}
      />
    </div>
  );
};

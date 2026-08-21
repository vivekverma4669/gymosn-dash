import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/apiClient';
import { Member, MembershipPlan, Enquiry } from '../constants/mockData';
import {
  Users,
  AlertCircle,
  Clock,
  PhoneCall,
  MessageSquare,
  Phone,
  CheckCircle2,
  Plus,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { cn } from '../utils/cn';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeActionTab, setActiveActionTab] = useState<'fees' | 'expiring' | 'leads'>('fees');
  const [waDialogData, setWaDialogData] = useState<{ name: string; phone: string; message: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ['gym', 'members'],
    queryFn: () => api.get<Member[]>('/api/gym/members'),
  });

  const { data: plans } = useQuery({
    queryKey: ['gym', 'plans'],
    queryFn: () => api.get<MembershipPlan[]>('/api/gym/plans'),
  });

  const { data: enquiries } = useQuery({
    queryKey: ['gym', 'enquiries'],
    queryFn: () => api.get<Enquiry[]>('/api/gym/enquiries'),
  });

  const collectFeeMutation = useMutation({
    mutationFn: (memberId: string) => api.patch(`/api/gym/members/${memberId}`, { dueAmount: 0 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gym', 'members'] }),
  });

  const markContactedMutation = useMutation({
    mutationFn: (enquiryId: string) => api.patch(`/api/gym/enquiries/${enquiryId}`, { status: 'Contacted' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gym', 'enquiries'] }),
  });

  const memberList = members ?? [];
  const planList = plans ?? [];
  const enquiryList = enquiries ?? [];

  const activeMembers = memberList.filter((m) => m.status === 'Active').length;
  const feesDue = memberList.filter((m) => m.dueAmount > 0).sort((a, b) => b.dueAmount - a.dueAmount);
  const totalPendingFees = feesDue.reduce((sum, m) => sum + m.dueAmount, 0);
  const expiringMembers = memberList.filter((m) => m.status === 'Expiring Soon');
  const pendingLeads = enquiryList
    .filter((e) => e.status !== 'Converted' && e.status !== 'Lost')
    .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));

  const planPrice = (planName: string): number => planList.find((p) => p.name === planName)?.price ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Gym Owner Action Dashboard"
        description="Daily operational command center. Track fee collections, membership renewals, and lead follow-ups."
        badge={user?.name ? `Welcome, ${user.name}` : undefined}
        actions={
          <button
            onClick={() => (window.location.href = '/attendance')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Quick Check-in
          </button>
        }
      />

      {/* KPI Cards — only stats backed by real data */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Members"
          value={memberList.length}
          change={memberList.length ? `${activeMembers} active` : 'No members yet'}
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Pending Fee Collection"
          value={`₹${totalPendingFees.toLocaleString('en-IN')}`}
          change={`${feesDue.length} Outstanding Dues`}
          trend={feesDue.length ? 'down' : 'neutral'}
          icon={AlertCircle}
          iconBgColor="bg-rose-500/10 text-rose-500"
        />
        <StatsCard
          title="Memberships Expiring Soon"
          value={expiringMembers.length}
          change="Expiring within 7 days"
          trend="neutral"
          icon={Clock}
          iconBgColor="bg-amber-500/10 text-amber-500"
        />
        <StatsCard
          title="Pending Enquiry Follow-ups"
          value={pendingLeads.length}
          change="Not yet converted or lost"
          trend="neutral"
          icon={PhoneCall}
          iconBgColor="bg-indigo-500/10 text-indigo-500"
        />
      </div>

      {/* Action Center */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Today's Operational Actions <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-xs text-muted-foreground">
              Direct action queues to collect dues, renew plans, and follow up on leads.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl border border-border overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveActionTab('fees')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
                activeActionTab === 'fees' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Fees Due ({feesDue.length})
            </button>
            <button
              onClick={() => setActiveActionTab('expiring')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
                activeActionTab === 'expiring' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Expiring ({expiringMembers.length})
            </button>
            <button
              onClick={() => setActiveActionTab('leads')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
                activeActionTab === 'leads' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Lead Follow-ups ({pendingLeads.length})
            </button>
          </div>
        </div>

        {/* Fees Due */}
        {activeActionTab === 'fees' && (
          <div className="space-y-3">
            {feesDue.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pending dues. Everyone's paid up.</p>
            ) : (
              feesDue.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{member.name}</h4>
                      <span className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                        Expires {member.expiryDate}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Plan: <strong className="text-foreground">{member.plan}</strong> • Phone:{' '}
                      <strong className="text-foreground">{member.phone}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-base font-black text-primary">₹{member.dueAmount.toLocaleString('en-IN')}</span>

                    <a
                      href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                      className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
                      title="Call Member"
                    >
                      <Phone className="h-4 w-4" />
                    </a>

                    <button
                      onClick={() =>
                        setWaDialogData({
                          name: member.name,
                          phone: member.phone,
                          message: `Namaste ${member.name}! This is a reminder that your fee payment of ₹${member.dueAmount} for ${member.plan} is due. Kindly pay at the desk or via UPI to keep your access active.`,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                    </button>

                    <button
                      onClick={() => collectFeeMutation.mutate(member.id)}
                      disabled={collectFeeMutation.isPending}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                    >
                      Collect Fee
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Expiring Soon */}
        {activeActionTab === 'expiring' && (
          <div className="space-y-3">
            {expiringMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No memberships expiring in the next 7 days.</p>
            ) : (
              expiringMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background hover:border-amber-500/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{member.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current Plan: <strong className="text-foreground">{member.plan}</strong> • Expiry:{' '}
                      <strong className="text-foreground">{member.expiryDate}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-muted-foreground">
                      Renewal: <span className="text-foreground font-black">₹{planPrice(member.plan).toLocaleString('en-IN')}</span>
                    </span>

                    <button
                      onClick={() =>
                        setWaDialogData({
                          name: member.name,
                          phone: member.phone,
                          message: `Namaste ${member.name}! Your ${member.plan} plan expires on ${member.expiryDate}. Renew now to keep your access active!`,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                    </button>

                    <button
                      onClick={() => (window.location.href = '/renewals')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Renew Plan
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Lead Follow-ups */}
        {activeActionTab === 'leads' && (
          <div className="space-y-3">
            {pendingLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No open enquiries need follow-up.</p>
            ) : (
              pendingLeads.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{enquiry.name}</h4>
                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        Follow-up {enquiry.followUpDate}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {enquiry.interestedPlan ? `Interested in ${enquiry.interestedPlan}` : enquiry.source}
                      {enquiry.notes ? ` • ${enquiry.notes}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${enquiry.phone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-accent"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call Lead
                    </a>

                    <button
                      onClick={() => markContactedMutation.mutate(enquiry.id)}
                      disabled={markContactedMutation.isPending || enquiry.status === 'Contacted'}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-60',
                        enquiry.status === 'Contacted'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                    >
                      {enquiry.status === 'Contacted' ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Contacted
                        </>
                      ) : (
                        'Mark Contacted'
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {waDialogData && (
        <WhatsAppDialog
          isOpen={!!waDialogData}
          onClose={() => setWaDialogData(null)}
          recipientName={waDialogData.name}
          phone={waDialogData.phone}
          defaultMessage={waDialogData.message}
        />
      )}
    </div>
  );
};

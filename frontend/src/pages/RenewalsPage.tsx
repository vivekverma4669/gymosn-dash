import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { SearchBar } from '../components/common/SearchBar';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import { api } from '../lib/apiClient';
import { Member, MembershipPlan } from '../constants/mockData';
import {
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Phone,
  Zap,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface RenewalItem {
  id: string;
  memberName: string;
  phone: string;
  currentPlan: string;
  expiryDate: string;
  daysRemaining: number;
  renewalAmount: number;
}

const toRenewalItem = (member: Member): RenewalItem => ({
  id: member.id,
  memberName: member.name,
  phone: member.phone,
  currentPlan: member.plan,
  expiryDate: member.expiryDate,
  daysRemaining: Math.ceil((new Date(member.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  renewalAmount: member.agreedPrice ?? member.listPrice ?? 0,
});

// Extend from today by the plan's duration — mirrors the backend's addDuration used at member creation.
const extendExpiryDate = (plan: MembershipPlan | undefined): string => {
  const from = new Date();
  if (!plan) {
    from.setDate(from.getDate() + 30);
    return from.toISOString().slice(0, 10);
  }
  switch (plan.durationUnit) {
    case 'Days':
      from.setDate(from.getDate() + plan.durationValue);
      break;
    case 'Weeks':
      from.setDate(from.getDate() + plan.durationValue * 7);
      break;
    case 'Months':
      from.setMonth(from.getMonth() + plan.durationValue);
      break;
    case 'Years':
      from.setFullYear(from.getFullYear() + plan.durationValue);
      break;
  }
  return from.toISOString().slice(0, 10);
};

export const RenewalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | '3days' | '7days' | 'expired'>('3days');
  const [search, setSearch] = useState('');
  const [selectedMemberForWA, setSelectedMemberForWA] = useState<{ name: string; phone: string; message: string } | null>(null);
  const [renewedCount, setRenewedCount] = useState(0);
  const [renewedValue, setRenewedValue] = useState(0);
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ['gym', 'members'],
    queryFn: () => api.get<Member[]>('/api/gym/members'),
  });

  const { data: plans } = useQuery({
    queryKey: ['gym', 'plans'],
    queryFn: () => api.get<MembershipPlan[]>('/api/gym/plans'),
  });

  const memberList = members ?? [];
  const planList = plans ?? [];

  const renewMutation = useMutation({
    mutationFn: ({ id, expiryDate }: { id: string; expiryDate: string }) =>
      api.patch(`/api/gym/members/${id}`, { expiryDate, dueAmount: 0 }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gym', 'members'] });
      const item = expiringItems.find((i) => i.id === variables.id) ?? expiredItems.find((i) => i.id === variables.id);
      setRenewedCount((c) => c + 1);
      setRenewedValue((v) => v + (item?.renewalAmount ?? 0));
    },
  });

  const expiringItems = memberList.filter((m) => m.status === 'Expiring Soon').map(toRenewalItem);
  const expiredItems = memberList.filter((m) => m.status === 'Expired').map(toRenewalItem);

  const getTabFilteredData = (): RenewalItem[] => {
    let items: RenewalItem[];
    if (activeTab === 'expired') {
      items = expiredItems;
    } else {
      const maxDays = activeTab === 'today' ? 1 : activeTab === '3days' ? 3 : 7;
      items = expiringItems.filter((i) => i.daysRemaining <= maxDays);
    }

    if (search) {
      items = items.filter(
        (i) => i.memberName.toLowerCase().includes(search.toLowerCase()) || i.phone.includes(search)
      );
    }

    return items;
  };

  const filteredItems = getTabFilteredData();

  const handleRenew = (item: RenewalItem) => {
    const plan = planList.find((p) => p.name === item.currentPlan);
    renewMutation.mutate({ id: item.id, expiryDate: extendExpiryDate(plan) });
  };

  const expiringThisWeekValue = expiringItems.reduce((sum, i) => sum + i.renewalAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membership Renewals Hub"
        description="Convert expiring memberships quickly, prevent churn, and collect renewal fees in ₹."
        badge="Daily Operational Hub"
      />

      {/* Overview Stats in Rupee ₹ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Expiring This Week"
          value={`${expiringItems.length} Members`}
          change={expiringItems.length ? 'Urgent Action' : 'All caught up'}
          trend={expiringItems.length ? 'down' : 'up'}
          icon={Clock}
          description="Needs renewal call"
        />
        <StatsCard
          title="Total Renewal Value"
          value={`₹${expiringThisWeekValue.toLocaleString('en-IN')}`}
          change="Within 7 days"
          trend="up"
          icon={Zap}
          iconBgColor="bg-emerald-500/10 text-emerald-500"
          description="Potential collection"
        />
        <StatsCard
          title="Renewed This Session"
          value={`${renewedCount} Plans`}
          change={`₹${renewedValue.toLocaleString('en-IN')} Collected`}
          trend="up"
          icon={CheckCircle2}
          iconBgColor="bg-blue-500/10 text-blue-500"
          description="Completed via this hub"
        />
        <StatsCard
          title="Expired & Pending"
          value={`${expiredItems.length} Members`}
          change={expiredItems.length ? 'Action Required' : 'None pending'}
          trend={expiredItems.length ? 'down' : 'up'}
          icon={AlertCircle}
          iconBgColor="bg-rose-500/10 text-rose-500"
          description="Lapsed memberships"
        />
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-border w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('today')}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
              activeTab === 'today'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Expiring Today ({expiringItems.filter((i) => i.daysRemaining <= 1).length})
          </button>
          <button
            onClick={() => setActiveTab('3days')}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
              activeTab === '3days'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Expiring in 3 Days ({expiringItems.filter((i) => i.daysRemaining <= 3).length})
          </button>
          <button
            onClick={() => setActiveTab('7days')}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
              activeTab === '7days'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Expiring in 7 Days ({expiringItems.length})
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
              activeTab === 'expired'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Expired Plans ({expiredItems.length})
          </button>
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder="Search member name or phone..." className="max-w-xs" />
      </div>

      {/* Renewals Action List */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading renewals...</div>
      ) : (
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-foreground">No Pending Renewals</h4>
              <p className="text-xs text-muted-foreground mt-1">All members in this category are up to date!</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isRenewing = renewMutation.isPending && renewMutation.variables?.id === item.id;
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-sm shrink-0">
                      {item.memberName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground text-sm">{item.memberName}</h4>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {item.currentPlan}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>Phone: <strong className="text-foreground">{item.phone}</strong></span>
                        <span>Expiry: <strong className="text-amber-500">{new Date(item.expiryDate).toLocaleDateString('en-IN')}</strong></span>
                        <span className="text-primary font-bold">
                          Renewal Fee: ₹{item.renewalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <a
                      href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                      className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      title="Call Member"
                    >
                      <Phone className="h-4 w-4" />
                    </a>

                    <button
                      onClick={() =>
                        setSelectedMemberForWA({
                          name: item.memberName,
                          phone: item.phone,
                          message: `Namaste ${item.memberName}! Your ${item.currentPlan} expires on ${new Date(item.expiryDate).toLocaleDateString('en-IN')}. Renewal fee: ₹${item.renewalAmount.toLocaleString('en-IN')}. Renew today to keep your workout streak!`,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      WhatsApp
                    </button>

                    <button
                      onClick={() => handleRenew(item)}
                      disabled={isRenewing}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60"
                    >
                      <RefreshCw className={cn('h-3.5 w-3.5', isRenewing && 'animate-spin')} />
                      {isRenewing ? 'Renewing...' : 'Renew Membership'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* WhatsApp Modal */}
      {selectedMemberForWA && (
        <WhatsAppDialog
          isOpen={!!selectedMemberForWA}
          onClose={() => setSelectedMemberForWA(null)}
          recipientName={selectedMemberForWA.name}
          phone={selectedMemberForWA.phone}
          defaultMessage={selectedMemberForWA.message}
        />
      )}
    </div>
  );
};

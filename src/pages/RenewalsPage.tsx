import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { SearchBar } from '../components/common/SearchBar';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import {
  MOCK_EXPIRING_MEMBERSHIPS,
  MOCK_MEMBERS,
  ExpiringMembershipItem,
} from '../constants/mockData';
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

export const RenewalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | '3days' | '7days' | 'expired'>('3days');
  const [search, setSearch] = useState('');
  const [selectedMemberForWA, setSelectedMemberForWA] = useState<{ name: string; phone: string; message: string } | null>(null);
  const [renewedIds, setRenewedIds] = useState<string[]>([]);

  // Filter lists based on tab & search
  const getTabFilteredData = (): ExpiringMembershipItem[] => {
    let items = MOCK_EXPIRING_MEMBERSHIPS;
    if (activeTab === 'today') {
      items = items.filter((i) => i.daysRemaining <= 1);
    } else if (activeTab === '3days') {
      items = items.filter((i) => i.daysRemaining <= 3);
    } else if (activeTab === '7days') {
      items = items.filter((i) => i.daysRemaining <= 7);
    } else if (activeTab === 'expired') {
      items = MOCK_MEMBERS.filter((m) => m.status === 'Expired').map((m) => ({
        id: m.id,
        memberName: m.name,
        phone: m.phone,
        currentPlan: m.plan,
        expiryDate: m.expiryDate,
        daysRemaining: -5,
        renewalAmount: 2500,
      }));
    }

    if (search) {
      items = items.filter((i) =>
        i.memberName.toLowerCase().includes(search.toLowerCase()) ||
        i.phone.includes(search)
      );
    }

    return items;
  };

  const filteredItems = getTabFilteredData();

  const handleRenew = (id: string) => {
    setRenewedIds((prev) => [...prev, id]);
  };

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
          value="14 Members"
          change="Urgent Action"
          trend="down"
          icon={Clock}
          description="Needs renewal call"
        />
        <StatsCard
          title="Total Renewal Value"
          value="₹44,500"
          change="+18% vs last week"
          trend="up"
          icon={Zap}
          iconBgColor="bg-emerald-500/10 text-emerald-500"
          description="Potential collection"
        />
        <StatsCard
          title="Renewed Today"
          value="4 Plans"
          change="₹18,000 Collected"
          trend="up"
          icon={CheckCircle2}
          iconBgColor="bg-blue-500/10 text-blue-500"
          description="Completed renewals"
        />
        <StatsCard
          title="Expired & Pending"
          value="6 Members"
          change="Action Required"
          trend="down"
          icon={AlertCircle}
          iconBgColor="bg-rose-500/10 text-rose-500"
          description="Overdue > 7 days"
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
            Expiring Today (1)
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
            Expiring in 3 Days (2)
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
            Expiring in 7 Days (4)
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
            Expired Plans
          </button>
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder="Search member name or phone..." className="max-w-xs" />
      </div>

      {/* Renewals Action List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-foreground">No Pending Renewals</h4>
            <p className="text-xs text-muted-foreground mt-1">All members in this category are up to date!</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isRenewed = renewedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={cn(
                  'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border bg-card transition-all shadow-xs',
                  isRenewed ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border hover:border-primary/40'
                )}
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
                      <span>Expiry: <strong className="text-amber-500">{item.expiryDate}</strong></span>
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
                        message: `Namaste ${item.memberName}! Your ${item.currentPlan} at Apex Fitness expires on ${item.expiryDate}. Renewal fee: ₹${item.renewalAmount}. Renew today to keep your workout streak!`,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    WhatsApp
                  </button>

                  <button
                    onClick={() => handleRenew(item.id)}
                    disabled={isRenewed}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all active:scale-95',
                      isRenewed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                  >
                    {isRenewed ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Renewed
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" /> Renew Membership
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

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

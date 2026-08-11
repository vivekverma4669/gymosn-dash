import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import {
  MOCK_UPCOMING_FEES,
  MOCK_EXPIRING_MEMBERSHIPS,
  MOCK_BIRTHDAYS,
  MOCK_ABSENT_MEMBERS,
  MOCK_LEAD_FOLLOWUPS,
  FeeCollectionItem,
  ExpiringMembershipItem,
  BirthdayItem,
  AbsentMemberItem,
  LeadFollowupItem,
} from '../constants/mockData';
import {
  Users,
  CalendarCheck,
  IndianRupee,
  AlertCircle,
  Clock,
  Cake,
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
  const [activeActionTab, setActiveActionTab] = useState<
    'fees' | 'expiring' | 'birthdays' | 'absent' | 'leads'
  >('fees');

  const [waDialogData, setWaDialogData] = useState<{ name: string; phone: string; message: string } | null>(null);
  const [completedLeadIds, setCompletedLeadIds] = useState<string[]>([]);
  const [collectedFeeIds, setCollectedFeeIds] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Indian Gym Owner Action Dashboard"
        description="Daily operational command center. Track fee collections, check-ins, member renewals, birthdays, and quick WhatsApp actions."
        badge="Apex Fitness Gym Branch"
        actions={
          <button
            onClick={() => window.location.href = '/attendance'}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> Quick Check-in
          </button>
        }
      />

      {/* 1. KPI CARDS SECTION (7 Required Cards with ₹ formatting) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Active Members"
          value="450"
          change="+14 members this month"
          trend="up"
          icon={Users}
          description="Capacity 500"
        />
        <StatsCard
          title="Today's Attendance"
          value="128 Checked-in"
          change="82% Peak capacity"
          trend="up"
          icon={CalendarCheck}
          iconBgColor="bg-emerald-500/10 text-emerald-500"
          description="Morning batch 74 • Evening 54"
        />
        <StatsCard
          title="Today's Revenue"
          value="₹24,500"
          change="+₹6,500 vs yesterday"
          trend="up"
          icon={IndianRupee}
          iconBgColor="bg-blue-500/10 text-blue-500"
          description="UPI ₹18.5k • Cash ₹6k"
        />
        <StatsCard
          title="Pending Fee Collection"
          value="₹68,000"
          change="12 Outstanding Dues"
          trend="down"
          icon={AlertCircle}
          iconBgColor="bg-rose-500/10 text-rose-500"
          description="Requires immediate follow-up"
        />
        <StatsCard
          title="Memberships Expiring Soon"
          value="14 Members"
          change="Expiring within 7 days"
          trend="neutral"
          icon={Clock}
          iconBgColor="bg-amber-500/10 text-amber-500"
          description="Click to open renewals"
        />
        <StatsCard
          title="Today's Birthdays"
          value="3 Members"
          change="Special Wishes Pending"
          trend="up"
          icon={Cake}
          iconBgColor="bg-purple-500/10 text-purple-500"
          description="Send birthday discount"
        />
        <StatsCard
          title="Pending Follow-ups"
          value="8 Leads"
          change="3 Today"
          trend="neutral"
          icon={PhoneCall}
          iconBgColor="bg-indigo-500/10 text-indigo-500"
          description="Inbound trial inquiries"
        />
      </div>

      {/* 2. ACTION CENTER SECTION: TODAY'S ACTIONS */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Today's Operational Actions <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-xs text-muted-foreground">
              Direct action queues to collect dues, renew plans, wish members, and call absent leads.
            </p>
          </div>

          {/* Action Tabs */}
          <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl border border-border overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveActionTab('fees')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
                activeActionTab === 'fees'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Fees Due ({MOCK_UPCOMING_FEES.length})
            </button>
            <button
              onClick={() => setActiveActionTab('expiring')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
                activeActionTab === 'expiring'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Expiring ({MOCK_EXPIRING_MEMBERSHIPS.length})
            </button>
            <button
              onClick={() => setActiveActionTab('birthdays')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
                activeActionTab === 'birthdays'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Birthdays ({MOCK_BIRTHDAYS.length})
            </button>
            <button
              onClick={() => setActiveActionTab('absent')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
                activeActionTab === 'absent'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Absent 5+ Days ({MOCK_ABSENT_MEMBERS.length})
            </button>
            <button
              onClick={() => setActiveActionTab('leads')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap',
                activeActionTab === 'leads'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Lead Follow-ups ({MOCK_LEAD_FOLLOWUPS.length})
            </button>
          </div>
        </div>

        {/* Action Tab Content 1: Upcoming Fee Collection */}
        {activeActionTab === 'fees' && (
          <div className="space-y-3">
            {MOCK_UPCOMING_FEES.map((item: FeeCollectionItem) => {
              const isCollected = collectedFeeIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{item.memberName}</h4>
                      <span className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                        {item.dueDate}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Plan: <strong className="text-foreground">{item.plan}</strong> • Phone:{' '}
                      <strong className="text-foreground">{item.phone}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-base font-black text-primary">
                      ₹{item.dueAmount.toLocaleString('en-IN')}
                    </span>

                    <a
                      href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                      className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
                      title="Call Member"
                    >
                      <Phone className="h-4 w-4" />
                    </a>

                    <button
                      onClick={() =>
                        setWaDialogData({
                          name: item.memberName,
                          phone: item.phone,
                          message: `Namaste ${item.memberName}! This is a reminder that your fee payment of ₹${item.dueAmount} for ${item.plan} at Apex Fitness is due. Kindly pay at desk or via UPI to keep your access active.`,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                    </button>

                    <button
                      onClick={() => setCollectedFeeIds((prev) => [...prev, item.id])}
                      disabled={isCollected}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs active:scale-95',
                        isCollected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                    >
                      {isCollected ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Paid
                        </>
                      ) : (
                        'Collect Fee'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Tab Content 2: Membership Expiring */}
        {activeActionTab === 'expiring' && (
          <div className="space-y-3">
            {MOCK_EXPIRING_MEMBERSHIPS.map((item: ExpiringMembershipItem) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background hover:border-amber-500/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-foreground">{item.memberName}</h4>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {item.daysRemaining} days remaining
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current Plan: <strong className="text-foreground">{item.currentPlan}</strong> • Expiry:{' '}
                    <strong className="text-foreground">{item.expiryDate}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-muted-foreground">
                    Renewal: <span className="text-foreground font-black">₹{item.renewalAmount.toLocaleString('en-IN')}</span>
                  </span>

                  <button
                    onClick={() =>
                      setWaDialogData({
                        name: item.memberName,
                        phone: item.phone,
                        message: `Namaste ${item.memberName}! Your ${item.currentPlan} at Apex Fitness expires in ${item.daysRemaining} days (${item.expiryDate}). Renew now to maintain your progress!`,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                  </button>

                  <button
                    onClick={() => window.location.href = '/renewals'}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Renew Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Tab Content 3: Today's Birthdays */}
        {activeActionTab === 'birthdays' && (
          <div className="space-y-3">
            {MOCK_BIRTHDAYS.map((item: BirthdayItem) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                    <Cake className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{item.memberName} ({item.age} yrs)</h4>
                    <p className="text-xs text-muted-foreground">{item.plan} • Turning {item.age} Today 🎉</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setWaDialogData({
                        name: item.memberName,
                        phone: item.phone,
                        message: `🎂 Happy Birthday ${item.memberName}! Wishing you maximum gains and peak fitness from Apex Fitness Gym! Enjoy a complimentary protein shake at reception today! 🥳`,
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all"
                  >
                    <MessageSquare className="h-4 w-4" /> Send Birthday Wish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Tab Content 4: Members Absent for 5+ Days */}
        {activeActionTab === 'absent' && (
          <div className="space-y-3">
            {MOCK_ABSENT_MEMBERS.map((item: AbsentMemberItem) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background hover:border-rose-500/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-foreground">{item.memberName}</h4>
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                      Absent {item.daysAbsent} days
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last Check-in: <strong className="text-foreground">{item.lastCheckInDate}</strong> • Trainer:{' '}
                    <strong className="text-foreground">{item.assignedTrainer}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-accent"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>

                  <button
                    onClick={() =>
                      setWaDialogData({
                        name: item.memberName,
                        phone: item.phone,
                        message: `Hey ${item.memberName}! We noticed you haven't checked in for the last ${item.daysAbsent} days at Apex Fitness. Your trainer ${item.assignedTrainer} is waiting for you! Let's get back on track 💪`,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Tab Content 5: Pending Lead Follow-ups */}
        {activeActionTab === 'leads' && (
          <div className="space-y-3">
            {MOCK_LEAD_FOLLOWUPS.map((item: LeadFollowupItem) => {
              const isCompleted = completedLeadIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        {item.followUpDate}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.notes}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-accent"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call Lead
                    </a>

                    <button
                      onClick={() => setCompletedLeadIds((prev) => [...prev, item.id])}
                      disabled={isCompleted}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs active:scale-95',
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                        </>
                      ) : (
                        'Mark Completed'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WhatsApp Action Dialog */}
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

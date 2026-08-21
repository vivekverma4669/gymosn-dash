import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { SearchBar } from '../components/common/SearchBar';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import { MemberFormDialog } from '../components/common/MemberFormDialog';
import { Member, MembershipPlan } from '../constants/mockData';
import { CreateMemberPayload } from '../types/gymData';
import { AuthUser } from '../types/auth';
import { api } from '../lib/apiClient';
import {
  UserCheck,
  UserX,
  Clock,
  UserPlus,
  MessageSquare,
  Phone,
  IndianRupee,
} from 'lucide-react';
import { cn } from '../utils/cn';

export const MembersPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [trainerFilter, setTrainerFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedWA, setSelectedWA] = useState<{ name: string; phone: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ['gym', 'members'],
    queryFn: () => api.get<Member[]>('/api/gym/members'),
  });

  const { data: plans } = useQuery({
    queryKey: ['gym', 'plans'],
    queryFn: () => api.get<MembershipPlan[]>('/api/gym/plans'),
  });

  const { data: trainers } = useQuery({
    queryKey: ['gym', 'trainers'],
    queryFn: () => api.get<AuthUser[]>('/api/gym/trainers'),
  });

  const createMemberMutation = useMutation({
    mutationFn: (input: CreateMemberPayload) => api.post('/api/gym/members', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym', 'members'] });
      queryClient.invalidateQueries({ queryKey: ['gym', 'plans'] });
    },
  });

  const memberList = members ?? [];
  const planList = plans ?? [];
  const trainerList = trainers ?? [];

  const filteredMembers = memberList.filter((m) => {
    if (statusFilter !== 'All' && m.status !== statusFilter) return false;
    if (planFilter !== 'All' && m.plan !== planFilter) return false;
    if (trainerFilter !== 'All' && m.trainer !== trainerFilter) return false;
    if (genderFilter !== 'All' && m.gender !== genderFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = memberList.filter((m) => m.status === 'Active').length;
  const expiringCount = memberList.filter((m) => m.status === 'Expiring Soon').length;
  const expiredCount = memberList.filter((m) => m.status === 'Expired').length;
  const pendingFees = memberList.reduce((sum, m) => sum + m.dueAmount, 0);
  const pendingFeeAccounts = memberList.filter((m) => m.dueAmount > 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Management CRM"
        description="Filter active, expiring, and inactive members. Manage plans, assign personal trainers, and connect via WhatsApp."
        badge={`${memberList.length} Total Members`}
        actions={
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <UserPlus className="h-4 w-4" /> Add New Member
          </button>
        }
      />

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Members"
          value={activeCount}
          change={memberList.length ? `${Math.round((activeCount / memberList.length) * 100)}% Active Rate` : 'No members yet'}
          trend="up"
          icon={UserCheck}
          iconBgColor="bg-emerald-500/10 text-emerald-500"
        />
        <StatsCard
          title="Expiring Soon"
          value={expiringCount}
          change="Within 7 Days"
          trend="neutral"
          icon={Clock}
          iconBgColor="bg-amber-500/10 text-amber-500"
        />
        <StatsCard
          title="Expired Members"
          value={expiredCount}
          change="Requires Follow-up"
          trend="down"
          icon={UserX}
          iconBgColor="bg-rose-500/10 text-rose-500"
        />
        <StatsCard
          title="Pending Fees"
          value={`₹${pendingFees.toLocaleString('en-IN')}`}
          change={`${pendingFeeAccounts} Accounts`}
          trend="down"
          icon={IndianRupee}
          iconBgColor="bg-blue-500/10 text-blue-500"
        />
      </div>

      {/* Comprehensive Filter Controls Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Membership Plan */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Plan</label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Plans</option>
              {planList.map((plan) => (
                <option key={plan.id} value={plan.name}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          {/* Trainer Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assigned Trainer</label>
            <select
              value={trainerFilter}
              onChange={(e) => setTrainerFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Trainers</option>
              {trainerList.map((trainer) => (
                <option key={trainer.id} value={trainer.name}>
                  {trainer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by member name, phone (+91), or member ID..."
        />
      </div>

      {/* Member Data Table with WhatsApp & Call Action Buttons */}
      <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            <tr>
              <th className="px-4 py-3.5">Member Details</th>
              <th className="px-4 py-3.5">Membership Plan</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Joining / Expiry Date</th>
              <th className="px-4 py-3.5">Assigned Trainer</th>
              <th className="px-4 py-3.5">Dues (₹)</th>
              <th className="px-4 py-3.5 text-right">Actions (WhatsApp / Call)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredMembers.map((member: Member) => (
              <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary text-xs shrink-0">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground">{member.phone} • {member.gender}, {member.age} yrs</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5">
                  <p className="font-semibold text-foreground">{member.plan}</p>
                  {member.agreedPrice !== undefined && (
                    <p className="text-[10px] text-muted-foreground">
                      Paying ₹{member.agreedPrice.toLocaleString('en-IN')}
                      {member.listPrice !== undefined && member.agreedPrice !== member.listPrice && (
                        <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 font-bold text-primary">
                          Custom{member.agreedPrice === 0 ? ' • Free' : ''}
                        </span>
                      )}
                    </p>
                  )}
                </td>

                <td className="px-4 py-3.5">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                      member.status === 'Active' && 'bg-emerald-500/10 text-emerald-500',
                      member.status === 'Expiring Soon' && 'bg-amber-500/10 text-amber-500',
                      member.status === 'Expired' && 'bg-rose-500/10 text-rose-500',
                      member.status === 'Inactive' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-muted-foreground">
                  <div>Join: <span className="text-foreground">{member.joiningDate}</span></div>
                  <div>Exp: <span className="font-semibold text-amber-500">{member.expiryDate}</span></div>
                </td>

                <td className="px-4 py-3.5 text-foreground font-medium">{member.trainer}</td>

                <td className="px-4 py-3.5 font-bold">
                  {member.dueAmount > 0 ? (
                    <span className="text-rose-500">₹{member.dueAmount.toLocaleString('en-IN')}</span>
                  ) : (
                    <span className="text-emerald-500">₹0 (Paid)</span>
                  )}
                </td>

                {/* WhatsApp & Call Action Buttons */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                      className="inline-flex items-center gap-1 p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      title="Call Member"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>

                    <button
                      onClick={() => setSelectedWA({ name: member.name, phone: member.phone })}
                      className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedWA && (
        <WhatsAppDialog
          isOpen={!!selectedWA}
          onClose={() => setSelectedWA(null)}
          recipientName={selectedWA.name}
          phone={selectedWA.phone}
          defaultMessage={`Namaste ${selectedWA.name}! Quick message from Apex Fitness Gym.`}
        />
      )}

      <MemberFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={async (input) => {
          await createMemberMutation.mutateAsync(input);
        }}
        plans={planList}
        trainers={trainerList}
      />
    </div>
  );
};

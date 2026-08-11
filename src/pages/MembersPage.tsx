import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { SearchBar } from '../components/common/SearchBar';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import { MOCK_MEMBERS, Member } from '../constants/mockData';
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

  // Filtered members list
  const filteredMembers = MOCK_MEMBERS.filter((m) => {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Management CRM"
        description="Filter active, expiring, and inactive members. Manage plans, assign personal trainers, and connect via WhatsApp."
        badge="450 Total Members"
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <UserPlus className="h-4 w-4" /> Add New Member
          </button>
        }
      />

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Members"
          value="412"
          change="91.5% Active Rate"
          trend="up"
          icon={UserCheck}
          iconBgColor="bg-emerald-500/10 text-emerald-500"
        />
        <StatsCard
          title="Expiring Soon"
          value="14"
          change="Within 7 Days"
          trend="neutral"
          icon={Clock}
          iconBgColor="bg-amber-500/10 text-amber-500"
        />
        <StatsCard
          title="Expired Members"
          value="18"
          change="Requires Follow-up"
          trend="down"
          icon={UserX}
          iconBgColor="bg-rose-500/10 text-rose-500"
        />
        <StatsCard
          title="Pending Fees"
          value="₹14,500"
          change="5 Accounts"
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
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Yearly">Yearly</option>
              <option value="Premium">Premium</option>
              <option value="Personal Training">Personal Training</option>
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
              <option value="Vikram Malhotra">Vikram Malhotra</option>
              <option value="Ananya Verma">Ananya Verma</option>
              <option value="Rohan Gupta">Rohan Gupta</option>
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

                <td className="px-4 py-3.5 font-semibold text-foreground">{member.plan}</td>

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
    </div>
  );
};

import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { SearchBar } from '../components/common/SearchBar';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import { MOCK_ATTENDANCE_RECORDS, AttendanceRecord } from '../constants/mockData';
import {
  UserCheck,
  UserX,
  Clock,
  Percent,
  UserPlus,
  QrCode,
  MessageSquare,
  Phone,
} from 'lucide-react';
import { cn } from '../utils/cn';

export const AttendancePage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'Today' | 'Yesterday' | 'This Week' | 'This Month'>('Today');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [trainerFilter, setTrainerFilter] = useState<string>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedWA, setSelectedWA] = useState<{ name: string; phone: string } | null>(null);

  // Filtered dataset
  const filteredRecords = MOCK_ATTENDANCE_RECORDS.filter((rec) => {
    if (statusFilter !== 'All' && rec.status !== statusFilter) return false;
    if (trainerFilter !== 'All' && rec.trainer !== trainerFilter) return false;
    if (planFilter !== 'All' && rec.plan !== planFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        rec.memberName.toLowerCase().includes(q) ||
        rec.phone.includes(q) ||
        rec.membershipId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Check-in Desk"
        description="Live attendance tracking, check-in logs, member attendance percentages, and QR entry scanner."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
            <QrCode className="h-4 w-4" /> Open QR Scanner
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Present Today"
          value="128"
          change="+12 vs yesterday"
          trend="up"
          icon={UserCheck}
          iconBgColor="bg-emerald-500/10 text-emerald-500"
        />
        <StatsCard
          title="Absent Members"
          value="42"
          change="Needs reminder"
          trend="down"
          icon={UserX}
          iconBgColor="bg-rose-500/10 text-rose-500"
        />
        <StatsCard
          title="Late Check-ins"
          value="18"
          change="After 10:00 AM"
          trend="neutral"
          icon={Clock}
          iconBgColor="bg-amber-500/10 text-amber-500"
        />
        <StatsCard
          title="Attendance Rate"
          value="75.2%"
          change="+4.1% this week"
          trend="up"
          icon={Percent}
          iconBgColor="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="New Check-ins"
          value="14"
          change="First-timers"
          trend="up"
          icon={UserPlus}
          iconBgColor="bg-purple-500/10 text-purple-500"
        />
      </div>

      {/* Comprehensive Filter Controls */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Date Range Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="Today">Today (10 Aug)</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          {/* Attendance Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Not Checked In">Not Checked In</option>
            </select>
          </div>

          {/* Trainer Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Trainer</label>
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

          {/* Membership Plan Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Plan Filter</label>
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
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by member name, phone (+91), or membership ID..."
        />
      </div>

      {/* Attendance Log Data Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            <tr>
              <th className="px-4 py-3.5">Member</th>
              <th className="px-4 py-3.5">Membership ID</th>
              <th className="px-4 py-3.5">Check-in Time</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Assigned Trainer</th>
              <th className="px-4 py-3.5">Plan</th>
              <th className="px-4 py-3.5 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredRecords.map((rec: AttendanceRecord) => (
              <tr key={rec.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3.5 font-bold text-foreground">
                  <div>{rec.memberName}</div>
                  <div className="text-[10px] text-muted-foreground font-normal">{rec.phone}</div>
                </td>
                <td className="px-4 py-3.5 font-mono text-muted-foreground">{rec.membershipId}</td>
                <td className="px-4 py-3.5 font-semibold text-foreground">{rec.checkInTime}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                      rec.status === 'Present' && 'bg-emerald-500/10 text-emerald-500',
                      rec.status === 'Absent' && 'bg-rose-500/10 text-rose-500',
                      rec.status === 'Late' && 'bg-amber-500/10 text-amber-500'
                    )}
                  >
                    {rec.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{rec.trainer}</td>
                <td className="px-4 py-3.5 font-medium text-foreground">{rec.plan}</td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <a
                      href={`tel:${rec.phone.replace(/[^0-9]/g, '')}`}
                      className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
                      title="Call Member"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => setSelectedWA({ name: rec.memberName, phone: rec.phone })}
                      className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                      title="Send WhatsApp"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
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
          defaultMessage={`Namaste ${selectedWA.name}! Quick check-in from Apex Fitness Gym regarding your attendance today.`}
        />
      )}
    </div>
  );
};

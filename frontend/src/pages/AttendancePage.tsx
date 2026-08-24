import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { SearchBar } from '../components/common/SearchBar';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import { QRCheckInDialog } from '../components/common/QRCheckInDialog';
import { useAuth } from '../contexts/AuthContext';
import { api, ApiClientError } from '../lib/apiClient';
import { AttendanceRow } from '../types/attendance';
import { MembershipPlan } from '../constants/mockData';
import { AuthUser } from '../types/auth';
import {
  UserCheck,
  UserX,
  Clock,
  Percent,
  MessageSquare,
  Phone,
  LogIn,
  LogOut,
  QrCode,
} from 'lucide-react';
import { cn } from '../utils/cn';

const todayIsoDate = (): string => new Date().toISOString().slice(0, 10);

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(todayIsoDate());
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [trainerFilter, setTrainerFilter] = useState<string>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedWA, setSelectedWA] = useState<{ name: string; phone: string } | null>(null);
  const [checkInError, setCheckInError] = useState<string | null>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const queryClient = useQueryClient();

  const isToday = date === todayIsoDate();

  const { data: attendance, isLoading } = useQuery({
    queryKey: ['gym', 'attendance', date],
    queryFn: () => api.get<AttendanceRow[]>(`/api/gym/attendance?date=${date}`),
  });

  const { data: plans } = useQuery({
    queryKey: ['gym', 'plans'],
    queryFn: () => api.get<MembershipPlan[]>('/api/gym/plans'),
  });

  const { data: trainers } = useQuery({
    queryKey: ['gym', 'trainers'],
    queryFn: () => api.get<AuthUser[]>('/api/gym/trainers'),
  });

  const checkInMutation = useMutation({
    mutationFn: (memberId: string) => api.post('/api/gym/attendance/check-in', { memberId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gym', 'attendance', date] }),
    onError: (err) => setCheckInError(err instanceof ApiClientError ? err.message : 'Failed to check in'),
  });

  const undoCheckInMutation = useMutation({
    mutationFn: (memberId: string) => api.delete(`/api/gym/attendance/${memberId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gym', 'attendance', date] }),
    onError: (err) => setCheckInError(err instanceof ApiClientError ? err.message : 'Failed to undo check-in'),
  });

  const records = attendance ?? [];
  const planList = plans ?? [];
  const trainerList = trainers ?? [];

  const filteredRecords = records.filter((rec) => {
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

  const presentCount = records.filter((r) => r.status === 'Present').length;
  const lateCount = records.filter((r) => r.status === 'Late').length;
  const absentCount = records.filter((r) => r.status === 'Absent' || r.status === 'Not Checked In').length;
  const attendanceRate = records.length ? Math.round(((presentCount + lateCount) / records.length) * 100) : 0;

  const formatCheckInTime = (iso: string): string => {
    if (iso === '-') return '-';
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Check-in Desk"
        description="Live attendance tracking and check-in logs for active members, by day."
        actions={
          user?.gym && (
            <button
              onClick={() => setIsQrOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              <QrCode className="h-4 w-4" /> Self Check-in QR
            </button>
          )
        }
      />

      {checkInError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-500">
          {checkInError}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Present"
          value={presentCount}
          change={isToday ? 'Today' : date}
          trend="up"
          icon={UserCheck}
          iconBgColor="bg-emerald-500/10 text-emerald-500"
        />
        <StatsCard
          title="Late Check-ins"
          value={lateCount}
          change="After 10:00 AM"
          trend="neutral"
          icon={Clock}
          iconBgColor="bg-amber-500/10 text-amber-500"
        />
        <StatsCard
          title={isToday ? 'Not Checked In' : 'Absent'}
          value={absentCount}
          change="Needs a reminder"
          trend="down"
          icon={UserX}
          iconBgColor="bg-rose-500/10 text-rose-500"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          change={`${records.length} active members`}
          trend={attendanceRate >= 50 ? 'up' : 'down'}
          icon={Percent}
          iconBgColor="bg-blue-500/10 text-blue-500"
        />
      </div>

      {/* Filter Controls */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={date}
              max={todayIsoDate()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              {isToday ? <option value="Not Checked In">Not Checked In</option> : <option value="Absent">Absent</option>}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Trainer</label>
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
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by member name, phone (+91), or member ID..."
        />
      </div>

      {/* Attendance Log Data Table */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading attendance...</div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="px-4 py-3.5">Member</th>
                <th className="px-4 py-3.5">Check-in Time</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Assigned Trainer</th>
                <th className="px-4 py-3.5">Plan</th>
                <th className="px-4 py-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-foreground">
                    <div>{rec.memberName}</div>
                    <div className="text-[10px] text-muted-foreground font-normal">{rec.phone}</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-foreground">{formatCheckInTime(rec.checkInTime)}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                        rec.status === 'Present' && 'bg-emerald-500/10 text-emerald-500',
                        rec.status === 'Late' && 'bg-amber-500/10 text-amber-500',
                        (rec.status === 'Absent' || rec.status === 'Not Checked In') && 'bg-rose-500/10 text-rose-500'
                      )}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{rec.trainer}</td>
                  <td className="px-4 py-3.5 font-medium text-foreground">{rec.plan}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isToday && rec.status === 'Not Checked In' && (
                        <button
                          onClick={() => {
                            setCheckInError(null);
                            checkInMutation.mutate(rec.memberId);
                          }}
                          disabled={checkInMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[10px] font-bold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-60"
                          title="Check In"
                        >
                          <LogIn className="h-3.5 w-3.5" /> Check In
                        </button>
                      )}
                      {isToday && (rec.status === 'Present' || rec.status === 'Late') && (
                        <button
                          onClick={() => {
                            setCheckInError(null);
                            undoCheckInMutation.mutate(rec.memberId);
                          }}
                          disabled={undoCheckInMutation.isPending}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-60"
                          title="Undo check-in"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Undo
                        </button>
                      )}
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
      )}

      {selectedWA && (
        <WhatsAppDialog
          isOpen={!!selectedWA}
          onClose={() => setSelectedWA(null)}
          recipientName={selectedWA.name}
          phone={selectedWA.phone}
          defaultMessage={`Namaste ${selectedWA.name}! Quick check-in reminder regarding your attendance today.`}
        />
      )}

      {user?.gym && (
        <QRCheckInDialog isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} gymId={user.gym} />
      )}
    </div>
  );
};

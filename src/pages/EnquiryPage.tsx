import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { SearchBar } from '../components/common/SearchBar';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import { DataTable, Column } from '../components/common/DataTable';
import { EnquiryFormDialog } from '../components/common/EnquiryFormDialog';
import { Enquiry } from '../constants/mockData';
import { CreateEnquiryPayload } from '../types/gymData';
import { api } from '../lib/apiClient';
import {
  ClipboardList,
  UserPlus,
  PhoneIncoming,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  ArrowRightCircle,
} from 'lucide-react';
import { cn } from '../utils/cn';

const STATUS_OPTIONS: Enquiry['status'][] = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];
const SOURCE_OPTIONS: Enquiry['source'][] = ['Walk-in', 'Phone Call', 'Instagram', 'Referral', 'Website', 'Facebook'];

export const EnquiryPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedWA, setSelectedWA] = useState<{ name: string; phone: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: enquiries } = useQuery({
    queryKey: ['gym', 'enquiries'],
    queryFn: () => api.get<Enquiry[]>('/api/gym/enquiries'),
  });

  const createEnquiryMutation = useMutation({
    mutationFn: (input: CreateEnquiryPayload) => api.post('/api/gym/enquiries', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gym', 'enquiries'] }),
  });

  const updateEnquiryMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Enquiry['status'] }) =>
      api.patch(`/api/gym/enquiries/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gym', 'enquiries'] }),
  });

  const filtered = (enquiries ?? []).filter((e) => {
    if (statusFilter !== 'All' && e.status !== statusFilter) return false;
    if (sourceFilter !== 'All' && e.source !== sourceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.phone.includes(q) || e.interestedPlan.toLowerCase().includes(q);
    }
    return true;
  });

  const enquiryList = enquiries ?? [];
  const newCount = enquiryList.filter((e) => e.status === 'New').length;
  const openCount = enquiryList.filter((e) => e.status === 'New' || e.status === 'Contacted' || e.status === 'Follow-up').length;
  const convertedCount = enquiryList.filter((e) => e.status === 'Converted').length;
  const conversionRate = enquiryList.length ? Math.round((convertedCount / enquiryList.length) * 100) : 0;

  const updateStatus = (id: string, status: Enquiry['status']) => {
    updateEnquiryMutation.mutate({ id, status });
  };

  const columns: Column<Enquiry>[] = [
    {
      header: 'Prospect',
      cell: (e) => (
        <div>
          <p className="font-bold text-foreground">{e.name}</p>
          <p className="text-[10px] text-muted-foreground">{e.phone}{e.email ? ` • ${e.email}` : ''}</p>
        </div>
      ),
    },
    {
      header: 'Source',
      cell: (e) => <span className="text-xs font-medium text-foreground">{e.source}</span>,
    },
    {
      header: 'Interested In',
      cell: (e) => <span className="text-xs font-semibold text-foreground">{e.interestedPlan}</span>,
    },
    {
      header: 'Visit / Follow-up',
      cell: (e) => (
        <div className="text-xs text-muted-foreground">
          <div>Visited: <span className="text-foreground">{e.visitDate}</span></div>
          <div>Next: <span className="font-semibold text-amber-500">{e.followUpDate}</span></div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (e) => (
        <select
          value={e.status}
          onChange={(ev) => updateStatus(e.id, ev.target.value as Enquiry['status'])}
          className={cn(
            'rounded-full border-0 px-2.5 py-1 text-[10px] font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/20',
            e.status === 'New' && 'bg-blue-500/10 text-blue-500',
            e.status === 'Contacted' && 'bg-amber-500/10 text-amber-500',
            e.status === 'Follow-up' && 'bg-primary/10 text-primary',
            e.status === 'Converted' && 'bg-emerald-500/10 text-emerald-500',
            e.status === 'Lost' && 'bg-rose-500/10 text-rose-500'
          )}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (e) => (
        <div className="flex items-center justify-end gap-2">
          <a
            href={`tel:${e.phone.replace(/[^0-9]/g, '')}`}
            className="inline-flex items-center gap-1 p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Call"
          >
            <Phone className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => setSelectedWA({ name: e.name, phone: e.phone })}
            className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 transition-colors"
            title="WhatsApp"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
          {e.status !== 'Converted' && (
            <button
              onClick={() => updateStatus(e.id, 'Converted')}
              className="inline-flex items-center gap-1 rounded-xl border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
              title="Convert to Member"
            >
              <ArrowRightCircle className="h-3.5 w-3.5" /> Convert
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description="Track walk-ins and callers who haven't joined yet — follow up before they choose another gym."
        badge={`${enquiryList.length} Total`}
        actions={
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <UserPlus className="h-4 w-4" /> Log New Enquiry
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="New Enquiries"
          value={newCount}
          change="Not yet contacted"
          trend="neutral"
          icon={PhoneIncoming}
          iconBgColor="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Open Pipeline"
          value={openCount}
          change="Needs follow-up"
          trend="up"
          icon={ClipboardList}
          iconBgColor="bg-amber-500/10 text-amber-500"
        />
        <StatsCard
          title="Converted"
          value={convertedCount}
          change="Became members"
          trend="up"
          icon={CheckCircle2}
          iconBgColor="bg-emerald-500/10 text-emerald-500"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          change="Of all enquiries"
          trend={conversionRate >= 40 ? 'up' : 'down'}
          icon={XCircle}
          iconBgColor="bg-rose-500/10 text-rose-500"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Sources</option>
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, phone, or interested plan..." />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyTitle="No Enquiries Found"
        emptyDescription="Walk-ins and calls that haven't converted to members yet will show up here."
        emptyIcon={ClipboardList}
      />

      {selectedWA && (
        <WhatsAppDialog
          isOpen={!!selectedWA}
          onClose={() => setSelectedWA(null)}
          recipientName={selectedWA.name}
          phone={selectedWA.phone}
          defaultMessage={`Namaste ${selectedWA.name}! Thanks for visiting Apex Fitness Gym. Let us know if you'd like to book a free trial session.`}
        />
      )}

      <EnquiryFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={async (input) => {
          await createEnquiryMutation.mutateAsync(input);
        }}
      />
    </div>
  );
};

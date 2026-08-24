import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { SearchBar } from '../components/common/SearchBar';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import { RecordPaymentDialog } from '../components/common/RecordPaymentDialog';
import { api } from '../lib/apiClient';
import { PaymentDto, CreatePaymentPayload } from '../types/payment';
import { Member, MembershipPlan } from '../constants/mockData';
import {
  IndianRupee,
  Clock,
  CheckCircle2,
  Receipt,
  Download,
  Plus,
  MessageSquare,
  QrCode,
} from 'lucide-react';

const todayIsoDate = (): string => new Date().toISOString().slice(0, 10);

const exportPaymentsCsv = (payments: PaymentDto[]): void => {
  const headers = ['Invoice No', 'Member Name', 'Phone', 'Plan', 'Amount', 'Method', 'Date', 'Notes'];
  const rows = payments.map((p) => [
    p.invoiceNo,
    p.memberName,
    p.phone,
    p.plan,
    String(p.amount),
    p.method,
    new Date(p.date).toLocaleDateString('en-IN'),
    p.notes,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payments-${todayIsoDate()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const PaymentsPage: React.FC = () => {
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedWA, setSelectedWA] = useState<{ name: string; phone: string; amount: number } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['gym', 'payments'],
    queryFn: () => api.get<PaymentDto[]>('/api/gym/payments'),
  });

  const { data: members } = useQuery({
    queryKey: ['gym', 'members'],
    queryFn: () => api.get<Member[]>('/api/gym/members'),
  });

  const { data: plans } = useQuery({
    queryKey: ['gym', 'plans'],
    queryFn: () => api.get<MembershipPlan[]>('/api/gym/plans'),
  });

  const recordPaymentMutation = useMutation({
    mutationFn: (input: CreatePaymentPayload) => api.post('/api/gym/payments', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym', 'payments'] });
      queryClient.invalidateQueries({ queryKey: ['gym', 'members'] });
    },
  });

  const paymentList = payments ?? [];
  const memberList = members ?? [];
  const planList = plans ?? [];

  const filteredPayments = paymentList.filter((pay) => {
    if (methodFilter !== 'All' && pay.method !== methodFilter) return false;
    if (planFilter !== 'All' && pay.plan !== planFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        pay.memberName.toLowerCase().includes(q) ||
        pay.invoiceNo.toLowerCase().includes(q) ||
        pay.phone.includes(q)
      );
    }
    return true;
  });

  const today = todayIsoDate();
  const now = new Date();
  const todaysRevenue = paymentList
    .filter((p) => p.date.slice(0, 10) === today)
    .reduce((sum, p) => sum + p.amount, 0);
  const collectedThisMonth = paymentList
    .filter((p) => {
      const d = new Date(p.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingFees = memberList.reduce((sum, m) => sum + m.dueAmount, 0);
  const pendingAccounts = memberList.filter((m) => m.dueAmount > 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance & Payments Dashboard"
        description="Monitor revenue, payment methods, outstanding dues, and generate member receipts."
        badge="Indian Rupee (₹)"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportPaymentsCsv(filteredPayments)}
              disabled={filteredPayments.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground shadow-xs hover:bg-accent transition-all disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" /> Record Payment
            </button>
          </div>
        }
      />

      {/* Finance Summary Cards (₹ INR) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Revenue"
          value={`₹${todaysRevenue.toLocaleString('en-IN')}`}
          change={`${paymentList.filter((p) => p.date.slice(0, 10) === today).length} transactions today`}
          trend="up"
          icon={IndianRupee}
          iconBgColor="bg-emerald-500/10 text-emerald-500"
        />
        <StatsCard
          title="Collected This Month"
          value={`₹${collectedThisMonth.toLocaleString('en-IN')}`}
          change="Total recorded this month"
          trend="up"
          icon={CheckCircle2}
          iconBgColor="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Pending Fees"
          value={`₹${pendingFees.toLocaleString('en-IN')}`}
          change={`${pendingAccounts} Outstanding Accounts`}
          trend={pendingAccounts ? 'down' : 'neutral'}
          icon={Clock}
          iconBgColor="bg-amber-500/10 text-amber-500"
        />
        <StatsCard
          title="Total Transactions"
          value={paymentList.length}
          change="All-time recorded payments"
          trend="neutral"
          icon={Receipt}
          iconBgColor="bg-purple-500/10 text-purple-500"
        />
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Payment Method</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Methods (UPI, Cash, Card)</option>
              <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
              <option value="Cash">Cash</option>
              <option value="Card">Credit / Debit Card</option>
              <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Membership Plan</label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Membership Plans</option>
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
          placeholder="Search invoice number (e.g. INV-2026-0001), member name, or phone..."
        />
      </div>

      {/* Finance Transactions Table */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Loading payments...</div>
      ) : filteredPayments.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-card/40 text-center">
          <Receipt className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">No payments recorded yet</p>
          <p className="text-xs text-muted-foreground">Record a payment to see it show up here.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="px-4 py-3.5">Invoice No</th>
                <th className="px-4 py-3.5">Member Name</th>
                <th className="px-4 py-3.5">Plan</th>
                <th className="px-4 py-3.5">Amount (₹)</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-primary">{pay.invoiceNo}</td>

                  <td className="px-4 py-3.5">
                    <p className="font-bold text-foreground">{pay.memberName}</p>
                    <p className="text-[10px] text-muted-foreground">{pay.phone}</p>
                  </td>

                  <td className="px-4 py-3.5 text-muted-foreground">{pay.plan}</td>

                  <td className="px-4 py-3.5 font-black text-foreground">₹{pay.amount.toLocaleString('en-IN')}</td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md text-[10px]">
                      {pay.method === 'UPI' && <QrCode className="h-3 w-3 text-emerald-500" />}
                      {pay.method}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-muted-foreground">
                    {new Date(pay.date).toLocaleDateString('en-IN')}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          setSelectedWA({
                            name: pay.memberName,
                            phone: pay.phone,
                            amount: pay.amount,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> WhatsApp Receipt
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
          defaultMessage={`Namaste ${selectedWA.name}! Here is your payment receipt of ₹${selectedWA.amount.toLocaleString('en-IN')}. Thank you!`}
        />
      )}

      <RecordPaymentDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={async (input) => {
          await recordPaymentMutation.mutateAsync(input);
        }}
        members={memberList}
      />
    </div>
  );
};

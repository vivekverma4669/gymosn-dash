import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/common/StatsCard';
import { SearchBar } from '../components/common/SearchBar';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import { MOCK_PAYMENTS, PaymentTransaction } from '../constants/mockData';
import {
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  MessageSquare,
  QrCode,
} from 'lucide-react';
import { cn } from '../utils/cn';

export const PaymentsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedWA, setSelectedWA] = useState<{ name: string; phone: string; amount: number } | null>(null);

  const filteredPayments = MOCK_PAYMENTS.filter((pay) => {
    if (statusFilter !== 'All' && pay.status !== statusFilter) return false;
    if (methodFilter !== 'All' && pay.method !== methodFilter) return false;
    if (planFilter !== 'All' && !pay.plan.toLowerCase().includes(planFilter.toLowerCase())) return false;
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance & Payments Dashboard"
        description="Monitor daily revenue, UPI transactions, cash registers, overdue fees in ₹, and generate member invoices."
        badge="Indian Rupee (₹)"
        actions={
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground shadow-xs hover:bg-accent transition-all">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
              <Plus className="h-4 w-4" /> Record Payment
            </button>
          </div>
        }
      />

      {/* Finance Summary Cards (₹ INR) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Revenue"
          value="₹24,500"
          change="+₹6,500 vs yesterday"
          trend="up"
          icon={IndianRupee}
          iconBgColor="bg-emerald-500/10 text-emerald-500"
          description="UPI ₹18.5k • Cash ₹6k"
        />
        <StatsCard
          title="Pending Fees"
          value="₹68,000"
          change="12 Outstanding Accounts"
          trend="down"
          icon={Clock}
          iconBgColor="bg-amber-500/10 text-amber-500"
          description="Pending desk collection"
        />
        <StatsCard
          title="Collected This Month"
          value="₹4,89,200"
          change="+14.2% Growth"
          trend="up"
          icon={CheckCircle2}
          iconBgColor="bg-blue-500/10 text-blue-500"
          description="Total membership revenue"
        />
        <StatsCard
          title="Overdue Dues"
          value="₹18,400"
          change="Overdue > 15 Days"
          trend="down"
          icon={AlertCircle}
          iconBgColor="bg-rose-500/10 text-rose-500"
          description="Immediate call required"
        />
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Payment Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Payment Method */}
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

          {/* Plan Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Membership Plan</label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Membership Plans</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search invoice number (e.g. INV-2026-001), member name, or phone..."
        />
      </div>

      {/* Finance Transactions Table */}
      <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            <tr>
              <th className="px-4 py-3.5">Invoice No</th>
              <th className="px-4 py-3.5">Member Name</th>
              <th className="px-4 py-3.5">Plan / Item</th>
              <th className="px-4 py-3.5">Amount (₹)</th>
              <th className="px-4 py-3.5">Payment Method</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredPayments.map((pay: PaymentTransaction) => (
              <tr key={pay.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3.5 font-mono font-bold text-primary">{pay.invoiceNo}</td>

                <td className="px-4 py-3.5">
                  <p className="font-bold text-foreground">{pay.memberName}</p>
                  <p className="text-[10px] text-muted-foreground">{pay.phone}</p>
                </td>

                <td className="px-4 py-3.5 text-muted-foreground">{pay.plan}</td>

                <td className="px-4 py-3.5 font-black text-foreground">
                  ₹{pay.amount.toLocaleString('en-IN')}
                </td>

                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md text-[10px]">
                    {pay.method === 'UPI' && <QrCode className="h-3 w-3 text-emerald-500" />}
                    {pay.method}
                  </span>
                </td>

                <td className="px-4 py-3.5">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                      pay.status === 'Paid' && 'bg-emerald-500/10 text-emerald-500',
                      pay.status === 'Partial' && 'bg-amber-500/10 text-amber-500',
                      pay.status === 'Pending' && 'bg-blue-500/10 text-blue-500',
                      pay.status === 'Overdue' && 'bg-rose-500/10 text-rose-500'
                    )}
                  >
                    {pay.status}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-muted-foreground">{pay.date}</td>

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

      {selectedWA && (
        <WhatsAppDialog
          isOpen={!!selectedWA}
          onClose={() => setSelectedWA(null)}
          recipientName={selectedWA.name}
          phone={selectedWA.phone}
          defaultMessage={`Namaste ${selectedWA.name}! Here is your payment receipt of ₹${selectedWA.amount.toLocaleString('en-IN')} for Apex Fitness. Thank you!`}
        />
      )}
    </div>
  );
};

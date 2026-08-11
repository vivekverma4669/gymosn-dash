import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import {
  MOCK_MEMBERS,
  MOCK_REMINDER_TEMPLATES,
  MOCK_REMINDER_HISTORY,
  ReminderHistoryItem,
} from '../constants/mockData';
import { WhatsAppDialog } from '../components/common/WhatsAppDialog';
import {
  Send,
  CheckCheck,
  Users,
  Sparkles,
  Clock,
  CheckSquare,
  Square,
} from 'lucide-react';
import { cn } from '../utils/cn';

export const ReminderCenterPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<
    'Membership Expiry' | 'Fee Reminder' | 'Birthday Wishes' | 'Missed Attendance' | 'Custom Reminder'
  >('Membership Expiry');

  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(['MEM-101', 'MEM-102']);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('T-01');
  const [customMessage, setCustomMessage] = useState<string>(
    'Namaste {name}! Your gym membership at Apex Fitness is expiring soon. Renew today to continue your workout streak!'
  );
  const [history, setHistory] = useState<ReminderHistoryItem[]>(MOCK_REMINDER_HISTORY);
  const [isSending, setIsSending] = useState(false);
  const [waModalData, setWaModalData] = useState<{ name: string; phone: string; message: string } | null>(null);

  // Get templates for active category
  const availableTemplates = MOCK_REMINDER_TEMPLATES.filter(
    (t) => t.category === activeCategory
  );

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = MOCK_REMINDER_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setCustomMessage(tmpl.templateText);
    }
  };

  const handleToggleMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMemberIds.length === MOCK_MEMBERS.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(MOCK_MEMBERS.map((m) => m.id));
    }
  };

  const handleSendBatchReminders = () => {
    if (selectedMemberIds.length === 0) return;
    setIsSending(true);

    setTimeout(() => {
      const newHistoryItems: ReminderHistoryItem[] = selectedMemberIds.map((id, index) => {
        const member = MOCK_MEMBERS.find((m) => m.id === id);
        return {
          id: `HIST-${Date.now()}-${index}`,
          recipientName: member?.name || 'Member',
          phone: member?.phone || '+91 98765 43210',
          category: activeCategory,
          message: customMessage.replace('{name}', member?.name || 'Member'),
          sentAt: 'Just now',
          status: 'Delivered',
        };
      });

      setHistory((prev) => [...newHistoryItems, ...prev]);
      setIsSending(false);
      alert(`Successfully dispatched ${selectedMemberIds.length} WhatsApp reminders!`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Reminder Center"
        description="Engage members with automated WhatsApp reminders for fees, renewals, birthdays, and missed workouts."
        badge="WhatsApp Engine"
      />

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border/60 pb-3">
        {(
          [
            'Membership Expiry',
            'Fee Reminder',
            'Birthday Wishes',
            'Missed Attendance',
            'Custom Reminder',
          ] as const
        ).map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              const firstTmpl = MOCK_REMINDER_TEMPLATES.find((t) => t.category === category);
              if (firstTmpl) {
                setSelectedTemplateId(firstTmpl.id);
                setCustomMessage(firstTmpl.templateText);
              }
            }}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap',
              activeCategory === category
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recipient List & Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-foreground text-sm">Select Recipients</h3>
              </div>
              <button
                onClick={handleSelectAll}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                {selectedMemberIds.length === MOCK_MEMBERS.length ? (
                  <CheckSquare className="h-3.5 w-3.5" />
                ) : (
                  <Square className="h-3.5 w-3.5" />
                )}
                Select All ({MOCK_MEMBERS.length})
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto divide-y divide-border/40 pr-1">
              {MOCK_MEMBERS.map((member) => {
                const isSelected = selectedMemberIds.includes(member.id);
                return (
                  <div
                    key={member.id}
                    onClick={() => handleToggleMember(member.id)}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors mt-1',
                      isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent/60'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border text-xs font-bold text-foreground">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{member.name}</p>
                        <p className="text-[10px] text-muted-foreground">{member.phone} • {member.plan}</p>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Template Composer & Live Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> Template & Message Composer
              </h3>
              <span className="text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                WhatsApp Ready
              </span>
            </div>

            {/* Template Selector */}
            {availableTemplates.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Choose Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
                >
                  {availableTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dynamic Message Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">WhatsApp Message Template</label>
                <span className="text-[10px] text-muted-foreground">Dynamic tags: &#123;name&#125;, &#123;due_amount&#125;, &#123;expiry_date&#125;</span>
              </div>
              <textarea
                rows={5}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Selected Recipients: <strong className="text-foreground">{selectedMemberIds.length}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const firstMember = MOCK_MEMBERS.find((m) => m.id === selectedMemberIds[0]) || MOCK_MEMBERS[0];
                    setWaModalData({
                      name: firstMember.name,
                      phone: firstMember.phone,
                      message: customMessage.replace('{name}', firstMember.name),
                    });
                  }}
                  disabled={selectedMemberIds.length === 0}
                  className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent disabled:opacity-40"
                >
                  Test Preview
                </button>

                <button
                  onClick={handleSendBatchReminders}
                  disabled={selectedMemberIds.length === 0 || isSending}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                  {isSending ? 'Sending...' : 'Send WhatsApp Blast'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-bold text-foreground text-sm">Recent Reminders History</h3>
          </div>
          <span className="text-xs text-muted-foreground">{history.length} reminders logged</span>
        </div>

        <div className="divide-y divide-border/40 max-h-[280px] overflow-y-auto">
          {history.map((item) => (
            <div key={item.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">{item.recipientName}</span>
                  <span className="text-[10px] text-muted-foreground">{item.phone}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{item.message}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <CheckCheck className="h-3.5 w-3.5" /> {item.status}
                </span>
                <p className="text-[10px] text-muted-foreground">{item.sentAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test WhatsApp Dialog */}
      {waModalData && (
        <WhatsAppDialog
          isOpen={!!waModalData}
          onClose={() => setWaModalData(null)}
          recipientName={waModalData.name}
          phone={waModalData.phone}
          defaultMessage={waModalData.message}
        />
      )}
    </div>
  );
};

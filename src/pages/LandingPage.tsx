import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  QrCode,
  CreditCard,
  Salad,
  BarChart3,
  UserCog,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  ChevronDown,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: Users,
    title: 'Member Management',
    description:
      'A complete CRM for every member — profiles, plans, attendance, payments, and progress in one view.',
  },
  {
    icon: QrCode,
    title: 'QR Attendance',
    description:
      'Frictionless check-in with QR codes or manual entry. Real-time attendance feeds your analytics.',
  },
  {
    icon: CreditCard,
    title: 'Payments & Invoicing',
    description:
      'Collect via UPI, cards, or Razorpay. Auto-generate GST invoices and send receipts instantly.',
  },
  {
    icon: Salad,
    title: 'Workout & Diet Plans',
    description:
      'Assign structured workout and diet plans to members. Track progress and adjust from anywhere.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description:
      'Revenue, retention, attendance, and growth — beautiful charts that make decisions obvious.',
  },
  {
    icon: UserCog,
    title: 'Trainer Management',
    description:
      'Assign trainers to members, track salaries, and measure performance with ratings and load.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Set up your gym',
    description:
      'Add your gym details, logo, GST, and business hours. Invite trainers and receptionists in minutes.',
  },
  {
    number: '02',
    title: 'Onboard members',
    description:
      'Import existing members or add them one by one. Assign plans, trainers, and payment schedules.',
  },
  {
    number: '03',
    title: 'Automate the daily grind',
    description:
      'QR check-ins, renewal reminders, and invoice generation run on autopilot while you focus on growth.',
  },
];

const STATS = [
  { value: '500+', label: 'Gyms onboarded' },
  { value: '1.2L+', label: 'Members managed' },
  { value: '₹48Cr+', label: 'Payments processed' },
  { value: '99.9%', label: 'Uptime' },
];

const PLANS = [
  {
    name: 'Starter',
    description: 'For single-location gyms getting started.',
    price: '₹1,499',
    popular: false,
    cta: 'Start Free Trial',
    features: [
      'Up to 200 members',
      'Attendance tracking',
      '1 trainer account',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    description: 'For growing gyms that need automation.',
    price: '₹3,499',
    popular: true,
    cta: 'Start Free Trial',
    features: [
      'Up to 1,000 members',
      'QR check-in & attendance',
      'Unlimited trainers',
      'Advanced analytics & reports',
      'Razorpay & invoice automation',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For multi-location gym chains.',
    price: '₹7,999',
    popular: false,
    cta: 'Contact Sales',
    features: [
      'Unlimited members',
      'Multi-branch dashboard',
      'Custom branded app',
      'API access & integrations',
      'Dedicated account manager',
      '24/7 phone support',
    ],
  },
];

const TESTIMONIALS = [
  {
    initials: 'AM',
    name: 'Arjun Mehta',
    role: 'Owner, IronCore Fitness — Bengaluru',
    quote:
      'Gymosn replaced three different tools for us. Attendance, payments, and renewals all happen in one place now. My front desk runs itself.',
  },
  {
    initials: 'PS',
    name: 'Priya Sharma',
    role: 'Owner, FlexZone Studio — Pune',
    quote:
      'The dashboards are gorgeous and my members love the QR check-in. We caught 12 expired memberships in the first week.',
  },
  {
    initials: 'RV',
    name: 'Rohan Verma',
    role: 'Owner, Titan Strength — Delhi',
    quote:
      'Razorpay integration alone paid for the subscription. Renewal reminders go out automatically and collection time dropped to near zero.',
  },
];

const FAQS = [
  {
    q: 'Is Gymosn built for gyms in India?',
    a: 'Yes. Gymosn supports GST invoicing, UPI and Razorpay payments, WhatsApp notifications, and Indian currency out of the box — designed for how Indian gyms actually operate.',
  },
  {
    q: 'Can I try Gymosn before paying?',
    a: 'Absolutely — every plan starts with a 14-day free trial and no credit card is required to get started.',
  },
  {
    q: 'Does Gymosn work on mobile?',
    a: 'Yes, the dashboard is mobile-first and works beautifully on any phone or tablet for owners, trainers, and front-desk staff.',
  },
  {
    q: 'How does member check-in work?',
    a: 'Members check in via a QR code scan at the front desk, or staff can log attendance manually. Every check-in feeds your real-time analytics.',
  },
  {
    q: 'Can I connect my existing payment system?',
    a: 'Gymosn integrates with Razorpay and supports UPI, card, and cash collection, with auto-generated GST invoices and receipts.',
  },
  {
    q: 'What happens when my trial ends?',
    a: "You'll be prompted to pick a plan that fits your gym. There's no automatic charge — you stay in control of when you subscribe.",
  },
];

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.18),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Trusted by 500+ gyms across India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight"
          >
            The Smart Operating System <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">for Modern Gyms</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Gymosn brings members, trainers, attendance, payments, and analytics into one beautiful dashboard — built for Indian gyms that want to grow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground shadow-xs hover:bg-accent/10 transition-all active:scale-95"
            >
              <PlayCircle className="h-4 w-4" />
              Book Demo
            </Link>
          </motion.div>

          <p className="text-xs text-muted-foreground">14-day free trial · No credit card required</p>

          {/* Dashboard preview mock */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-4xl pt-8"
          >
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden text-left">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-3 text-xs text-muted-foreground">app.gymosn.in/dashboard</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
                {[
                  { label: 'Active Members', value: '248', change: '+12%' },
                  { label: "Today's Attendance", value: '142', change: '+8%' },
                  { label: 'Monthly Revenue', value: '₹4.38L', change: '+18%' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border bg-background/60 p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                      <span className="text-xs font-semibold text-success">{stat.change}</span>
                    </div>
                    <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 pb-6">
                <div className="h-28 rounded-xl border border-border bg-gradient-to-t from-primary/15 to-transparent flex items-end p-3">
                  <span className="text-xs font-medium text-muted-foreground">Revenue</span>
                </div>
                <div className="h-28 rounded-xl border border-border bg-gradient-to-t from-accent/15 to-transparent flex items-end p-3">
                  <span className="text-xs font-medium text-muted-foreground">Attendance</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <p className="text-xs font-bold tracking-widest text-primary uppercase">Features</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Everything your gym needs, nothing it doesn&apos;t
          </h2>
          <p className="text-muted-foreground">A complete toolkit to run your gym like a modern SaaS company.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-8 space-y-4 shadow-sm hover:border-primary/50 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-card/30 py-16 md:py-24 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <p className="text-xs font-bold tracking-widest text-primary uppercase">How it works</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Live in three simple steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="space-y-3">
                <span className="font-heading text-4xl font-bold text-primary/30">{step.number}</span>
                <h3 className="font-heading text-xl font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                Built for the way Indian gyms actually operate
              </h3>
              <p className="text-muted-foreground">
                GST invoices, UPI and Razorpay payments, WhatsApp reminders, and a mobile-first dashboard your trainers will actually use.
              </p>
              <ul className="space-y-3">
                {[
                  'GST-compliant invoicing out of the box',
                  'UPI, cards, and cash collection in one place',
                  'WhatsApp renewal reminders that get paid',
                  'Works beautifully on any phone or tablet',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 text-center space-y-1">
                  <p className="font-heading text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <p className="text-xs font-bold tracking-widest text-primary uppercase">Pricing</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Simple, transparent pricing</h2>
          <p className="text-muted-foreground">Start free for 14 days. Pick a plan when you&apos;re ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 space-y-6 ${
                plan.popular
                  ? 'border-primary bg-card shadow-xl shadow-primary/10 md:-translate-y-3'
                  : 'border-border bg-card'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}
              <div className="space-y-1">
                <h3 className="font-heading text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <Link
                to="/register"
                className={`block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all active:scale-95 ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90'
                    : 'border border-border bg-background text-foreground hover:bg-accent/10'
                }`}
              >
                {plan.cta}
              </Link>
              <ul className="space-y-3 pt-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-card/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <p className="text-xs font-bold tracking-widest text-primary uppercase">Testimonials</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Loved by gym owners across India</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-card p-8 space-y-5">
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 scroll-mt-16">
        <div className="text-center space-y-3 mb-14">
          <p className="text-xs font-bold tracking-widest text-primary uppercase">FAQ</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Frequently asked questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={faq.q} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Ready to modernize your gym?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join 500+ gyms running smarter with Gymosn. Start your free trial today — no credit card needed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground shadow-xs hover:bg-accent/10 transition-all active:scale-95"
            >
              <PlayCircle className="h-4 w-4" />
              Book Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

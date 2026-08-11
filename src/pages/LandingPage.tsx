import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ShieldCheck, Zap, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-12 md:py-20">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary"
        >
          <Zap className="h-3.5 w-3.5" /> Next-Gen Multi-Tenant Gym SaaS Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight"
        >
          Manage Your Gym Multi-Branch SaaS with <span className="text-primary">Gymosn</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Streamline member check-ins, automated billing, trainer scheduling, diet programs, and analytics in one enterprise-grade CRM shell.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground shadow-xs hover:bg-accent transition-all active:scale-95"
          >
            Launch Demo Dashboard
          </Link>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-border bg-card p-8 space-y-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Multi-Tenant CRM</h3>
            <p className="text-sm text-muted-foreground">
              Isolated data structures for every gym branch with custom branding, membership tiers, and trainer workflows.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 space-y-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Dumbbell className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Workouts & Diet Plans</h3>
            <p className="text-sm text-muted-foreground">
              Build custom workout routines and macro-nutrient meal plans tailored to member fitness objectives.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 space-y-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Enterprise Security</h3>
            <p className="text-sm text-muted-foreground">
              Role-based authorization, automated recurring billing, real-time analytics, and data protection.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/* Layouts */
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

/* Public Pages */
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterGymPage } from '../pages/RegisterGymPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

/* Protected Pages */
import { DashboardPage } from '../pages/DashboardPage';
import { MembersPage } from '../pages/MembersPage';
import { RenewalsPage } from '../pages/RenewalsPage';
import { ReminderCenterPage } from '../pages/ReminderCenterPage';
import { TrainersPage } from '../pages/TrainersPage';
import { AttendancePage } from '../pages/AttendancePage';
import { MembershipsPage } from '../pages/MembershipsPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { WorkoutPlansPage } from '../pages/WorkoutPlansPage';
import { DietPlansPage } from '../pages/DietPlansPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SubscriptionPage } from '../pages/SubscriptionPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Route */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterGymPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/renewals" element={<RenewalsPage />} />
        <Route path="/reminders" element={<ReminderCenterPage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/memberships" element={<MembershipsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/workout-plans" element={<WorkoutPlansPage />} />
        <Route path="/diet-plans" element={<DietPlansPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

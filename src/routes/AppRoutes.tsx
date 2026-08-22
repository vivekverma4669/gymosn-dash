import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/* Layouts */
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout';

/* Auth */
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

/* Public Pages */
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

/* Super Admin Pages */
import { SuperAdminLoginPage } from '../pages/SuperAdminLoginPage';
import { SuperAdminGymsPage } from '../pages/superadmin/SuperAdminGymsPage';

/* Public Kiosk Pages */
import { CheckInKioskPage } from '../pages/public/CheckInKioskPage';

/* Protected Pages */
import { DashboardPage } from '../pages/DashboardPage';
import { MembersPage } from '../pages/MembersPage';
import { EnquiryPage } from '../pages/EnquiryPage';
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
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      {/* Self-service gym registration is disabled — gyms are onboarded by the Super Admin */}
      <Route path="/register" element={<Navigate to="/login" replace />} />

      {/* Public QR self check-in kiosk — no login, reachable from a member's own phone */}
      <Route path="/checkin/:gymId" element={<CheckInKioskPage />} />

      {/* Super Admin login — deliberately separate from /login, not linked anywhere in the UI */}
      <Route path="/system-console/login" element={<SuperAdminLoginPage />} />

      {/* Protected Super Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN']} />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/superadmin/gyms" element={<SuperAdminGymsPage />} />
        </Route>
      </Route>

      {/* Protected Dashboard Routes (Gym Owner / Trainer) */}
      <Route element={<ProtectedRoute allowedRoles={['GYM_OWNER', 'TRAINER']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/enquiries" element={<EnquiryPage />} />
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
      </Route>

      {/* 404 Catch-All */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleGuard } from '../auth/RoleGuard';
import { Layout } from '../ui/Layout';

// Placeholder Pages
const LoginPage = React.lazy(() => import('../../features/auth/LoginPage'));
const DashboardPage = React.lazy(() => import('../../features/moderator/DashboardPage'));
const QueuePage = React.lazy(() => import('../../features/moderator/QueuePage'));
const SubmissionDetailPage = React.lazy(() => import('../../features/moderator/SubmissionDetailPage'));
const TriagePage = React.lazy(() => import('../../features/moderator/TriagePage'));
const UsersPage = React.lazy(() => import('../../features/admin/UsersPage'));
const SettingsPage = React.lazy(() => import('../../features/admin/SettingsPage'));
const HierarchyPage = React.lazy(() => import('../../features/admin/HierarchyPage'));
const AuditLogsPage = React.lazy(() => import('../../features/admin/AuditLogsPage'));
const AnalyticsPage = React.lazy(() => import('../../features/admin/AnalyticsPage'));
const GovernancePage = React.lazy(() => import('../../features/admin/GovernancePage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route element={<RoleGuard requiredRole="moderator" />}>
            <Route element={<Layout><OutletWrapper /></Layout>}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/moderator/queue" element={<QueuePage />} />
              <Route path="/moderator/submission/:id" element={<SubmissionDetailPage />} />
              <Route path="/moderator/triage" element={<TriagePage />} />
              
              {/* Admin Only Routes */}
              <Route element={<RoleGuard requiredRole="admin" />}>
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path="/admin/hierarchy" element={<HierarchyPage />} />
                <Route path="/admin/audit" element={<AuditLogsPage />} />
                <Route path="/admin/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/governance" element={<GovernancePage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

// Helper to render nested routes in Layout
import { Outlet } from 'react-router-dom';
const OutletWrapper = () => <Outlet />;

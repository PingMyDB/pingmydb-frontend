import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Lazy load dashboard pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MonitorsPage = lazy(() => import('./pages/MonitorsPage'));
const LogsPage = lazy(() => import('./pages/LogsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const DocsPage = lazy(() => import('./pages/DocsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const StatusPage = lazy(() => import('./pages/StatusPage'));
const StatusSettingsPage = lazy(() => import('./pages/StatusSettingsPage'));
const ApiKeyPage = lazy(() => import('./pages/ApiKeyPage'));
const IncidentPage = lazy(() => import('./pages/IncidentPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

import AuthCallback from './pages/AuthCallback';
import DashboardLayout from './layouts/DashboardLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
      );
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-background">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
      );
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
    // The checkAuth is handled inside AuthProvider, 
    // but if we need global loading state we can add it there.
    // For now, AuthContext handles hydration on mount.
    return (
        <Router>
          <ScrollToTop />
          <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
          }>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/status/:slug" element={<StatusPage />} />
              <Route path="/auth-callback" element={<AuthCallback />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="monitors" element={<MonitorsPage />} />
                <Route path="logs" element={<LogsPage />} />
                {/* Replaced Billing with Pricing as per request */}
                <Route path="billing" element={<PricingPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="status" element={<StatusSettingsPage />} />
                <Route path="incidents" element={<IncidentPage />} />
                <Route path="api-keys" element={<ApiKeyPage />} />
                <Route path="team" element={<TeamPage />} />

                {/* Admin Routes */}
                <Route 
                  path="admin" 
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="admin/users" 
                  element={
                    <AdminProtectedRoute>
                      <AdminUsers />
                    </AdminProtectedRoute>
                  } 
                />
              </Route>
      
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      );
}

import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppContent />
        <Toaster position="top-center" richColors />
    </AuthProvider>
  );
};

export default App;


import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MonitorsPage from './pages/MonitorsPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';
import DocsPage from './pages/DocsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import StatusPage from './pages/StatusPage';
import StatusSettingsPage from './pages/StatusSettingsPage';
import ApiKeyPage from './pages/ApiKeyPage';
import IncidentPage from './pages/IncidentPage';
<<<<<<< HEAD
import TeamPage from './pages/TeamPage';
import AuthCallback from './pages/AuthCallback';
import DashboardLayout from './layouts/DashboardLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
=======
import DashboardLayout from './layouts/DashboardLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
>>>>>>> origin/main

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

const AppContent: React.FC = () => {
    // The checkAuth is handled inside AuthProvider, 
    // but if we need global loading state we can add it there.
    // For now, AuthContext handles hydration on mount.
    return (
        <Router>
          <ScrollToTop />
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
<<<<<<< HEAD
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

=======
    
>>>>>>> origin/main
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
<<<<<<< HEAD
              <Route path="team" element={<TeamPage />} />
=======
>>>>>>> origin/main

              {/* Admin Routes */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminUsers />} />
            </Route>
    
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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

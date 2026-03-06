
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import OnboardingModal from '../components/OnboardingModal';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../src/config';
import { toast } from 'sonner';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { user } = useAuth();

  const handleResend = async () => {
    if (!user?.email || isResending) return;
    setIsResending(true);
    const pmdb_token = localStorage.getItem('pmdb_token');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'token': pmdb_token || '' 
        },
        body: JSON.stringify({ email: user.email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Verification email sent!');
      } else {
        toast.error(data.message || 'Failed to resend email.');
      }
    } catch (err) {
      console.error('Resend error:', err);
      toast.error('Network error. Check your connection.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {user && !user.is_verified && (
        <div className="w-full z-50 bg-amber-500/10 text-amber-500 font-semibold text-center p-2 border-b border-amber-500/20 shrink-0 text-sm flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Please verify your email address. Check your inbox for the verification link.
          </div>
          <button 
            onClick={handleResend} 
            disabled={isResending}
            className="text-amber-600 hover:text-amber-700 underline text-xs font-bold disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend Link'}
          </button>
        </div>
      )}
      <div className="flex flex-1 w-full bg-background overflow-hidden relative">
        {/* Fixed Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Scrollable Right Side */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-slate-50/30 dark:bg-background">
          {/* Navbar stays at the top of the right side */}
          <div className="z-30 border-b border-border/60">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
          </div>
          
          {/* This is the only part that scrolls */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8 pb-10">
              <Outlet />
            </div>
          </main>
        </div>

        <OnboardingModal />
      </div>
    </div>
  );
};

export default DashboardLayout;

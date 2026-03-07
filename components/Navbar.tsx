import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, LogOut, Moon, Sun, ChevronDown, Menu, Settings, XCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMonitorStore } from '../store/monitorStore';
import { useNotificationStore } from '../store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { allAlerts, fetchAllAlerts } = useMonitorStore();
  const { channels, fetchChannels } = useNotificationStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [nudgeDismissed, setNudgeDismissed] = useState(
    () => sessionStorage.getItem('notif_nudge_dismissed') === 'true'
  );

  useEffect(() => {
    fetchAllAlerts();
    const timer = setInterval(fetchAllAlerts, 30000);
    return () => clearInterval(timer);
  }, [fetchAllAlerts]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleDismissNudge = () => {
    setNudgeDismissed(true);
    sessionStorage.setItem('notif_nudge_dismissed', 'true');
  };

  const hasActiveChannel = channels.some(c => c.is_enabled);
  const showNudge = !hasActiveChannel && !nudgeDismissed;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      {/* ─── Main Navbar Row ─────────────────────────────────────── */}
      <div className="h-16 px-4 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-md hover:bg-accent lg:hidden"
            aria-label="Toggle mobile menu"
          >
            <Menu size={20} />
          </button>
          
          <div className="relative hidden md:block w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search monitors..." 
              className="w-full bg-accent/30 border border-border focus:border-primary/40 rounded-xl py-1.5 pl-10 pr-4 text-sm focus:outline-none transition-all focus:ring-4 focus:ring-primary/5"
            />
          </div>
        </div>

        {/* System Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">All Systems Operational</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">

          {/* ── Notification Nudge Chip (desktop only) ─────────── */}
          <AnimatePresence>
            {showNudge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 10 }}
                className="hidden md:flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full pl-3 pr-1 py-1"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                  Notifications off
                </span>
                <button
                  onClick={() => navigate('/dashboard/settings?tab=notifications')}
                  className="text-[11px] font-bold bg-amber-500 text-white px-2.5 py-1 rounded-full hover:bg-amber-600 transition-colors whitespace-nowrap"
                >
                  Enable →
                </button>
                <button
                  onClick={handleDismissNudge}
                  className="p-1 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors opacity-60 hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <XCircle size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Theme Toggle ─────────────────────────────────────── */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border bg-card hover:bg-accent text-muted-foreground transition-all flex items-center justify-center"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-500" />}
          </motion.button>
          
          {/* ── Bell / Alerts Dropdown ───────────────────────────── */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-xl border bg-card hover:bg-accent text-muted-foreground transition-all relative group ${showNotifications ? 'bg-accent border-primary/20' : ''}`}
              aria-label={`Open notifications`}
            >
              <Bell size={18} className="group-hover:rotate-12 transition-transform" />
              {allAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-primary text-[10px] font-bold text-white rounded-full ring-4 ring-background animate-in zoom-in">
                  {allAlerts.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl border bg-card shadow-lg z-20 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
                      <h3 className="text-sm font-bold">Recent Alerts</h3>
                      {!hasActiveChannel && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          Alerts off
                        </span>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {allAlerts.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-xs text-muted-foreground">No recent notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y">
                          {allAlerts.map((alert) => (
                            <div key={alert.id} className="px-4 py-3 hover:bg-accent/50 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className={`mt-1 p-1 rounded-full ${alert.type === 'down' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
                                  {alert.type === 'down' ? <XCircle size={10} /> : <CheckCircle2 size={10} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold truncate">{(alert as any).monitor_name}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {alert.type === 'down' ? 'Monitor is down!' : 'Monitor has recovered.'}
                                  </p>
                                  <p className="text-[8px] text-muted-foreground mt-1 uppercase">
                                    {new Date(alert.triggered_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {allAlerts.length > 0 && (
                      <div className="p-2 border-t text-center">
                        <button className="text-[10px] font-bold text-primary hover:underline">View All History</button>
                      </div>
                    )}

                    {/* ── Setup CTA inside dropdown ───────────────── */}
                    {!hasActiveChannel && (
                      <div className="border-t px-4 py-3 bg-amber-500/5">
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mb-1 flex items-center gap-1">
                          <Bell size={10} className="animate-bounce" />
                          You won't be alerted when monitors go down
                        </p>
                        <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
                          Connect Slack, Discord, Email, or a Webhook to get real-time alerts.
                        </p>
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            navigate('/dashboard/settings?tab=notifications');
                          }}
                          className="w-full text-[11px] font-bold bg-amber-500 text-white py-1.5 rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Set Up Notifications →
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* ── Profile Dropdown ─────────────────────────────────── */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-accent transition-colors border border-transparent hover:border-border"
              aria-label="Open profile menu"
            >
              <img 
                src={user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-border bg-muted"
              />
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDropdown(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border bg-card shadow-lg z-20 py-1"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link 
                        to="/dashboard/settings" 
                        onClick={() => setShowDropdown(false)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <User size={14} /> Profile
                      </Link>
                      <Link 
                        to="/dashboard/settings" 
                        onClick={() => setShowDropdown(false)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <Settings size={14} /> Settings
                      </Link>
                      {/* Notification shortcut - only visible when no channels */}
                      {!hasActiveChannel && (
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            navigate('/dashboard/settings?tab=notifications');
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-colors flex items-center gap-2"
                        >
                          <Bell size={14} className="animate-bounce" /> Enable Notifications
                        </button>
                      )}
                    </div>
                    <div className="border-t py-1">
                      <button 
                        onClick={() => logout()}
                        className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

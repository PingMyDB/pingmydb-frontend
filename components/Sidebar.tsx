
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  History, 
  CreditCard, 
  Settings, 
  Database,
  Menu,
  X,
  ShieldCheck,
  Users,
  Globe,
  Code2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Activity, label: 'Monitors', path: '/dashboard/monitors' },
  { icon: Users, label: 'Team', path: '/dashboard/team' },
  { icon: Globe, label: 'Status Page', path: '/dashboard/status' },
  { icon: AlertTriangle, label: 'Incident Manager', path: '/dashboard/incidents' },
  { icon: Code2, label: 'Developer API', path: '/dashboard/api-keys' },
  { icon: History, label: 'Logs', path: '/dashboard/logs' },
  { icon: CreditCard, label: 'Pricing & Plans', path: '/dashboard/billing' }, // Path /dashboard/billing now maps to PricingPage in App.tsx
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transition-transform duration-300
        lg:sticky lg:translate-x-0 lg:flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section - Fixed */}
          <div className="p-6 flex items-center gap-2 border-b lg:border-none">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Database size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">PingMyDb</span>
          </div>

          {/* Navigation Section - Scrollable internally if needed */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Main Menu</p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                `}
                onClick={() => onClose()}
              >
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            ))}

            {user?.role === 'admin' && (
              <div className="pt-6">
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Admin Control</p>
                <NavLink
                  to="/dashboard/admin"
                  end
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-1
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                  `}
                  onClick={() => onClose()}
                >
                  <ShieldCheck size={18} />
                  <span className="font-medium text-sm">System Stats</span>
                </NavLink>
                <NavLink
                  to="/dashboard/admin/users"
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                  `}
                  onClick={() => onClose()}
                >
                  <Users size={18} />
                  <span className="font-medium text-sm">Manage Users</span>
                </NavLink>
              </div>
            )}
          </nav>

          {/* Footer Section - Fixed at bottom */}
          <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
            <div className="p-4 rounded-xl bg-accent/30 border border-border/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Support</p>
              <Link to="/docs" className="text-xs font-semibold hover:text-primary transition-colors flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                 Documentation
              </Link>
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-medium">v1.2.0-stable</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


import React, { useEffect, useMemo, useRef } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  TrendingUp,
  ChevronRight,
  Database,
  Plus,
  RefreshCw,
  Zap,
  Globe,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMonitorStore } from '../store/monitorStore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../src/config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Filler,
  Legend
);

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  subValue?: string; 
  icon: any; 
  color: string;
  delay?: number;
  statusIcon?: React.ReactNode;
}> = ({ title, value, subValue, icon: Icon, color, delay = 0, statusIcon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    transition={{ delay }}
    className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between group cursor-default hover:border-primary/50 transition-colors"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">{title}</span>
      <div className={`p-2.5 rounded-xl transition-all group-hover:scale-110 shadow-sm ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
        {statusIcon && <span className="mb-1">{statusIcon}</span>}
      </div>
      {subValue && (
        <p className="text-[11px] text-muted-foreground mt-1 font-semibold flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          {subValue}
        </p>
      )}
    </div>
  </motion.div>
);

// Plan-based available chart ranges
const PLAN_RANGES: Record<string, { label: string; hours: number }[]> = {
  free:       [{ label: '24h', hours: 24 }],
  student:    [{ label: '24h', hours: 24 }, { label: '3d', hours: 72 }],
  pro:        [{ label: '24h', hours: 24 }, { label: '7d', hours: 168 }, { label: '15d', hours: 360 }],
  team: [{ label: '24h', hours: 24 }, { label: '7d', hours: 168 }, { label: '30d', hours: 720 }],
};

const UptimeChart: React.FC<{ activeWorkspace: number | null, activeMonitorId: number | null, plan: string }> = ({ activeWorkspace, activeMonitorId, plan }) => {
  const { fetchStatsHistory } = useMonitorStore();
  const [history, setHistory] = React.useState<{ hour: string; uptime_pct: number; avg_latency: number }[]>([]);
  const [view, setView] = React.useState<'uptime' | 'latency'>('uptime');
  const availableRanges = PLAN_RANGES[plan] || PLAN_RANGES.free;
  const [selectedRange, setSelectedRange] = React.useState(availableRanges[0]);

  useEffect(() => {
    // Reset to first range if plan changes
    setSelectedRange(availableRanges[0]);
  }, [plan]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStatsHistory(activeWorkspace || undefined, activeMonitorId || undefined, selectedRange.hours);
        setHistory(data);
      } catch (err) {
        console.error('Failed to load chart data:', err);
      }
    };
    loadData();
    const timer = setInterval(loadData, 60000);
    return () => clearInterval(timer);
  }, [fetchStatsHistory, activeWorkspace, activeMonitorId, selectedRange]);

  const chartLabels = history.map(h => {
    const d = new Date(h.hour);
    // For ranges <= 48h show hour ticks, otherwise show date
    if (selectedRange.hours <= 48) {
      return d.getHours().toString().padStart(2, '0') + ':00';
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  });

  const uptimeData = history.map(h => h.uptime_pct);
  const latencyData = history.map(h => h.avg_latency);

  const chartData: ChartData<'line'> = {
    labels: chartLabels,
    datasets: [{
      fill: true,
      label: view === 'uptime' ? 'Uptime' : 'Latency',
      data: view === 'uptime' ? uptimeData : latencyData,
      borderColor: view === 'uptime' ? '#10b981' : '#f59e0b', // Brighter Green (Emerald 500)
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return undefined;
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        if (view === 'uptime') {
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
          gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
        }
        return gradient;
      },
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: view === 'uptime' ? '#10b981' : '#f59e0b',
      pointBorderColor: 'rgba(255,255,255,0.8)',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: view === 'uptime' ? '#10b981' : '#f59e0b',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 3,
      borderWidth: 3,
    }],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#0f172a', // slate-900
        titleColor: '#94a3b8',
        titleFont: { size: 10, weight: 'bold' },
        bodyColor: '#f8fafc',
        bodyFont: { size: 13, weight: 'bold' },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: { 
          title: (items) => `TIME: ${items[0].label}`,
          label: (context) => `⚡ ${context.parsed.y}${view === 'uptime' ? '%' : 'ms'} ${view === 'uptime' ? 'Uptime' : 'Latency'}` 
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 10, weight: 'bold' } }
      },
      y: {
        min: view === 'uptime' ? 0 : undefined,
        max: view === 'uptime' ? 100 : undefined,
        grid: { color: 'rgba(203, 213, 225, 0.1)' },
        ticks: { 
          stepSize: view === 'uptime' ? 25 : undefined, 
          color: '#64748b', 
          font: { size: 10, weight: 'bold' },
          callback: (value) => `${value}${view === 'uptime' ? '%' : 'ms'}`
        }
      }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 bg-accent/50 p-1 rounded-xl">
          <button 
            onClick={() => setView('uptime')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'uptime' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:bg-background/50'}`}
          >
            Uptime
          </button>
          <button 
            onClick={() => setView('latency')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'latency' ? 'bg-background text-amber-500 shadow-sm' : 'text-muted-foreground hover:bg-background/50'}`}
          >
            Latency
          </button>
        </div>
        <div className="flex gap-1 bg-accent/30 p-1 rounded-lg">
          {availableRanges.map((range) => (
             <button 
              key={range.label}
              onClick={() => setSelectedRange(range)}
              className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                selectedRange.label === range.label
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:bg-background/30'
              }`}
             >
               {range.label}
             </button>
          ))}
        </div>
      </div>
      <div className="h-[300px] w-full">
        {history.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
            Gathering 24-hour insights...
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { monitors, fetchMonitors } = useMonitorStore();
  const { user } = useAuth();
  const [joinedTeams, setJoinedTeams] = React.useState<any[]>([]);
  const [activeWorkspace, setActiveWorkspace] = React.useState<number | null>(null); // null = user's own workspace
  const [activeMonitorId, setActiveMonitorId] = React.useState<number | null>(null);

  useEffect(() => {
    fetchMonitors();
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('pmdb_token');
        const res = await fetch(`${API_BASE_URL}/api/teams/joined`, { 
          headers: { 'token': token || '' } 
        });
        const data = await res.json();
        if (res.ok) setJoinedTeams(data);
      } catch (e) {
        console.error('Failed to fetch teams:', e);
      }
    };
    fetchTeams();
    const timer = setInterval(fetchMonitors, 15000);
    return () => clearInterval(timer);
  }, [fetchMonitors]);

  // Filter monitors based on active workspace
  const workspaceMonitors = useMemo(() => {
    if (activeWorkspace === null) {
      // Show user's own monitors
      return monitors.filter(m => m.owner_email === user?.email);
    } else {
      // Show specific team owner's monitors
      const team = joinedTeams.find(t => t.owner_id === activeWorkspace);
      if (team) {
        return monitors.filter(m => m.owner_email === team.owner_email);
      }
      return [];
    }
  }, [monitors, activeWorkspace, joinedTeams, user?.email]);

  const stats = useMemo(() => {
    const online = workspaceMonitors.filter(m => m.status === 'online').length;
    const offline = workspaceMonitors.filter(m => m.status === 'offline').length;
    const avgLatency = workspaceMonitors.length 
      ? Math.round(workspaceMonitors.reduce((acc, m) => acc + (m.avg_latency || 0), 0) / workspaceMonitors.length) 
      : 0;
    const lastLatency = workspaceMonitors.length
      ? Math.round(workspaceMonitors.reduce((acc, m) => acc + (m.latency || 0), 0) / workspaceMonitors.length)
      : 0;
    const uptimePct = workspaceMonitors.length ? Math.round((online / workspaceMonitors.length) * 100 * 10) / 10 : 100;

    return [
      { 
        title: 'Active Monitors', 
        value: online, 
        subValue: `out of ${workspaceMonitors.length} total`, 
        icon: Database, 
        color: 'bg-primary/10 text-primary',
        statusIcon: <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-2" />
      },
      { 
        title: 'Uptime', 
        value: workspaceMonitors.length ? `${uptimePct}%` : 'No data yet', 
        subValue: workspaceMonitors.length ? 'Last 24 hours' : 'Add a monitor to start', 
        icon: CheckCircle2, 
        color: 'bg-emerald-500/10 text-emerald-500',
        statusIcon: workspaceMonitors.length ? <span className="text-emerald-500 text-lg">✓</span> : undefined
      },
      { 
        title: 'Down', 
        value: offline, 
        subValue: 'Requires attention', 
        icon: AlertCircle, 
        color: 'bg-destructive/10 text-destructive',
        statusIcon: offline > 0 ? <div className="w-3 h-3 rounded-full bg-destructive animate-ping ml-2" /> : <div className="w-2 h-2 rounded-full bg-muted ml-2" />
      },
      { 
        title: 'Avg Latency', 
        value: workspaceMonitors.length ? `${avgLatency}ms` : 'No data yet', 
        subValue: workspaceMonitors.length ? `Last ping: ${lastLatency}ms` : 'Add a monitor to start', 
        icon: Zap, 
        color: 'bg-amber-500/10 text-amber-500',
        statusIcon: workspaceMonitors.length ? <span className="text-amber-500 text-lg">⚡</span> : undefined
      },
    ];
  }, [workspaceMonitors]);

  const getTypeIcon = (type: string) => {
    if (type === 'postgres') return '🐘';
    if (type === 'mongodb') return '🍃';
    if (type === 'mysql') return '🐬';
    return '🗄️';
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">System Pulse</h1>
          <p className="text-muted-foreground font-medium mt-1">Hello, {user?.name.split(' ')[0]}. Here's your infrastructure status.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Workspace Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2.5 bg-card border rounded-2xl text-sm font-bold shadow-sm hover:border-primary/50 transition-all outline-none">
              <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-primary">
                <Database size={12} />
              </div>
              <span>
                {activeWorkspace === null 
                  ? `${user?.name.split(' ')[0]} (Personal)` 
                  : joinedTeams.find(t => t.owner_id === activeWorkspace)?.owner_name + ' (Shared)'
                }
              </span>
              <ChevronRight size={14} className="text-muted-foreground group-hover:rotate-90 transition-transform" />
            </button>
            <div className="absolute right-0 mt-2 w-64 bg-card border rounded-2xl shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 translate-y-2 group-hover:translate-y-0">
               <p className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Switch Workspace</p>
               <button 
                onClick={() => setActiveWorkspace(null)}
                className={`w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-accent flex items-center justify-between group/item ${activeWorkspace === null ? 'bg-primary/5 text-primary' : ''}`}
               >
                 <span className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   {user?.name} (Personal)
                 </span>
                 {activeWorkspace === null && <CheckCircle2 size={14} />}
               </button>
               {joinedTeams.map(team => (
                 <button 
                  key={team.owner_id}
                  onClick={() => setActiveWorkspace(team.owner_id)}
                  className={`w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-accent flex items-center justify-between group/item ${activeWorkspace === team.owner_id ? 'bg-primary/5 text-primary' : ''}`}
                 >
                   <span className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     {team.owner_name} (Shared)
                   </span>
                   {activeWorkspace === team.owner_id && <CheckCircle2 size={14} />}
                 </button>
                ))}
            </div>
          </div>
          
          {/* Monitor Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2.5 bg-card border rounded-2xl text-sm font-bold shadow-sm hover:border-primary/50 transition-all outline-none min-w-[180px]">
              <div className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Activity size={12} />
              </div>
              <span className="truncate max-w-[120px]">
                {activeMonitorId === null 
                  ? 'All Monitors' 
                  : workspaceMonitors.find(m => m.id === activeMonitorId)?.name || 'Select Monitor'
                }
              </span>
              <ChevronRight size={14} className="text-muted-foreground group-hover:rotate-90 transition-transform ml-auto" />
            </button>
            <div className="absolute right-0 mt-2 w-64 bg-card border rounded-2xl shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 translate-y-2 group-hover:translate-y-0 max-h-[300px] overflow-y-auto custom-scrollbar text-left">
               <p className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Filter by Monitor</p>
               <button 
                onClick={() => setActiveMonitorId(null)}
                className={`w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-accent flex items-center justify-between group/item ${activeMonitorId === null ? 'bg-primary/5 text-primary' : ''}`}
               >
                 <span className="flex items-center gap-2 text-left">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                   All Monitors
                 </span>
                 {activeMonitorId === null && <CheckCircle2 size={14} />}
               </button>
               {workspaceMonitors.map(monitor => (
                 <button 
                  key={monitor.id}
                  onClick={() => setActiveMonitorId(monitor.id)}
                  className={`w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-accent flex items-center justify-between group/item ${activeMonitorId === monitor.id ? 'bg-primary/5 text-primary' : ''}`}
                 >
                   <span className="flex items-center gap-2 truncate text-left">
                     <div className={`w-2 h-2 rounded-full ${monitor.status === 'online' ? 'bg-emerald-500' : 'bg-destructive'}`} />
                     {monitor.name}
                   </span>
                   {activeMonitorId === monitor.id && <CheckCircle2 size={14} />}
                 </button>
               ))}
            </div>
          </div>

          <Link 
            to="/dashboard/monitors" 
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>New Monitor</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Uptime Overview</h3>
              <p className="text-xs text-muted-foreground">Calculated across all active monitors</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-xs font-semibold">
              <TrendingUp size={14} className="text-green-500" /> Live
            </div>
          </div>
          <UptimeChart activeWorkspace={activeWorkspace} activeMonitorId={activeMonitorId} plan={user?.plan || 'free'} />
        </div>

        {/* Active Monitors */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Active Monitors</h3>
          <div className="space-y-4">
            {workspaceMonitors.slice(0, 5).map((monitor) => (
              <div key={monitor.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`shrink-0 w-2 h-2 rounded-full ${monitor.status === 'online' ? 'bg-green-500 animate-pulse' : monitor.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold truncate">{getTypeIcon(monitor.type)} {monitor.name}</p>
                        {monitor.owner_email !== user?.email && (
                            <span className="text-[8px] bg-primary/10 text-primary px-1 py-0 rounded font-black uppercase">Team</span>
                        )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                        {monitor.provider} • {monitor.type} {monitor.owner_email !== user?.email && `• ${monitor.owner_name}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                   <span className="text-xs font-mono text-muted-foreground">{monitor.latency || 0}ms</span>
                   <Link to="/dashboard/monitors" className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-accent">
                     <ChevronRight size={14} />
                   </Link>
                </div>
              </div>
            ))}
            {monitors.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl border-muted/20">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <Plus size={24} />
                </div>
                <h4 className="font-bold text-sm mb-1">No monitors configured yet</h4>
                <p className="text-[10px] text-muted-foreground mb-6">Start monitoring your systems in seconds</p>
                <Link 
                  to="/dashboard/monitors" 
                  className="bg-primary text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-block"
                >
                  Create Monitor
                </Link>
              </div>
            )}
          </div>
          {monitors.length > 0 && (
            <Link to="/dashboard/monitors" className="mt-8 block w-full py-3 text-center text-xs font-bold bg-accent/50 rounded-xl hover:bg-accent transition-all group">
              View All Monitors
              <ChevronRight size={14} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/5 to-transparent flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <TrendingUp size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold">Plan: {user?.plan?.toUpperCase()}</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {user?.plan === 'free' ? 'Upgrade to Pro for faster intervals and more monitors.' : 'You are on a premium plan.'}
              <Link to="/dashboard/billing" className="text-primary cursor-pointer ml-1 inline-flex items-center gap-0.5 font-bold">Details <ChevronRight size={12} /></Link>
            </p>
          </div>
        </div>
        <div className="p-6 rounded-2xl border bg-card/50 flex items-start gap-4 hover:border-emerald-500/50 transition-colors">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
            <CheckCircle2 size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold flex items-center justify-between">
              System Status
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </h4>
            <div className="mt-3 space-y-2">
               <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Worker Cluster</span>
                  <span className="text-emerald-500 border-b border-emerald-500/20">● Operational</span>
               </div>
               <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>In-Memory Cache</span>
                  <span className="text-emerald-500 border-b border-emerald-500/20">● Operational</span>
               </div>
               <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>API Services</span>
                  <span className="text-emerald-500 border-b border-emerald-500/20">● Operational</span>
               </div>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-2xl border bg-card/50 flex items-start gap-4 hover:border-amber-500/50 transition-colors">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold">Alert Rules</h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
              Intelligent thresholding active. Alerts trigger after <span className="text-amber-500 font-bold">3 consecutive</span> failures.
              <Link to="/dashboard/logs" className="text-primary hover:underline ml-1 inline-flex items-center gap-0.5 font-bold">Uptime History <ChevronRight size={12} /></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

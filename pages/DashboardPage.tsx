
import React, { useEffect, useMemo, useRef } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  TrendingUp,
  ChevronRight,
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
}> = ({ title, value, subValue, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div>
      <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
      {subValue && <p className="text-xs text-muted-foreground mt-1 font-medium">{subValue}</p>}
    </div>
  </motion.div>
);

const UptimeChart: React.FC<{ activeWorkspace: number | null }> = ({ activeWorkspace }) => {
  const { fetchStatsHistory } = useMonitorStore();
  const [history, setHistory] = React.useState<{ hour: string; uptime_pct: number; avg_latency: number }[]>([]);
  const [view, setView] = React.useState<'uptime' | 'latency'>('uptime');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStatsHistory(activeWorkspace || undefined);
        setHistory(data);
      } catch (err) {
        console.error('Failed to load chart data:', err);
      }
    };
    loadData();
    const timer = setInterval(loadData, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [fetchStatsHistory, activeWorkspace]);

  const chartLabels = history.map(h => {
    const d = new Date(h.hour);
    return d.getHours().toString().padStart(2, '0') + ':00';
  });

  const uptimeData = history.map(h => h.uptime_pct);
  const latencyData = history.map(h => h.avg_latency);

  const chartData: ChartData<'line'> = {
    labels: chartLabels,
    datasets: [{
      fill: true,
      label: view === 'uptime' ? 'Uptime %' : 'Latency (ms)',
      data: view === 'uptime' ? uptimeData : latencyData,
      borderColor: view === 'uptime' ? 'rgb(59, 130, 246)' : 'rgb(245, 158, 11)',
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return undefined;
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        if (view === 'uptime') {
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
          gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
        }
        return gradient;
      },
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: view === 'uptime' ? 'rgb(59, 130, 246)' : 'rgb(245, 158, 11)',
      pointBorderColor: '#fff',
      pointHoverRadius: 6,
      pointHoverBackgroundColor: view === 'uptime' ? 'rgb(59, 130, 246)' : 'rgb(245, 158, 11)',
      pointHoverBorderColor: '#fff',
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
        backgroundColor: '#1e293b', // Slate 800 for a consistent premium dark tooltip
        titleColor: '#f8fafc', // Slate 50
        bodyColor: '#cbd5e1', // Slate 300
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: { 
          label: (context) => ` ${context.parsed.y}${view === 'uptime' ? '%' : 'ms'} ${view === 'uptime' ? 'Uptime' : 'Latency'}` 
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'hsl(var(--muted-foreground))', font: { size: 11 } }
      },
      y: {
        min: view === 'uptime' ? 0 : undefined,
        max: view === 'uptime' ? 100 : undefined,
        grid: { color: 'hsla(var(--border), 0.5)' },
        ticks: { 
          stepSize: view === 'uptime' ? 20 : undefined, 
          color: 'hsl(var(--muted-foreground))', 
          font: { size: 11 },
          callback: (value) => `${value}${view === 'uptime' ? '%' : 'ms'}`
        }
      }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button 
          onClick={() => setView('uptime')}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'uptime' ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground hover:bg-accent/80'}`}
        >
          Uptime
        </button>
        <button 
          onClick={() => setView('latency')}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'latency' ? 'bg-amber-500 text-white' : 'bg-accent text-muted-foreground hover:bg-accent/80'}`}
        >
          Latency
        </button>
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
      { title: 'Active Monitors', value: online, subValue: `out of ${workspaceMonitors.length} total`, icon: Activity, color: 'bg-primary/10 text-primary' },
      { title: 'Uptime', value: `${uptimePct}%`, subValue: 'Current snapshot', icon: CheckCircle2, color: 'bg-green-500/10 text-green-500' },
      { title: 'Down', value: offline, subValue: 'Monitors currently offline', icon: AlertCircle, color: 'bg-destructive/10 text-destructive' },
      { title: 'Avg Latency', value: `${avgLatency}ms`, subValue: `Last: ${lastLatency}ms`, icon: Clock, color: 'bg-yellow-500/10 text-yellow-500' },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Here's what's happening with your databases today.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Workspace Tabs */}
          {joinedTeams.length > 0 && (
            <>
              <button
                onClick={() => setActiveWorkspace(null)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeWorkspace === null
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-card border hover:bg-accent'
                }`}
              >
                Your Overview
              </button>
              {joinedTeams.map((team) => (
                <button
                  key={team.owner_id}
                  onClick={() => setActiveWorkspace(team.owner_id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeWorkspace === team.owner_id
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-card border hover:bg-accent'
                  }`}
                >
                  {team.owner_name}'s Overview
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    {team.role}
                  </span>
                </button>
              ))}
            </>
          )}
          <Link 
            to="/dashboard/monitors" 
            className="inline-flex items-center justify-center rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent transition-colors"
          >
            View All Monitors
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
          <UptimeChart activeWorkspace={activeWorkspace} />
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
              <div className="text-center py-8">
                <p className="text-xs text-muted-foreground mb-4">No monitors configured yet.</p>
                <Link to="/dashboard/monitors" className="text-xs font-bold text-primary">Create your first monitor</Link>
              </div>
            )}
          </div>
          <Link to="/dashboard/monitors" className="mt-8 block w-full py-2 text-center text-xs font-semibold bg-accent rounded-lg hover:bg-accent/80 transition-colors">
            View All Monitors
          </Link>
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
        <div className="p-6 rounded-xl border bg-card flex items-start gap-4">
          <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold">System Status</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Worker and Redis are operational. Pings running on schedule.
            </p>
          </div>
        </div>
        <div className="p-6 rounded-xl border bg-card flex items-start gap-4">
          <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold">Alerts</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Alerts trigger after 3 consecutive failures.
              <Link to="/dashboard/logs" className="text-primary cursor-pointer ml-1 inline-flex items-center gap-0.5 font-bold">View Logs <ChevronRight size={12} /></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

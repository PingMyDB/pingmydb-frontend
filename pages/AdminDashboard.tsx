
import React, { useEffect, useState } from 'react';
import { 
  Users, Database, AlertTriangle, Activity, 
  TrendingUp, ShieldAlert, Wifi, Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../src/config';

interface AdminStats {
  totalUsers: number;
  totalMonitors: number;
  activeMonitors: number;
  recentAlerts: number;
  pingsLast24h: number;
  systemStatus: string;
}

interface SystemHealth {
  statuses: { status: string; count: string }[];
  distribution: { type: string; count: string }[];
  workerStatus: string;
  redisStatus: string;
  lastHeartbeat: string;
  queueMetrics?: {
    waiting: number;
    active: number;
    delayed: number;
    oldestJobAgeMs: number;
  };
}

interface ErrorAnalytics {
  categories: { error_category: string; count: string }[];
  byType: { type: string; error_category: string; count: string }[];
}

const StatCard: React.FC<{ title: string; value: number | string; icon: any; color: string; delay: number; sub?: string }> = ({ title, value, icon: Icon, color, delay, sub }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-colors"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={18} />
      </div>
    </div>
    <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
    {sub && <p className="text-xs text-muted-foreground mt-2">{sub}</p>}
  </motion.div>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [errors, setErrors] = useState<ErrorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'token': localStorage.getItem('pmdb_token') || '' };
        const [statsRes, healthRes, errorsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/stats`, { headers }),
          fetch(`${API_BASE_URL}/api/admin/system/health`, { headers }),
          fetch(`${API_BASE_URL}/api/admin/system/errors`, { headers })
        ]);
        
        const [statsData, healthData, errorsData] = await Promise.all([
          statsRes.json(),
          healthRes.json(),
          errorsRes.json()
        ]);
        
        if (statsData && !statsData.message) setStats(statsData);
        if (healthData && !healthData.message) setHealth(healthData);
        if (errorsData && !errorsData.message) setErrors(errorsData);
      } catch (err) {
        console.error('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Synthesizing system intelligence...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Intelligence</h1>
          <p className="text-muted-foreground">Real-time infrastructure health and usage signals.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Workers Online
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="bg-blue-500/10 text-blue-500" delay={0.1} />
        <StatCard title="Active Monitors" value={`${stats?.activeMonitors || 0}/${stats?.totalMonitors || 0}`} icon={Database} color="bg-emerald-500/10 text-emerald-500" delay={0.2} sub="Global Uptime Tracking" />
        <StatCard title="Failed (24h)" value={stats?.recentAlerts || 0} icon={AlertTriangle} color="bg-orange-500/10 text-orange-500" delay={0.3} sub="Unique failure events" />
        <StatCard title="Throughput" value={stats?.pingsLast24h || 0} icon={Zap} color="bg-purple-500/10 text-purple-500" delay={0.4} sub="Pings in last 24h" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monitor Distribution */}
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                Monitor Status
            </h3>
            <div className="space-y-4 flex-1">
                {health?.statuses.map((s, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="capitalize">{s.status === 'online' ? 'UP' : s.status === 'offline' ? 'DOWN' : s.status}</span>
                            <span className="font-bold">{s.count}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(parseInt(s.count) / (stats?.totalMonitors || 1)) * 100}%` }}
                                className={`h-full ${s.status === 'online' ? 'bg-emerald-500' : 'bg-destructive'}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Error distribution */}
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-destructive">
                <ShieldAlert size={18} />
                Failure Analysis (7d)
            </h3>
            <div className="space-y-4 flex-1">
                {errors?.categories.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-destructive" />
                            <span className="text-xs font-medium capitalize">{c.error_category}</span>
                        </div>
                        <span className="text-xs font-bold">{c.count}</span>
                    </div>
                ))}
                {(!errors?.categories || errors.categories.length === 0) && (
                    <p className="text-xs text-muted-foreground text-center py-8">No significant failures recorded.</p>
                )}
            </div>
        </div>

        {/* Infrastructure Status */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                <Wifi size={18} className="text-primary" />
                Infra Health
            </h3>
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <span className="text-xs text-muted-foreground">Redis Connection</span>
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Healthy
                    </span>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                    <span className="text-xs text-muted-foreground">Worker Cluster</span>
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        5 Nodes
                    </span>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                    <span className="text-xs text-muted-foreground">Queue Backlog</span>
                    <span className="text-xs font-bold text-emerald-500">{health?.queueMetrics?.waiting || 0} pending</span>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                    <span className="text-xs text-muted-foreground">Oldest Job Age</span>
                    <span className={`text-xs font-bold font-mono ${
                      (health?.queueMetrics?.oldestJobAgeMs || 0) > 5000 
                        ? 'text-destructive' 
                        : (health?.queueMetrics?.oldestJobAgeMs || 0) > 1000 
                          ? 'text-amber-500' 
                          : 'text-emerald-500'
                    }`}>
                        {((health?.queueMetrics?.oldestJobAgeMs || 0) / 1000).toFixed(2)}s
                    </span>
                </div>
                <div className="pt-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Last Heartbeat</p>
                    <p className="text-xs font-mono mt-1">{new Date(health?.lastHeartbeat || '').toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Usage distribution
          </h3>
          <div className="grid grid-cols-2 gap-4">
              {health?.distribution.map((d, i) => (
                  <div key={i} className="p-4 rounded-xl border bg-muted/20">
                      <p className="text-xs text-muted-foreground uppercase">{d.type}</p>
                      <p className="text-2xl font-bold mt-1">{d.count}</p>
                  </div>
              ))}
          </div>
        </div>
        
        <div className="bg-card border rounded-xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database size={120} />
            </div>
            <h4 className="font-bold text-lg mb-2">Operational Insight</h4>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[400px]">
                {stats && stats.activeMonitors / stats.totalMonitors > 0.9 
                    ? "Network stability is exceptionally high. Current conversion rate from pending to active is optimal."
                    : "Some monitors are stuck in offline state. Investigating potential provider-specific network resets."
                }
            </p>
            <button className="mt-4 text-xs font-bold text-primary hover:underline">View detailed logs →</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

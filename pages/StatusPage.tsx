import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  Zap,
  RefreshCw,
  Globe,
  AlertTriangle,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../src/config';

interface MonitorStatus {
  id: number;
  name: string;
  status: string;
  latency: number;
  last_ping_at: string;
  avg_latency: number;
}

interface Incident {
  id: number;
  title: string;
  status: string;
  severity: string;
  created_at: string;
  latest_message: string;
}

interface StatusData {
  organization: string;
  monitors: MonitorStatus[];
  incidents: Incident[];
}

const StatusPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState<StatusData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const fetchStatus = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/public/status/${slug}`);
            const json = await res.json();
            
            if (!res.ok) throw new Error(json.message || "Failed to load status page");
            
            setData(json);
            setLastRefresh(new Date());
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // Auto refresh every 30s
        return () => clearInterval(interval);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse font-medium">Retrieving real-time infrastructure data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
                <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
                    <XCircle size={40} />
                </div>
                <h1 className="text-2xl font-black mb-2 tracking-tight">Status Page Unavailable</h1>
                <p className="text-muted-foreground max-w-md mb-8">{error}</p>
                <Link to="/" className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                    Back to PingMyDb <ExternalLink size={14} />
                </Link>
            </div>
        );
    }

    const allOperational = data?.monitors.every(m => m.status === 'online');
    const someOperational = data?.monitors.some(m => m.status === 'online');

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b bg-card/30 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/favicon-96x96.png" className="w-8 h-8 rounded-lg" alt="Logo" />
                        <span className="font-bold text-xl tracking-tighter">
                            <span className="text-primary">Ping</span><span className="text-foreground">MyDb</span>
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/20 px-3 py-1.5 rounded-full">
                        <span className="flex items-center gap-1.5 relative">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Live Updates
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-12">
                {/* Global Status Banner */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border shadow-2xl overflow-hidden relative group
                        ${allOperational 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                            : someOperational 
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                                : 'bg-destructive/10 border-destructive/20 text-destructive'}
                    `}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center gap-6 relative z-10 text-center md:text-left">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg
                            ${allOperational ? 'bg-emerald-500 text-white' : someOperational ? 'bg-amber-500 text-white' : 'bg-destructive text-white'}
                        `}>
                            {allOperational ? <CheckCircle2 size={40} /> : someOperational ? <Activity size={40} /> : <XCircle size={40} />}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight mb-1">
                                {allOperational ? 'All Systems Operational' : someOperational ? 'Partial System Outage' : 'Major System Outage'}
                            </h2>
                            <p className="text-sm font-medium opacity-80 uppercase tracking-widest">
                                Status as of {lastRefresh.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    <div className="text-center md:text-right relative z-10">
                        <div className="text-sm font-bold opacity-70 mb-1">Infrastructure Health</div>
                        <div className="text-4xl font-black">
                            {allOperational ? '100%' : Math.round((data?.monitors.filter(m => m.status === 'online').length || 0) / (data?.monitors.length || 1) * 100) + '%'}
                        </div>
                    </div>
                </motion.div>

                {/* Incident Announcements */}
                <AnimatePresence>
                    {data?.incidents && data.incidents.length > 0 && (
                        <div className="mb-12 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                                <AlertCircle size={14} className="text-destructive" /> Active Incidents
                            </h3>
                            {data.incidents.map((incident) => (
                                <motion.div 
                                    key={incident.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-6 rounded-2xl border ${incident.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' : 'bg-orange-500/10 border-orange-500/20 shadow-lg shadow-orange-500/5'}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${incident.severity === 'critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                                                {incident.severity}
                                            </div>
                                            <h4 className="text-lg font-black">{incident.title}</h4>
                                        </div>
                                        <span className="text-xs font-bold opacity-60 flex items-center gap-1">
                                            <Clock size={12} /> {new Date(incident.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-xl bg-background/40 border-l-4 border-l-primary backdrop-blur-sm">
                                        <div className="pt-0.5">
                                            <MessageSquare size={16} className="text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-primary">{incident.status}</div>
                                            <p className="text-sm font-medium leading-relaxed opacity-90 italic">
                                                "{incident.latest_message}"
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* Organization Header */}
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Service Overview</h3>
                        <h1 className="text-4xl font-black tracking-tight">{data?.organization}</h1>
                    </div>
                    <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full border">
                        <Globe size={12} />
                        Global Monitoring Active
                    </div>
                </div>

                {/* Monitor List */}
                <div className="grid gap-4">
                    <AnimatePresence mode="popLayout">
                        {data?.monitors.length === 0 && (
                            <div className="text-center py-12 bg-card border rounded-xl border-dashed">
                                <Activity className="mx-auto text-muted-foreground mb-4 opacity-20" size={40} />
                                <p className="text-muted-foreground font-medium">No active monitors are currently being tracked for this organization.</p>
                            </div>
                        )}
                        {data?.monitors.map((monitor, index) => (
                            <motion.div
                                key={monitor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card border rounded-xl p-5 hover:border-primary/30 transition-all shadow-sm flex flex-col md:flex-row items-center gap-6 group"
                            >
                                <div className="flex items-center gap-4 flex-1 w-full">
                                    <div className={`w-3 h-3 rounded-full shadow-sm
                                        ${monitor.status === 'online' ? 'bg-emerald-500 shadow-emerald-500/50 animate-pulse' : 'bg-destructive shadow-destructive/50'}
                                    `} />
                                    <h4 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">{monitor.name}</h4>
                                </div>

                                <div className="flex items-center gap-8 justify-between w-full md:w-auto">
                                    <div className="flex flex-col items-center md:items-end min-w-[100px]">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Performance</span>
                                        <span className="font-mono font-bold text-sm">
                                            {monitor.status === 'online' ? `${monitor.avg_latency || monitor.latency}ms` : '--'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center md:items-end min-w-[100px]">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Last Check</span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {new Date(monitor.last_ping_at).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center md:items-end min-w-[80px]">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</span>
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md
                                            ${monitor.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}
                                        `}>
                                            {monitor.status === 'online' ? 'Operational' : 'Degraded'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Footer Section */}
                <footer className="mt-20 pt-8 border-t text-center space-y-6">
                    <p className="text-xs font-medium text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        This status page is automatically generated and updated in real-time by <strong>PingMyDb</strong>. 
                        We monitor infrastructure health by performing periodic connectivity checks to the specified database endpoints.
                    </p>

                    {/* Powered by badge — viral marketing on every share */}
                    <Link 
                      to="/" 
                      className="inline-flex flex-col items-center gap-1 group"
                    >
                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border bg-card hover:border-primary/50 transition-all shadow-sm group-hover:shadow-md">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest">
                          Powered by <span className="text-primary">Ping</span><span className="text-foreground">MyDb</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Database monitoring &amp; cold start prevention for developers
                      </span>
                    </Link>
                </footer>
            </main>
        </div>
    );
};

export default StatusPage;


import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Loader2,
  Activity,
  Zap,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Database,
  Terminal,
  Code,
  Equal,
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
  Lock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMonitorStore } from '../store/monitorStore';
import { useAuth } from '../context/AuthContext';
import { MonitorStatus } from '../types';
import { toast } from 'sonner';
import ConfirmationModal from '../components/ConfirmationModal';
import { API_BASE_URL } from '../src/config';

// ─── All interval options ───────────────────────────────────
const ALL_INTERVALS = [
  { label: '5 min',   ms: 300000 },
  { label: '10 min',  ms: 600000 },
  { label: '15 min',  ms: 900000 },
  { label: '30 min',  ms: 1800000 },
  { label: '1 hour',  ms: 3600000 },
  { label: '6 hours', ms: 21600000 },
  { label: '12 hours',ms: 43200000 },
  { label: '1 day',   ms: 86400000 },
  { label: '15 days', ms: 1296000000 },
  { label: '30 days', ms: 2592000000 },
];

const PLAN_MIN_INTERVAL_MS: Record<string, number> = {
  free: 43200000,      // 12 hours
  student: 3600000,    // 1 hour
  pro: 3600000,        // 1 hour
  enterprise: 300000,  // 5 min
};

const MonitorsPage: React.FC = () => {
  const { monitors, isLoading, fetchMonitors, deleteMonitor, addMonitor, manualPing, verifyUri, togglePause } = useMonitorStore();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedTeams, setJoinedTeams] = useState<any[]>([]);
  const [targetOwner, setTargetOwner] = useState<any>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<number | null>(null); // null = user's own workspace

  // Verify state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ ok: boolean; type?: string; provider?: string; latency?: number; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    uri: '',
    interval_ms: 3600000,
    query_type: 'ping',
    custom_query: '',
    expected_value: '',
    comparison_operator: 'equals',
    value_type: 'number',
    target_owner_id: user?.id || null
  });

  // Query Test state
  const [isTestingQuery, setIsTestingQuery] = useState(false);
  const [testQueryResult, setTestQueryResult] = useState<any>(null);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'latency' | 'last_ping'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const plan = (user?.plan as string) || 'free';
  const minIntervalMs = PLAN_MIN_INTERVAL_MS[plan] || 3600000;

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
        } catch (e) {}
    };
    fetchTeams();
    const timer = setInterval(fetchMonitors, 15000);
    return () => clearInterval(timer);
  }, [fetchMonitors]);

  // Filter monitors based on active workspace
  const getActiveWorkspaceMonitors = () => {
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
  };

  const workspaceMonitors = getActiveWorkspaceMonitors();

  const filteredMonitors = workspaceMonitors
    .filter(m =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortedMonitors = filteredMonitors.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'latency':
        comparison = (a.avg_latency || 999999) - (b.avg_latency || 999999);
        break;
      case 'last_ping':
        const timeA = a.last_ping_at ? new Date(a.last_ping_at).getTime() : 0;
        const timeB = b.last_ping_at ? new Date(b.last_ping_at).getTime() : 0;
        comparison = timeA - timeB;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Helper to get user's role for a specific team owner
  const getUserRoleForOwner = (ownerEmail: string) => {
    const team = joinedTeams.find(t => t.owner_email === ownerEmail);
    return team?.role || 'viewer';
  };

  // Helper to check if user can perform action
  const canPauseMonitor = (monitor: any) => {
    if (monitor.owner_email === user?.email) return true;
    const role = getUserRoleForOwner(monitor.owner_email);
    return role === 'admin' || role === 'editor';
  };

  const canDeleteMonitor = (monitor: any) => {
    if (monitor.owner_email === user?.email) return true;
    const role = getUserRoleForOwner(monitor.owner_email);
    return role === 'admin';
  };

  const handleVerify = async () => {
    if (!formData.uri.trim()) {
      toast.error('Please enter a database URI first');
      return;
    }
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const result = await verifyUri(formData.uri);
      setVerifyResult(result);
      if (result.ok) {
        toast.success(`Connected! ${result.type} (${result.provider}) — ${result.latency}ms`);
      } else {
        toast.error(result.message || 'Connection failed');
      }
    } catch (error: any) {
      setVerifyResult({ ok: false, message: error.message });
      toast.error(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTestQuery = async () => {
    if (!verifyResult?.ok) {
        toast.error('Verify database connection first');
        return;
    }
    if (formData.query_type === 'custom' && !formData.custom_query.trim()) {
        toast.error('Enter a custom query first');
        return;
    }

    setIsTestingQuery(true);
    setTestQueryResult(null);
    try {
        const { testQuery } = useMonitorStore.getState();
        const res = await testQuery({
            uri: formData.uri,
            type: verifyResult.type,
            ...formData
        });
        setTestQueryResult(res);
        if (res.ok) {
            toast.success("Query check passed!");
        } else {
            toast.error(res.message || "Query check failed");
        }
    } catch (err: any) {
        toast.error(err.message);
    } finally {
        setIsTestingQuery(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyResult?.ok) {
      toast.error('Please verify your URI before creating a monitor');
      return;
    }
    setIsSubmitting(true);
    try {
      await addMonitor(formData);
      toast.success('Monitor created! First ping queued.');
      setIsModalOpen(false);
      setFormData({ 
          name: '', 
          uri: '', 
          interval_ms: minIntervalMs,
          query_type: 'ping',
          custom_query: '',
          expected_value: '',
          comparison_operator: 'equals',
          value_type: 'number',
          target_owner_id: user?.id || null
      });
      setVerifyResult(null);
      setTestQueryResult(null);
      setTargetOwner(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create monitor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteMonitor(deleteId);
      toast.success('Monitor deleted');
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePause = async (id: number) => {
    try {
      await togglePause(id);
      // fetchMonitors(); // The store updates locally, but fetch to be safe if needed
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePing = async (id: number) => {
    try {
      await manualPing(id);
      toast.info('Ping queued');
      setTimeout(fetchMonitors, 3000);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openModal = () => {
    setFormData({ 
        name: '', 
        uri: '', 
        interval_ms: minIntervalMs, 
        query_type: 'ping',
        custom_query: '',
        expected_value: '',
        comparison_operator: 'equals',
        value_type: 'number',
        target_owner_id: user?.id || null
    });
    setVerifyResult(null);
    setTestQueryResult(null);
    setTargetOwner(null);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    if (status === MonitorStatus.ONLINE) return 'bg-green-500 ring-4 ring-green-500/10';
    if (status === MonitorStatus.OFFLINE) return 'bg-red-500 ring-4 ring-red-500/10';
    if (status === MonitorStatus.PAUSED) return 'bg-slate-400 ring-4 ring-slate-400/10';
    return 'bg-yellow-500 ring-4 ring-yellow-500/10';
  };

  const getStatusText = (status: string) => {
    if (status === MonitorStatus.ONLINE) return 'text-green-600 dark:text-green-400';
    if (status === MonitorStatus.OFFLINE) return 'text-red-600 dark:text-red-400';
    if (status === MonitorStatus.PAUSED) return 'text-slate-500 dark:text-slate-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  const getTypeIcon = (type: string) => {
    if (type === 'postgres') return '🐘';
    if (type === 'mongodb') return '🍃';
    if (type === 'mysql') return '🐬';
    return '🗄️';
  };

  const formatIntervalMs = (ms: number) => {
    if (ms < 60000) return `${ms / 1000}s`;
    if (ms < 3600000) return `${ms / 60000}m`;
    if (ms < 86400000) return `${ms / 3600000}h`;
    return `${ms / 86400000}d`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Monitors</h1>
          <p className="text-muted-foreground">Manage your database health checks.</p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow shadow-primary/20 hover:bg-primary/90 transition-all font-bold"
          aria-label="Create new database monitor"
        >
          <Plus size={18} /> New Monitor
        </button>
      </div>

      {/* Workspace Tabs */}
      {joinedTeams.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveWorkspace(null)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeWorkspace === null
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-card border hover:bg-accent'
            }`}
          >
            Your Monitors
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
              {team.owner_name}'s Monitors
              <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                {team.role}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 flex items-center gap-4 bg-card border rounded-xl p-2 px-4 shadow-sm w-full">
          <Search className="text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Filter monitors..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 bg-card border rounded-xl p-2 px-4 shadow-sm shrink-0 w-full md:w-auto">
          <span className="text-xs font-bold text-muted-foreground uppercase">Sort:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer pr-2"
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="latency">Latency</option>
            <option value="last_ping">Last Ping</option>
          </select>
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 hover:bg-accent rounded-lg transition-colors text-foreground font-bold"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            aria-label={`Current sort order: ${sortOrder}. Click to toggle.`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Name & Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Provider</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Interval</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg Latency</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Ping</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading && monitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Loading monitors...</span>
                  </td>
                </tr>
              ) : sortedMonitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity size={24} className="text-muted-foreground" />
                      </div>
                      <h3 className="font-bold text-lg">No monitors found</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {activeWorkspace === null 
                          ? 'Add your first database monitor to get started.'
                          : 'This workspace has no monitors yet.'}
                      </p>
                      {activeWorkspace === null && (
                        <button onClick={openModal} className="mt-6 text-sm font-bold text-primary hover:underline">
                          Create Monitor
                        </button>
                      )}
                    </div>
                    </td>
                </tr>
              ) : (
                <>
                  {sortedMonitors.map((m) => {
                    const isOwnMonitor = m.owner_email === user?.email;
                    const canPause = isOwnMonitor || canPauseMonitor(m);
                    const canDelete = isOwnMonitor || canDeleteMonitor(m);
                    
                    return (
                      <tr key={m.id} className="hover:bg-accent/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(m.status)}`} />
                            <span className={`text-xs font-bold uppercase ${getStatusText(m.status)}`}>{m.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getTypeIcon(m.type)}</span>
                            <div>
                              <div className="text-sm font-bold">{m.name}</div>
                              <p className="text-xs text-muted-foreground">{m.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-xs font-medium border border-border capitalize">
                            {m.provider}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-muted-foreground">
                            Every {formatIntervalMs(m.interval_ms)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className={`text-sm font-mono font-bold ${m.avg_latency && m.avg_latency > 500 ? 'text-yellow-600' : 'text-primary'}`}>
                              {m.avg_latency ? `${m.avg_latency}ms` : '—'}
                            </span>
                            <span className="text-[10px] text-muted-foreground">Last: {m.latency ? `${m.latency}ms` : '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground font-medium">
                          {m.last_ping_at ? new Date(m.last_ping_at).toLocaleTimeString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {canPause && (
                              <button 
                                onClick={() => handlePause(m.id)} 
                                title={m.is_paused ? "Resume Monitor" : "Pause Monitor"} 
                                className={`p-2 rounded-lg transition-colors ${m.is_paused ? 'text-green-600 dark:text-green-400 hover:bg-green-500/10' : 'text-foreground hover:bg-accent'}`}
                                aria-label={m.is_paused ? "Resume monitoring" : "Pause monitoring"}
                              >
                                {m.is_paused ? <Play size={16} /> : <Pause size={16} />}
                              </button>
                            )}
                            {canDelete && (
                              <button 
                                onClick={() => handleDelete(m.id)} 
                                title="Delete Monitor"
                                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive dark:text-red-400 transition-colors"
                                aria-label="Delete monitor"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            {canPause && (
                              <button 
                                onClick={() => handlePing(m.id)} 
                                title="Manual Ping"
                                className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                                aria-label="Trigger manual ping"
                              >
                                <RefreshCw size={16} />
                              </button>
                            )}
                            {!canPause && !isOwnMonitor && (
                              <span className="text-xs text-muted-foreground italic px-2">View Only</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Create Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-card border rounded-2xl shadow-2xl p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">New Database Monitor</h2>
                  <p className="text-sm text-muted-foreground">Add a database URI to monitor.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 rounded-full hover:bg-accent text-foreground"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Workspace Selection */}
                {joinedTeams.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <Database size={16} className="text-primary" />
                            Target Workspace
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({ ...formData, target_owner_id: user?.id || null });
                                    setTargetOwner(null);
                                }}
                                className={`p-3 rounded-xl border text-left transition-all ${formData.target_owner_id === user?.id ? 'bg-primary/10 border-primary ring-2 ring-primary/20' : 'bg-accent/30 hover:bg-accent'}`}
                            >
                                <p className="text-[9px] font-black uppercase tracking-widest text-primary">Personal</p>
                                <p className="text-xs font-semibold truncate">My monitors</p>
                            </button>
                            {joinedTeams.map((team) => (
                                <button
                                    key={team.owner_id}
                                    type="button"
                                    disabled={team.role === 'viewer'}
                                    onClick={() => {
                                        setFormData({ ...formData, target_owner_id: team.owner_id });
                                        setTargetOwner(team);
                                    }}
                                    className={`p-3 rounded-xl border text-left transition-all relative ${formData.target_owner_id === team.owner_id ? 'bg-primary/10 border-primary ring-2 ring-primary/20' : 'bg-accent/30 hover:bg-accent'} ${team.role === 'viewer' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {team.role === 'viewer' && <Lock size={10} className="absolute top-2 right-2 text-muted-foreground" />}
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{team.owner_name}'s Team</p>
                                    <p className="text-xs font-semibold truncate capitalize">{team.role} Access</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Monitor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Production Postgres"
                    required
                    className="w-full rounded-xl border bg-accent/30 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* URI + Verify */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Database URI</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="postgres://user:pass@host:5432/dbname"
                      required
                      className="flex-1 rounded-xl border bg-accent/30 p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={formData.uri}
                      onChange={(e) => {
                        setFormData({ ...formData, uri: e.target.value });
                        setVerifyResult(null); // reset verify on change
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={isVerifying || !formData.uri.trim()}
                      className="shrink-0 px-4 py-3 rounded-xl border bg-accent/50 text-sm font-bold hover:bg-accent transition-all disabled:opacity-40 flex items-center gap-2"
                    >
                      {isVerifying ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : verifyResult?.ok ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : verifyResult && !verifyResult.ok ? (
                        <XCircle size={16} className="text-destructive" />
                      ) : (
                        <ShieldCheck size={16} />
                      )}
                      {isVerifying ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Supports postgres://, mongodb://, mongodb+srv://, mysql://</p>

                  {/* Verify result badge */}
                  {verifyResult && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium border ${
                        verifyResult.ok
                          ? 'bg-green-500/5 border-green-500/20 text-green-700 dark:text-green-400'
                          : 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {verifyResult.ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      <span>
                        {verifyResult.ok
                          ? `✓ Connected — ${verifyResult.type} (${verifyResult.provider}) • ${verifyResult.latency}ms`
                          : `✗ ${verifyResult.message}`}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Interval picker */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Ping Interval</label>
                  <div className="grid grid-cols-4 gap-2">
                    {ALL_INTERVALS.map((opt) => {
                      const isLocked = opt.ms < minIntervalMs;
                      const isSelected = formData.interval_ms === opt.ms;
                      return (
                        <button
                          key={opt.ms}
                          type="button"
                          disabled={isLocked}
                          onClick={() => !isLocked && setFormData({ ...formData, interval_ms: opt.ms })}
                          className={`relative py-2 px-1 rounded-xl text-xs font-semibold border transition-all
                            ${isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                              : isLocked
                                ? 'bg-muted/30 text-muted-foreground/50 border-border/50 cursor-not-allowed'
                                : 'bg-accent/30 text-foreground border-border hover:bg-accent hover:border-primary/30 cursor-pointer'
                            }`}
                        >
                          {isLocked && (
                            <Lock size={10} className="absolute top-1 right-1 text-muted-foreground/40" />
                          )}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Your <span className="font-bold uppercase">{plan}</span> plan allows intervals from{' '}
                    <span className="font-bold">
                      {ALL_INTERVALS.find(i => i.ms === minIntervalMs)?.label || '1 hour'}
                    </span>{' '}
                    onwards.
                  </p>
                </div>

                {/* Query Mode Toggle */}
                {verifyResult?.ok && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 pt-4 border-t"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Activity size={16} className="text-primary" />
                                Monitoring Mode
                            </label>
                            <div className="flex p-1 bg-muted rounded-lg w-fit">
                                <button 
                                    type="button"
                                    onClick={() => setFormData({ ...formData, query_type: 'ping' })}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${formData.query_type === 'ping' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                                >
                                    Heartbeat
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({ ...formData, query_type: 'custom' })}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${formData.query_type === 'custom' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                                >
                                    Custom Query
                                </button>
                            </div>
                        </div>

                        {formData.query_type === 'custom' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                            {verifyResult.type === 'mongodb' ? 'Mongo Command (JSON)' : 'SQL Query (SELECT only)'}
                                        </label>
                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">PRO</span>
                                    </div>
                                    <textarea 
                                        rows={3}
                                        placeholder={verifyResult.type === 'mongodb' ? '{"count": "users", "query": {"active": true}}' : 'SELECT count(*) FROM users'}
                                        required
                                        className="w-full rounded-xl border bg-accent/30 p-4 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                        value={formData.custom_query}
                                        onChange={(e) => setFormData({ ...formData, custom_query: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Expectation</label>
                                        <select 
                                            className="w-full rounded-xl border bg-accent/30 p-2.5 text-xs font-bold focus:outline-none"
                                            value={formData.comparison_operator}
                                            onChange={(e) => setFormData({ ...formData, comparison_operator: e.target.value })}
                                        >
                                            <option value="equals">Equals (==)</option>
                                            <option value="not_equals">Not Equals (!=)</option>
                                            <option value="greater_than">Greater Than (&gt;)</option>
                                            <option value="less_than">Less Than (&lt;)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Target Value</label>
                                        <input 
                                            type="text" 
                                            required
                                            placeholder="100"
                                            className="w-full rounded-xl border bg-accent/30 p-2.5 text-xs font-bold focus:outline-none"
                                            value={formData.expected_value}
                                            onChange={(e) => setFormData({ ...formData, expected_value: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="button"
                                    onClick={handleTestQuery}
                                    disabled={isTestingQuery || !formData.custom_query.trim()}
                                    className="w-full py-2.5 rounded-xl border border-dashed border-primary/30 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                >
                                    {isTestingQuery ? <Loader2 size={14} className="animate-spin" /> : <Terminal size={14} />}
                                    {isTestingQuery ? 'Running Probe...' : 'Run Test Probe'}
                                </button>

                                {testQueryResult && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`p-3 rounded-xl border text-[11px] font-bold flex items-center justify-between ${testQueryResult.ok ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600' : 'bg-red-500/5 border-red-500/20 text-red-600'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {testQueryResult.ok ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                                            {testQueryResult.ok ? 'Probe Passed' : `Probe Failed: ${testQueryResult.message}`}
                                        </div>
                                        {testQueryResult.latency > 0 && <span>{testQueryResult.latency}ms</span>}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Encryption notice */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3">
                  <Zap className="text-primary shrink-0" size={18} />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your URI is <strong>encrypted at rest</strong> using AES-256 and never logged. A test ping will run immediately after creation.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border font-bold hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !verifyResult?.ok}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    {isSubmitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Monitor"
        message="Are you sure you want to delete this monitor? All history and alerts for this monitor will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default MonitorsPage;

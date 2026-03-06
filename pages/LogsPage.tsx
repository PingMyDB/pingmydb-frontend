
import React, { useState, useEffect } from 'react';
import { useMonitorStore } from '../store/monitorStore';
import { MonitorCheck } from '../types';
import { 
  Filter, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Activity,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const LogsPage: React.FC = () => {
  const { monitors, fetchMonitors, fetchHistory } = useMonitorStore();
  const [filterMonitor, setFilterMonitor] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [checks, setChecks] = useState<MonitorCheck[]>([]);
  const [totalChecks, setTotalChecks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  useEffect(() => {
    loadChecks();
  }, [filterMonitor, currentPage, monitors]);

  const loadChecks = async () => {
    if (filterMonitor === 'all') {
      // Load checks from all monitors
      setIsLoading(true);
      try {
        const allChecks: MonitorCheck[] = [];
        let total = 0;
        for (const m of monitors) {
          const result = await fetchHistory(m.id, 1);
          allChecks.push(...result.checks);
          total += result.total;
        }
        // Sort by date desc
        allChecks.sort((a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime());
        setChecks(allChecks.slice(0, itemsPerPage));
        setTotalChecks(total);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        const result = await fetchHistory(parseInt(filterMonitor), currentPage);
        setChecks(result.checks);
        setTotalChecks(result.total);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalPages = Math.ceil(totalChecks / itemsPerPage);

  const getMonitorName = (monitorId: number) => {
    const m = monitors.find(mon => mon.id === monitorId);
    return m ? m.name : `Monitor #${monitorId}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">History of pings and health checks.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadChecks} className="p-2.5 rounded-lg border bg-card hover:bg-accent transition-colors">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-4 flex items-center gap-4 bg-card border rounded-xl p-2 px-4 shadow-sm">
          <Filter className="text-muted-foreground" size={18} />
          <select 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-1"
            value={filterMonitor}
            onChange={(e) => { setFilterMonitor(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Monitors</option>
            {monitors.map(m => (
              <option key={m.id} value={m.id.toString()}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : checks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6"
            >
              <Activity size={32} className="text-muted-foreground" />
            </motion.div>
            <h3 className="text-xl font-bold">Waiting for the first pulse</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
              Logs will appear here as soon as your monitors complete their first health check.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Monitor</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Latency</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {checks.map((check) => (
                    <tr key={check.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4">
                        {check.status === 'UP' ? (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle size={14} />
                            <span className="text-xs font-bold uppercase tracking-wide">UP</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-destructive">
                            <XCircle size={14} />
                            <span className="text-xs font-bold uppercase tracking-wide">DOWN</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{getMonitorName(check.monitor_id)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                          <Clock size={12} /> {check.latency_ms}ms
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium">
                          <p>{new Date(check.checked_at).toLocaleDateString()}</p>
                          <p className="text-muted-foreground mt-0.5">{new Date(check.checked_at).toLocaleTimeString()}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t bg-muted/10 mt-auto flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Showing {checks.length} of {totalChecks} checks</span>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-1.5 rounded-lg border hover:bg-accent disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold px-3">Page {currentPage} of {totalPages}</span>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-1.5 rounded-lg border hover:bg-accent disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LogsPage;

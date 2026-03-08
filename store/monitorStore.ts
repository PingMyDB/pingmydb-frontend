
import { create } from 'zustand';
import { Monitor, MonitorCheck, Alert } from '../types';
import { API_BASE_URL } from '../src/config';

const API_BASE = `${API_BASE_URL}/api/monitors`;

function getToken(): string {
  return localStorage.getItem('pmdb_token') || '';
}

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'token': getToken(),
  };
}

interface VerifyResult {
  ok: boolean;
  type?: string;
  provider?: string;
  latency?: number;
  message: string;
}

interface MonitorStore {
  monitors: Monitor[];
  isLoading: boolean;
  error: string | null;
  fetchMonitors: () => Promise<void>;
  addMonitor: (data: any) => Promise<void>;
  deleteMonitor: (id: number) => Promise<void>;
  manualPing: (id: number) => Promise<void>;
  togglePause: (id: number) => Promise<void>;
  verifyUri: (uri: string) => Promise<VerifyResult>;
  fetchHistory: (id: number, page?: number) => Promise<{ checks: MonitorCheck[]; total: number }>;
  fetchAlerts: (id: number) => Promise<Alert[]>;
  allAlerts: Alert[];
  fetchAllAlerts: () => Promise<void>;
  fetchStatsHistory: (owner_id?: number, monitor_id?: number, hours?: number) => Promise<{ hour: string; uptime_pct: number; avg_latency: number }[]>;
  testQuery: (data: any) => Promise<any>;
}

export const useMonitorStore = create<MonitorStore>((set) => ({
  monitors: [],
  allAlerts: [],
  isLoading: false,
  error: null,

  fetchMonitors: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(API_BASE, { headers: headers() });
      if (!res.ok) throw new Error('Failed to fetch monitors');
      const data = await res.json();
      set({ monitors: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addMonitor: async (data) => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to add monitor');
    set((state) => ({ monitors: [json, ...state.monitors] }));
  },

  deleteMonitor: async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message || 'Failed to delete monitor');
    }
    set((state) => ({ monitors: state.monitors.filter((m) => m.id !== id) }));
  },

  manualPing: async (id) => {
    const res = await fetch(`${API_BASE}/${id}/ping`, {
      method: 'POST',
      headers: headers(),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message || 'Failed to trigger ping');
    }
  },
  
  togglePause: async (id) => {
    const res = await fetch(`${API_BASE}/${id}/toggle-pause`, {
        method: 'PATCH',
        headers: headers(),
    });
    
    // Check if the response is actually JSON
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error('Toggle Pause failed. Status:', res.status, 'Response:', text);
        throw new Error(`Failed to toggle pause: ${res.statusText}. See console for details.`);
    }

    const data = await res.json();
    set((state) => ({
        monitors: state.monitors.map(m => m.id === id ? { ...m, is_paused: data.is_paused, status: data.is_paused ? 'paused' as any : m.status } : m)
    }));
  },

  verifyUri: async (uri: string): Promise<VerifyResult> => {
    const res = await fetch(`${API_BASE}/verify`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ uri }),
    });
    const json = await res.json();
    return json;
  },

  fetchHistory: async (id, page = 1) => {
    const res = await fetch(`${API_BASE}/${id}/history?page=${page}&limit=50`, {
      headers: headers(),
    });
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  fetchAlerts: async (id) => {
    const res = await fetch(`${API_BASE}/${id}/alerts`, {
      headers: headers(),
    });
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  fetchAllAlerts: async () => {
    try {
      const res = await fetch(`${API_BASE}/all/alerts`, { headers: headers() });
      if (!res.ok) throw new Error('Failed to fetch global alerts');
      const data = await res.json();
      set({ allAlerts: data });
    } catch (err: any) {
      console.error('Fetch all alerts error:', err.message);
    }
  },

  fetchStatsHistory: async (owner_id?: number, monitor_id?: number, hours?: number) => {
    let url = `${API_BASE}/stats/history`;
    const params = new URLSearchParams();
    if (owner_id) params.append('owner_id', owner_id.toString());
    if (monitor_id) params.append('monitor_id', monitor_id.toString());
    if (hours) params.append('hours', hours.toString());
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch stats history');
    return res.json();
  },

  testQuery: async (data) => {
    const res = await fetch(`${API_BASE}/test-query`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
    });
    const json = await res.json();
    return json;
  }
}));

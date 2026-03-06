import { create } from 'zustand';
import { API_BASE_URL } from '../src/config';

interface NotificationChannel {
  id: number;
  type: 'discord' | 'slack' | 'email';
  name: string;
  config: any;
  is_enabled: boolean;
  created_at: string;
}

interface NotificationState {
  channels: NotificationChannel[];
  isLoading: boolean;
  fetchChannels: () => Promise<void>;
  addChannel: (data: Partial<NotificationChannel>) => Promise<void>;
  updateChannel: (id: number, data: Partial<NotificationChannel>) => Promise<void>;
  deleteChannel: (id: number) => Promise<void>;
  testChannel: (id: number) => Promise<void>;
}

const API_BASE = `${API_BASE_URL}/api/notifications`;

function getToken(): string {
  return localStorage.getItem('pmdb_token') || '';
}

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'token': getToken(),
  };
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  channels: [],
  isLoading: false,

  fetchChannels: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(API_BASE, { headers: headers() });
      if (!res.ok) throw new Error('Failed to fetch channels');
      const data = await res.json();
      set({ channels: data, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  addChannel: async (data) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to add channel');
      set({ channels: [json, ...get().channels] });
    } catch (err) {
      throw err;
    }
  },

  updateChannel: async (id, data) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update channel');
      set({
        channels: get().channels.map((c) => (c.id === id ? json : c))
      });
    } catch (err) {
      throw err;
    }
  },

  deleteChannel: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || 'Failed to delete channel');
      }
      set({
        channels: get().channels.filter((c) => c.id !== id)
      });
    } catch (err) {
      throw err;
    }
  },
  
  testChannel: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/test`, {
        method: 'POST',
        headers: headers(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to send test notification');
    } catch (err) {
      throw err;
    }
  },
}));

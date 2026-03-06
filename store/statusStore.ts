
import { create } from 'zustand';
import { API_BASE_URL } from '../src/config';

interface StatusSettings {
    status_slug: string | null;
    is_status_public: boolean;
}

interface StatusStore {
    settings: StatusSettings | null;
    isLoading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
    updateSettings: (settings: StatusSettings) => Promise<void>;
}

function getToken(): string {
  return localStorage.getItem('pmdb_token') || '';
}

export const useStatusStore = create<StatusStore>((set) => ({
    settings: null,
    isLoading: false,
    error: null,

    fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${API_BASE_URL}/profile/status`, {
                headers: { 'token': getToken() }
            });
            if (!res.ok) throw new Error("Failed to fetch status settings");
            const data = await res.json();
            set({ settings: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    updateSettings: async (newSettings) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${API_BASE_URL}/profile/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'token': getToken() 
                },
                body: JSON.stringify(newSettings)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update settings");
            set({ settings: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    }
}));

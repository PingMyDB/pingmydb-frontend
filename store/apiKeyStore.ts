import { create } from 'zustand';
import { API_BASE_URL } from '../src/config';

interface ApiKey {
    id: number;
    name: string;
    prefix: string;
    last_used_at: string | null;
    created_at: string;
    key?: string; // Only present when just created
}

interface ApiKeyStore {
    keys: ApiKey[];
    isLoading: boolean;
    error: string | null;
    fetchKeys: () => Promise<void>;
    generateKey: (name: string) => Promise<string | null>;
    revokeKey: (id: number) => Promise<void>;
}

function getToken() {
    return localStorage.getItem('pmdb_token') || '';
}

export const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
    keys: [],
    isLoading: false,
    error: null,

    fetchKeys: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${API_BASE_URL}/api/keys`, {
                headers: { 'token': getToken() }
            });
            if (!res.ok) throw new Error("Failed to fetch keys");
            const data = await res.json();
            set({ keys: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    generateKey: async (name: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${API_BASE_URL}/api/keys`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'token': getToken() 
                },
                body: JSON.stringify({ name })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to generate key");
            
            // Refresh list but the raw key is in the response data
            await get().fetchKeys();
            set({ isLoading: false });
            return data.key;
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    revokeKey: async (id: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/keys/${id}`, {
                method: 'DELETE',
                headers: { 'token': getToken() }
            });
            if (!res.ok) throw new Error("Failed to revoke key");
            set(state => ({
                keys: state.keys.filter(k => k.id !== id)
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    }
}));

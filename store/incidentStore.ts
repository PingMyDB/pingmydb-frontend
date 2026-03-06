import { create } from 'zustand';
import { API_BASE_URL } from '../src/config';

export interface IncidentUpdate {
    id: number;
    message: string;
    status: string;
    created_at: string;
}

export interface Incident {
    id: number;
    title: string;
    status: string;
    severity: string;
    created_at: string;
    resolved_at: string | null;
    latest_message?: string;
    updates?: IncidentUpdate[];
}

interface IncidentStore {
    incidents: Incident[];
    isLoading: boolean;
    error: string | null;
    fetchIncidents: () => Promise<void>;
    createIncident: (data: { title: string; severity: string; message: string }) => Promise<void>;
    addUpdate: (id: number, message: string, status: string) => Promise<void>;
    deleteIncident: (id: number) => Promise<void>;
}

function getToken() {
    return localStorage.getItem('pmdb_token') || '';
}

export const useIncidentStore = create<IncidentStore>((set, get) => ({
    incidents: [],
    isLoading: false,
    error: null,

    fetchIncidents: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${API_BASE_URL}/api/incidents`, {
                headers: { 'token': getToken() }
            });
            if (!res.ok) throw new Error("Failed to fetch incidents");
            const data = await res.json();
            set({ incidents: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    createIncident: async (data) => {
        set({ isLoading: true });
        try {
            const res = await fetch(`${API_BASE_URL}/api/incidents`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'token': getToken() 
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("Failed to create incident");
            await get().fetchIncidents();
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    addUpdate: async (id, message, status) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/incidents/${id}/updates`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'token': getToken() 
                },
                body: JSON.stringify({ message, status })
            });
            if (!res.ok) throw new Error("Failed to add update");
            await get().fetchIncidents();
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    },

    deleteIncident: async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/incidents/${id}`, {
                method: 'DELETE',
                headers: { 'token': getToken() }
            });
            if (!res.ok) throw new Error("Failed to delete incident");
            set(state => ({
                incidents: state.incidents.filter(i => i.id !== id)
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    }
}));

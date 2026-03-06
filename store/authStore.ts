
import { create } from 'zustand';
import { AuthState, User } from '../types';

interface AuthStore extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  login: async (email, pass) => {
    // Mock login
    const mockUser: User = {
      id: 'usr_1',
      email,
      name: email.split('@')[0],
      apiKey: 'pmdb_live_xxxxxxxxxx',
      plan: 'free',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      hasSeenOnboarding: localStorage.getItem('pmdb_onboarded') === 'true'
    };
    localStorage.setItem('pmdb_token', 'mock_token_123');
    localStorage.setItem('pmdb_user', JSON.stringify(mockUser));
    set({ user: mockUser, isAuthenticated: true, token: 'mock_token_123' });
  },

  register: async (name, email, pass) => {
    const mockUser: User = {
      id: 'usr_1',
      email,
      name,
      apiKey: 'pmdb_live_xxxxxxxxxx',
      plan: 'free',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      hasSeenOnboarding: false
    };
    localStorage.setItem('pmdb_token', 'mock_token_123');
    localStorage.setItem('pmdb_user', JSON.stringify(mockUser));
    set({ user: mockUser, isAuthenticated: true, token: 'mock_token_123' });
  },

  logout: () => {
    localStorage.removeItem('pmdb_token');
    localStorage.removeItem('pmdb_user');
    set({ user: null, isAuthenticated: false, token: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem('pmdb_token');
    const userJson = localStorage.getItem('pmdb_user');
    if (token && userJson) {
      set({ user: JSON.parse(userJson), isAuthenticated: true, token });
    }
  },

  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updates };
      if (updates.hasSeenOnboarding !== undefined) {
        localStorage.setItem('pmdb_onboarded', updates.hasSeenOnboarding ? 'true' : 'false');
      }
      localStorage.setItem('pmdb_user', JSON.stringify(newUser));
      return { user: newUser };
    });
  }
}));

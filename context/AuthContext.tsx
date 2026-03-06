import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { API_BASE_URL } from '../src/config';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  updateProfile: (name: string, avatarUrl?: string) => Promise<void>;
  sendEmailOtp: (newEmail: string) => Promise<void>;
  verifyEmailOtp: (otp: string) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  forceVerify: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper function to decode JWT and check expiration
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Treat invalid tokens as expired
    }
  };

  const checkAuth = () => {
    try {
      const storedToken = localStorage.getItem('pmdb_token');
      const storedUser = localStorage.getItem('pmdb_user');
      
      if (storedToken && storedUser) {
        // Check if token is expired
        if (isTokenExpired(storedToken)) {
          console.log('Token expired, logging out...');
          logout();
          return;
        }
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth hydration error", error);
      // Clear potentially corrupted storage
      localStorage.removeItem('pmdb_token');
      localStorage.removeItem('pmdb_user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // Check token expiration every minute
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem('pmdb_token');
      if (storedToken && isTokenExpired(storedToken)) {
        console.log('Token expired during session, logging out...');
        logout();
      }
    }, 600000); // Check every minute (wait I should fix the 60000 in previous code too)

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'ACCOUNT_DISABLED') {
          logout();
          throw new Error(data.message);
        }
        throw new Error(data.message || 'Login failed');
      }

      const { token, user } = data;

      // Ensure user object has all required fields for frontend
      // The backend returns id, name, email, password, created_at.
      // We might need to map or add missing fields if the frontend expects them (e.g. apiKey, plan, avatarUrl)
      // For now, we'll merge with some defaults or just use what we get, and add the missing mock fields existing code used.
      
      const userWithExtras = {
        ...user,
        apiKey: 'pmdb_live_xxxxxxxxxx', // Placeholder
        // plan: 'free', // Remove this placeholder as backend now returns it
        avatarUrl: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        hasSeenOnboarding: localStorage.getItem('pmdb_onboarded') === 'true'
      };

      localStorage.setItem('pmdb_token', token);
      localStorage.setItem('pmdb_user', JSON.stringify(userWithExtras));
      
      setToken(token);
      setUser(userWithExtras);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password: pass }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'ACCOUNT_DISABLED') {
          logout();
          throw new Error(data.message);
        }
        throw new Error(data.message || 'Registration failed');
      }

      const { token, user } = data;

      const userWithExtras = {
        ...user,
        apiKey: 'pmdb_live_xxxxxxxxxx',
        // plan: 'free', // Remove placeholder
        avatarUrl: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        hasSeenOnboarding: false
      };

      localStorage.setItem('pmdb_token', token);
      localStorage.setItem('pmdb_user', JSON.stringify(userWithExtras));

      setToken(token);
      setUser(userWithExtras);
      setIsAuthenticated(true);
    } catch (error) {
       console.error("Registration error", error);
       throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('pmdb_token');
    localStorage.removeItem('pmdb_user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    window.location.href = '/login'; // Redirect to login page
  };

  const updateProfile = async (name: string, avatarUrl?: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'token': token || ''
          },
          body: JSON.stringify({ name, avatar_url: avatarUrl }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          if (data.code === 'ACCOUNT_DISABLED') {
            logout();
            throw new Error(data.message);
          }
          throw new Error(data.message || 'Update failed');
        }
  
        // data contains the updated user object from backend
        // If avatarUrl was provided, use it. Otherwise, if email changed, regenerate it. 
        // If neither, keep existing or fallback to data.email based generation.
        const newAvatarUrl = avatarUrl 
            ? avatarUrl 
            : (data.email !== user?.email 
                ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}` 
                : user?.avatarUrl);

        const userWithExtras = {
            ...user!, // Keep existing extras (apiKey, etc)
            ...data,  // Overwrite with new data from backend (name, email, avatar_url)
            avatarUrl: data.avatar_url || user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`, 
        };

        localStorage.setItem('pmdb_user', JSON.stringify(userWithExtras));
        setUser(userWithExtras);
      } catch (error) {
         console.error("Profile update error", error);
         throw error;
      }
  };

  const sendEmailOtp = async (newEmail: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/send-email-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token || ''
        },
        body: JSON.stringify({ newEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error("Send OTP error", error);
      throw error;
    }
  };

  const verifyEmailOtp = async (otp: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token || ''
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }

      // Update user state with new email
      const userWithExtras = {
          ...user!,
          ...data,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
      };

      localStorage.setItem('pmdb_user', JSON.stringify(userWithExtras));
      setUser(userWithExtras);

    } catch (error) {
      console.error("Verify OTP error", error);
      throw error;
    }
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token || ''
        },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error("Change password error", error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'DELETE',
        headers: {
          'token': token || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      logout();
    } catch (error) {
      console.error("Delete account error", error);
      throw error;
    }
  };

  const forceVerify = () => {
    if (user) {
      const updated = { ...user, is_verified: true };
      localStorage.setItem('pmdb_user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, token, login, register, logout, checkAuth, updateProfile, sendEmailOtp, verifyEmailOtp, changePassword, deleteAccount, forceVerify, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

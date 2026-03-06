
export enum MonitorStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  PENDING = 'pending',
  PAUSED = 'paused',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

export interface Monitor {
  id: number;
  name: string;
  type: string;           // postgres, mongodb, mysql
  provider: string;       // supabase, atlas, self-hosted, etc.
  status: MonitorStatus;
  latency: number | null;
  last_ping_at: string | null;
  interval_ms: number;
  consecutive_failures: number;
  created_at: string;
  is_paused: boolean;
  avg_latency: number | null;
  owner_name?: string;
  owner_email?: string;
}

export interface MonitorCheck {
  id: number;
  monitor_id: number;
  status: 'UP' | 'DOWN';
  latency_ms: number;
  checked_at: string;
}

export interface Alert {
  id: number;
  monitor_id: number;
  type: 'down' | 'recovered';
  message: string;
  triggered_at: string;
}

export interface LogEntry {
  id: string;
  monitorId: string;
  monitorName: string;
  timestamp: string;
  statusCode: number;
  responseTime: number;
  status: 'success' | 'failure';
  errorMessage?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  apiKey: string;
<<<<<<< HEAD
  is_verified?: boolean;
=======
>>>>>>> origin/main
  plan: 'free' | 'student' | 'pro' | 'enterprise';
  role: 'user' | 'admin';
  student_status?: 'none' | 'pending' | 'verified';
  institution_name?: string;
<<<<<<< HEAD
  is_status_public?: boolean;
  status_slug?: string;
  hasSeenOnboarding?: boolean;
  created_at?: string;
  cancel_at_period_end?: boolean;
  current_period_end?: string;
=======
  hasSeenOnboarding?: boolean;
  created_at?: string;
>>>>>>> origin/main
}

export interface AdminStats {
  totalUsers: number;
  totalMonitors: number;
  recentAlerts: number;
  systemStatus: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}


import React, { useEffect, useState } from 'react';
import { 
  Search, UserCog, Trash2, ShieldCheck, Mail, Calendar, 
  Ban, Flag, StickyNote, ChevronDown, ChevronUp, Database,
  ArrowRight, Activity, ShieldOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { API_BASE_URL } from '../src/config';
import ConfirmationModal from '../components/ConfirmationModal';

interface UserItem {
  id: number;
  name: string;
  email: string;
  plan: string;
  role: string;
  created_at: string;
  last_login: string | null;
  is_disabled: boolean;
  is_flagged: boolean;
  admin_notes: string | null;
  monitor_count: number;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [banModal, setBanModal] = useState<{ user: UserItem; action: 'ban' | 'unban' } | null>(null);
  const [isActioning, setIsActioning] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('pmdb_token');
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { 
          'token': token,
          'X-Admin-Secret': 'fallback_dev_secret_123'
        }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      if (Array.isArray(data)) {
        // Parse monitor_count as number since bigint comes as string from PG
        const parsedUsers = data.map((u: any) => ({
          ...u,
          monitor_count: typeof u.monitor_count === 'string' ? parseInt(u.monitor_count) : u.monitor_count
        }));
        setUsers(parsedUsers);
      } else {
        console.error('Expected array of users, got:', data);
        setUsers([]);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (id: number, updates: Partial<UserItem>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'token': localStorage.getItem('pmdb_token') || '',
          'X-Admin-Secret': 'fallback_dev_secret_123'
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        toast.success('User updated');
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const handleBanConfirm = async () => {
    if (!banModal) return;
    setIsActioning(true);
    await handleUpdateStatus(banModal.user.id, { is_disabled: banModal.action === 'ban' });
    setIsActioning(false);
    setBanModal(null);
  };

  const handleUpdatePlan = async (id: number, newPlan: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/plan`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'token': localStorage.getItem('pmdb_token') || '',
          'X-Admin-Secret': 'fallback_dev_secret_123'
        },
        body: JSON.stringify({ plan: newPlan })
      });
      if (res.ok) {
        toast.success(`Plan updated to ${newPlan}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to update plan');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-muted-foreground">Fetching user database...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage accounts, plans, and system status.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="w-10 px-6"></th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status / Plan</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">Stats</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Timeline</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <tr className={`group hover:bg-muted/10 transition-colors ${user.is_disabled ? 'opacity-50 grayscale bg-muted/5' : ''}`}>
                    <td className="px-6">
                        <button 
                            onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                        >
                            {expandedId === user.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative
                            ${user.is_flagged ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}
                        `}>
                          {user.name[0]}
                          {user.is_flagged && (
                              <div className="absolute -top-1 -right-1 bg-destructive text-white p-0.5 rounded-full">
                                  <Flag size={8} fill="currentColor" />
                              </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold flex items-center gap-1">
                            {user.name} 
                            {user.role === 'admin' && <ShieldCheck size={12} className="text-primary" />}
                          </p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <select 
                            value={user.plan}
                            onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
                            className="text-xs font-bold bg-muted/50 border-none rounded px-2 py-1 w-fit focus:ring-1 focus:ring-primary transition-all"
                        >
                            <option value="free">Free</option>
                            <option value="student">Student</option>
                            <option value="pro">Pro</option>
                            <option value="team">Team</option>
                        </select>
                        <div className="flex gap-2">
                            {user.is_disabled && <span className="text-[10px] font-black uppercase text-destructive tracking-tighter">Banned</span>}
                            {user.is_flagged && <span className="text-[10px] font-black uppercase text-orange-500 tracking-tighter">Flagged</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/5 rounded-lg text-primary">
                            <Database size={12} />
                            <span className="text-xs font-bold">{user.monitor_count}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <Calendar size={10} />
                                Joined {new Date(user.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <Activity size={10} />
                                Login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleUpdateStatus(user.id, { is_flagged: !user.is_flagged })}
                                className={`p-2 rounded-lg transition-colors ${user.is_flagged ? 'text-orange-500 bg-orange-500/10' : 'text-muted-foreground hover:bg-muted'}`}
                                title="Flag for review"
                            >
                                <Flag size={16} />
                            </button>
                            {user.is_disabled ? (
                                <button 
                                    onClick={() => setBanModal({ user, action: 'unban' })}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                                    title="Unban this user"
                                >
                                    <ShieldOff size={13} /> Unban
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setBanModal({ user, action: 'ban' })}
                                    className="p-2 rounded-lg transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                    title="Ban User"
                                >
                                    <Ban size={16} />
                                </button>
                            )}
                            <button className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Overlay */}
                  <AnimatePresence>
                    {expandedId === user.id && (
                        <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-muted/5"
                        >
                            <td colSpan={6} className="px-20 py-6">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <StickyNote size={14} />
                                            Admin Notes
                                        </h4>
                                        <textarea 
                                            className="w-full bg-background border rounded-lg p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Add private observations about this user..."
                                            defaultValue={user.admin_notes || ''}
                                            onBlur={(e) => handleUpdateStatus(user.id, { admin_notes: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Database size={14} />
                                            Associated Infrastructure
                                        </h4>
                                        <div className="p-4 rounded-xl border bg-background/50 text-center py-8">
                                            <p className="text-xs text-muted-foreground italic">Monitor deep-dive available in version 2.1</p>
                                            <button className="mt-4 text-xs font-bold text-primary flex items-center gap-1 mx-auto hover:gap-2 transition-all">
                                                Inspect {user.monitor_count} monitors <ArrowRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
              <div className="py-20 text-center">
                  <UserCog size={40} className="mx-auto text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground">No users found matching your search.</p>
              </div>
          )}
        </div>
      </div>

      {/* Ban / Unban Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!banModal}
        onClose={() => setBanModal(null)}
        onConfirm={handleBanConfirm}
        isLoading={isActioning}
        variant={banModal?.action === 'ban' ? 'danger' : 'info'}
        title={banModal?.action === 'ban' ? `Ban ${banModal?.user.name}?` : `Unban ${banModal?.user.name}?`}
        message={
          banModal?.action === 'ban'
            ? `This will immediately disable ${banModal?.user.name}'s account (${banModal?.user.email}). They won't be able to log in or access any data until unbanned.`
            : `This will restore full access to ${banModal?.user.name}'s account (${banModal?.user.email}). They will be able to log in immediately.`
        }
        confirmText={banModal?.action === 'ban' ? 'Yes, Ban User' : 'Yes, Unban User'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminUsers;

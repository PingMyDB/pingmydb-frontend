import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Mail,
  Loader2,
  CheckCircle2,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../src/config';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    avatar_url: string;
    created_at: string;
}

const TeamManagement: React.FC = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('pmdb_token');
            const res = await fetch(`${API_BASE_URL}/api/teams/members`, {
                headers: { 'token': token || '' }
            });
            const data = await res.json();
            if (res.ok) setMembers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviting(true);
        try {
            const token = localStorage.getItem('pmdb_token');
            const res = await fetch(`${API_BASE_URL}/api/teams/invite`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'token': token || '' 
                },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setInviteEmail('');
                fetchMembers();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Invitation failed");
        } finally {
            setIsInviting(false);
        }
    };

    const handleRoleChange = async (memberSubscriptionId: number, newRole: string) => {
        try {
            const token = localStorage.getItem('pmdb_token');
            const res = await fetch(`${API_BASE_URL}/api/teams/members/${memberSubscriptionId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'token': token || '' 
                },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                toast.success("Role updated");
                fetchMembers();
            }
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const handleRemove = async (memberSubscriptionId: number) => {
        if (!confirm("Are you sure you want to remove this member?")) return;
        try {
            const token = localStorage.getItem('pmdb_token');
            const res = await fetch(`${API_BASE_URL}/api/teams/members/${memberSubscriptionId}`, {
                method: 'DELETE',
                headers: { 'token': token || '' }
            });
            if (res.ok) {
                toast.success("Member removed");
                fetchMembers();
            }
        } catch (err) {
            toast.error("Removal failed");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <h3 className="text-3xl font-black tracking-tight flex items-center gap-3">
                      Team Collaboration <Users className="text-primary" size={28} />
                   </h3>
                   <p className="text-muted-foreground font-medium mt-1">Manage shared access to your monitors and incidents.</p>
                </div>
                
                <form onSubmit={handleInvite} className="flex gap-2">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input 
                            type="email" 
                            required
                            placeholder="colleague@company.com"
                            className="pl-10 pr-4 py-2.5 rounded-xl border bg-card text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                        />
                    </div>
                    <select 
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as any)}
                        className="bg-card border rounded-xl px-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button 
                        type="submit"
                        disabled={isInviting}
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-black hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isInviting ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
                        Invite
                    </button>
                </form>
            </div>

            <div className="grid gap-4">
                {/* Team Owner (Always shown at top) */}
                {user && (
                    <motion.div 
                        layout
                        className="group relative bg-primary/5 border border-primary/20 rounded-3xl p-5 flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner'} className="w-12 h-12 rounded-xl border-2 border-primary bg-card" alt={user.name} />
                                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5 border border-background">
                                   <ShieldCheck className="text-white" size={14} />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-black text-sm flex items-center gap-2">
                                    {user.name} 
                                    <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Owner</span>
                                </h4>
                                <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:block text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Access</p>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                                    Full Workspace Control
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence mode="popLayout">
                    {members.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-2 border-dashed rounded-[2rem] p-12 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto text-muted-foreground/50">
                                <Users size={32} />
                            </div>
                            <p className="text-muted-foreground font-medium">No team members yet. Invite your first colleague to start collaborating.</p>
                        </motion.div>
                    ) : (
                        members.map((member) => (
                            <motion.div 
                                key={member.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative bg-card border rounded-3xl p-5 hover:border-primary/50 transition-all flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={member.avatar_url} className="w-12 h-12 rounded-xl border bg-muted" alt={member.name} />
                                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border">
                                           {member.role === 'admin' ? <ShieldCheck className="text-primary" size={14} /> : member.role === 'editor' ? <Shield size={14} className="text-emerald-500" /> : <ShieldAlert size={14} className="text-amber-500" />}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm">{member.name}</h4>
                                        <p className="text-xs text-muted-foreground font-medium">{member.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="hidden md:block text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Status</p>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Active
                                        </div>
                                    </div>
                                    
                                    <div className="h-8 w-px bg-border" />

                                    <div className="flex items-center gap-3">
                                        <select 
                                            value={member.role}
                                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                            className="bg-transparent text-xs font-bold border-none focus:ring-0 outline-none cursor-pointer hover:text-primary transition-colors"
                                        >
                                            <option value="viewer">Viewer</option>
                                            <option value="editor">Editor</option>
                                            <option value="admin">Admin</option>
                                        </select>

                                        <button 
                                            onClick={() => handleRemove(member.id)}
                                            className="p-2.5 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                                            title="Remove from team"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
            
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                <div className="p-2 bg-primary/20 rounded-xl text-primary shrink-0">
                    <ShieldCheck size={20} />
                </div>
                <div>
                   <p className="text-sm font-bold text-primary mb-1">Role Definitions</p>
                   <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong>Admins</strong> can manage team members and monitors. <strong>Editors</strong> can create and edit monitors but cannot manage the team. <strong>Viewers</strong> have read-only access to the dashboard and status pages.
                   </p>
                </div>
            </div>
        </div>
    );
};

export default TeamManagement;

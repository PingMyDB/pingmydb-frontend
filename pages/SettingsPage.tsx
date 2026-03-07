
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Trash2, 
  Save,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Mail,
  MessageSquare,
  Shield,
  Clock,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotificationStore } from '../store/notificationStore';
import NotificationSettings from '../components/NotificationSettings';
import ConfirmationModal from '../components/ConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { API_BASE_URL } from '../src/config';

const SettingsPage: React.FC = () => {
  const { user, updateProfile, sendEmailOtp, verifyEmailOtp, changePassword, deleteAccount, sendCurrentEmailOtp, verifyCurrentEmailOtp } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>((searchParams.get('tab') as any) || 'profile');
  const { channels, isLoading: isNotifLoading, fetchChannels, addChannel, deleteChannel, updateChannel, testChannel } = useNotificationStore();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || '');
  const [institutionName, setInstitutionName] = useState(user?.institution_name || '');
  const [isVerifyingStudent, setIsVerifyingStudent] = useState(false);
  const [isStudentToggle, setIsStudentToggle] = useState(user?.student_status === 'verified' || user?.student_status === 'pending');

  // Multi-step Email Change States
  const [emailStep, setEmailStep] = useState<'idle' | 'verifying_current' | 'entering_new' | 'verifying_new'>('idle');
  const [currentEmailOtp, setCurrentEmailOtp] = useState('');
  const [newEmailOtp, setNewEmailOtp] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const avatarOptions = [
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Jack',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Bella',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Midnight',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Boots'
  ];

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
    setSearchParams({ tab });
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setIsAvatarModalOpen(false);
    try {
        await updateProfile(name, avatarUrl);
        toast.success("Avatar updated!");
    } catch (err) {
        toast.error("Failed to update avatar");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await updateProfile(name, selectedAvatar);
        toast.success('Profile updated');
    } catch (error: any) {
        toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleStartEmailChange = async () => {
    setIsEmailLoading(true);
    try {
      await sendCurrentEmailOtp();
      setEmailStep('verifying_current');
      toast.info(`OTP sent to your current email: ${user?.email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate email change");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleVerifyCurrentOtp = async () => {
    setIsEmailLoading(true);
    try {
      await verifyCurrentEmailOtp(currentEmailOtp);
      setEmailStep('entering_new');
      toast.success("Current email verified!");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleSendNewEmailOtp = async () => {
    if (!email || email === user?.email) {
      return toast.error("Please enter a different new email address");
    }
    setIsEmailLoading(true);
    try {
      await sendEmailOtp(email);
      setEmailStep('verifying_new');
      toast.info(`OTP sent to ${email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP to new email");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleVerifyNewOtp = async () => {
    setIsEmailLoading(true);
    try {
      await verifyEmailOtp(newEmailOtp);
      toast.success("Email updated successfully!");
      setEmailStep('idle');
      setNewEmailOtp('');
      setCurrentEmailOtp('');
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP for new email");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleVerifyStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName) return toast.error("Please enter your institution name");
    
    setIsVerifyingStudent(true);
    try {
        const token = localStorage.getItem('pmdb_token');
        const res = await fetch(`${API_BASE_URL}/api/profile/verify-student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token || ''
            },
            body: JSON.stringify({ institutionName })
        });
        const data = await res.json();
        if (res.ok) {
            toast.success(data.message);
            if (user) {
              const updatedUser = { ...user, ...data.user };
              localStorage.setItem('pmdb_user', JSON.stringify(updatedUser));
            }
            setTimeout(() => window.location.reload(), 1500);
        } else {
            toast.error(data.message);
        }
    } catch (err) {
        toast.error("Failed to submit verification");
    } finally {
        setIsVerifyingStudent(false);
    }
  };

  const handleTestChannel = async (id: number) => {
    try {
        await testChannel(id);
        toast.success("Test notification sent!");
    } catch (err: any) {
        toast.error(err.message || "Failed to send test");
    }
  };

  return (
    <div className="space-y-10 max-w-4xl pb-20 relative">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and API preferences.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1 sticky top-0 py-2">
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => handleTabChange('profile')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'profile' ? 'bg-accent text-primary' : 'hover:bg-accent text-muted-foreground'}`}
            >
              <User size={16} /> Profile
            </button>
            <button 
              onClick={() => handleTabChange('security')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'security' ? 'bg-accent text-primary' : 'hover:bg-accent text-muted-foreground'}`}
            >
              <Lock size={16} /> Security
            </button>
            <button 
              onClick={() => handleTabChange('notifications')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'notifications' ? 'bg-accent text-primary' : 'hover:bg-accent text-muted-foreground'}`}
            >
              <Bell size={16} /> Notifications
            </button>
          </nav>
        </div>

        <div className="lg:col-span-3 space-y-10">
          {activeTab === 'profile' && (
            <section className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User size={20} className="text-muted-foreground" /> Personal Information
              </h2>
              
              <form onSubmit={handleSave} className="bg-card border rounded-2xl p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b">
                  <img src={selectedAvatar} className="w-20 h-20 rounded-2xl border bg-muted" alt="Avatar" />
                  <div>
                    <button 
                        type="button" 
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="text-sm font-bold text-primary hover:underline"
                    >
                        Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full rounded-xl border bg-accent/30 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email Account</label>
                    <input 
                      disabled
                      type="email" 
                      className="w-full rounded-xl border bg-muted p-3 text-sm opacity-60"
                      value={user?.email || ''}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold border-t pt-6">Email Change Security</h3>
                  <div className="grid md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        To update your email, we require verification from both your current and new addresses.
                      </p>
                    </div>
                    <div className="space-y-2">
                        {emailStep === 'idle' && (
                            <button 
                              type="button"
                              onClick={handleStartEmailChange}
                              disabled={isEmailLoading}
                              className="w-full bg-accent hover:bg-accent/80 p-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-border/50"
                            >
                              {isEmailLoading ? <RefreshCw className="animate-spin" size={16} /> : <Mail size={16} />}
                              Begin Email Change
                            </button>
                        )}
                        {(emailStep === 'verifying_current' || emailStep === 'verifying_new' || emailStep === 'entering_new') && (
                            <button 
                              type="button"
                              onClick={() => setEmailStep('idle')}
                              className="text-xs text-muted-foreground hover:text-primary underline mb-2 ml-auto block"
                            >
                              Cancel Process
                            </button>
                        )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {emailStep === 'verifying_current' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-accent/30 p-6 rounded-2xl border border-dashed border-primary/30 space-y-4"
                      >
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">1</span>
                          Verify Current Address
                        </p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter 6-digit OTP"
                            className="flex-1 rounded-xl border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={currentEmailOtp}
                            onChange={(e) => setCurrentEmailOtp(e.target.value)}
                            maxLength={6}
                          />
                          <button 
                            type="button"
                            onClick={handleVerifyCurrentOtp}
                            disabled={isEmailLoading || currentEmailOtp.length !== 6}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            Verify
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {emailStep === 'entering_new' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-accent/30 p-6 rounded-2xl border border-dashed border-primary/30 space-y-4"
                      >
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">2</span>
                          Enter New Email
                        </p>
                        <div className="flex flex-col gap-3">
                          <input 
                            type="email" 
                            placeholder="new-email@example.com"
                            className="w-full rounded-xl border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <button 
                            type="button"
                            onClick={handleSendNewEmailOtp}
                            disabled={isEmailLoading}
                            className="bg-primary text-primary-foreground w-full py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                          >
                            Get Pin for New Email
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {emailStep === 'verifying_new' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-accent/30 p-6 rounded-2xl border border-dashed border-emerald-500/30 space-y-4"
                      >
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">3</span>
                          Final Confirmation
                        </p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter final OTP"
                            className="flex-1 rounded-xl border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={newEmailOtp}
                            onChange={(e) => setNewEmailOtp(e.target.value)}
                            maxLength={6}
                          />
                          <button 
                            type="button"
                            onClick={handleVerifyNewOtp}
                            disabled={isEmailLoading || newEmailOtp.length !== 6}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                          >
                            Confirm Update
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-end border-t pt-6 mt-4">
                  <button 
                    type="submit"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              {/* Student Verification */}
              <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-8">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                           <Shield size={20} className="text-primary" /> Student Status
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">Access specialized pricing ($0.99/mo) for your academic projects.</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-accent/30 px-4 py-2 rounded-2xl border border-border/50">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Are you a student?</span>
                        <button 
                            type="button"
                            onClick={() => {
                                if (user?.plan === 'student') {
                                    toast.error("You cannot disable student status while on the Student plan.");
                                    return;
                                }
                                setIsStudentToggle(!isStudentToggle);
                            }}
                            className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 ${isStudentToggle ? 'bg-primary shadow-inner' : 'bg-muted'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${isStudentToggle ? 'translate-x-5' : ''}`} />
                        </button>
                    </div>
                 </div>

                 <AnimatePresence>
                    {isStudentToggle && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6 pt-4 border-t border-dashed"
                        >
                            {user?.student_status === 'verified' ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-4 text-emerald-600 dark:text-emerald-500">
                                   <div className="p-3 bg-emerald-500/20 rounded-xl">
                                      <CheckCircle2 size={24} className="shrink-0" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold">Student Status Verified!</p>
                                      <p className="text-xs font-medium opacity-80">You're currently authorized as a student from {user.institution_name}.</p>
                                   </div>
                                </div>
                            ) : user?.student_status === 'pending' ? (
                                <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl flex items-center gap-4 text-amber-600 dark:text-amber-500">
                                   <div className="p-3 bg-amber-500/20 rounded-xl">
                                      <Clock size={24} className="shrink-0" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold">Verification In Progress</p>
                                      <p className="text-xs font-medium opacity-80">Our team is reviewing your details for {user.institution_name}.</p>
                                   </div>
                                </div>
                            ) : (
                                <form onSubmit={handleVerifyStudent} className="space-y-6">
                                   <div className="space-y-2">
                                      <label className="text-sm font-semibold flex items-center gap-2">
                                        <GraduationCap size={16} className="text-primary" />
                                        University / Institution Name
                                      </label>
                                      <input 
                                         type="text" 
                                         className="w-full rounded-xl border bg-accent/30 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                         placeholder="e.g. Stanford University, IIT Delhi"
                                         value={institutionName}
                                         onChange={(e) => setInstitutionName(e.target.value)}
                                         required
                                      />
                                   </div>
                                   
                                   <div className="space-y-2">
                                      <label className="text-sm font-semibold">Student Identity Proof</label>
                                      <div className="p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-accent/30 transition-all cursor-pointer group hover:border-primary/50">
                                         <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            <Shield size={22} />
                                         </div>
                                         <div className="text-center">
                                            <p className="text-sm font-bold">Click to upload ID Card</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">PDF, JPG or PNG (Max 5MB)</p>
                                         </div>
                                      </div>
                                   </div>

                                   <button 
                                      type="submit"
                                      disabled={isVerifyingStudent}
                                      className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                   >
                                      {isVerifyingStudent ? (
                                        <>
                                            <RefreshCw className="animate-spin" size={16} /> Submitting...
                                        </>
                                      ) : 'Submit Verification Details'}
                                   </button>
                                </form>
                            )}
                        </motion.div>
                    )}
                 </AnimatePresence>
              </div>
            </section>
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings 
              channels={channels} 
              onAdd={addChannel} 
              onDelete={deleteChannel} 
              onToggle={(id, enabled) => updateChannel(id, { is_enabled: enabled })}
              onTest={handleTestChannel}
            />
          )}

          {activeTab === 'security' && (
            <section className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Lock size={20} className="text-muted-foreground" /> Security Settings
                </h2>
                
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (newPassword !== confirmPassword) {
                      toast.error("New passwords do not match");
                      return;
                    }
                    setIsChangingPassword(true);
                    try {
                      await changePassword(oldPassword, newPassword);
                      toast.success("Password updated successfully");
                      setOldPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    } catch (err: any) {
                      toast.error(err.message || "Failed to update password");
                    } finally {
                      setIsChangingPassword(false);
                    }
                  }} 
                  className="bg-card border rounded-2xl p-8 shadow-sm space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="font-bold">Change Password</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Current Password</label>
                        <input 
                          type="password" 
                          className="w-full rounded-xl border bg-accent/30 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">New Password</label>
                          <input 
                            type="password" 
                            className="w-full rounded-xl border bg-accent/30 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">Confirm New Password</label>
                          <input 
                            type="password" 
                            className="w-full rounded-xl border bg-accent/30 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit"
                      disabled={isChangingPassword}
                      className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {isChangingPassword ? <RefreshCw className="animate-spin mr-2 inline" size={16} /> : null}
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-destructive">
                  <Trash2 size={20} /> Danger Zone
                </h2>
                <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 space-y-6">
                  <div>
                    <h4 className="font-bold">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Deleting your account will permanently remove all your monitors, check logs, and account data. 
                      This action cannot be undone.
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="bg-destructive text-destructive-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-destructive/90 transition-all shadow-lg shadow-destructive/20"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </section>
          )}

          <ConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={async () => {
              setIsDeleting(true);
              try {
                await deleteAccount();
              } catch (err: any) {
                toast.error(err.message || "Failed to delete account");
                setIsDeleting(false);
                setIsDeleteModalOpen(false);
              }
            }}
            title="Delete Account?"
            message="This will permanently delete your account, all monitors, and check history. This action is irreversible. Are you sure you want to proceed?"
            confirmText="Yes, delete my account"
            variant="danger"
            isLoading={isDeleting}
          />
        </div>
      </div>

       {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border rounded-3xl shadow-2xl p-8 w-full max-w-lg relative"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black">Choose Avatar</h3>
                    <button onClick={() => setIsAvatarModalOpen(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                        <Trash2 size={20} className="rotate-45" />
                    </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {avatarOptions.map((url, i) => (
                        <button 
                            key={i}
                            type="button"
                            onClick={() => handleAvatarSelect(url)}
                            className={`relative aspect-square rounded-2xl border-2 overflow-hidden transition-all hover:scale-105 ${selectedAvatar === url ? 'border-primary ring-4 ring-primary/20' : 'border-border hover:border-primary/50'}`}
                        >
                            <img src={url} alt={`Avatar option ${i}`} className="w-full h-full object-cover bg-muted" />
                            {selectedAvatar === url && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                    <CheckCircle2 className="text-primary w-8 h-8 drop-shadow-md" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button 
                        type="button"
                        onClick={() => setIsAvatarModalOpen(false)}
                        className="px-6 py-2.5 font-bold rounded-xl border hover:bg-accent transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

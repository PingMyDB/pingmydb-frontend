import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../src/config';
import { motion } from 'framer-motion';

const AuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    
    const [needsEmail, setNeedsEmail] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(true);

    const finishAuthWithToken = async (token: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/profile`, {
                headers: { 'token': token }
            });
            
            if (!response.ok) throw new Error('Failed to fetch profile');
            
            const user = await response.json();
            
            const userWithExtras = {
                ...user,
                apiKey: user.api_key || 'pmdb_live_xxxxxxxxxx',
                avatarUrl: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                hasSeenOnboarding: localStorage.getItem('pmdb_onboarded') === 'true'
            };

            localStorage.setItem('pmdb_token', token);
            localStorage.setItem('pmdb_user', JSON.stringify(userWithExtras));
            
            checkAuth();
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (err) {
            console.error('Auth callback error:', err);
            toast.error('Authentication failed during setup');
            navigate('/login');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const token = searchParams.get('token');
        const needsEmailFlag = searchParams.get('needs_email');

        if (token) {
            finishAuthWithToken(token);
        } else if (needsEmailFlag === 'true') {
            setNeedsEmail(true);
            setIsProcessing(false);
        } else {
            toast.error('Authentication failed: No token provided');
            navigate('/login');
        }
    }, [searchParams]);

    const handleFinalize = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const githubId = searchParams.get('github_id');
            const name = searchParams.get('name');
            const avatar = searchParams.get('avatar');

            const res = await fetch(`${API_BASE_URL}/auth/finalize-social`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailInput,
                    github_id: githubId,
                    name,
                    avatar
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to complete setup");

            const { token, user } = data;
            const userWithExtras = {
                ...user,
                apiKey: 'pmdb_live_xxxxxxxxxx',
                avatarUrl: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                hasSeenOnboarding: false
            };

            localStorage.setItem('pmdb_token', token);
            localStorage.setItem('pmdb_user', JSON.stringify(userWithExtras));
            
            checkAuth();
            toast.success('Welcome to PingMyDb!');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (needsEmail) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-card border rounded-[2.5rem] p-10 shadow-2xl space-y-8"
                >
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Mail size={32} />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">One Last Step</h2>
                        <p className="text-muted-foreground">Your GitHub email is private. Please provide an email to complete your account.</p>
                    </div>

                    <form onSubmit={handleFinalize} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                            <input 
                                type="email" 
                                required
                                placeholder="name@company.com"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full bg-background border rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Complete Setup <ArrowRight size={20} /></>}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold tracking-tight">Completing sign-in...</h2>
                <p className="text-muted-foreground mt-2">Please wait while we set up your dashboard.</p>
            </div>
        </div>
    );
};

export default AuthCallback;

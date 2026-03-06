
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Database, Mail, Lock, Loader2, ArrowLeft, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../src/config';
=======
import { Database, Mail, Lock, Loader2, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
>>>>>>> origin/main

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
  const [emailError, setEmailError] = useState('');

  const checkEmailExists = async (checkEmail: string) => {
    if (!checkEmail || !checkEmail.includes('@')) {
      setEmailError('');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: checkEmail })
      });
      const data = await res.json();
      if (data.exists) {
        setEmailError('An account with this email already exists.');
      } else {
        setEmailError('');
      }
    } catch (e) {
      console.error(e);
    }
  };
=======
>>>>>>> origin/main

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email, password);
      toast.success('Registration successful. Welcome!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back to home
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/20">
            <Database size={24} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground mt-2">Start keeping your apps awake today</p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-xl shadow-black/5">
          <form onSubmit={handleSubmit} className="space-y-6">
<<<<<<< HEAD
            {emailError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 mb-2 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive text-sm font-medium">
                <AlertCircle size={16} /> {emailError}
              </motion.div>
            )}
=======
>>>>>>> origin/main
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
<<<<<<< HEAD
                  autoComplete="name"
=======
>>>>>>> origin/main
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                  value={email}
<<<<<<< HEAD
                  onBlur={() => checkEmailExists(email)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  autoComplete="email"
=======
                  onChange={(e) => setEmail(e.target.value)}
>>>>>>> origin/main
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
                  autoComplete="new-password"
=======
>>>>>>> origin/main
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
<<<<<<< HEAD
              disabled={isLoading || !!emailError}
=======
              disabled={isLoading}
>>>>>>> origin/main
              className="inline-flex items-center justify-center rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-4 py-2 w-full shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6 px-4">
            By clicking "Create Account", you agree to our{' '}
            <Link to="/terms" className="underline">Terms</Link> and{' '}
            <Link to="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../src/config';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { login, user, isAuthenticated, forceVerify } = useAuth();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        
        if (res.ok) {
          setStatus('success');
          setMessage('Email verified successfully!');
          if (isAuthenticated) {
            forceVerify();
          }
        } else {
          setStatus('error');
          setMessage(data.message || 'Invalid or expired verification link.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error while verifying email.');
      }
    };

    verifyToken();
  }, [token, login, navigate]);

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute bottom-1/4 -left-64 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 shadow-2xl text-center flex flex-col items-center">
          {status === 'verifying' && (
            <div className="w-20 h-20 text-primary animate-spin mb-6">
              <Loader2 size={80} />
            </div>
          )}
          
          {status === 'success' && (
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} />
            </div>
          )}

          {status === 'error' && (
            <div className="w-20 h-20 bg-destructive/20 text-destructive rounded-full flex items-center justify-center mb-6">
              <XCircle size={40} />
            </div>
          )}

          <h1 className="text-3xl font-black mb-4">
            {status === 'verifying' ? 'Verifying...' : status === 'success' ? 'Verified!' : 'Verification Failed'}
          </h1>
          
          <p className="text-muted-foreground font-medium mb-8">
            {message}
          </p>

          {(status === 'success' || status === 'error') && (
            <button
              onClick={() => navigate(isAuthenticated && status === 'success' ? '/dashboard' : '/login')}
              className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              {isAuthenticated && status === 'success' ? 'Go to Dashboard' : 'Go to Login'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

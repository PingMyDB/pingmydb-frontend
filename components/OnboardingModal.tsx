
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, Clock, CheckCircle2, ArrowRight, Loader2, X } from 'lucide-react';
import { useMonitorStore } from '../store/monitorStore';
import { useAuth } from '../context/AuthContext';

const OnboardingModal: React.FC = () => {
  const { monitors, addMonitor } = useMonitorStore();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('pmdb_onboarding_done') === '1');
  const [formData, setFormData] = useState({
    name: '',
    uri: '',
    interval_ms: 900000
  });

  const isVisible = user && !dismissed && monitors.length === 0;

  if (!isVisible) return null;

  const handleNext = () => setStep(s => s + 1);
  
  const handleFinish = async () => {
    setIsLoading(true);
    if (formData.uri) {
      try {
        await addMonitor({
          name: formData.name || 'My First Monitor',
          uri: formData.uri,
          interval_ms: formData.interval_ms,
        });
      } catch (_) {}
    }
    localStorage.setItem('pmdb_onboarding_done', '1');
    setDismissed(true);
    setIsLoading(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem('pmdb_onboarding_done', '1');
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/90 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-xl bg-card border border-primary/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Progress Indicator */}
          <div className="absolute top-6 right-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Step {step} of 3
          </div>

          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                    <img src="/favicon-96x96.png" className="w-10 h-10" alt="Logo" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Stop the Sleep Cycle.</h2>
                    <p className="text-muted-foreground mt-4 leading-relaxed">
                      Free tiers on Render, Railway, and Supabase hibernate after inactivity. 
                      PingMyDb sends lightweight heartbeats to keep your instances warm and ready for users 24/7.
                    </p>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                  >
                    Let's Go <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Zap size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Quick Connect.</h2>
                    <p className="text-muted-foreground mt-2 leading-relaxed">
                      Paste your database health URI or backend URL.
                    </p>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Database URI / URL</label>
                      <input 
                        type="url" 
                        placeholder="https://my-app.supabase.co/rest/v1/"
                        className="w-full bg-accent/30 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={formData.uri}
                        onChange={e => setFormData({...formData, uri: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Frequency</label>
                        <select 
                          className="w-full bg-accent/30 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                          value={formData.interval_ms}
                          onChange={e => setFormData({...formData, interval_ms: Number(e.target.value)})}
                        >
                          <option value={900000}>Every 15 min</option>
                          <option value={1800000}>Every 30 min</option>
                          <option value={3600000}>Every 1 hour</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Label</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Production DB"
                          className="w-full bg-accent/30 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleNext}
                    disabled={!formData.uri}
                    className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                  >
                    Start Monitoring
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8 py-4"
                >
                  <div className="relative mx-auto w-24 h-24">
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-green-500 rounded-full blur-xl"
                    />
                    <div className="relative w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20">
                      <CheckCircle2 size={48} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">You're all set.</h2>
                    <p className="text-muted-foreground mt-4 leading-relaxed max-w-sm mx-auto">
                      We've verified your endpoint. Your first ping will be recorded in the logs momentarily.
                    </p>
                  </div>
                  <button 
                    onClick={handleFinish}
                    disabled={isLoading}
                    className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Go to Dashboard'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center">
              <button 
                onClick={skipOnboarding}
                className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
              >
                Skip for now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OnboardingModal;


import React, { useMemo, useEffect } from 'react';
import { 
  CheckCircle2, 
  Zap, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  CreditCard,
  Database,
  ArrowLeft,
  Info,
  Layers,
  Sparkles,
  ChevronRight,
  Sun,
<<<<<<< HEAD
  Moon,
  AlertTriangle,
  Github
=======
  Moon
>>>>>>> origin/main
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useMonitorStore } from '../store/monitorStore';
import { toast } from 'sonner';
import { API_BASE_URL } from '../src/config';
<<<<<<< HEAD
import ConfirmationModal from '../components/ConfirmationModal';
=======
import TeamManagement from '../components/TeamManagement';
>>>>>>> origin/main

interface PricingCardProps {
  key?: string | number;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  isCurrent?: boolean;
  usageText?: string;
  usagePercent?: number;
  originalPrice?: string;
  index: number;
  onClick?: () => void;
}

const PricingCard = ({ 
  name, 
  price, 
  description, 
  features, 
  isPopular, 
  ctaText,
  isCurrent,
  usageText,
  usagePercent,
  originalPrice,
  index,
  onClick
}: PricingCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden group ${
      isCurrent
        ? 'bg-primary shadow-2xl shadow-primary/20 border-white/20'
        : 'bg-card/40 backdrop-blur-xl border-border hover:border-primary/50 shadow-xl'
    }`}
  >
    {/* Background Glows for Cards */}
    <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] transition-opacity duration-700 opacity-20 group-hover:opacity-40 ${isCurrent ? 'bg-white' : 'bg-primary'}`} />
    
    {isCurrent && (
      <div className="absolute top-6 right-8 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10">
        Current Plan
      </div>
    )}

    <div className="relative z-10">
      <div className="mb-8">
        <h3 className={`text-2xl font-black mb-2 flex items-center gap-2 ${isCurrent ? 'text-white' : 'text-foreground'}`}>
          {name}
          {isCurrent && <Sparkles size={18} className="text-white/80" />}
        </h3>
        <p className={`text-sm leading-relaxed ${isCurrent ? 'text-white/70' : 'text-muted-foreground'}`}>{description}</p>
      </div>

      <div className="mb-8 items-baseline gap-2">
        <div className="flex flex-col">
          {originalPrice && (
            <span className={`text-sm line-through font-medium mb-1 ${isCurrent ? 'text-white/40' : 'text-muted-foreground/50'}`}>{originalPrice}</span>
          )}
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-black tracking-tight ${isCurrent ? 'text-white' : 'text-foreground'}`}>{price}</span>
<<<<<<< HEAD
            {price !== '$0' && <span className={`font-semibold text-sm ${isCurrent ? 'text-white/60' : 'text-muted-foreground'}`}>/mo</span>}
=======
            {price !== '₹0' && <span className={`font-semibold text-sm ${isCurrent ? 'text-white/60' : 'text-muted-foreground'}`}>/mo</span>}
>>>>>>> origin/main
          </div>
        </div>
      </div>

      {/* Usage Stats (Dashboard-only enhancement) */}
      {isCurrent && usageText !== undefined && (
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/80">
            <span>Monitor Capacity</span>
            <span>{usageText}</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${usagePercent}%` }}
              transition={{ duration: 1, ease: "circOut" }}
              className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
          </div>
        </div>
      )}

      <ul className="space-y-4 mb-10 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <div className={`shrink-0 mt-1 p-0.5 rounded-full ${isCurrent ? 'bg-white/20' : 'bg-primary/10'}`}>
              <CheckCircle2 size={14} className={isCurrent ? 'text-white' : 'text-primary'} />
            </div>
            <span className={`font-semibold ${isCurrent ? 'text-white' : 'text-foreground/80'}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        disabled={isCurrent || (ctaText === 'Processing...')}
        onClick={onClick}
        className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group/btn ${
          isCurrent || (ctaText === 'Processing...')
            ? 'bg-white text-primary cursor-default opacity-90'
            : 'bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] hover:shadow-primary/40 active:scale-95'
        }`}
      >
        {ctaText}
        {!isCurrent && ctaText !== 'Processing...' && <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}
      </button>
    </div>
  </motion.div>
);

const PlanMetric = ({ icon: Icon, label, value, subvalue }: { icon: any; label: string; value: string; subvalue?: string }) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.02 }}
    className="flex items-center gap-5 p-6 rounded-[2rem] bg-card/30 backdrop-blur-md border border-border group hover:border-primary/20 transition-all shadow-lg"
  >
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner">
      <Icon size={28} />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <h4 className="text-2xl font-black tracking-tight text-foreground">{value}</h4>
        {subvalue && <span className="text-sm font-bold text-muted-foreground/60">/ {subvalue}</span>}
      </div>
    </div>
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="p-6 rounded-3xl bg-card border border-border hover:shadow-lg transition-all"
  >
    <h4 className="font-black text-lg mb-3 flex items-center gap-2 text-foreground">
      <div className="w-2 h-2 rounded-full bg-primary" />
      {question}
    </h4>
    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
      {answer}
    </p>
  </motion.div>
);

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const { monitors } = useMonitorStore();
  const location = useLocation();
  const isInDashboard = location.pathname.startsWith('/dashboard');
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Theme toggle logic to match LandingPage
  const [isDark, setIsDark] = React.useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'light' || (!savedTheme && !systemDark)) {
      setIsDark(false);
    } else {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const [showAllPlans, setShowAllPlans] = React.useState(!user);
<<<<<<< HEAD

   const [isProcessing, setIsProcessing] = React.useState<string | null>(null);
   const [isCancelling, setIsCancelling] = React.useState(false);
   const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);

   const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
        const token = localStorage.getItem('pmdb_token');
        const res = await fetch(`${API_BASE_URL}/api/payments/cancel-subscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token || ''
            }
        });
        const data = await res.json();
        if (res.ok) {
            toast.success(data.message);
            // Update local user data
            if (user) {
                const updatedUser = { ...user, cancel_at_period_end: true };
                localStorage.setItem('pmdb_user', JSON.stringify(updatedUser));
                setTimeout(() => window.location.reload(), 1500);
            }
        } else {
            toast.error(data.message);
        }
    } catch (err) {
        toast.error("Failed to cancel subscription");
    } finally {
        setIsCancelling(false);
    }
  };
=======
  const [currency, setCurrency] = React.useState<'INR' | 'USD'>('INR');

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_code !== 'IN') {
          setCurrency('USD');
        }
      } catch (e) {
        console.error('Failed to detect country:', e);
      }
    };
    fetchCountry();
  }, []);

  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);
>>>>>>> origin/main

  const handleUpgrade = async (planId: string, amount: number) => {
    if (!user) {
        window.location.href = '/login';
        return;
    }

    if (planId === 'free') {
<<<<<<< HEAD
        toast.error("You cannot downgrade to free plan automatically. Please use the cancel button instead.");
=======
        toast.error("You cannot downgrade to free plan automatically. Please contact support.");
>>>>>>> origin/main
        return;
    }

    if (planId === 'student' && user.student_status !== 'verified') {
        toast.error("Please verify your student status in Settings first.");
        setTimeout(() => {
            window.location.href = '/dashboard/settings?tab=profile';
        }, 1500);
        return;
    }

<<<<<<< HEAD
    const token = localStorage.getItem('pmdb_token');

    try {
        setIsProcessing(planId);
=======
    try {
        setIsProcessing(planId);
        const token = localStorage.getItem('pmdb_token');
>>>>>>> origin/main
        
        // 1. Create Order
        const orderRes = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token || ''
            },
            body: JSON.stringify({
                amount: amount, 
<<<<<<< HEAD
                currency: 'USD',
=======
                currency: currency,
>>>>>>> origin/main
                planId: planId
            })
        });

        const orderData = await orderRes.json();

        if (!orderRes.ok) {
            throw new Error(orderData.message || "Failed to create order");
        }

        // 2. Open Razorpay
        const options = {
            key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID, 
            amount: orderData.amount,
            currency: orderData.currency,
            name: "PingMyDb",
            description: `Upgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
            order_id: orderData.id,
            handler: async function (response: any) {
<<<<<<< HEAD
                const verificationToast = toast.loading("Verifying payment...");
                
                try {
=======
                // Show a "Verifying..." toast that we can update later
                const verificationToast = toast.loading("Verifying your payment...");
                
                try {
                     // 3. Verify Payment
>>>>>>> origin/main
                     const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify-payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token || ''
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: planId
                        })
                    });

                    const verifyData = await verifyRes.json();

                    if (!verifyRes.ok) {
                         toast.error(verifyData.message || "Payment verification failed", { id: verificationToast });
                         setIsProcessing(null);
                         return;
                    }

                    toast.success("Upgrade successful!", { id: verificationToast });
<<<<<<< HEAD
                    localStorage.setItem('pmdb_user', JSON.stringify(verifyData.user));
                    setIsProcessing(null);
                    setShowAllPlans(false);
                    setTimeout(() => window.location.reload(), 1000);

                } catch (err) {
=======
                    
                    // Update local user and reload to reflect changes
                    const currentUser = JSON.parse(localStorage.getItem('pmdb_user') || '{}');
                    const updatedUser = { ...currentUser, ...verifyData.user };
                    localStorage.setItem('pmdb_user', JSON.stringify(updatedUser));
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);

                } catch (err) {
                    console.error(err);
>>>>>>> origin/main
                    toast.error("Verification error", { id: verificationToast });
                    setIsProcessing(null);
                }
            },
            prefill: {
                name: user.name,
                email: user.email,
            },
<<<<<<< HEAD
            theme: { color: "#3b82f6" },
=======
            theme: {
                color: "#3b82f6"
            },
>>>>>>> origin/main
            modal: {
                ondismiss: function() {
                    setIsProcessing(null);
                    toast.info("Payment cancelled");
                }
            }
        };

        const rzp1 = new (window as any).Razorpay(options);
<<<<<<< HEAD
        rzp1.on('payment.failed', function (response: any){
            setIsProcessing(null);
            toast.error(response.error.description || "Payment declined");
        });
=======
        
        rzp1.on('payment.failed', function (response: any){
            setIsProcessing(null);
            const errorMsg = response.error.description || "Payment declined";
            toast.error(errorMsg);
            console.error("Payment Failed:", response.error);
        });

>>>>>>> origin/main
        rzp1.open();

    } catch (err: any) {
        setIsProcessing(null);
<<<<<<< HEAD
=======
        console.error(err);
>>>>>>> origin/main
        toast.error(err.message || "Payment initialization failed");
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Starter',
<<<<<<< HEAD
      price: '$0',
=======
      price: currency === 'INR' ? '₹0' : '$0',
>>>>>>> origin/main
      priceValue: 0,
      limit: 2,
      description: 'The foundation for your small project monitoring.',
      features: [
        '2 Active Monitors',
<<<<<<< HEAD
        '12-hour ping interval',
=======
        '1-hour ping interval',
>>>>>>> origin/main
        '24-hour log retention',
        'Standard Email alerts',
      ],
      ctaText: 'Downgrade'
    },
    {
      id: 'student',
      name: 'Student',
<<<<<<< HEAD
      price: '$0.99',
      priceValue: 0.99,
      originalPrice: '$1.99',
=======
      price: currency === 'INR' ? '₹39' : '$1',
      priceValue: currency === 'INR' ? 39 : 1,
      originalPrice: currency === 'INR' ? '₹79' : '$2',
>>>>>>> origin/main
      limit: 5,
      description: 'Empowering students to keep their apps alive.',
      features: [
        '5 Active Monitors',
<<<<<<< HEAD
        '1-hour ping interval',
        '3-day log history',
=======
        '10-minute ping interval',
        '7-day log history',
>>>>>>> origin/main
        'Email & Discord alerts',
        'Full API access',
      ],
      ctaText: 'Get Student Access'
    },
    {
      id: 'pro',
      name: 'Pro',
<<<<<<< HEAD
      price: '$3.99',
      priceValue: 3.99,
      originalPrice: '$7.99',
=======
      price: currency === 'INR' ? '₹99' : '$3.99',
      priceValue: currency === 'INR' ? 99 : 3.99,
      originalPrice: currency === 'INR' ? '₹199' : '$7.99',
>>>>>>> origin/main
      limit: 20,
      description: 'Production-grade reliability for developers.',
      isPopular: true,
      features: [
        '20 Active Monitors',
        '3 Team Seats',
<<<<<<< HEAD
        '1-hour ping interval',
        '15-day log history',
=======
        '10-minute ping interval',
        '30-day log history',
>>>>>>> origin/main
        'Discord, Slack & Email alerts',
        'Full API & Webhooks',
      ],
      ctaText: 'Go Pro Now'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
<<<<<<< HEAD
      price: '$9.99',
      priceValue: 9.99,
      originalPrice: '$19.99',
      limit: 150,
      description: 'Scale without limits for your entire team.',
      features: [
        '150 Active Monitors',
        'Unlimited Team Seats',
        '5-minute ping interval',
        '30-day detailed logs',
=======
      price: currency === 'INR' ? '₹399' : '$9.99',
      priceValue: currency === 'INR' ? 399 : 9.99,
      originalPrice: currency === 'INR' ? '₹799' : '$19.99',
      limit: 1000,
      description: 'Scale without limits for your entire team.',
      features: [
        '1000 Active Monitors',
        'Unlimited Team Seats',
        '1-minute ping interval',
        '90-day detailed logs',
>>>>>>> origin/main
        'Priority 24/7 support',
        'Team collaboration',
      ],
      ctaText: 'Get Enterprise'
    }
  ];

  const billingInfo = useMemo(() => {
    if (!user) return null;
    const signupDate = user.created_at ? new Date(user.created_at) : new Date();
    const today = new Date();
<<<<<<< HEAD
    const nextBilling = user.current_period_end ? new Date(user.current_period_end) : new Date(signupDate);
    
    if (!user.current_period_end) {
        while (nextBilling <= today) {
            nextBilling.setDate(nextBilling.getDate() + 30);
        }
    }

    const currentPlan = plans.find(p => p.id === user.plan) || plans[0];
    return {
      date: nextBilling.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }),
=======
    const nextBilling = new Date(signupDate);
    while (nextBilling <= today) {
      nextBilling.setDate(nextBilling.getDate() + 30);
    }
    const currentPlan = plans.find(p => p.id === user.plan) || plans[0];
    return {
      date: nextBilling.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' }),
>>>>>>> origin/main
      amount: currentPlan.priceValue.toFixed(2)
    };
  }, [user]);

  const visiblePlans = useMemo(() => {
    if (!user || showAllPlans) return plans;
    return plans.filter(p => p.id === user.plan);
  }, [user, showAllPlans]);

  const content = (
    <div className={`space-y-16 ${isInDashboard ? '' : 'max-w-7xl mx-auto py-24 px-6'}`}>
      
      {/* Premium Usage Dashboard (Only in Dashboard) */}
      {isInDashboard && user && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">Account Hub</p>
              <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
                Plan Overview <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground/80 bg-accent/30 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/5 shadow-inner">
              <ShieldCheck size={16} className="text-green-500" />
              Security Status: <span className="text-foreground">Verified</span>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PlanMetric 
              icon={Layers} 
              label="Subscription Tier" 
              value={(plans.find(p => p.id === user.plan)?.name || 'Starter')} 
            />
            <PlanMetric 
              icon={Database} 
              label="Current Capacity" 
              value={monitors.length.toString()} 
<<<<<<< HEAD
              subvalue={plans.find(p => p.id === user.plan)?.limit?.toString()}
=======
              subvalue={(plans.find(p => p.id === user.plan)?.limit === 1000 ? '∞' : plans.find(p => p.id === user.plan)?.limit.toString())}
>>>>>>> origin/main
            />
            <PlanMetric 
              icon={Globe} 
              label="Optimal Interval" 
              value={plans.find(p => p.id === user.plan)?.features.find(f => f.includes('interval'))?.replace(' ping interval', '') || '1-hour'} 
            />
          </div>

          <motion.div 
            whileHover={{ scale: 1.005 }}
            className="group relative p-10 rounded-[3rem] border border-white/5 bg-gradient-to-br from-card/60 via-card/40 to-primary/5 backdrop-blur-3xl overflow-hidden shadow-2xl"
          >
             {/* Animated Gradient Background */}
             <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="absolute top-0 right-0 p-16 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none">
                <CreditCard size={200} />
             </div>
             
             <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="max-w-xl">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                     <Sparkles size={12} /> Billing Schedule
                   </div>
                   <h3 className="text-3xl font-black mb-4">Subscription Intelligence</h3>
<<<<<<< HEAD
                   {billingInfo && user?.role !== 'admin' && (
                     <p className="text-lg text-muted-foreground/80 leading-relaxed font-medium">
                       Your next automated maintenance cycle for <span className="text-foreground font-black underline decoration-primary decoration-4 underline-offset-4">${billingInfo.amount}</span> is scheduled for <span className="text-foreground font-black">{billingInfo.date}</span>.
                     </p>
                   )}
                   {user?.role === 'admin' && (
                     <p className="text-lg text-muted-foreground/80 leading-relaxed font-medium">
                       You are an Administrator. Billing and payment cycles are managed externally and your premium access is permanent.
=======
                   {billingInfo && (
                     <p className="text-lg text-muted-foreground/80 leading-relaxed font-medium">
                       Your next automated maintenance cycle for <span className="text-foreground font-black underline decoration-primary decoration-4 underline-offset-4">₹{billingInfo.amount}</span> is scheduled for <span className="text-foreground font-black">{billingInfo.date}</span>.
>>>>>>> origin/main
                     </p>
                   )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                   {!showAllPlans && (
                     <button 
                       onClick={() => setShowAllPlans(true)}
                       className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-sm font-black shadow-2xl shadow-primary/30 hover:scale-[1.05] hover:shadow-primary/50 transition-all active:scale-95"
                     >
                       Explore Tiers
                     </button>
                   )}
<<<<<<< HEAD
                   {user?.role !== 'admin' && (
                     <button className="px-8 py-4 rounded-2xl bg-card border border-white/10 hover:bg-accent transition-all flex items-center gap-3 text-sm font-black shadow-lg">
                       <CreditCard size={18} /> Financial Portal
                     </button>
                   )}
                    {user?.role !== 'admin' && user.plan !== 'free' && !user.cancel_at_period_end && (
                      <button 
                        onClick={() => setIsCancelModalOpen(true)}
                        disabled={isCancelling}
                        className="px-8 py-4 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white transition-all text-sm font-black shadow-lg"
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                      </button>
                    )}
                    {user?.role !== 'admin' && user.cancel_at_period_end && (
                      <div className="px-8 py-4 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 text-sm font-black flex items-center gap-2">
                        <AlertTriangle size={18} /> Cancellation Pending
                      </div>
                    )}
                 </div>
             </div>
          </motion.div>

           <ConfirmationModal 
             isOpen={isCancelModalOpen}
             onClose={() => setIsCancelModalOpen(false)}
             onConfirm={() => {
               setIsCancelModalOpen(false);
               handleCancelSubscription();
             }}
             title="Cancel Subscription?"
             message="Are you sure you want to cancel? Your premium features will remain active until the end of your current billing cycle, after which you'll be moved to the free plan."
             confirmText="Yes, Cancel"
             cancelText="Keep Plan"
             variant="warning"
           />

=======
                   <button className="px-8 py-4 rounded-2xl bg-card border border-white/10 hover:bg-accent transition-all flex items-center gap-3 text-sm font-black shadow-lg">
                     <CreditCard size={18} /> Financial Portal
                   </button>
                </div>
             </div>
          </motion.div>

          {/* Team Management Section (New) */}
          {user.plan !== 'free' && (
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl"
             >
                 <TeamManagement />
             </motion.div>
          )}
>>>>>>> origin/main
        </motion.div>
      )}

      {/* Launch Banner (Always shown if not on Enterprise plan) */}
      {user?.plan !== 'enterprise' && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-primary via-primary/80 to-primary-foreground/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl shadow-primary/20"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xl border border-white/10">
              <Zap size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Early Adopter Privilege</h3>
              <p className="text-white/80 font-semibold">Deploy <span className="bg-white/20 px-2 py-0.5 rounded text-white font-mono">LAUNCH50</span> during tier transition for lifetime -50% rates.</p>
            </div>
          </div>
          <button className="relative z-10 px-6 py-3 bg-white text-primary rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform active:scale-95">
            Copy Code
          </button>
        </motion.div>
      )}

      {/* Pricing Section */}
      <div className="space-y-16">
        <div className="text-center space-y-6">
          {!isInDashboard ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                Power Up.
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed mb-8">
                Sophisticated monitoring architecture for developers who demand the absolute maximum uptime.
              </p>
            </motion.div>
          ) : showAllPlans && (
            <div className={`flex flex-col items-center gap-6 ${isInDashboard ? '' : 'mt-8'}`}>
               {showAllPlans && isInDashboard && (
                 <>
                  <h3 className="text-4xl font-black tracking-tight">Select Future Tier</h3>
                  <button 
                    onClick={() => setShowAllPlans(false)}
                    className="group px-5 py-2.5 rounded-2xl bg-accent text-sm font-black flex items-center gap-3 hover:text-primary transition-colors border border-border"
                  >
                      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                      Return to Dashboard
                  </button>
                 </>
               )}
            </div>
          )}
        </div>

        <div className={`grid gap-8 ${visiblePlans.length === 1 ? 'max-w-lg mx-auto' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {visiblePlans.map((plan, idx) => {
            const isCurrentPlan = !!user && user.plan === plan.id;
            const usagePercent = isCurrentPlan ? Math.min((monitors.length / plan.limit) * 100, 100) : 0;
<<<<<<< HEAD
            const usageText = isCurrentPlan ? `${monitors.length} / ${plan.limit}` : '';
=======
            const usageText = isCurrentPlan ? `${monitors.length} / ${plan.limit === 1000 ? '∞' : plan.limit}` : '';
>>>>>>> origin/main
            
            let ctaText = plan.ctaText;
            if (!user) {
              ctaText = plan.id === 'free' ? 'Deploy Free' : `Get ${plan.name}`;
            } else if (!isCurrentPlan) {
              const currentPlan = plans.find(p => p.id === user.plan);
              ctaText = plan.priceValue > (currentPlan?.priceValue || 0) ? `Upgrade to ${plan.name}` : `Downgrade to ${plan.name}`;
            }

            return (
              <PricingCard 
                key={plan.id}
                index={idx}
                name={plan.name}
                price={plan.price}
                originalPrice={plan.originalPrice}
                description={plan.description}
                features={plan.features}
                isPopular={plan.isPopular}
                ctaText={isProcessing === plan.id ? 'Processing...' : ctaText}
                isCurrent={isCurrentPlan && !showAllPlans} 
                usagePercent={usagePercent}
                usageText={usageText}
                onClick={user && isCurrentPlan ? undefined : () => handleUpgrade(plan.id, plan.priceValue)}
              />
            );
          })}
        </div>
      </div>



      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="p-12 rounded-[3.5rem] border border-border bg-gradient-to-br from-card/30 to-accent/10 backdrop-blur-3xl relative overflow-hidden"
      >
         <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="p-6 bg-primary/10 rounded-[2rem] text-primary shadow-inner">
               <Info size={40} />
            </div>
            <div className="flex-1 text-center md:text-left">
               <h4 className="text-2xl font-black mb-3">Custom Enterprise Architecture?</h4>
               <p className="text-muted-foreground font-medium leading-relaxed">
                 For high-volume distribution or specialized regional monitoring clusters, 
                 our engineers can architect a bespoke solution tailored to your exact SLA requirements.
               </p>
            </div>
            <button className="px-10 py-5 bg-foreground text-background rounded-3xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Consult Sales
            </button>
         </div>
      </motion.div>

      {/* FAQ Version 2.0 */}
      {!isInDashboard && (
        <section className="pt-32 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-black tracking-tight mb-16 text-center">Protocol FAQ</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <FAQItem 
                question="Monitoring Mechanics?" 
                answer="We execute cryptographic pings at your specified frequency. Each check undergoes latency validation and TLS handshake verification." 
              />
              <FAQItem 
                question="Scalable Migration?" 
                answer="Transition between tiers is instantaneous. Your monitoring tokens and historical data logs persist through all infrastructure upgrades." 
              />
              <FAQItem 
                question="Global Infrastructure?" 
                answer="Our nodes are distributed globally to ensure your database is accessible and warm from any production environment." 
              />
              <FAQItem 
                question="SLA Guarantee?" 
                answer="We maintain 99.99% infrastructure uptime, ensuring your side projects never sleep and your production apps stay warm." 
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );

  if (isInDashboard) {
    return (
      <div className="bg-transparent">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground selection:bg-primary/20 transition-colors duration-300">
       <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
       </div>
       <nav className="fixed top-0 w-full z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <Database size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight">PingMyDb</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-border bg-card/50 hover:bg-accent text-muted-foreground transition-all flex items-center justify-center"
              >
                {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-500" />}
              </button>
              {user ? (
                <Link to="/dashboard" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block px-4 py-2 border border-border rounded-lg bg-card/30">
                    Login
                  </Link>
                  <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
       </nav>

       {content}

       <footer className="border-t border-border py-20 text-center bg-muted/20">
<<<<<<< HEAD
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Database size={18} />
            </div>
            <span className="text-lg font-black tracking-widest uppercase">PingMyDb</span>
          </div>
          <div className="flex items-center gap-4">
             <a href="https://github.com/orgs/PingMyDB/repositories" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-border bg-card hover:bg-accent transition-all text-muted-foreground hover:text-primary">
                <Github size={18} />
             </a>
          </div>
          <p className="text-sm text-muted-foreground font-medium">&copy; {new Date().getFullYear()} PingMyDb. All rights reserved.</p>
        </div>
=======
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Database size={18} />
          </div>
          <span className="text-lg font-black tracking-widest uppercase">PingMyDb</span>
        </div>
        <p className="text-sm text-muted-foreground font-medium">&copy; {new Date().getFullYear()} PingMyDb. All rights reserved.</p>
>>>>>>> origin/main
      </footer>
    </div>
  );
};

export default PricingPage;

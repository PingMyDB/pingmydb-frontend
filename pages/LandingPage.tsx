
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';
import { 
  Database, 
  Clock, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Activity,
  Server,
  Network,
  Eye,
  Github,
  Twitter,
  Check,
  Lock,
  Globe,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DEMO_STEPS = [
  {
    title: "Beautiful Dashboard",
    description: "Get a bird's-eye view of your database health. Track uptime and latency in real-time with vibrant, interactive charts.",
    image: "/demo/dashboard.png"
  },
  {
    title: "Add Monitors in Seconds",
    description: "Choosing between Personal or Team workspaces. Just paste your URI, and we'll detect the database type automatically.",
    image: "/demo/add_monitor.png"
  },
  {
    title: "Instant Alerts",
    description: "Never miss a downtime. Get notified instantly via Slack, Discord, or Email the moment your database goes offline.",
    image: "/demo/notifications.png"
  },
  {
    title: "Team Collaboration",
    description: "Work together. Invite colleagues, assign roles, and manage shared monitors seamlessly in a unified workspace.",
    image: "/demo/team.png"
  }
];

const DemoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-5xl bg-card border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/50 border hover:bg-accent transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
              Step {currentStep + 1} of {DEMO_STEPS.length}
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {DEMO_STEPS[currentStep].title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {DEMO_STEPS[currentStep].description}
            </p>
            
            <div className="flex items-center gap-4 pt-8">
              <button 
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="p-4 rounded-2xl border bg-accent/50 hover:bg-accent transition-all disabled:opacity-30"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => {
                  if (currentStep === DEMO_STEPS.length - 1) onClose();
                  else setCurrentStep(prev => prev + 1);
                }}
                className="flex-1 bg-primary text-primary-foreground px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
              >
                {currentStep === DEMO_STEPS.length - 1 ? "Got it!" : "Next Step"}
                {currentStep !== DEMO_STEPS.length - 1 && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 bg-muted/30 p-4 md:p-8 flex items-center justify-center border-l border-border/50">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="w-full h-full rounded-2xl overflow-hidden border shadow-inner bg-background"
             >
               <img 
                 src={DEMO_STEPS[currentStep].image} 
                 alt={DEMO_STEPS[currentStep].title}
                 className="w-full h-auto object-cover"
               />
             </motion.div>
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const MonitoringMockup = () => {
  return (
    <div className="relative w-full h-full bg-slate-950 rounded-2xl border border-white/5 shadow-2xl p-6 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative z-10 w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] border border-white/20"
      >
        <Activity size={40} className="text-white" />
      </motion.div>

      {[
        { icon: Database, label: "Supabase", pos: "top-10 left-10", color: "text-emerald-400" },
        { icon: Server, label: "MongoDB", pos: "top-10 right-10", color: "text-green-400" },
        { icon: Network, label: "Neon", pos: "bottom-10 left-10", color: "text-blue-400" },
        { icon: Zap, label: "Railway", pos: "bottom-10 right-10", color: "text-purple-400" }
      ].map((node, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.2 }}
          className={`absolute ${node.pos} flex flex-col items-center gap-2`}
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
            <node.icon className={node.color} size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{node.label}</span>
        </motion.div>
      ))}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
         <span className="text-xs text-white font-medium flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
           Live monitoring active
         </span>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 transition-colors duration-300">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-8 border border-primary/20">
              <Zap size={12} /> Stop the sleep cycle
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Keep your database active. <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-400">Automatically</span>. 
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
              PingMyDB periodically connects to your database to prevent it from going inactive — no queries, no cron jobs, no maintenance.
            </p>
            <p className="text-sm font-semibold text-primary/80 mb-10 max-w-xl mx-auto bg-primary/5 py-2 px-4 rounded-full border border-primary/10">
               Ideal for free-tier and low-traffic databases on Supabase, Neon, MongoDB Atlas, Railway, and Render.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary/30"
              >
                Start Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-border font-bold hover:bg-accent transition-all flex items-center justify-center gap-2 bg-card/50"
              >
                <Eye size={20} /> View Demo
              </button>
            </div>
            
            <div className="mt-20 relative p-1 rounded-[2.5rem] bg-gradient-to-b from-blue-500/20 to-transparent border border-border/40 backdrop-blur-sm shadow-2xl aspect-video max-w-3xl mx-auto group">
               <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <MonitoringMockup />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-muted/40 border-y border-border/60 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Why PingMyDB?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">Simple solutions for complex infrastructure problems.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Prevent Idle State", desc: "Prevent free-tier databases from going idle by maintaining active connectivity.", icon: Activity },
              { title: "Reduce Cold Starts", desc: "Reduce backend cold-start delays significantly, ensuring your API is always responsive.", icon: Zap },
              { title: "Custom SQL Probes", desc: "Write custom SQL (Postgres/MySQL) or MongoDB JSON queries to monitor specific business metrics.", icon: Database },
              { title: "Public Status Pages", desc: "Share real-time infrastructure health with your users via beautiful, brandable status pages.", icon: Globe },
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl border border-border bg-card/80 backdrop-blur-md shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <f.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Reassurance Section */}
      <section className="py-24 px-4 bg-background border-b border-border/60">
         <div className="max-w-4xl mx-auto text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-8 ring-8 ring-green-500/5">
                <ShieldCheck size={32} />
             </div>
             <h2 className="text-3xl font-bold mb-6">Security Reassurance</h2>
             <div className="grid md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
                <div className="flex gap-4">
                   <div className="mt-1 bg-primary/10 p-1.5 rounded-lg text-primary h-fit">
                      <Lock size={18} />
                   </div>
                   <div>
                      <h4 className="font-bold mb-2">Encrypted at Rest</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Your database URI is encrypted at rest using industry-standard AES-256 encryption.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="mt-1 bg-primary/10 p-1.5 rounded-lg text-primary h-fit">
                      <Network size={18} />
                   </div>
                   <div>
                      <h4 className="font-bold mb-2">Zero Data Access</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We only establish short-lived connections. We never run queries on your data.
                      </p>
                   </div>
                </div>
             </div>
         </div>
      </section>

      {/* Pricing Preview Section - Return to Base Background */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight">Simple, Transparent Plans.</h2>
            <p className="text-muted-foreground text-lg">Choose a plan that scales with your infrastructure.</p>
            <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest pt-2">
               Ping intervals are enforced to prevent abuse and ensure system reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Starter Preview */}
            <div className="p-8 rounded-2xl border border-border bg-card/50 flex flex-col items-center text-center">
              <h3 className="font-bold text-lg mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black">$0</span>
                <span className="text-xs text-muted-foreground font-bold">FREE</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> 2 Active Monitors</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> 12h Ping Interval</li>
              </ul>
              <button 
                onClick={() => navigate('/register')}
                className="mt-auto w-full py-2.5 rounded-xl border border-border font-bold text-xs hover:bg-accent transition-colors bg-card/30"
              >
                Get Started
              </button>
            </div>

            {/* Student Preview */}
            <div className="p-8 rounded-2xl border border-border bg-card/50 flex flex-col items-center text-center">
              <h3 className="font-bold text-lg mb-2">Student</h3>
              <div className="flex flex-col items-center mb-6">
                <span className="text-sm text-muted-foreground line-through font-bold mb-1">$1.99</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">$0.99</span>
                  <span className="text-xs text-muted-foreground font-bold">/MO</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> 5 Active Monitors</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> 1h Ping Interval</li>
              </ul>
              <button 
                onClick={() => navigate('/pricing')}
                className="mt-auto w-full py-2.5 rounded-xl border border-border font-bold text-xs hover:bg-accent transition-colors bg-card/30"
              >
                Learn More
              </button>
            </div>

            {/* Pro Preview (Highlighted) */}
            <div className="p-8 rounded-2xl border border-primary/40 bg-primary/5 relative flex flex-col items-center text-center shadow-2xl shadow-primary/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase">Most Popular</div>
              <h3 className="font-bold text-lg mb-2 text-primary">Pro Plan</h3>
              <div className="flex flex-col items-center mb-6">
                <span className="text-sm text-primary/70 line-through font-bold mb-1">$7.99</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary">$3.99</span>
                  <span className="text-xs text-primary/70 font-bold">/MO</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-primary/80">
                <li className="flex items-center gap-2"><Check size={14} /> 20 Active Monitors</li>
                <li className="flex items-center gap-2"><Check size={14} /> 1h Ping Interval</li>
                <li className="flex items-center gap-2"><Check size={14} /> Discord, Slack & Email</li>
              </ul>
              <button 
                onClick={() => navigate('/pricing')}
                className="mt-auto w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Go Pro Now
              </button>
            </div>

            {/* enterprise Preview */}
            <div className="p-8 rounded-2xl border border-border bg-card/50 flex flex-col items-center text-center">
              <h3 className="font-bold text-lg mb-2">Enterprise</h3>
              <div className="flex flex-col items-center mb-6">
                <span className="text-sm text-muted-foreground line-through font-bold mb-1">$19.99</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">$9.99</span>
                  <span className="text-xs text-muted-foreground font-bold">/MO</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> 150 Active Monitors</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> 5m Ping Interval</li>
              </ul>
              <button 
                onClick={() => navigate('/pricing')}
                className="mt-auto w-full py-2.5 rounded-xl border border-border font-bold text-xs hover:bg-accent transition-colors bg-card/30"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/pricing" className="text-sm font-bold text-primary flex items-center justify-center gap-2 hover:underline">
              View full detailed pricing comparison <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Highly Differentiated Background */}
      <footer className="py-20 border-t border-border/80 px-4 bg-muted/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                <Database size={20} />
              </div>
              <span className="text-xl font-black tracking-tight">PingMyDb</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              We help developers keep their databases active and reliable — automatically.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground">Product</h4>
            <div className="flex flex-col gap-4 text-sm text-muted-foreground font-medium">
              <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link to="/docs" className="text-left hover:text-primary transition-colors">Documentation</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground">Legal</h4>
            <div className="flex flex-col gap-4 text-sm text-muted-foreground font-medium">
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a href="https://github.com/orgs/PingMyDB/repositories" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-accent transition-colors shadow-sm">
                <Github size={18} />
              </a>
              <button className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-accent transition-colors shadow-sm"><Twitter size={18} /></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">&copy; {new Date().getFullYear()} PingMyDb. All rights reserved.</p>
        </div>
      </footer>

      <AnimatePresence>
        {isDemoOpen && (
          <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;

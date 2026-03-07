import PublicNavbar from '../components/PublicNavbar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Lock, ShieldCheck, Database, Server, Mail, Github } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-black uppercase tracking-widest mb-6"
          >
            <Lock size={14} /> Data Protection
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground font-medium"
          >
            Your privacy is our priority. Learn how we secure your data and monitor your infrastructure with integrity.
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-32">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
        >
          <div className="bg-card border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
            <div className="p-8 md:p-12 space-y-16">
              
              <section className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1">
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-2">
                    <Eye size={16} /> Data Collection
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Information We Collect</h2>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    We collect minimal data required to provide a reliable monitoring service:
                  </p>
                  <div className="grid gap-4">
                    {[
                      { icon: Mail, title: "Identity & Contact", desc: "Email address, full name, and hashed credentials." },
                      { icon: Server, title: "Infrastructure Details", desc: "Database URIs (Stored with AES-256-CBC encryption)." },
                      { icon: Database, title: "Usage Metrics", desc: "Ping latency, uptime history, and custom query results." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary shrink-0 shadow-sm border">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-sm mb-0.5">{item.title}</div>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <section className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1">
                  <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-xs mb-2">
                    <ShieldCheck size={16} /> Usage & Security
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">How We Use Data</h2>
                </div>
                <div className="md:col-span-2 space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    Your data is strictly used for service delivery. We do not sell your personal information or monitoring metrics to third parties.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span><strong>Encryption:</strong> All database connection strings are encrypted before being stored. Only our isolated monitoring workers have the keys to decrypt them during a check.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span><strong>Access Logs:</strong> We maintain internal logs for 30 days to troubleshoot monitoring failures and prevent abuse.</span>
                    </li>
                  </ul>
                </div>
              </section>

            </div>
          </div>

          <div className="text-center bg-emerald-500/[0.03] border border-emerald-500/10 rounded-3xl p-8">
            <p className="text-sm text-muted-foreground font-medium mb-4 italic">
              "We take privacy seriously because we are developers ourselves."
            </p>
            <div className="h-px w-12 bg-emerald-500/20 mx-auto mb-4" />
            <p className="text-xs text-muted-foreground">
              Questions? Reach out to <a href="mailto:privacy@pingmydb.com" className="text-emerald-600 font-bold hover:underline">privacy@pingmydb.com</a>
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Simple Footer */}
      <footer className="border-t border-border/40 py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground font-medium">
          <div className="flex items-center gap-4">
            <img src="/favicon-96x96.png" className="w-8 h-8 rounded-lg" alt="Logo" />
            <p>© 2026 <span className="text-primary">Ping</span><span className="text-foreground">MyDb</span> Systems Inc.</p>
          </div>
          <div className="flex gap-8 items-center">
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="text-foreground font-black tracking-tight">Privacy</Link>
            <a href="https://github.com/orgs/PingMyDB/repositories" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              <Github size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;

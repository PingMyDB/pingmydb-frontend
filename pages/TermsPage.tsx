import PublicNavbar from '../components/PublicNavbar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Shield, Scale, FileText, CheckCircle2, Github } from 'lucide-react';
=======
import { Shield, Scale, FileText, CheckCircle2 } from 'lucide-react';
>>>>>>> origin/main

const TermsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            <PublicNavbar />
            
            {/* Hero Section */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <Shield size={14} /> Legal Agreement
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
                    >
                        Terms of Service
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground font-medium"
                    >
                        Last updated: February 15, 2026. Please read these terms carefully before using our platform.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 pb-32">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid gap-12"
                >
                    <div className="bg-card border rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 space-y-12">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Scale size={24} />
                                <h2 className="text-2xl font-black tracking-tight">1. Acceptance of Terms</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                By accessing or using PingMyDB ("the Service"), you agree to be bound by these Terms. 
                                Our service provides database monitoring, heartbeat checks, and custom query alerting. 
                                If you disagree with any part of these terms, you may not access the Service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <FileText size={24} />
                                <h2 className="text-2xl font-black tracking-tight">2. Use License</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Permission is granted to temporarily use the PingMyDb software for monitoring your own database infrastructure. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="grid gap-3 ps-6">
                                {[
                                    "Modify or copy the proprietary code snippets.",
                                    "Use the materials for any commercial purpose beyond monitoring your own apps.",
                                    "Attempt to decompile or reverse engineer any software contained on PingMyDb's website.",
                                    "Remove any copyright or other proprietary notations from the materials."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <CheckCircle2 size={18} className="text-primary mt-1 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Shield size={24} />
                                <h2 className="text-2xl font-black tracking-tight">3. Accounts & Security</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                When you create an account with us, you must provide us information that is accurate, complete, and current. You are responsible for safeguarding the credentials and API keys provided to you. PingMyDb implements AES-256-CBC encryption for your database URIs, but you remain responsible for the security of your own database endpoints.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <Scale size={24} />
                                <h2 className="text-2xl font-black tracking-tight">4. Service Limitations</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                PingMyDb is provided "as is". While we strive for 99.99% uptime for our monitoring workers, we are not liable for any damages arising out of the use or inability to use the materials on PingMyDb's website, or any missed notifications during provider outages.
                            </p>
                        </section>
                    </div>

                    <div className="text-center bg-muted/30 border rounded-3xl p-8">
                        <p className="text-sm text-muted-foreground font-medium mb-4">
                            Have questions about our terms?
                        </p>
                        <a href="mailto:legal@pingmydb.com" className="text-primary font-bold hover:underline">
                            legal@pingmydb.com
                        </a>
                    </div>
                </motion.div>
            </div>
            
            {/* Simple Footer */}
            <footer className="border-t border-border/40 py-16 bg-muted/20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-black">P</div>
                        <p>© 2026 PingMyDb Systems Inc.</p>
                    </div>
<<<<<<< HEAD
                    <div className="flex gap-8 items-center">
                        <Link to="/terms" className="text-foreground font-black tracking-tight">Terms</Link>
                        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                        <a href="https://github.com/orgs/PingMyDB/repositories" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                          <Github size={18} />
                        </a>
=======
                    <div className="flex gap-8">
                        <Link to="/terms" className="text-foreground font-black tracking-tight">Terms</Link>
                        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
>>>>>>> origin/main
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TermsPage;

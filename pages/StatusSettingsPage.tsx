import React, { useEffect, useState } from 'react';
import { 
  Globe, 
  Settings, 
  ExternalLink, 
  Copy, 
  Check, 
  Lock, 
  Eye, 
  Zap,
  Info,
  ShieldCheck,
  Share2,
  Code2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStatusStore } from '../store/statusStore';
import { toast } from 'sonner';

const StatusSettingsPage: React.FC = () => {
    const { settings, fetchSettings, updateSettings, isLoading } = useStatusStore();
    const [slug, setSlug] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (settings) {
            setSlug(settings.status_slug || '');
            setIsPublic(settings.is_status_public || false);
        }
    }, [settings]);

    const handleSave = async () => {
        try {
            await updateSettings({ status_slug: slug, is_status_public: isPublic });
            toast.success("Status page settings updated!");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const copyUrl = () => {
        const url = `${window.location.origin}/status/${slug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.info("Status URL copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const statusUrl = `${window.location.origin}/status/${slug}`;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Public Status Page</h1>
                <p className="text-muted-foreground">Share your infrastructure health with stakeholders or customers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Settings Panel */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 mb-6">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPublic ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                                    {isPublic ? <Globe size={18} /> : <Lock size={18} />}
                                </span>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Visibility</h3>
                                    <p className="text-xs text-muted-foreground">Decide who can view your system health metrics.</p>
                                </div>
                                <div 
<<<<<<< HEAD
                                    onClick={async () => {
                                        const newVal = !isPublic;
                                        setIsPublic(newVal);
                                        try {
                                            await updateSettings({ status_slug: slug, is_status_public: newVal });
                                            toast.success(`Status page is now ${newVal ? 'Public' : 'Private'}`);
                                        } catch (err: any) {
                                            setIsPublic(!newVal); // Rollback
                                            toast.error(err.message);
                                        }
                                    }}
=======
                                    onClick={() => setIsPublic(!isPublic)}
>>>>>>> origin/main
                                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${isPublic ? 'bg-primary' : 'bg-muted'}`}
                                >
                                    <motion.div 
                                        animate={{ x: isPublic ? 24 : 4 }}
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-border" />

                        <section className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <Settings size={14} className="text-primary" />
                                    Custom URL Slug
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="bg-muted px-3 py-2 rounded-lg text-sm font-mono text-muted-foreground border">
                                        pingmydb.com/status/
                                    </div>
                                    <input 
                                        type="text" 
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        placeholder="your-org-name"
                                        className="flex-1 bg-background border rounded-lg px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground font-medium italic">
                                    * Use lowercase letters, numbers, and hyphens only.
                                </p>
                            </div>

                            {isPublic && slug && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-muted/30 rounded-xl border border-dashed flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <Share2 size={16} className="text-muted-foreground" />
                                        <span className="text-sm font-mono text-muted-foreground truncate max-w-[250px]">
                                            {statusUrl}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={copyUrl}
                                            className="p-2 hover:bg-background rounded-lg transition-colors text-primary"
                                        >
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                        <a 
                                            href={`/status/${slug}`} 
                                            target="_blank" 
                                            className="p-2 hover:bg-background rounded-lg transition-colors text-muted-foreground"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </section>

                        <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground font-black py-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Saving Intelligence...' : 'Publish Status Settings'}
                        </button>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex gap-4">
                        <Info className="text-blue-500 shrink-0" size={20} />
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-blue-500">How it works</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Once enabled, anyone with your link can view the status of all your **unpaused** monitors. This includes their current health state, recent latency, and 30-day uptime trends. Public pages refresh automatically every 30 seconds.
                            </p>
                        </div>
                    </div>

                    {/* Widget Section */}
                    {isPublic && slug && (
                         <div className="bg-card border rounded-2xl p-8 shadow-sm space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <Code2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black tracking-tight">Embed Status Widget</h3>
                                    <p className="text-xs text-muted-foreground">Add a live health badge to your app or footer.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-muted/50 rounded-xl p-4 border relative group overflow-hidden">
                                     <div className="flex justify-between items-center mb-2">
                                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">HTML Snippet</span>
                                         <button 
                                            onClick={() => {
                                                const snippet = `<script src="${window.location.origin}/widget.js" data-slug="${slug}" data-theme="dark"></script>`;
                                                navigator.clipboard.writeText(snippet);
                                                toast.success("Widget snippet copied!");
                                            }}
                                            className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors"
                                         >
                                             <Copy size={16} />
                                         </button>
                                     </div>
                                     <code className="text-xs font-mono text-muted-foreground break-all leading-relaxed">
                                         {`<script src="${window.location.origin}/widget.js" data-slug="${slug}" data-theme="dark"></script>`}
                                     </code>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-xl flex items-center justify-center bg-background">
                                        <div className="flex items-center gap-2 bg-[#f8f9fa] border border-[#e9ecef] px-3 py-1.5 rounded-lg text-xs font-bold text-[#1a1a1a]">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span>Systems: Operational</span>
                                        </div>
                                    </div>
                                    <div className="p-4 border rounded-xl flex items-center justify-center bg-accent/20">
                                        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded-lg text-xs font-bold text-white">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span>Systems: Operational</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-center text-muted-foreground italic">
                                    Change <code className="bg-muted px-1 rounded text-primary">data-theme="dark"</code> to <code className="bg-muted px-1 rounded text-primary">"light"</code> for the white version.
                                </p>
                            </div>
                         </div>
                    )}
                </div>

                {/* Right: Preview Card */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider">Preview</h3>
                    <div className="bg-card border rounded-2xl overflow-hidden shadow-2xl scale-[0.9] origin-top opacity-50 select-none pointer-events-none grayscale-[0.5]">
                        <div className="bg-muted/50 p-4 border-b flex items-center gap-2">
                            <Zap size={14} className="text-primary" fill="currentColor" />
                            <div className="h-2 w-20 bg-muted rounded-full" />
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="h-12 w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl" />
                            <div className="space-y-2">
                                <div className="h-10 w-full bg-muted/50 rounded-lg" />
                                <div className="h-10 w-full bg-muted/50 rounded-lg" />
                                <div className="h-10 w-full bg-muted/50 rounded-lg" />
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Live Monitoring Active</p>
                        <div className="flex justify-center -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusSettingsPage;

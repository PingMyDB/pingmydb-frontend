import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  AlertCircle,
  Terminal,
  Code2,
  Lock,
  ExternalLink,
  ShieldCheck,
  Calendar,
<<<<<<< HEAD
  Activity,
  AlertTriangle,
  X
=======
  Activity
>>>>>>> origin/main
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApiKeyStore } from '../store/apiKeyStore';
import { toast } from 'sonner';

const ApiKeyPage: React.FC = () => {
    const { keys, fetchKeys, generateKey, revokeKey, isLoading } = useApiKeyStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [revealedKey, setRevealedKey] = useState<string | null>(null);
    const [copiedKey, setCopiedKey] = useState(false);
<<<<<<< HEAD
    const [keyToDelete, setKeyToDelete] = useState<any>(null);
=======
>>>>>>> origin/main

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const key = await generateKey(newKeyName);
            setRevealedKey(key);
            setNewKeyName('');
            setIsGenerating(false);
            toast.success("API Key generated successfully");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
        toast.info("Copied to clipboard");
    };

<<<<<<< HEAD
    const handleDelete = async () => {
        if (!keyToDelete) return;
        try {
            await revokeKey(keyToDelete.id);
            setKeyToDelete(null);
            toast.success("API Key revoked successfully");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

=======
>>>>>>> origin/main
    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Developer API</h1>
                    <p className="text-muted-foreground text-lg">Build custom integrations and automate your database monitoring.</p>
                </div>
                <button 
                    onClick={() => setIsGenerating(true)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                >
                    <Plus size={20} /> Generate New Key
                </button>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Key List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Key size={14} /> Active API Keys
                    </h3>
                    
                    <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                        {keys.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground/50">
                                    <Lock size={32} />
                                </div>
                                <p className="text-muted-foreground font-medium">No API keys found. Generate one to start building.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {keys.map((key) => (
                                    <div key={key.id} className="p-6 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold">{key.name}</h4>
                                                <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded border font-mono">
                                                    {key.prefix}••••••••
                                                </code>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} /> Created {new Date(key.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Activity size={12} /> {key.last_used_at ? `Last used ${new Date(key.last_used_at).toLocaleTimeString()}` : 'Never used'}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
<<<<<<< HEAD
                                            onClick={() => setKeyToDelete(key)}
=======
                                            onClick={() => {
                                                if (confirm('Revoking this key will immediately break any integrations using it. Continue?')) {
                                                    revokeKey(key.id);
                                                }
                                            }}
>>>>>>> origin/main
                                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Technical Details */}
                <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <ShieldCheck size={20} />
                            <h3 className="font-bold">Security Best Practices</h3>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-3 font-medium leading-relaxed">
                            <li className="flex gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full mt-1.5 shrink-0" />
                                Never share your API keys or commit them to version control.
                            </li>
                            <li className="flex gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full mt-1.5 shrink-0" />
                                Use environment variables (`PMDB_API_KEY`) to store keys.
                            </li>
                            <li className="flex gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full mt-1.5 shrink-0" />
                                Revoke keys immediately if you suspect they are compromised.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <Terminal size={20} className="text-muted-foreground" />
                            <h3 className="font-bold">Quick Start</h3>
                        </div>
                        <div className="space-y-4">
                            <p className="text-xs text-muted-foreground font-medium">Use curl to verify your status:</p>
                            <pre className="bg-[#0d1117] text-[#c9d1d9] p-4 rounded-xl text-[10px] font-mono overflow-hidden leading-relaxed border border-white/5 shadow-inner">
                                {`curl -H "x-api-key: YOUR_KEY" \\
  https://pingmydb.com/api/v1/monitors`}
                            </pre>
                            <Link to="/docs" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                View API Documentation <ExternalLink size={12} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: Generate Key */}
            <AnimatePresence>
                {isGenerating && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsGenerating(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-card border rounded-3xl shadow-2xl p-8 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-primary">
                                <Key size={120} />
                            </div>
                            
                            <h2 className="text-2xl font-black mb-2">New API Key</h2>
                            <p className="text-muted-foreground text-sm mb-8">Give your key a descriptive name to track its usage.</p>
                            
                            <form onSubmit={handleGenerate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Key Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        autoFocus
                                        placeholder="e.g. Production CLI, Vercel Bot"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        className="w-full bg-background border rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setIsGenerating(false)}
                                        className="flex-1 py-3 rounded-xl font-bold hover:bg-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isLoading ? 'Hashing...' : 'Create Key'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: Reveal Key */}
            <AnimatePresence>
                {revealedKey && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="relative w-full max-w-xl bg-card border rounded-[2rem] shadow-2xl p-10 text-center"
                        >
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <ShieldCheck size={40} />
                            </div>
                            
                            <h2 className="text-3xl font-black mb-4">Secret Key Created</h2>
                            <p className="text-muted-foreground text-sm mb-10 max-w-sm mx-auto">
                                Copy this key now. For security purposes, we cannot show it to you again.
                            </p>
                            
                            <div className="bg-muted/50 border rounded-2xl p-4 flex items-center justify-between mb-8 group overflow-hidden">
                                <code className="font-mono font-bold text-primary truncate max-w-[350px]">
                                    {revealedKey}
                                </code>
                                <button 
                                    onClick={() => copyToClipboard(revealedKey)}
                                    className="p-3 bg-primary text-primary-foreground rounded-xl hover:shadow-lg shadow-primary/20 transition-all active:scale-90"
                                >
                                    {copiedKey ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                            </div>

                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex gap-4 text-left items-start mb-10">
                                <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
                                    <AlertCircle size={18} />
                                </div>
                                <p className="text-xs text-amber-600 dark:text-amber-500 font-bold leading-relaxed">
                                    If you lose this key, you will need to revoke it and generate a new one. This is the only time it will be shown.
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => setRevealedKey(null)}
                                className="w-full bg-foreground text-background py-4 rounded-xl font-black hover:opacity-90 transition-opacity"
                            >
                                I have secured this key
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
<<<<<<< HEAD

            {/* Modal: Revoke Confirmation */}
            <AnimatePresence>
                {keyToDelete && (
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setKeyToDelete(null)}
                            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-sm bg-card border rounded-3xl shadow-2xl p-8 overflow-hidden"
                        >
                            <div className="w-14 h-14 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mb-6">
                                <AlertTriangle size={28} />
                            </div>
                            
                            <h2 className="text-xl font-black mb-2">Revoke API Key?</h2>
                            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                Are you sure you want to revoke <span className="text-foreground font-bold">"{keyToDelete.name}"</span>? Any application using this key will stop working immediately.
                            </p>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setKeyToDelete(null)}
                                    className="flex-1 py-3 rounded-xl font-bold hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="flex-1 bg-destructive text-destructive-foreground py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-destructive/20 transition-all active:scale-[0.98]"
                                >
                                    {isLoading ? 'Revoking...' : 'Yes, Revoke'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
=======
>>>>>>> origin/main
        </div>
    );
};

export default ApiKeyPage;

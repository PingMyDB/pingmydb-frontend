import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  History,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIncidentStore, Incident } from '../store/incidentStore';
import { toast } from 'sonner';
<<<<<<< HEAD
import ConfirmationModal from '../components/ConfirmationModal';
=======
>>>>>>> origin/main

const IncidentPage: React.FC = () => {
    const { incidents, fetchIncidents, createIncident, addUpdate, deleteIncident, isLoading } = useIncidentStore();
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
<<<<<<< HEAD

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [incidentToDelete, setIncidentToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
=======
>>>>>>> origin/main
    
    // Form States
    const [newTitle, setNewTitle] = useState('');
    const [newSeverity, setNewSeverity] = useState('minor');
    const [newMessage, setNewMessage] = useState('');
    
    // Update States
    const [updateStatus, setUpdateStatus] = useState('investigating');
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        fetchIncidents();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createIncident({ title: newTitle, severity: newSeverity, message: newMessage });
            toast.success("Incident posted to status page");
            setIsAdding(false);
            setNewTitle('');
            setNewMessage('');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleAddUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isUpdating) return;
        try {
            await addUpdate(isUpdating, updateMessage, updateStatus);
            toast.success("Timeline updated");
            setIsUpdating(null);
            setUpdateMessage('');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 text-red-600 border-red-500/20';
            case 'major': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
            default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved': return <CheckCircle2 size={16} className="text-emerald-500" />;
            case 'identified': return <AlertCircle size={16} className="text-orange-500" />;
            case 'monitoring': return <Clock size={16} className="text-blue-500" />;
            default: return <AlertTriangle size={16} className="text-red-500" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Incidents</h1>
                    <p className="text-muted-foreground text-lg">Manage outages and communicate with your users.</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                >
                    <Plus size={20} /> New Incident
                </button>
            </header>

            <div className="grid gap-6">
                {incidents.length === 0 ? (
                    <div className="bg-card border rounded-3xl p-20 text-center space-y-4 shadow-sm">
                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">All Systems Operational</h3>
                            <p className="text-muted-foreground mt-1">No active incidents or past history recorded.</p>
                        </div>
                    </div>
                ) : (
                    incidents.map((incident) => (
                        <div key={incident.id} className="bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between border-b bg-muted/20">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getSeverityStyles(incident.severity)}`}>
                                            {incident.severity}
                                        </span>
                                        <span className="text-muted-foreground text-xs font-medium flex items-center gap-1">
                                            <History size={12} /> {new Date(incident.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black">{incident.title}</h3>
                                    <div className="flex items-center gap-2 text-sm font-bold capitalize">
                                        {getStatusIcon(incident.status)}
                                        {incident.status}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {incident.status !== 'resolved' && (
                                        <button 
                                            onClick={() => {
                                                setIsUpdating(incident.id);
                                                setUpdateStatus(incident.status);
                                            }}
                                            className="px-4 py-2 bg-foreground text-background rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                                        >
                                            Add Update
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => {
<<<<<<< HEAD
                                            setIncidentToDelete(incident.id);
                                            setIsDeleteModalOpen(true);
=======
                                            if (confirm('Delete this incident history?')) deleteIncident(incident.id);
>>>>>>> origin/main
                                        }}
                                        className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Past Timeline (Summarized) */}
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                                    <MessageSquare size={14} /> Latest Status
                                </div>
                                <div className="bg-muted/30 border rounded-2xl p-6 italic text-muted-foreground font-medium leading-relaxed">
                                    "{incident.latest_message || 'No description provided'}"
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal: Add Incident */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-card border rounded-[2rem] shadow-2xl p-10">
                            <h2 className="text-2xl font-black mb-2">Report Incident</h2>
                            <p className="text-muted-foreground text-sm mb-8">This will be immediately visible on your public status page.</p>
                            
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Incident Title</label>
                                    <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Unusual Latency in US-East" className="w-full bg-background border rounded-xl px-4 py-3 font-bold outline-none border-foreground/10 focus:border-primary transition-all" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Severity</label>
                                        <select value={newSeverity} onChange={(e) => setNewSeverity(e.target.value)} className="w-full bg-background border rounded-xl px-4 py-3 font-bold outline-none border-foreground/10">
                                            <option value="minor">Minor</option>
                                            <option value="major">Major</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Internal Message</label>
                                    <textarea required rows={4} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Describe what's happening..." className="w-full bg-background border rounded-xl px-4 py-3 font-bold outline-none border-foreground/10 resize-none" />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 font-bold hover:bg-muted rounded-xl transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">Post Incident</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: Add Update */}
            <AnimatePresence>
                {isUpdating && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsUpdating(null)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-card border rounded-[2rem] shadow-2xl p-10">
                            <h2 className="text-2xl font-black mb-8 italic flex items-center gap-2">
                                <Clock className="text-primary" /> Update Timeline
                            </h2>
                            <form onSubmit={handleAddUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">New Status</label>
                                    <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)} className="w-full bg-background border rounded-xl px-4 py-3 font-bold outline-none">
                                        <option value="investigating">Investigating</option>
                                        <option value="identified">Identified</option>
                                        <option value="monitoring">Monitoring</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Update Message</label>
                                    <textarea required rows={3} value={updateMessage} onChange={(e) => setUpdateMessage(e.target.value)} placeholder="What's the current status?" className="w-full bg-background border rounded-xl px-4 py-3 font-bold outline-none resize-none" />
                                </div>
                                <button type="submit" className="w-full bg-foreground text-background py-4 rounded-xl font-black hover:opacity-90 transition-opacity">Push Update</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
<<<<<<< HEAD
            
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setIncidentToDelete(null);
                }}
                onConfirm={async () => {
                    if (incidentToDelete) {
                        setIsDeleting(true);
                        try {
                            await deleteIncident(incidentToDelete);
                            toast.success("Incident history deleted");
                        } catch (err: any) {
                            toast.error(err.message);
                        } finally {
                            setIsDeleting(false);
                            setIsDeleteModalOpen(false);
                            setIncidentToDelete(null);
                        }
                    }
                }}
                title="Delete Incident History?"
                message="This will permanently remove this incident from your history and public status page. This action cannot be undone."
                confirmText="Yes, delete history"
                variant="danger"
                isLoading={isDeleting}
            />
=======
>>>>>>> origin/main
        </div>
    );
};

export default IncidentPage;

import React, { useState } from 'react';
import { 
  Bell, 
  Trash2, 
  Plus, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

interface NotificationSettingsProps {
  channels: any[];
  onAdd: (data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number, enabled: boolean) => Promise<void>;
  onTest: (id: number) => Promise<void>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ channels, onAdd, onDelete, onToggle, onTest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'email' as 'discord' | 'slack' | 'email',
    name: '',
    config: { url: '', email: '' }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        type: formData.type,
        name: formData.name,
        config: formData.type === 'email' ? { email: formData.config.email } : { url: formData.config.url }
      };
      await onAdd(data);
      setIsModalOpen(false);
      setFormData({ type: 'email', name: '', config: { url: '', email: '' } });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell size={20} className="text-muted-foreground" /> Notification Channels
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> Add Channel
        </button>
      </div>

      <div className="grid gap-4">
        {channels.length === 0 ? (
          <div className="bg-card border border-dashed rounded-2xl p-12 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg text-foreground">No channels configured</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              Get notified instantly via Slack, Discord, or Email when your database goes down.
            </p>
          </div>
        ) : (
          channels.map((channel) => (
            <div key={channel.id} className="bg-card border rounded-2xl p-6 shadow-sm flex items-center justify-between group transition-all hover:border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {channel.type === 'discord' && <MessageSquare size={24} />}
                  {channel.type === 'slack' && <MessageSquare size={24} className="text-emerald-500" />}
                  {channel.type === 'email' && <Mail size={24} className="text-orange-500" />}
                </div>
                <div>
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    {channel.name || (channel.type.charAt(0).toUpperCase() + channel.type.slice(1))}
                    {!channel.is_enabled && <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-black uppercase tracking-tighter">Paused</span>}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate font-mono">
                    {channel.type === 'email' ? channel.config.email : channel.config.url}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onToggle(channel.id, !channel.is_enabled)}
                  className={`p-2 rounded-lg transition-colors ${channel.is_enabled ? 'text-primary hover:bg-primary/10' : 'text-muted-foreground hover:bg-accent'}`}
                  title={channel.is_enabled ? "Disable" : "Enable"}
                >
                  <CheckCircle2 size={18} className={channel.is_enabled ? 'opacity-100' : 'opacity-20'} />
                </button>
                <button 
                  onClick={() => onTest(channel.id)}
                  className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-all"
                  title="Send Test"
                >
                  <RefreshCw size={16} />
                </button>
                <button 
                  onClick={() => onDelete(channel.id)}
                  className="p-2 rounded-lg text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border rounded-3xl shadow-2xl p-8 w-full max-w-md relative"
            >
              <h3 className="text-2xl font-black mb-6">Add Notification</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Channel Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['email', 'discord', 'slack'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t as any })}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                          formData.type === t 
                            ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10' 
                            : 'hover:bg-accent border-border text-muted-foreground'
                        }`}
                      >
                        {t === 'discord' && <MessageSquare size={20} />}
                        {t === 'slack' && <MessageSquare size={20} />}
                        {t === 'email' && <Mail size={20} />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Identifier Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Production Alerts"
                    className="w-full rounded-2xl border bg-accent/30 p-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                     {formData.type === 'email' ? 'Email Address' : 'Webhook URL'}
                   </label>
                   <input 
                    type={formData.type === 'email' ? 'email' : 'url'} 
                    placeholder={formData.type === 'email' ? 'user@example.com' : 'https://hooks.slack.com/services/...'}
                    className="w-full rounded-2xl border bg-accent/30 p-4 text-sm font-mono focus:outline-none focus:border-primary/50 transition-colors"
                    value={formData.type === 'email' ? formData.config.email : formData.config.url}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      config: formData.type === 'email' ? { ...formData.config, email: e.target.value } : { ...formData.config, url: e.target.value }
                    })}
                    required
                  />
                  
                  {formData.type === 'discord' && (
                    <div className="mt-4 p-4 rounded-xl bg-[#5865F2]/5 border border-[#5865F2]/20 space-y-3">
                        <p className="text-[11px] font-bold text-[#5865F2] dark:text-[#7289da] flex items-center gap-2">
                            <ExternalLink size={12} /> Discord Webhook
                        </p>
                        <ol className="text-[10px] text-muted-foreground list-decimal pl-4 space-y-1">
                            <li>Open your Discord server → channel settings (⚙️)</li>
                            <li>Go to <strong>Integrations</strong> &gt; <strong>Webhooks</strong></li>
                            <li>Click <strong>New Webhook</strong>, copy the URL</li>
                        </ol>
                        <a
                          href="https://discord.com/channels/@me"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full text-[11px] font-bold text-white bg-[#5865F2] hover:bg-[#4752c4] py-2 rounded-lg transition-colors"
                        >
                          <ExternalLink size={12} /> Open Discord
                        </a>
                    </div>
                  )}

                  {formData.type === 'slack' && (
                    <div className="mt-4 p-4 rounded-xl bg-[#4A154B]/5 border border-[#4A154B]/20 dark:border-[#E01E5A]/20 space-y-3">
                        <p className="text-[11px] font-bold text-[#4A154B] dark:text-[#E01E5A] flex items-center gap-2">
                            <ExternalLink size={12} /> Slack Webhook
                        </p>
                        <ol className="text-[10px] text-muted-foreground list-decimal pl-4 space-y-1">
                            <li>Create a Slack App and enable <strong>Incoming Webhooks</strong></li>
                            <li>Select a channel and click <strong>Add New Webhook</strong></li>
                            <li>Copy the <strong>Webhook URL</strong></li>
                        </ol>
                        <a
                          href="https://api.slack.com/apps/new"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full text-[11px] font-bold text-white bg-[#4A154B] hover:bg-[#611f69] py-2 rounded-lg transition-colors"
                        >
                          <ExternalLink size={12} /> Create Slack App
                        </a>
                    </div>
                  )}

                  {formData.type === 'email' && (
                    <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                      We'll send alert notifications to this email address.
                    </p>
                  )}

                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-sm font-bold rounded-2xl border hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-primary-foreground py-4 text-sm font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NotificationSettings;

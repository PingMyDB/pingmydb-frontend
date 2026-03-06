
import React from 'react';
import { 
  CreditCard,
  History,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const BillingPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Billing & Plan</h1>
        <p className="text-muted-foreground">Manage your subscription and invoices.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Current Plan Card */}
          <div className="bg-card border rounded-2xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CheckCircle2 size={120} className="text-primary" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                Active
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1 uppercase tracking-tight">{user?.plan} Plan</h3>
            <p className="text-muted-foreground text-sm mb-8">Your next billing date is April 12, 2024.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                Manage Subscription
              </button>
              <Link to="/pricing" className="px-6 py-2.5 rounded-xl border font-bold text-sm hover:bg-accent transition-all flex items-center justify-center gap-2">
                Upgrade Plan <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-muted-foreground">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="font-bold text-sm">Payment Method</p>
                <p className="text-xs text-muted-foreground">Visa ending in 4242</p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:underline">Update</button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-accent/30 border border-border/50 rounded-2xl p-6">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
              <History size={16} className="text-muted-foreground" /> Recent Invoices
            </h4>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium">March 12, 2024</p>
                    <p className="text-muted-foreground">₹499.00</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-accent"><ExternalLink size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;

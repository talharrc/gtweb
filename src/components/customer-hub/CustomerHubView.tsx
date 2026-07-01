import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { ShoppingBag, Package, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { Order } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../lib/mockData';
import HubLayout, { NavItem } from '../shared/HubLayout';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

const navItems: NavItem[] = [
  { label: 'My Orders', path: 'orders', icon: <Package className="w-4 h-4" /> },
];

const STATUS_LABELS: Record<Order['status'], string> = {
  pending_payment: 'Pending Payment',
  verified: 'Verified — Preparing',
  fulfilled: 'Fulfilled',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export default function CustomerHubView() {
  const navigate = useNavigate();
  const { email, isDemo, setIsDemo } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo || !email) {
      setOrders(mockDb.getOrders());
      setLoading(false);
      return;
    }

    let active = true;
    const fallbackTimer = setTimeout(() => {
      if (active) {
        console.warn('Firestore load timed out in CustomerHubView, falling back to Demo Mode');
        setIsDemo(true);
        setLoading(false);
      }
    }, 2500);

    const handleError = (error: any) => {
      console.warn('Firestore error in CustomerHubView, falling back to Demo Mode:', error);
      if (active) {
        setIsDemo(true);
        setLoading(false);
      }
    };

    const q = query(collection(db, 'orders'), where('customerUsername', '==', email.toLowerCase()));
    const unsub = onSnapshot(q, s => {
      if (!active) return;
      setOrders(s.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    }, handleError);

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      unsub();
    };
  }, [email, isDemo]);

  return (
    <HubLayout title="Customer Hub" navItems={navItems} activeSection="orders" onSectionChange={() => {}}>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl">My Orders</h2>
        <p className="text-white/40 text-sm">Track payment verification and delivery status for your purchases</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-6 h-6" />}
          title="No orders yet"
          description="Visit the Store to grab your first subscription plan."
          action={
            <button onClick={() => navigate('/browse')} className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold uppercase tracking-wider transition-all">
              Go to Store
            </button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(o => (
            <div key={o.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-white/40 text-[10px] font-mono uppercase">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-white font-mono font-bold text-lg mt-0.5">৳{o.totalBDT.toLocaleString()}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                {o.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-white/70">{it.productName} — {it.planLabel} × {it.quantity}</span>
                    <span className="text-white/50 font-mono">৳{(it.priceBDT * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <p className="text-white/30 text-[10px] font-mono mt-3">{STATUS_LABELS[o.status]}{o.trxId ? ` · TrxID ${o.trxId}` : ''}</p>

              {o.status === 'rejected' && o.adminNote && (
                <p className="text-red-400/80 text-xs mt-2">Note: {o.adminNote}</p>
              )}

              {o.status === 'fulfilled' && o.deliveredCredentials && o.deliveredCredentials.length > 0 && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 mt-3">
                  <p className="text-emerald-400 text-[10px] uppercase font-mono font-bold mb-2">Your Credentials</p>
                  {o.deliveredCredentials.map((c, i) => (
                    <p key={i} className="text-white/70 text-xs"><span className="text-white/40">{c.label}:</span> {c.value}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </HubLayout>
  );
}

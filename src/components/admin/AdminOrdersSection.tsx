import { useState, useEffect, FormEvent } from 'react';
import { Loader2, Plus, Trash2, Copy, Check } from 'lucide-react';
import { Order, OrderStatus, DeliveredCredential } from '../../types';
import { updateOrderStatus, deliverCredentials, getAllOrders } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../lib/mockData';
import EmptyState from '../shared/EmptyState';
import StatusBadge from '../shared/StatusBadge';

const TABS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending_payment', label: 'Pending Payment' },
  { key: 'verified', label: 'Verified' },
  { key: 'fulfilled', label: 'Fulfilled' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'cancelled', label: 'Cancelled' },
];

function mockNow() {
  return { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any;
}

export default function AdminOrdersSection() {
  const { isDemo, setIsDemo } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<OrderStatus | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fulfillingId, setFulfillingId] = useState<string | null>(null);
  const [credRows, setCredRows] = useState<DeliveredCredential[]>([{ label: '', value: '' }]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const reload = async () => {
    if (isDemo) {
      setOrders(mockDb.getOrders());
      setLoading(false);
      return;
    }
    try {
      setOrders(await getAllOrders());
    } catch (error) {
      console.warn('Failed to load orders in AdminOrdersSection, falling back to Demo Mode:', error);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, [isDemo]);

  const applyStatusUpdate = async (id: string, status: OrderStatus, extra?: Partial<Order>) => {
    setBusyId(id);
    try {
      if (isDemo) {
        const updated = mockDb.getOrders().map(o => o.id === id ? { ...o, status, ...extra } : o);
        mockDb.saveOrders(updated);
        setOrders(updated);
      } else {
        await updateOrderStatus(id, status, { adminNote: extra?.adminNote });
        await reload();
      }
    } finally { setBusyId(null); }
  };

  const handleVerify = (id: string) => applyStatusUpdate(id, 'verified', { verifiedAt: mockNow() });
  const handleReject = (id: string) => {
    const note = window.prompt('Reason for rejecting this order (shown internally):') ?? '';
    applyStatusUpdate(id, 'rejected', { adminNote: note });
  };
  const handleCancel = (id: string) => applyStatusUpdate(id, 'cancelled');

  const openFulfill = (id: string) => { setFulfillingId(id); setCredRows([{ label: '', value: '' }]); };
  const addCredRow = () => setCredRows(r => [...r, { label: '', value: '' }]);
  const removeCredRow = (idx: number) => setCredRows(r => r.filter((_, i) => i !== idx));
  const updateCredRow = (idx: number, updates: Partial<DeliveredCredential>) =>
    setCredRows(r => r.map((c, i) => (i === idx ? { ...c, ...updates } : c)));

  const handleFulfillSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fulfillingId) return;
    const rows = credRows.filter(r => r.label.trim() && r.value.trim());
    if (rows.length === 0) return;
    setBusyId(fulfillingId);
    try {
      if (isDemo) {
        const updated = mockDb.getOrders().map(o => o.id === fulfillingId
          ? { ...o, status: 'fulfilled' as OrderStatus, deliveredCredentials: rows, fulfilledAt: mockNow() }
          : o);
        mockDb.saveOrders(updated);
        setOrders(updated);
      } else {
        await deliverCredentials(fulfillingId, rows);
        await reload();
      }
      setFulfillingId(null);
    } finally { setBusyId(null); }
  };

  const copyTrx = (order: Order) => {
    navigator.clipboard.writeText(order.trxId);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl">Store Orders</h2>
        <p className="text-white/40 text-sm">Verify bKash/Nagad/Rocket payments and fulfill orders</p>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              tab === t.key ? 'bg-primary/20 border-primary/50 text-white' : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No orders" description="Orders will appear here once customers check out." />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(o => (
            <div key={o.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-white font-semibold text-sm">{o.customerName}</p>
                  <p className="text-white/40 text-xs">{o.customerEmail}{o.customerPhone ? ` · ${o.customerPhone}` : ''}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <div className="flex flex-col gap-1 mb-4 border-t border-b border-white/5 py-3">
                {o.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-white/70">{it.productName} — {it.planLabel} × {it.quantity}</span>
                    <span className="text-white/50 font-mono">৳{(it.priceBDT * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm font-bold pt-1.5 mt-1 border-t border-white/5">
                  <span className="text-white">Total</span>
                  <span className="text-white font-mono">৳{o.totalBDT.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <p className="text-white/30 text-[9px] uppercase font-mono mb-1">Method</p>
                  <p className="text-white text-xs font-semibold uppercase">{o.paymentMethod}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <p className="text-white/30 text-[9px] uppercase font-mono mb-1">Sender Number</p>
                  <p className="text-white text-xs font-mono">{o.senderNumber}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-white/30 text-[9px] uppercase font-mono mb-1">TrxID</p>
                    <p className="text-white text-xs font-mono">{o.trxId}</p>
                  </div>
                  <button onClick={() => copyTrx(o)} className="text-white/40 hover:text-white transition-colors">
                    {copiedId === o.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {o.status === 'rejected' && o.adminNote && (
                <p className="text-red-400/80 text-xs mb-3">Rejection note: {o.adminNote}</p>
              )}

              {o.status === 'fulfilled' && o.deliveredCredentials && o.deliveredCredentials.length > 0 && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 mb-3">
                  <p className="text-emerald-400 text-[10px] uppercase font-mono font-bold mb-2">Delivered</p>
                  {o.deliveredCredentials.map((c, i) => (
                    <p key={i} className="text-white/70 text-xs"><span className="text-white/40">{c.label}:</span> {c.value}</p>
                  ))}
                </div>
              )}

              {o.status === 'pending_payment' && (
                <div className="flex gap-3">
                  <button disabled={busyId === o.id} onClick={() => handleVerify(o.id)} className="flex-1 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-xs font-semibold transition-all disabled:opacity-60">
                    Mark Verified
                  </button>
                  <button disabled={busyId === o.id} onClick={() => handleReject(o.id)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 text-xs font-semibold transition-all disabled:opacity-60">
                    Reject
                  </button>
                </div>
              )}

              {o.status === 'verified' && (
                <div className="flex gap-3">
                  <button disabled={busyId === o.id} onClick={() => openFulfill(o.id)} className="flex-1 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-xs font-semibold transition-all disabled:opacity-60">
                    Deliver & Fulfill
                  </button>
                  <button disabled={busyId === o.id} onClick={() => handleCancel(o.id)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-xs font-semibold transition-all disabled:opacity-60">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {fulfillingId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md rounded-2xl p-6">
            <h3 className="text-white font-bold mb-1">Deliver & Fulfill</h3>
            <p className="text-white/40 text-xs mb-4">Enter the login/credential details to hand over to the customer.</p>
            <form onSubmit={handleFulfillSubmit} className="flex flex-col gap-2">
              {credRows.map((c, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_1.4fr_auto] gap-2">
                  <input required value={c.label} onChange={e => updateCredRow(idx, { label: e.target.value })} placeholder="Label (e.g. Email)" className="admin-input text-xs" />
                  <input required value={c.value} onChange={e => updateCredRow(idx, { value: e.target.value })} placeholder="Value" className="admin-input text-xs" />
                  <button type="button" onClick={() => removeCredRow(idx)} disabled={credRows.length === 1} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 disabled:opacity-30">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addCredRow} className="text-xs text-primary font-semibold flex items-center gap-1 self-start">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setFulfillingId(null)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm">Cancel</button>
                <button type="submit" disabled={busyId === fulfillingId} className="flex-1 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {busyId === fulfillingId && <Loader2 className="w-4 h-4 animate-spin" />} Mark Fulfilled
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

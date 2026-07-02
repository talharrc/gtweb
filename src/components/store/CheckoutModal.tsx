import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Smartphone, Check, Loader2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '../../types';
import { createOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useStoreCart } from '../../context/StoreCartContext';
import { mockDb } from '../../lib/mockData';
import CustomerAuthGate from '../auth/CustomerAuthGate';

const OFFICIAL_STORE_NUMBER = '01959-209103';

const PAYMENT_METHODS: { key: PaymentMethod; label: string; color: string }[] = [
  { key: 'bkash', label: 'bKash', color: '#EC1E8E' },
  { key: 'nagad', label: 'Nagad', color: '#FF7A45' },
  { key: 'rocket', label: 'Rocket', color: '#5B23A8' },
];

type CheckoutStep = 'auth' | 'payment' | 'success';

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { isDemo, isCustomer, email } = useAuth();
  const { cart, cartTotal, clearCart } = useStoreCart();

  const [step, setStep] = useState<CheckoutStep>(isCustomer ? 'payment' : 'auth');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step === 'auth' && isCustomer) setStep('payment');
  }, [step, isCustomer]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !senderNumber.trim() || !trxId.trim() || !email) return;
    setSubmitting(true);
    setError('');
    try {
      const items = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        planId: item.plan.id,
        planLabel: `${item.plan.label} · ${item.plan.durationLabel}`,
        priceBDT: item.plan.priceBDT,
        quantity: item.quantity,
      }));
      const totalBDT = items.reduce((sum, it) => sum + it.priceBDT * it.quantity, 0);

      if (isDemo) {
        const orders = mockDb.getOrders();
        mockDb.saveOrders([...orders, {
          id: `order-${Date.now()}`,
          customerUsername: email, customerEmail: email, customerName, customerPhone,
          items, totalBDT, paymentMethod, senderNumber, trxId,
          status: 'pending_payment' as const,
          createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        }]);
      } else {
        await createOrder({
          customerUsername: email, customerEmail: email, customerName, customerPhone,
          items, totalBDT, paymentMethod, senderNumber, trxId,
        });
      }

      clearCart();
      setStep('success');
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong submitting your order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-gs-surface/95 backdrop-blur-md w-full max-w-3xl rounded-2xl border border-white/5 relative max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
        <button onClick={onClose} className="absolute top-5 right-5 text-gs-text-muted hover:text-gs-text z-10 transition-all p-1">
          <X className="w-5 h-5" />
        </button>

        {step === 'auth' && (
          <div className="p-4">
            <CustomerAuthGate title="Sign in to check out" subtitle="Create a free account so you can track your order and get your login credentials delivered." />
          </div>
        )}

        {step === 'payment' && (
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gs-red-core/10 border border-gs-red-core/20 flex items-center justify-center shadow-inner shadow-gs-red-core/5">
                  <Smartphone className="w-5 h-5 text-gs-red-bright filter drop-shadow-[0_0_6px_rgba(205,56,29,0.3)]" />
                </div>
                <div>
                  <h3 className="text-gs-text font-black text-base font-display uppercase tracking-wide">Payment</h3>
                  <p className="text-gs-text-muted text-[10px] font-mono uppercase tracking-wider">Complete checkout using bKash, Nagad, or Rocket.</p>
                </div>
              </div>

              <div className="bg-gs-card/50 border border-white/5 rounded-xl p-4 mb-6 shadow-sm">
                <p className="text-gs-text-muted text-[9px] uppercase font-bold tracking-widest mb-2 font-mono">Send Money To</p>
                <div className="flex items-center justify-between bg-gs-card-alt/80 border border-white/5 p-3 rounded-lg shadow-inner">
                  <div>
                    <span className="text-[9px] text-gs-text-muted uppercase font-bold tracking-widest block font-mono">Official Number</span>
                    <strong className="text-gs-text text-sm font-mono tracking-wider font-bold">{OFFICIAL_STORE_NUMBER}</strong>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-gs-card border border-white/5 text-gs-text-secondary text-[8px] uppercase font-black tracking-widest font-mono shadow-sm">Personal</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold text-gs-text-secondary uppercase tracking-widest block mb-1.5 font-mono">Full Name</label>
                  <input
                    required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Jane Doe"
                    className="w-full bg-gs-card/50 border border-white/10 rounded-lg px-4 py-2.5 text-gs-text text-sm placeholder-gs-text-muted focus:outline-none focus:border-gs-red-bright/40 focus:ring-1 focus:ring-gs-red-bright/10 transition-colors shadow-inner"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gs-text-secondary uppercase tracking-widest block mb-1.5 font-mono">Phone Number</label>
                  <input
                    required type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="01XXXXXXXXX"
                    className="w-full bg-gs-card/50 border border-white/10 rounded-lg px-4 py-2.5 text-gs-text text-sm placeholder-gs-text-muted focus:outline-none focus:border-gs-red-bright/40 focus:ring-1 focus:ring-gs-red-bright/10 transition-colors shadow-inner"
                  />
                </div>

                <div className="border-t border-white/5 pt-4">
                  <label className="text-[9px] font-bold text-gs-text-secondary uppercase tracking-widest block mb-3 font-mono">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS.map(m => {
                      const isSelected = paymentMethod === m.key;
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setPaymentMethod(m.key)}
                          className="rounded-lg p-3.5 border text-center transition-all flex flex-col items-center justify-center gap-1.5 hover:scale-[1.02] shadow-sm"
                          style={isSelected ? { borderColor: m.color, backgroundColor: `${m.color}0d` } : { borderColor: 'rgba(255,255,255,0.06)' }}
                        >
                          <span className="text-[10px] font-black uppercase tracking-wider font-rajdhani" style={{ color: isSelected ? m.color : '#6E6480' }}>
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-gs-text-secondary uppercase tracking-widest block mb-1.5 font-mono">Your Sender Number</label>
                    <input
                      required type="tel" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} placeholder="01XXXXXXXXX"
                      className="w-full bg-gs-card/50 border border-white/10 rounded-lg px-4 py-2.5 text-gs-text text-sm placeholder-gs-text-muted focus:outline-none focus:border-gs-red-bright/40 focus:ring-1 focus:ring-gs-red-bright/10 transition-colors shadow-inner font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gs-text-secondary uppercase tracking-widest block mb-1.5 font-mono">Transaction ID (TrxID)</label>
                    <input
                      required type="text" value={trxId} onChange={e => setTrxId(e.target.value)} placeholder="9AK3D7F2Q1"
                      className="w-full bg-gs-card/50 border border-white/10 rounded-lg px-4 py-2.5 text-gs-text text-sm placeholder-gs-text-muted focus:outline-none focus:border-gs-red-bright/40 focus:ring-1 focus:ring-gs-red-bright/10 transition-colors shadow-inner font-mono"
                    />
                  </div>
                </div>

                {error && <p className="text-gs-red-orange text-xs font-bold bg-gs-red-core/10 border border-gs-red-orange/20 p-3.5 rounded-lg shadow-sm">{error}</p>}

                <button
                  type="submit" disabled={submitting}
                  className="w-full py-3.5 btn-primary-red text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 min-h-[46px] shadow-lg shadow-gs-red-core/30"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : <>Complete Order</>}
                </button>
              </form>
            </div>

            <div className="p-6 sm:p-8 bg-gs-card/40 flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="text-gs-text font-black text-sm uppercase tracking-wider mb-6 flex items-center gap-1.5 font-mono border-b border-white/5 pb-4">
                  <ShoppingBag className="w-4 h-4 text-gs-red-bright filter drop-shadow-[0_0_6px_rgba(205,56,29,0.3)]" /> Order Summary
                </h4>

                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1.5 custom-scrollbar">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.plan.id}`} className="flex justify-between items-start text-xs border-b border-white/5 pb-3.5">
                      <div>
                        <p className="text-gs-text font-semibold hover:text-gs-red-bright transition-colors">{item.product.name}</p>
                        <p className="text-gs-text-muted text-[10px] mt-0.5">{item.plan.label} · Qty: {item.quantity}</p>
                      </div>
                      <span className="text-gs-text font-bold font-rajdhani text-sm">৳{(item.plan.priceBDT * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-white/5 pt-6 space-y-3.5">
                <div className="flex justify-between text-xs text-gs-text-secondary font-medium">
                  <span>Subtotal</span>
                  <span className="text-gs-text font-semibold">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gs-text-secondary font-medium">
                  <span>Delivery</span>
                  <span className="text-emerald-400 font-semibold">Instant / Digital</span>
                </div>
                <div className="border-t border-white/5 pt-3.5 flex justify-between items-baseline">
                  <span className="text-xs text-gs-text-secondary font-bold uppercase font-mono tracking-widest">Total</span>
                  <span className="text-gs-text font-black text-2xl tracking-wider font-rajdhani">৳{cartTotal.toLocaleString()}</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[9px] text-gs-text-muted uppercase tracking-widest justify-center bg-gs-card-alt border border-white/5 py-2.5 rounded-xl font-mono shadow-inner">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Checkout
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-14 px-6 flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-inner">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-gs-text font-black text-xl mb-2 font-display uppercase tracking-wide">Order Submitted!</h3>
            <p className="text-gs-text-secondary text-xs leading-relaxed mb-8">
              We've received your transaction details. Verification usually takes <strong className="text-gs-red-bright font-bold">15–30 minutes</strong>. Your login credentials will appear under your Customer Orders panel.
            </p>
            <div className="flex gap-4 w-full">
              <button onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-gs-card/50 text-gs-text text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-gs-card-alt shadow-sm">
                Keep Browsing
              </button>
              <button onClick={() => { onClose(); navigate('/hub/customer'); }} className="flex-1 py-3.5 rounded-xl btn-primary-red text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-gs-red-core/30">
                Track Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

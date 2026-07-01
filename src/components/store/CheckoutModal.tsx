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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 z-10 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {step === 'auth' && (
          <div className="p-4">
            <CustomerAuthGate title="Sign in to check out" subtitle="Create a free account so you can track your order and get your login credentials delivered." />
          </div>
        )}

        {step === 'payment' && (
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#e50914]/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#e50914]" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-base">Payment</h3>
                  <p className="text-slate-400 text-[11px]">Complete checkout using bKash, Nagad, or Rocket.</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wide mb-2">Send Money To</p>
                <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide block">Official Number</span>
                    <strong className="text-slate-900 text-sm font-mono tracking-wide">{OFFICIAL_STORE_NUMBER}</strong>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] uppercase font-bold tracking-widest">Personal</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Full Name</label>
                  <input
                    required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Jane Doe"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-[#e50914]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Phone Number</label>
                  <input
                    required type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="01XXXXXXXXX"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-[#e50914]/50 transition-colors"
                  />
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS.map(m => {
                      const isSelected = paymentMethod === m.key;
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setPaymentMethod(m.key)}
                          className="rounded-lg p-3 border text-center transition-all flex flex-col items-center justify-center gap-1.5"
                          style={isSelected ? { borderColor: m.color, backgroundColor: `${m.color}0d` } : { borderColor: '#e2e8f0' }}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isSelected ? m.color : '#94a3b8' }}>
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Your Sender Number</label>
                    <input
                      required type="tel" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} placeholder="01XXXXXXXXX"
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-[#e50914]/50 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Transaction ID (TrxID)</label>
                    <input
                      required type="text" value={trxId} onChange={e => setTrxId(e.target.value)} placeholder="9AK3D7F2Q1"
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-[#e50914]/50 transition-colors font-mono"
                    />
                  </div>
                </div>

                {error && <p className="text-[#e50914] text-xs font-semibold bg-[#e50914]/5 border border-[#e50914]/20 p-3 rounded-lg">{error}</p>}

                <button
                  type="submit" disabled={submitting}
                  className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 min-h-[46px]"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : <>Complete Order</>}
                </button>
              </form>
            </div>

            <div className="p-6 sm:p-8 bg-slate-50 flex flex-col justify-between">
              <div>
                <h4 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-6 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#e50914]" /> Order Summary
                </h4>

                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1.5">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.plan.id}`} className="flex justify-between items-start text-xs border-b border-slate-200 pb-3">
                      <div>
                        <p className="text-slate-900 font-semibold">{item.product.name}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{item.plan.label} · Qty: {item.quantity}</p>
                      </div>
                      <span className="text-slate-900 font-semibold">৳{(item.plan.priceBDT * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6 space-y-3.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-900">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-semibold">Instant / Digital</span>
                </div>
                <div className="border-t border-slate-200 pt-3.5 flex justify-between items-baseline">
                  <span className="text-xs text-slate-500 font-bold uppercase">Total</span>
                  <span className="text-slate-900 font-black text-2xl tracking-tight">৳{cartTotal.toLocaleString()}</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[9px] text-slate-400 uppercase tracking-widest justify-center bg-white border border-slate-200 py-2.5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Checkout
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-14 px-6 flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-slate-900 font-black text-xl mb-2">Order Submitted!</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-8">
              We've received your transaction details. Verification usually takes <strong className="text-[#e50914]">15–30 minutes</strong>. Your login credentials will appear under your Customer Orders panel.
            </p>
            <div className="flex gap-4 w-full">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider transition-all">
                Keep Browsing
              </button>
              <button onClick={() => { onClose(); navigate('/hub/customer'); }} className="flex-1 py-3 rounded-xl bg-[#e50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider transition-all">
                Track Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

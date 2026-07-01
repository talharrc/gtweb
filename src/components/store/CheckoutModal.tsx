import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Smartphone, Check, Loader2, CreditCard, ShoppingBag, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '../../types';
import { createOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useStoreCart } from '../../context/StoreCartContext';
import { mockDb } from '../../lib/mockData';
import CustomerAuthGate from '../auth/CustomerAuthGate';

const OFFICIAL_STORE_NUMBER = '01959-209103';

const RECEIVING_NUMBERS: Record<PaymentMethod, string> = {
  bkash: OFFICIAL_STORE_NUMBER,
  nagad: OFFICIAL_STORE_NUMBER,
  rocket: OFFICIAL_STORE_NUMBER,
};

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
      <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-[#0a0710] w-full max-w-3xl rounded-3xl border border-white/5 relative max-h-[90vh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.8)] custom-scrollbar">
        <button onClick={onClose} className="absolute top-5 right-5 text-white/40 hover:text-white z-10 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {step === 'auth' && (
          <div className="p-4">
            <CustomerAuthGate title="Sign in to check out" subtitle="Create a free account so you can track your order and get your login credentials delivered." />
          </div>
        )}

        {step === 'payment' && (
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] divide-y md:divide-y-0 md:divide-x divide-white/5">
            
            {/* Left Column: Checkout Form & Payment Info */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#e50914]/15 border border-[#e50914]/30 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#e50914]" />
                </div>
                <div>
                  <h3 className="text-white font-black text-base uppercase tracking-wider">MFS Secure Payment</h3>
                  <p className="text-white/40 text-[10px]">Complete checkout using bKash, Nagad or Rocket.</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 mb-6">
                <p className="text-white/40 text-[9px] uppercase font-black tracking-wider mb-2">How to Pay (Send Money)</p>
                <p className="text-white/60 text-xs leading-relaxed mb-3">
                  Please send the exact order amount as <strong className="text-[#e50914]">Send Money</strong> to the number below:
                </p>
                <div className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-wider block">Official Number</span>
                    <strong className="text-white text-sm font-mono tracking-wide">{OFFICIAL_STORE_NUMBER}</strong>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#e50914]/25 text-[#e50914] text-[9px] uppercase font-bold tracking-widest border border-[#e50914]/20">Personal</span>
                </div>
              </div>

              {/* Billing / Delivery Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold text-white uppercase tracking-widest block mb-1.5">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)} 
                    placeholder="E.g., Jane Doe"
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#e50914] transition-colors" 
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-white uppercase tracking-widest block mb-1.5">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    value={customerPhone} 
                    onChange={e => setCustomerPhone(e.target.value)} 
                    placeholder="E.g., 017XXXXXXXX"
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#e50914] transition-colors" 
                  />
                </div>

                <div className="border-t border-white/5 pt-4">
                  <label className="text-[9px] font-bold text-white uppercase tracking-widest block mb-3">Select Payment Wallet</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['bkash', 'nagad', 'rocket'] as PaymentMethod[]).map(m => {
                      const isSelected = paymentMethod === m;
                      let mColor = 'border-white/5 hover:border-white/20 bg-white/2';
                      let labelColor = 'text-white/60';
                      if (isSelected) {
                        if (m === 'bkash') {
                          mColor = 'border-[#EC1E8E] bg-[#EC1E8E]/10 shadow-[0_0_12px_rgba(236,30,142,0.15)]';
                          labelColor = 'text-[#EC1E8E]';
                        } else if (m === 'nagad') {
                          mColor = 'border-[#FF7A45] bg-[#FF7A45]/10 shadow-[0_0_12px_rgba(255,122,69,0.15)]';
                          labelColor = 'text-[#FF7A45]';
                        } else {
                          mColor = 'border-[#5B23A8] bg-[#5B23A8]/10 shadow-[0_0_12px_rgba(91,35,168,0.15)]';
                          labelColor = 'text-[#5B23A8]';
                        }
                      }
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPaymentMethod(m)}
                          className={`rounded-xl p-3 border text-center transition-all flex flex-col items-center justify-center relative gap-1.5 ${mColor}`}
                        >
                          <CreditCard className={`w-4 h-4 ${isSelected ? labelColor : 'text-white/25'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? labelColor : 'text-white/40'}`}>
                            {m}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-white uppercase tracking-widest block mb-1.5">Your Sender Number</label>
                    <input 
                      required 
                      type="tel" 
                      value={senderNumber} 
                      onChange={e => setSenderNumber(e.target.value)} 
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#e50914] transition-colors font-mono" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-white uppercase tracking-widest block mb-1.5">Transaction ID (TrxID)</label>
                    <input 
                      required 
                      type="text" 
                      value={trxId} 
                      onChange={e => setTrxId(e.target.value)} 
                      placeholder="E.g., 9AK3D7F2Q1"
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#e50914] transition-colors font-mono" 
                    />
                  </div>
                </div>

                {error && <p className="text-[#e50914] text-xs font-bold bg-[#e50914]/10 border border-[#e50914]/20 p-3 rounded-xl">{error}</p>}

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#e50914] hover:bg-[#b81d24] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 min-h-[46px] shadow-[0_0_15px_rgba(229,9,20,0.3)]"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying Payment...</> : <>Complete Checkout</>}
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary Info */}
            <div className="p-6 sm:p-8 bg-white/2 flex flex-col justify-between">
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-wider mb-6 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#e50914]" /> Order Summary
                </h4>
                
                {/* Items breakdown list */}
                <div className="space-y-4 max-h-[220px] overflow-y-auto custom-scrollbar pr-1.5">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.plan.id}`} className="flex justify-between items-start text-xs border-b border-white/5 pb-3">
                      <div>
                        <p className="text-white font-bold">{item.product.name}</p>
                        <p className="text-white/40 text-[10px] mt-0.5">{item.plan.label} · Qty: {item.quantity}</p>
                      </div>
                      <span className="text-white font-bold">৳{(item.plan.priceBDT * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-white/5 pt-6 space-y-3.5">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Cart Subtotal</span>
                  <span className="text-white">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Delivery Charge</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="border-t border-white/5 pt-3.5 flex justify-between items-baseline">
                  <span className="text-xs text-white/40 font-bold uppercase">Total Payable</span>
                  <span className="text-white font-black text-2xl tracking-tight">৳{cartTotal.toLocaleString()}</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[9px] text-white/30 uppercase tracking-widest justify-center bg-black/40 border border-white/5 py-2.5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authorized Buyer Security
                </div>
              </div>
            </div>

          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-14 px-6 flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-white font-black text-xl uppercase tracking-wider mb-2">Order Submitted!</h3>
            <p className="text-white/50 text-xs leading-relaxed mb-8">
              We've received your transaction details. Verification usually takes <strong className="text-[#e50914]">15–30 minutes</strong>. Your account login credentials will appear under your Customer Orders panel.
            </p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={onClose} 
                className="flex-1 py-3 rounded-xl border border-white/10 hover:border-white/30 bg-[#121212] hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Close Store
              </button>
              <button 
                onClick={() => { onClose(); navigate('/hub/customer'); }} 
                className="flex-1 py-3 rounded-xl bg-[#e50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)]"
              >
                Track Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

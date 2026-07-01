import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Smartphone, Check, Loader2 } from 'lucide-react';
import { PaymentMethod } from '../../types';
import { createOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useStoreCart } from '../../context/StoreCartContext';
import { mockDb } from '../../lib/mockData';
import CustomerAuthGate from '../auth/CustomerAuthGate';

const RECEIVING_NUMBERS: Record<PaymentMethod, string> = {
  bkash: '01700-000000',
  nagad: '01700-000000',
  rocket: '01700-000000',
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 z-10">
          <X className="w-5 h-5" />
        </button>

        {step === 'auth' && <CustomerAuthGate title="Sign in to check out" subtitle="Create a free account so you can track your order and get your login delivered." />}

        {step === 'payment' && (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg">Pay via bKash / Nagad / Rocket</h3>
              <p className="text-slate-500 text-xs mt-1">Send money to the number below, then submit your Transaction ID.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
              <p className="text-slate-400 text-[10px] uppercase font-semibold mb-2">Send Money to (not Payment)</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {(Object.keys(RECEIVING_NUMBERS) as PaymentMethod[]).map(m => (
                  <div key={m} className={`rounded-lg p-2 border ${paymentMethod === m ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}>
                    <p className="text-slate-500 text-[9px] uppercase font-semibold">{m}</p>
                    <p className="text-slate-900 text-xs font-bold mt-0.5">{RECEIVING_NUMBERS[m]}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">Full Name</label>
                <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Jane Doe"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-blue-400 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">Phone Number</label>
                <input required type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="01XXXXXXXXX"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-blue-400 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-400">
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">Your Sending Number</label>
                <input required type="tel" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} placeholder="01XXXXXXXXX"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-blue-400 transition-colors font-mono" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">Transaction ID (TrxID)</label>
                <input required type="text" value={trxId} onChange={e => setTrxId(e.target.value)} placeholder="e.g. 9AK3D7F2Q1"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-blue-400 transition-colors font-mono" />
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-slate-500 text-xs">Total Amount</span>
                <span className="text-slate-900 font-extrabold text-lg">৳{cartTotal.toLocaleString()}</span>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button type="submit" disabled={submitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[46px]">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Order...</> : <>Submit Order</>}
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-10 px-6 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-4">
              <Check className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl">Order Received!</h3>
            <p className="text-slate-500 text-xs mt-2 max-w-xs leading-relaxed">
              We'll verify your payment shortly and deliver your login details. Track the status anytime from My Orders.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-all">
                Keep Browsing
              </button>
              <button onClick={() => { onClose(); navigate('/hub/customer'); }} className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all">
                View My Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

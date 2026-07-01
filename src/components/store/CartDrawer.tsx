import { useState } from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, Zap } from 'lucide-react';
import { useStoreCart } from '../../context/StoreCartContext';

export default function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { cart, cartTotal, isCartOpen, closeCart, updateQuantity, removeFromCart } = useStoreCart();
  const [orderNote, setOrderNote] = useState('');

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeCart} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#e50914]" /> Your Cart
            </h3>
            <button onClick={closeCart} className="text-slate-400 hover:text-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-slate-400 text-sm">Your cart is empty.</p>
                <button onClick={closeCart} className="text-xs text-[#e50914] font-bold mt-3 hover:underline">
                  Browse plans now →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Zap className="w-4 h-4 text-[#e50914]" /> You're eligible for instant digital delivery.
                </div>

                <div className="flex flex-col gap-4">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.plan.id}`} className="flex gap-4 p-3 bg-white border border-slate-200 rounded-xl items-center">
                      <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 p-1 overflow-hidden">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="text-slate-900 text-xs font-bold truncate leading-tight">{item.product.name}</h4>
                            <p className="text-slate-400 text-[10px] mt-0.5 truncate">{item.plan.label} · {item.plan.durationLabel}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id, item.plan.id)} className="text-slate-300 hover:text-[#e50914] transition-colors flex-shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          <p className="text-slate-900 font-bold text-xs">৳{item.plan.priceBDT.toLocaleString()}</p>
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 w-max">
                            <button onClick={() => updateQuantity(item.product.id, item.plan.id, -1)} className="text-slate-400 hover:text-slate-800 transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-slate-900 text-xs font-semibold px-1">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.plan.id, 1)} className="text-slate-400 hover:text-slate-800 transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-2">Order Note (Optional)</label>
                  <textarea
                    placeholder="E.g., special instructions or WhatsApp number"
                    value={orderNote}
                    onChange={e => setOrderNote(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#e50914]/50 resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="px-6 py-6 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-xs">Estimated Total</span>
                <span className="text-slate-900 font-black text-lg">৳{cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3.5 bg-[#e50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                Check Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

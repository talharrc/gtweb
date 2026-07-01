import { useState } from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, Zap } from 'lucide-react';
import { useStoreCart } from '../../context/StoreCartContext';

export default function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { cart, cartTotal, isCartOpen, closeCart, updateQuantity, removeFromCart } = useStoreCart();
  const [orderNote, setOrderNote] = useState('');

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeCart} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#100C1A] shadow-2xl flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-[#F4F1F8] font-bold text-lg flex items-center gap-2 font-display">
              <ShoppingBag className="w-5 h-5 text-[#CD381D]" /> Your Cart
            </h3>
            <button onClick={closeCart} className="text-[#6E6480] hover:text-[#F4F1F8] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-12 h-12 text-[#1E1428] mb-4" />
                <p className="text-[#6E6480] text-sm">Your cart is empty.</p>
                <button onClick={closeCart} className="text-xs text-[#CD381D] font-bold mt-3 hover:underline">
                  Browse plans now →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="bg-[#16101E] border border-white/10 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-[#A89EB8]">
                  <Zap className="w-4 h-4 text-[#E04420]" /> You're eligible for instant digital delivery.
                </div>

                <div className="flex flex-col gap-4">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.plan.id}`} className="flex gap-4 p-3 bg-[#16101E] border border-white/10 rounded-xl items-center">
                      <div className="w-14 h-14 rounded-lg bg-[#1E1428] border border-white/10 flex items-center justify-center flex-shrink-0 p-1 overflow-hidden">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-[#6E6480]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="text-[#F4F1F8] text-xs font-bold truncate leading-tight">{item.product.name}</h4>
                            <p className="text-[#6E6480] text-[10px] mt-0.5 truncate">{item.plan.label} · {item.plan.durationLabel}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id, item.plan.id)} className="text-[#6E6480] hover:text-[#E04420] transition-colors flex-shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          <p className="text-[#CD381D] font-bold text-xs font-rajdhani">৳{item.plan.priceBDT.toLocaleString()}</p>
                          <div className="flex items-center gap-2 bg-[#1E1428] border border-white/10 rounded-lg px-2 py-1 w-max">
                            <button onClick={() => updateQuantity(item.product.id, item.plan.id, -1)} className="text-[#6E6480] hover:text-[#F4F1F8] transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[#F4F1F8] text-xs font-semibold px-1">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.plan.id, 1)} className="text-[#6E6480] hover:text-[#F4F1F8] transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <label className="text-[10px] font-bold text-[#A89EB8] uppercase tracking-wide block mb-2 font-mono">Order Note (Optional)</label>
                  <textarea
                    placeholder="E.g., special instructions or WhatsApp number"
                    value={orderNote}
                    onChange={e => setOrderNote(e.target.value)}
                    rows={2}
                    className="w-full bg-[#1E1428] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F4F1F8] placeholder-[#6E6480] focus:outline-none focus:border-[#CD381D]/50 resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="px-6 py-6 border-t border-white/10 bg-[#16101E]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#A89EB8] text-xs">Estimated Total</span>
                <span className="text-[#F4F1F8] font-black text-lg font-rajdhani">৳{cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3.5 btn-primary-red text-white text-xs font-bold uppercase tracking-wider rounded-xl"
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

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
        <div className="w-screen max-w-md bg-gs-surface/95 border-l border-white/5 backdrop-blur-md shadow-2xl flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-gs-text font-bold text-lg flex items-center gap-2 font-display">
              <ShoppingBag className="w-5 h-5 text-gs-red-bright filter drop-shadow-[0_0_6px_rgba(205,56,29,0.3)]" /> Your Cart
            </h3>
            <button onClick={closeCart} className="text-gs-text-muted hover:text-gs-text transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-12 h-12 text-gs-card-alt mb-4" />
                <p className="text-gs-text-muted text-sm">Your cart is empty.</p>
                <button onClick={closeCart} className="text-xs text-gs-red-bright font-bold mt-3 hover:underline font-rajdhani uppercase tracking-wider">
                  Browse plans now →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="bg-gs-card/50 border border-white/5 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-gs-text-secondary shadow-sm">
                  <Zap className="w-4 h-4 text-gs-red-orange animate-pulse" /> You're eligible for instant digital delivery.
                </div>

                <div className="flex flex-col gap-4">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.plan.id}`} className="flex gap-4 p-3 bg-gs-card/30 border border-white/5 rounded-xl items-center hover:border-gs-red-bright/10 transition-all duration-300 shadow-sm">
                      <div className="w-14 h-14 rounded-lg bg-gs-card-alt border border-white/5 flex items-center justify-center flex-shrink-0 p-1 overflow-hidden shadow-inner">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-gs-text-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="text-gs-text text-xs font-bold truncate leading-tight hover:text-gs-red-bright transition-colors">{item.product.name}</h4>
                            <p className="text-gs-text-muted text-[10px] mt-0.5 truncate">{item.plan.label} · {item.plan.durationLabel}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id, item.plan.id)} className="text-gs-text-muted hover:text-gs-red-orange transition-colors flex-shrink-0 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          <p className="text-gs-red-bright font-bold text-xs font-rajdhani">৳{item.plan.priceBDT.toLocaleString()}</p>
                          <div className="flex items-center gap-2 bg-gs-card-alt border border-white/5 rounded-lg px-2 py-1 w-max shadow-inner">
                            <button onClick={() => updateQuantity(item.product.id, item.plan.id, -1)} className="text-gs-text-muted hover:text-gs-text transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-gs-text text-xs font-semibold px-1">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.plan.id, 1)} className="text-gs-text-muted hover:text-gs-text transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4">
                  <label className="text-[10px] font-bold text-gs-text-secondary uppercase tracking-wider block mb-2 font-mono">Order Note (Optional)</label>
                  <textarea
                    placeholder="E.g., special instructions or WhatsApp number"
                    value={orderNote}
                    onChange={e => setOrderNote(e.target.value)}
                    rows={2}
                    className="w-full bg-gs-card-alt/60 border border-white/5 rounded-lg px-3 py-2 text-xs text-gs-text placeholder-gs-text-muted focus:outline-none focus:border-gs-red-bright/40 focus:ring-1 focus:ring-gs-red-bright/10 resize-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="px-6 py-6 border-t border-white/5 bg-gs-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gs-text-secondary text-xs font-bold uppercase tracking-wider font-mono">Estimated Total</span>
                <span className="text-gs-text font-black text-lg font-rajdhani tracking-wider">৳{cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3.5 btn-primary-red text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-gs-red-core/30"
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

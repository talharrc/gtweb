import { useState } from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, Truck } from 'lucide-react';
import { useStoreCart } from '../../context/StoreCartContext';

export default function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { cart, cartTotal, isCartOpen, closeCart, updateQuantity, removeFromCart } = useStoreCart();
  const [orderNote, setOrderNote] = useState('');

  if (!isCartOpen) return null;

  // Free delivery threshold (e.g., ৳500 BDT)
  const FREE_SHIPPING_THRESHOLD = 500;
  const deliveryLeft = FREE_SHIPPING_THRESHOLD - cartTotal;
  const deliveryPercent = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[#000000]/60 backdrop-blur-sm transition-opacity" onClick={closeCart} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0710]/95 border-l border-white/5 shadow-2xl flex flex-col justify-between custom-scrollbar">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#e50914] drop-shadow-[0_0_8px_rgba(229,9,20,0.4)]" /> Shopping Cart
            </h3>
            <button onClick={closeCart} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-12 h-12 text-white/10 mb-4" />
                <p className="text-white/40 text-sm">Your cart is empty.</p>
                <button onClick={closeCart} className="text-xs text-[#e50914] font-bold mt-3 hover:underline">
                  Browse plans now →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Free Delivery Bar */}
                <div className="bg-[#121212] border border-white/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                    <Truck className="w-4 h-4 text-[#e50914]" />
                    {deliveryLeft > 0 ? (
                      <span>Add <strong className="text-[#e50914]">৳{deliveryLeft.toLocaleString()}</strong> more for Free Delivery</span>
                    ) : (
                      <span className="text-emerald-400">🎉 Congratulations! You qualify for Free Delivery</span>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#e50914] to-red-500 transition-all duration-300"
                      style={{ width: `${deliveryPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-4">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.plan.id}`} className="flex gap-4 p-4 bg-[#121212]/50 border border-white/5 rounded-2xl items-center">
                      <div className="w-12 h-12 rounded-xl bg-[#000000] border border-white/5 flex items-center justify-center text-white/40 flex-shrink-0 p-1">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                        ) : (
                          <ShoppingBag className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="text-white text-xs font-bold truncate leading-tight">{item.product.name}</h4>
                            <p className="text-white/40 text-[10px] mt-1 truncate">{item.plan.label} · {item.plan.durationLabel}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id, item.plan.id)} className="text-white/20 hover:text-[#e50914] transition-colors flex-shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-white font-bold text-xs">৳{item.plan.priceBDT.toLocaleString()}</p>
                          
                          <div className="flex items-center gap-2 bg-[#000000] border border-white/5 rounded-lg px-2 py-1 w-max">
                            <button onClick={() => updateQuantity(item.product.id, item.plan.id, -1)} className="text-white/40 hover:text-white transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-xs font-semibold px-1">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.plan.id, 1)} className="text-white/40 hover:text-white transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Note */}
                <div className="border-t border-white/5 pt-4">
                  <label className="text-[10px] font-bold text-white uppercase tracking-wider block mb-2">Add Order Note (Optional)</label>
                  <textarea
                    placeholder="E.g., Special instructions or WhatsApp number"
                    value={orderNote}
                    onChange={e => setOrderNote(e.target.value)}
                    rows={2}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e50914] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkbox/Totals */}
          {cart.length > 0 && (
            <div className="px-6 py-6 border-t border-white/5 bg-[#121212]/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/50 text-xs">Subtotal Amount</span>
                <span className="text-white font-black text-lg">৳{cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3.5 bg-[#e50914] hover:bg-[#b81d24] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:scale-[1.01]"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

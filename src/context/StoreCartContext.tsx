import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductPlan } from '../types';

export interface CartItem {
  product: Product;
  plan: ProductPlan;
  quantity: number;
}

interface StoreCartContextValue {
  cart: CartItem[];
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, plan: ProductPlan) => void;
  updateQuantity: (productId: string, planId: string, delta: number) => void;
  removeFromCart: (productId: string, planId: string) => void;
  clearCart: () => void;
}

const StoreCartContext = createContext<StoreCartContextValue | null>(null);

export function StoreCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gt_cart');
      if (stored) setCart(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('gt_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  };

  const addToCart = (product: Product, plan: ProductPlan) => {
    const existing = cart.find(item => item.product.id === product.id && item.plan.id === plan.id);
    const newCart = existing
      ? cart.map(item =>
          item.product.id === product.id && item.plan.id === plan.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...cart, { product, plan, quantity: 1 }];
    saveCart(newCart);
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, planId: string, delta: number) => {
    saveCart(cart.map(item =>
      item.product.id === productId && item.plan.id === planId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeFromCart = (productId: string, planId: string) => {
    saveCart(cart.filter(item => !(item.product.id === productId && item.plan.id === planId)));
  };

  const clearCart = () => saveCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.plan.priceBDT * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreCartContext.Provider value={{
      cart, cartTotal, cartItemCount, isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addToCart, updateQuantity, removeFromCart, clearCart,
    }}>
      {children}
    </StoreCartContext.Provider>
  );
}

export function useStoreCart(): StoreCartContextValue {
  const ctx = useContext(StoreCartContext);
  if (!ctx) throw new Error('useStoreCart must be used within a StoreCartProvider');
  return ctx;
}

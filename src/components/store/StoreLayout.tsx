import { useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Search, ArrowLeft, Facebook, Twitter } from 'lucide-react';
import { ProductCategory } from '../../types';
import { StoreCartProvider, useStoreCart } from '../../context/StoreCartContext';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';

const CATEGORIES: { label: string; value: ProductCategory | 'All' }[] = [
  { label: 'All Products', value: 'All' },
  { label: 'Streaming', value: 'Streaming' },
  { label: 'Music', value: 'Music' },
  { label: 'AI Tools', value: 'AI Tools' },
  { label: 'Design', value: 'Design' },
  { label: 'Gaming', value: 'Gaming' },
  { label: 'Gift Cards', value: 'Gift Cards' },
];

function StoreHeader() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { cartItemCount, openCart } = useStoreCart();
  const activeCategory = searchParams.get('category') ?? 'All';
  const searchQuery = searchParams.get('q') ?? '';

  const goToCategory = (value: string) => {
    navigate(value === 'All' ? '/browse' : `/browse?category=${encodeURIComponent(value)}`);
  };

  const onSearchChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('q', value); else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-xs font-medium flex-shrink-0 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> GalaxaTech
        </button>

        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 flex-shrink-0">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          <span className="font-black text-lg tracking-tight text-slate-900">GALAXA STORE</span>
        </button>

        <div className="relative flex-1 max-w-sm ml-auto hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>

        <button
          onClick={openCart}
          className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 hover:border-blue-300 text-slate-700 transition-all flex-shrink-0"
        >
          <ShoppingBag className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold hidden sm:inline">Cart</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      <nav className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => goToCategory(cat.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat.value
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function StoreFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="font-black text-slate-900 mb-2">GALAXA STORE</p>
          <p className="text-slate-500 text-xs leading-relaxed">Subscription plans and digital top-ups for Bangladesh, delivered fast and paid for with bKash, Nagad, or Rocket.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-700 mb-2 text-xs uppercase tracking-wider">Policies</p>
          <div className="flex flex-col gap-1.5 text-xs text-slate-500">
            <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-blue-600 transition-colors">Refund &amp; Support</a>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-700 mb-2 text-xs uppercase tracking-wider">Follow Us</p>
          <div className="flex gap-3">
            <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-[11px] text-slate-400">
        © {new Date().getFullYear()} Galaxa Store, a GalaxaTech brand.
      </div>
    </footer>
  );
}

function StoreLayoutInner() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { closeCart } = useStoreCart();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col" style={{ colorScheme: 'light' }}>
      <StoreHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <StoreFooter />
      <CartDrawer onCheckout={() => { closeCart(); setIsCheckingOut(true); }} />
      {isCheckingOut && <CheckoutModal onClose={() => setIsCheckingOut(false)} />}
    </div>
  );
}

export default function StoreLayout() {
  return (
    <StoreCartProvider>
      <StoreLayoutInner />
    </StoreCartProvider>
  );
}

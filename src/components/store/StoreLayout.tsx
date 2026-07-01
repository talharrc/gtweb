import { useState, useEffect, FormEvent } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Search, ArrowLeft, Facebook, Twitter, ShieldAlert, Mail } from 'lucide-react';
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

function AnnouncementBar() {
  const announcements = [
    "🚀 Enjoy a Better OTT Experience with Full Control • Support Hours: 11:00 AM – 11:30 PM",
    "🔔 Please check our Product Details, Terms of Service, and Refund Policy before ordering",
    "⚡ Fast delivery via WhatsApp / Customer Hub within 15-30 minutes"
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#e50914] text-white py-2 px-4 text-center text-[11px] font-bold uppercase tracking-wider relative h-8 flex items-center justify-center border-b border-[#b81d24]/30 z-50">
      <div key={index} className="truncate max-w-full animate-fade-in flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5" />
        {announcements[index]}
      </div>
    </div>
  );
}

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
    <header className="sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-1 text-white/40 hover:text-white text-xs font-semibold flex-shrink-0 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Agency
        </button>

        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 flex-shrink-0">
          <ShoppingBag className="w-5 h-5 text-[#e50914] drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]" />
          <span className="font-black text-xl tracking-tight text-white">GALAXA<span className="text-[#e50914]">STORE</span></span>
        </button>

        <div className="relative flex-1 max-w-sm ml-auto hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search premium plans..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded-full pl-9 pr-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#e50914]/60 transition-colors"
          />
        </div>

        <button
          onClick={openCart}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[#e50914]/40 bg-[#121212] text-white hover:text-[#e50914] transition-all flex-shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-xs font-bold hidden sm:inline">Cart</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#e50914] flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_8px_rgba(229,9,20,0.5)]">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search premium plans..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded-full pl-9 pr-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#e50914]/60 transition-colors"
          />
        </div>
      </div>

      <nav className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => goToCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all border ${
              activeCategory === cat.value
                ? 'bg-[#e50914] border-[#e50914] text-white shadow-[0_0_8px_rgba(229,9,20,0.3)]'
                : 'bg-[#121212] border-white/5 text-white/60 hover:border-white/20 hover:text-white'
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
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="border-t border-white/5 bg-[#000000] mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div className="md:col-span-2">
          <p className="font-black text-xl tracking-tight text-white mb-3">
            GALAXA<span className="text-[#e50914]">STORE</span>
          </p>
          <p className="text-white/50 text-xs leading-relaxed max-w-sm mb-5">
            Premium subscription plans and digital top-ups for entertainment, design, and developer tools in Bangladesh. Fast WhatsApp/Email delivery, secured checkouts via bKash, Nagad, and Rocket.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://www.facebook.com/share/1GJq598Yfm/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-[#121212] border border-white/5 hover:border-[#e50914] flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://x.com/galaxatech" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-[#121212] border border-white/5 hover:border-[#e50914] flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-[#e50914]">Quick Links</p>
          <div className="flex flex-col gap-2.5 text-xs text-white/50">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-white transition-colors">Refund &amp; Support</a>
          </div>
        </div>

        <div>
          <p className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-[#e50914]">Newsletter</p>
          <p className="text-white/50 text-xs leading-relaxed mb-3">Subscribe to be in the know about top streaming deals.</p>
          
          {newsletterSubscribed ? (
            <p className="text-emerald-400 text-xs font-semibold">✓ Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#e50914] flex-1"
                required
              />
              <button 
                type="submit"
                className="bg-[#e50914] hover:bg-[#b81d24] text-white p-2 rounded-lg text-xs font-bold transition-all shadow-[0_0_8px_rgba(229,9,20,0.2)]"
              >
                <Mail className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-[10px] text-white/30">
        © {new Date().getFullYear()} Galaxa Store, a GalaxaTech brand. All Site Content is protected.
      </div>
    </footer>
  );
}

function StoreLayoutInner() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { closeCart } = useStoreCart();

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col custom-scrollbar relative" style={{ colorScheme: 'dark' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/5 w-[32rem] h-[32rem] bg-[#e50914]/25 rounded-full blur-[110px]" />
        <div className="absolute top-24 -right-24 w-[28rem] h-[28rem] bg-teal-500/20 rounded-full blur-[110px]" />
        <div className="absolute top-[70vh] left-1/3 w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[110px]" />
        <div className="absolute top-[140vh] -right-10 w-[26rem] h-[26rem] bg-[#e50914]/15 rounded-full blur-[110px]" />
      </div>
      <AnnouncementBar />
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

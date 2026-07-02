import { useState, useEffect, FormEvent } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Search, ArrowLeft, Facebook, Twitter, MessageCircle, Mail, User } from 'lucide-react';
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
    'Enjoy a Better OTT Experience with Full Control • Support Hours: 11:00 AM – 11:30 PM',
    'Please check our Product Details, Terms of Service, and Refund Policy before ordering',
    'Fast delivery via WhatsApp / Customer Hub within 15-30 minutes',
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % announcements.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white py-1.5 px-4 text-center text-[11px] font-medium relative h-7 flex items-center justify-center overflow-hidden font-mono uppercase tracking-wider">
      <div key={index} className="truncate max-w-full animate-fade-in">{announcements[index]}</div>
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
    <header className="sticky top-0 z-40 bg-gs-nav/90 backdrop-blur-md border-b border-gs-red-core/15">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3.5 flex items-center gap-1.5 sm:gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gs-text-muted hover:text-gs-text text-xs font-medium flex-shrink-0 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Agency</span>
        </button>

        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 flex-shrink-0 group">
          <img src="/store/gs-logo.png" alt="Galaxa Store" className="w-8 h-8 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 border border-gs-red-core/20 group-hover:border-gs-red-bright/40 shadow-sm group-hover:shadow-gs-red-core/25" />
          <span className="font-rajdhani font-black text-lg sm:text-xl tracking-wider text-gs-text uppercase">Galaxa<span className="text-transparent bg-clip-text bg-gradient-to-r from-gs-red-bright to-gs-red-orange">Store</span></span>
        </button>

        <div className="relative flex-1 max-w-sm ml-auto hidden sm:block group-within:scale-[1.01] transition-transform duration-200">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gs-text-muted group-focus-within:text-gs-red-bright transition-colors" />
          <input
            type="text"
            placeholder="Search premium plans..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-gs-card/50 border border-white/10 hover:border-white/20 rounded-full pl-9 pr-3 py-2 text-gs-text text-sm placeholder-gs-text-muted focus:outline-none focus:border-gs-red-bright/40 focus:ring-1 focus:ring-gs-red-bright/20 focus:bg-gs-card-alt/80 transition-all"
          />
        </div>

        <button className="text-gs-text-muted hover:text-gs-text transition-colors flex-shrink-0 hover:scale-105 active:scale-95 duration-200" aria-label="Account">
          <User className="w-5 h-5" />
        </button>

        <button
          onClick={openCart}
          className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-white/10 bg-gs-card/30 hover:bg-gs-card-alt/50 hover:border-gs-red-orange/30 text-gs-text-secondary hover:text-gs-text transition-all duration-300 flex-shrink-0"
        >
          <ShoppingBag className="w-4 h-4 text-gs-text-secondary" />
          <span className="text-xs font-semibold hidden sm:inline">Cart</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-gs-red-core to-gs-red-orange flex items-center justify-center text-[10px] font-black text-white shadow-sm shadow-gs-red-core/30 animate-pulse">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      <div className="sm:hidden px-3 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gs-text-muted" />
          <input
            type="text"
            placeholder="Search premium plans..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-gs-card/50 border border-white/10 rounded-full pl-9 pr-3 py-2 text-gs-text text-sm placeholder-gs-text-muted focus:outline-none focus:border-gs-red-bright/40 focus:ring-1 focus:ring-gs-red-bright/20 focus:bg-gs-card-alt/80 transition-all"
          />
        </div>
      </div>

      <nav className="max-w-6xl mx-auto px-3 sm:px-6 pb-3.5 flex gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => goToCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold font-rajdhani uppercase tracking-wider whitespace-nowrap transition-all border duration-300 ${
              activeCategory === cat.value
                ? 'bg-gradient-to-r from-gs-red-core to-gs-red-bright border-gs-red-core text-white shadow-sm shadow-gs-red-core/25'
                : 'bg-gs-card/50 border-white/10 text-gs-text-secondary hover:border-gs-red-orange/30 hover:text-gs-text'
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
    <footer className="border-t border-white/10 bg-gs-surface mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/store/gs-logo.png" alt="Galaxa Store" className="w-9 h-9 rounded-lg object-cover border border-gs-red-core/20 shadow-sm" />
            <p className="font-rajdhani font-black text-xl tracking-wider text-gs-text uppercase">
              Galaxa<span className="text-transparent bg-clip-text bg-gradient-to-r from-gs-red-bright to-gs-red-orange">Store</span>
            </p>
          </div>
          <p className="text-gs-text-secondary text-xs leading-relaxed max-w-sm mb-6">
            Premium subscription plans and digital top-ups for entertainment, design, and developer tools in Bangladesh. Fast WhatsApp/Email delivery, secured checkouts via bKash, Nagad, and Rocket.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-gs-red-bright flex items-center justify-center text-[#A89EB8] hover:text-white transition-all shadow-sm duration-200">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-gs-red-bright flex items-center justify-center text-[#A89EB8] hover:text-white transition-all shadow-sm duration-200">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="font-bold text-gs-text mb-4 text-[10px] uppercase tracking-widest font-mono text-gs-red-bright">Quick Links</p>
          <div className="flex flex-col gap-2.5 text-xs text-gs-text-secondary">
            <a href="/privacy" className="hover:text-gs-text hover:underline decoration-gs-red-bright/50 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-gs-text hover:underline decoration-gs-red-bright/50 transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-gs-text hover:underline decoration-gs-red-bright/50 transition-colors">Refund &amp; Support</a>
          </div>
        </div>

        <div>
          <p className="font-bold text-gs-text mb-4 text-[10px] uppercase tracking-widest font-mono text-gs-red-bright">Newsletter</p>
          <p className="text-gs-text-secondary text-xs leading-relaxed mb-3">Subscribe to be in the know about top streaming deals.</p>

          {newsletterSubscribed ? (
            <p className="text-emerald-400 text-xs font-semibold">✓ Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="bg-gs-card/50 border border-white/10 rounded-lg px-3 py-2 text-gs-text text-xs placeholder-white/20 focus:outline-none focus:border-gs-red-bright/40 focus:ring-1 focus:ring-gs-red-bright/10 flex-1 transition-all"
                required
              />
              <button type="submit" className="bg-gradient-to-br from-gs-red-core to-gs-red-orange hover:brightness-110 text-white p-2 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm shadow-gs-red-core/25">
                <Mail className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-[10px] text-white/30">
        © {new Date().getFullYear()} Galaxa Store, a GalaxaTech brand. All Site Content is protected.
      </div>
    </footer>
  );
}

function StoreWhatsAppButton() {
  return (
    <a
      href="https://wa.me/8801959209103"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 sm:right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full text-white transition-all hover:scale-105 active:scale-95"
      style={{
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
        background: 'linear-gradient(135deg, #25d366 0%, #128c48 100%)',
        boxShadow: '0 4px 20px rgba(37,211,102,0.35)',
      }}
    >
      <MessageCircle className="w-5 h-5" />
    </a>
  );
}

function StoreLayoutInner() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { closeCart } = useStoreCart();

  return (
    <div className="min-h-screen bg-gs-void text-gs-text flex flex-col" style={{ colorScheme: 'dark' }}>
      <div className="gs-bg-mesh" />
      <AnnouncementBar />
      <StoreHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <StoreFooter />
      <StoreWhatsAppButton />
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

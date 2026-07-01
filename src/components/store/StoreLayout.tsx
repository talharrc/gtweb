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
    <div className="bg-black text-white py-1.5 px-4 text-center text-[11px] font-medium relative h-7 flex items-center justify-center overflow-hidden">
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-700 text-xs font-medium flex-shrink-0 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Agency
        </button>

        <button onClick={() => navigate('/browse')} className="flex items-center gap-1.5 flex-shrink-0">
          <span className="font-black text-xl tracking-tight text-[#e50914]">GALAXA<span className="text-slate-900">STORE</span></span>
        </button>

        <div className="relative flex-1 max-w-sm ml-auto hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search premium plans..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-3 py-2 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#e50914]/50 transition-colors"
          />
        </div>

        <button className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0" aria-label="Account">
          <User className="w-5 h-5" />
        </button>

        <button
          onClick={openCart}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 hover:border-[#e50914]/40 text-slate-700 hover:text-[#e50914] transition-all flex-shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-xs font-semibold hidden sm:inline">Cart</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#e50914] flex items-center justify-center text-[10px] font-black text-white">
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
            placeholder="Search premium plans..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-3 py-2 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-[#e50914]/50 transition-colors"
          />
        </div>
      </div>

      <nav className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => goToCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat.value
                ? 'bg-[#e50914] border-[#e50914] text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-[#e50914]/40 hover:text-[#e50914]'
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
    <footer className="border-t border-white/10 bg-[#0a0a0a] mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div className="md:col-span-2">
          <p className="font-black text-xl tracking-tight mb-3">
            <span className="text-[#e50914]">GALAXA</span><span className="text-white">STORE</span>
          </p>
          <p className="text-white/50 text-xs leading-relaxed max-w-sm mb-5">
            Premium subscription plans and digital top-ups for entertainment, design, and developer tools in Bangladesh. Fast WhatsApp/Email delivery, secured checkouts via bKash, Nagad, and Rocket.
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-[#e50914] flex items-center justify-center text-white/50 hover:text-white transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-[#e50914] flex items-center justify-center text-white/50 hover:text-white transition-all">
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
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#e50914] flex-1"
                required
              />
              <button type="submit" className="bg-[#e50914] hover:bg-[#b81d24] text-white p-2 rounded-lg text-xs font-bold transition-all">
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
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full text-white transition-all hover:scale-105 active:scale-95"
      style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c48 100%)', boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}
    >
      <MessageCircle className="w-5 h-5" />
    </a>
  );
}

function StoreLayoutInner() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { closeCart } = useStoreCart();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col" style={{ colorScheme: 'light' }}>
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

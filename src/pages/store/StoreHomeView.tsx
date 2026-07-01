import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Loader2, ShoppingBag, ShieldCheck, ChevronDown, Award, Star, Search,
  Tv, Music, Bot, Palette, Gamepad2, Gift, Truck, BadgePercent, Headphones,
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { useStoreProducts } from '../../hooks/useStoreProducts';
import ProductCard from '../../components/store/ProductCard';

const CATEGORY_ICONS: Record<ProductCategory, typeof Tv> = {
  Streaming: Tv, Music: Music, 'AI Tools': Bot, Design: Palette,
  Productivity: Palette, Gaming: Gamepad2, 'Gift Cards': Gift, Other: ShoppingBag,
};

const FEATURES = [
  { icon: Truck, label: 'Fast Delivery' },
  { icon: BadgePercent, label: 'Discounted Prices' },
  { icon: ShieldCheck, label: 'Secure Payment' },
  { icon: Headphones, label: 'Customer Support' },
];

export default function StoreHomeView() {
  const navigate = useNavigate();
  const { products, loadingProducts } = useStoreProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? 'All';
  const query = (searchParams.get('q') ?? '').toLowerCase();

  const onHeroSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('q', value); else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const filtered = products.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.shortDescription.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  // FAQs interactive accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (idx: number) => setOpenFaq(openFaq === idx ? null : idx);

  const FAQS = [
    { q: "How to get subscription details after ordering?", a: "Once your payment is verified (usually within 15-30 minutes), your login credentials (username and password) will be delivered directly to your Customer Hub dashboard under 'My Orders' and sent via WhatsApp / Email." },
    { q: "Is Galaxa Store safe and trustworthy?", a: "Yes. All transactions are fully secured, and we provide active warranties for the entire duration of your plan. Customer service is available 11:00 AM – 11:30 PM daily." },
    { q: "What happens if the subscription doesn't work?", a: "If you encounter any issues (e.g. password errors, screen limits), contact our support team immediately. We will troubleshoot or replace the credentials within minutes under our warranty policy." },
    { q: "What are the accepted payment methods?", a: "We accept bKash, Nagad, and Rocket payments. Checkout is simple and verified using your Sender mobile number and Transaction ID (TrxID)." },
    { q: "Are these subscriptions official?", a: "Yes, all plans (Netflix, Spotify, ChatGPT Plus, Canva Pro) are officially purchased and distributed. We offer both shared screens and private personal accounts depending on your preference." }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Helmet>
        <title>Galaxa Store — Netflix, Spotify, ChatGPT Plus & More</title>
        <meta name="description" content="Buy Netflix, Spotify, ChatGPT Plus, Canva Pro, gift cards, and game top-ups in Bangladesh via bKash & Nagad." />
      </Helmet>

      {/* Hero Banner Promo — sits directly on the page's ambient glow, no boxed card */}
      {category === 'All' && !query && (
        <div className="mb-10 relative py-10 md:py-14 flex flex-col items-center text-center">
          <img
            src="/store/netflix.svg"
            alt=""
            aria-hidden="true"
            className="absolute w-72 h-72 object-contain opacity-[0.05] pointer-events-none"
          />

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e50914]/15 border border-[#e50914]/30 text-[#e50914] text-[10px] font-black uppercase tracking-wider mb-5">
              <Award className="w-3.5 h-3.5" /> Best Streaming Deals in BD
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3 tracking-tight">
              Premium Subscriptions,<br />
              <span className="text-[#e50914] drop-shadow-[0_0_15px_rgba(229,9,20,0.3)]">Fast, Secure, Personalized</span>
            </h2>
            <p className="text-white/60 text-sm max-w-md mx-auto mb-7 leading-relaxed">
              Netflix, Spotify, ChatGPT Plus &amp; more — shared and private plans starting from just <strong className="text-white">৳349/mo</strong>.
            </p>

            <div className="relative max-w-md mx-auto mb-7">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search Netflix, Spotify, ChatGPT Plus..."
                onChange={e => onHeroSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#e50914]/60 transition-colors"
              />
            </div>

            <button
              onClick={() => navigate('/browse/product/netflix-premium')}
              className="px-6 py-3.5 rounded-xl bg-[#e50914] hover:bg-[#b81d24] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:scale-105 active:scale-95"
            >
              Get Netflix Now
            </button>
          </div>
        </div>
      )}

      {/* Shop by Category */}
      {category === 'All' && !query && (
        <div className="mb-10">
          <h2 className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Shop by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {(['Streaming', 'Music', 'AI Tools', 'Design', 'Gaming', 'Gift Cards'] as ProductCategory[]).map(cat => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => navigate(`/browse?category=${encodeURIComponent(cat)}`)}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-white/5 bg-[#121212]/50 hover:border-[#e50914]/40 hover:bg-[#121212] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/60 group-hover:text-[#e50914] group-hover:border-[#e50914]/30 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-white/70 group-hover:text-white text-center leading-tight">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature strip */}
      {category === 'All' && !query && (
        <div className="mb-10 rounded-2xl border border-white/5 bg-[#121212]/40 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <div key={f.label} className="flex items-center gap-2.5 justify-center sm:justify-start">
              <f.icon className="w-4 h-4 text-[#e50914] flex-shrink-0" />
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wide">{f.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main product catalog */}
      <div className="mb-8 flex items-baseline justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {category === 'All' ? 'What Everyone’s Watching' : category}
          </h1>
          <p className="text-white/40 text-xs mt-1">Instant digital delivery. Payment secured via bKash, Nagad, and Rocket.</p>
        </div>
      </div>

      {loadingProducts ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#e50914] animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-white/5 rounded-3xl bg-[#121212]/40">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-white font-semibold text-sm mb-1">No products found</p>
          <p className="text-white/40 text-xs max-w-xs">Try searching for Netflix, Spotify, or choose another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Trust Accordions / Review section */}
      {category === 'All' && !query && (
        <div className="mt-24 border-t border-white/5 pt-16 max-w-4xl mx-auto">
          {/* Rating Summary */}
          <div className="text-center mb-10">
            <div className="flex justify-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">Over 2,000+ Happy Customers</h3>
            <p className="text-white/50 text-xs">We provide active warranties and instant support for all subscriptions.</p>
          </div>

          {/* Interactive FAQs Accordion */}
          <div className="glass-card rounded-2xl border border-white/5 bg-[#121212]/30 p-6 md:p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#e50914]" /> FAQs &amp; Support Guide
            </h3>
            
            <div className="flex flex-col gap-4">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between text-left text-sm font-bold text-white hover:text-[#e50914] transition-colors py-2"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180 text-[#e50914]' : ''}`} />
                    </button>
                    {isOpen && (
                      <p className="text-xs text-white/50 leading-relaxed mt-2.5 pl-1 animate-fade-in">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

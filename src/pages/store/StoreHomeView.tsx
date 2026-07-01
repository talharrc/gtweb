import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Loader2, ShoppingBag, ShieldCheck, ChevronDown, Star, ChevronLeft, ChevronRight,
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

const HERO_SLIDES = [
  {
    slug: 'netflix-premium', badge: 'Best Streaming Deal', image: '/store/netflix.svg',
    title: 'Netflix Premium', subtitle: 'Watch on any screen — mobile, laptop, or TV — in Full HD or 4K.', priceFrom: 349,
  },
  {
    slug: 'chatgpt-plus', badge: 'Most Popular AI Tool', image: '/store/chatgpt.svg',
    title: 'ChatGPT Plus', subtitle: 'GPT-5 access, image generation, web browsing, and file uploads.', priceFrom: 500,
  },
  {
    slug: 'netflix-prime-combo', badge: 'Best Value Combo', image: '/store/netflix.svg',
    title: 'Netflix + Prime Video', subtitle: 'One plan, two of the biggest streaming libraries.', priceFrom: 489,
  },
];

function HeroCarousel() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[index];

  return (
    <div className="relative mb-10 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-r from-slate-50 to-white">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 p-8 md:p-12">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#e50914]/10 text-[#e50914] text-[10px] font-bold uppercase tracking-wider mb-4">
            {slide.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-3 tracking-tight">
            {slide.title}
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">{slide.subtitle}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/browse/product/${slide.slug}`)}
              className="px-6 py-3 rounded-lg bg-[#e50914] hover:bg-[#b81d24] text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Shop Now — from ৳{slide.priceFrom}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src={slide.image} alt={slide.title} className="w-40 h-40 md:w-52 md:h-52 object-contain rounded-2xl shadow-lg" />
        </div>
      </div>

      <button
        onClick={() => setIndex(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-slate-500 hover:text-[#e50914] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setIndex(prev => (prev + 1) % HERO_SLIDES.length)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-slate-500 hover:text-[#e50914] transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-[#e50914]' : 'w-1.5 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function StoreHomeView() {
  const navigate = useNavigate();
  const { products, loadingProducts } = useStoreProducts();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') ?? 'All';
  const query = (searchParams.get('q') ?? '').toLowerCase();

  const filtered = products.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.shortDescription.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
  const featured = products.filter(p => p.isFeatured);
  const showHomeSections = category === 'All' && !query;

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (idx: number) => setOpenFaq(openFaq === idx ? null : idx);

  const FAQS = [
    { q: "How to get subscription details after ordering?", a: "Once your payment is verified (usually within 15-30 minutes), your login credentials (username and password) will be delivered directly to your Customer Hub dashboard under 'My Orders' and sent via WhatsApp / Email." },
    { q: "Is Galaxa Store safe and trustworthy?", a: "Yes. All transactions are fully secured, and we provide active warranties for the entire duration of your plan. Customer service is available 11:00 AM – 11:30 PM daily." },
    { q: "What happens if the subscription doesn't work?", a: "If you encounter any issues (e.g. password errors, screen limits), contact our support team immediately. We will troubleshoot or replace the credentials within minutes under our warranty policy." },
    { q: "What are the accepted payment methods?", a: "We accept bKash, Nagad, and Rocket payments. Checkout is simple and verified using your Sender mobile number and Transaction ID (TrxID)." },
    { q: "Are these subscriptions official?", a: "Yes, all plans (Netflix, Spotify, ChatGPT Plus, Canva Pro) are officially purchased and distributed. We offer both shared screens and private personal accounts depending on your preference." },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Helmet>
        <title>Galaxa Store — Netflix, Spotify, ChatGPT Plus & More</title>
        <meta name="description" content="Buy Netflix, Spotify, ChatGPT Plus, Canva Pro, gift cards, and game top-ups in Bangladesh via bKash & Nagad." />
      </Helmet>

      {showHomeSections && <HeroCarousel />}

      {showHomeSections && (
        <div className="mb-10">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Shop by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {(['Streaming', 'Music', 'AI Tools', 'Design', 'Gaming', 'Gift Cards'] as ProductCategory[]).map(cat => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => navigate(`/browse?category=${encodeURIComponent(cat)}`)}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-slate-200 bg-white hover:border-[#e50914]/40 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[#e50914] group-hover:border-[#e50914]/30 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 group-hover:text-slate-900 text-center leading-tight">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showHomeSections && (
        <div className="mb-10 rounded-xl border border-slate-200 bg-slate-50 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <div key={f.label} className="flex items-center gap-2.5 justify-center sm:justify-start">
              <f.icon className="w-4 h-4 text-[#e50914] flex-shrink-0" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">{f.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mb-8 flex items-baseline justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {category === 'All' ? "What Everyone's Watching" : category}
          </h1>
          <p className="text-slate-400 text-xs mt-1">Instant digital delivery. Payment secured via bKash, Nagad, and Rocket.</p>
        </div>
      </div>

      {loadingProducts ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#e50914] animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-slate-200 rounded-2xl bg-slate-50">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-slate-700 font-semibold text-sm mb-1">No products found</p>
          <p className="text-slate-400 text-xs max-w-xs">Try searching for Netflix, Spotify, or choose another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {showHomeSections && featured.length > 0 && (
        <div className="mt-14">
          <div className="mb-6 border-b border-slate-200 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Featured Collection</h2>
            <p className="text-slate-400 text-xs mt-1">Our most popular picks this month.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {showHomeSections && (
        <div className="mt-20 border-t border-slate-200 pt-14 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex justify-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">Trusted by customers across Bangladesh</h3>
            <p className="text-slate-500 text-xs">We provide active warranties and instant support for all subscriptions.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#e50914]" /> FAQs &amp; Support Guide
            </h3>

            <div className="flex flex-col gap-4">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-[#e50914] transition-colors py-2"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#e50914]' : ''}`} />
                    </button>
                    {isOpen && <p className="text-xs text-slate-500 leading-relaxed mt-2.5 pl-1">{faq.a}</p>}
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

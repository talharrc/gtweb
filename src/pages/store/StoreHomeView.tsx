import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Loader2, ShoppingBag, ShieldCheck, ChevronDown, Star,
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

function VideoHero() {
  return (
    <div className="relative mb-10 rounded-2xl overflow-hidden border border-white/10 h-64 sm:h-80 md:h-[420px]">
      <video
        src="/store/GS banner.mp4"
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
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

      {showHomeSections && <VideoHero />}

      {showHomeSections && (
        <div className="mb-10">
          <h2 className="text-xs font-bold text-[#6E6480] uppercase tracking-widest mb-4 font-mono">Shop by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {(['Streaming', 'Music', 'AI Tools', 'Design', 'Gaming', 'Gift Cards'] as ProductCategory[]).map(cat => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => navigate(`/browse?category=${encodeURIComponent(cat)}`)}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-white/10 bg-[#16101E] hover:border-[#E04420]/40 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1E1428] border border-white/10 flex items-center justify-center text-[#A89EB8] group-hover:text-[#CD381D] group-hover:border-[#E04420]/30 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#A89EB8] group-hover:text-[#F4F1F8] text-center leading-tight">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showHomeSections && (
        <div className="mb-10 rounded-xl border border-white/10 bg-[#16101E] px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <div key={f.label} className="flex items-center gap-2.5 justify-center sm:justify-start">
              <f.icon className="w-4 h-4 text-[#E04420] flex-shrink-0" />
              <span className="text-[11px] font-bold text-[#A89EB8] uppercase tracking-wide font-mono">{f.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mb-8 flex items-baseline justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#F4F1F8] tracking-tight font-display">
            {category === 'All' ? "What Everyone's Watching" : category}
          </h1>
          <p className="text-[#6E6480] text-xs mt-1">Instant digital delivery. Payment secured via bKash, Nagad, and Rocket.</p>
        </div>
      </div>

      {loadingProducts ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#CD381D] animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-white/10 rounded-2xl bg-[#16101E]">
          <div className="w-14 h-14 rounded-2xl bg-[#1E1428] border border-white/10 flex items-center justify-center text-[#6E6480] mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-[#A89EB8] font-semibold text-sm mb-1">No products found</p>
          <p className="text-[#6E6480] text-xs max-w-xs">Try searching for Netflix, Spotify, or choose another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {showHomeSections && featured.length > 0 && (
        <div className="mt-14">
          <div className="mb-6 border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#F4F1F8] tracking-tight font-display">Featured Collection</h2>
            <p className="text-[#6E6480] text-xs mt-1">Our most popular picks this month.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {showHomeSections && (
        <div className="mt-20 border-t border-white/10 pt-14 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex justify-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#F4F1F8] tracking-tight mb-2 font-display">Trusted by customers across Bangladesh</h3>
            <p className="text-[#A89EB8] text-xs">We provide active warranties and instant support for all subscriptions.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#16101E] p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#F4F1F8] mb-6 flex items-center gap-2 font-display">
              <ShieldCheck className="w-5 h-5 text-[#CD381D]" /> FAQs &amp; Support Guide
            </h3>

            <div className="flex flex-col gap-4">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between text-left text-sm font-bold text-[#F4F1F8] hover:text-[#CD381D] transition-colors py-2"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-[#6E6480] transition-transform ${isOpen ? 'rotate-180 text-[#CD381D]' : ''}`} />
                    </button>
                    {isOpen && <p className="text-xs text-[#A89EB8] leading-relaxed mt-2.5 pl-1">{faq.a}</p>}
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

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Loader2, ShoppingBag, ShieldCheck, ChevronDown, Star,
  Truck, BadgePercent, Headphones,
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { useStoreProducts } from '../../hooks/useStoreProducts';
import ProductCard from '../../components/store/ProductCard';


const FEATURES = [
  { icon: Truck, label: 'Fast Delivery' },
  { icon: BadgePercent, label: 'Discounted Prices' },
  { icon: ShieldCheck, label: 'Secure Payment' },
  { icon: Headphones, label: 'Customer Support' },
];

function VideoHero() {
  return (
    <div className="relative mb-12 rounded-2xl overflow-hidden border border-gs-red-core/20 h-64 sm:h-80 md:h-[420px] shadow-lg shadow-gs-red-core/10 group">
      <div className="absolute inset-0 bg-gradient-to-t from-gs-void via-transparent to-transparent z-10 pointer-events-none" />
      <video
        src="/store/GS banner.mp4"
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-[1.01] transition-transform duration-700"
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
        <div className="mb-12">
          <h2 className="text-[10px] font-bold text-gs-text-muted uppercase tracking-widest mb-4 font-mono">Shop by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5">
            {([
              { cat: 'Streaming', img: '/store/cat-streaming.png' },
              { cat: 'Music', img: '/store/cat-music.png' },
              { cat: 'AI Tools', img: '/store/cat-ai-tools.png' },
              { cat: 'Design', img: '/store/cat-design.png' },
              { cat: 'Gaming', img: '/store/cat-gaming.png' },
              { cat: 'Gift Cards', img: '/store/cat-gift-cards.png' },
            ] as { cat: ProductCategory; img: string }[]).map(({ cat, img }) => (
              <button
                key={cat}
                onClick={() => navigate(`/browse?category=${encodeURIComponent(cat)}`)}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-gs-card/50 hover:border-gs-red-bright/30 hover:bg-gs-card-alt/80 hover:shadow-lg hover:shadow-gs-red-core/10 transition-all duration-300 group overflow-hidden"
              >
                <div className="w-full aspect-square overflow-hidden rounded-t-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gs-card/40 to-transparent opacity-60 pointer-events-none" />
                  <img
                    src={img}
                    alt={cat}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] font-bold font-rajdhani uppercase tracking-wider text-gs-text-secondary group-hover:text-gs-text text-center leading-tight pb-2.5 px-1.5 transition-colors duration-200">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showHomeSections && (
        <div className="mb-12 rounded-xl border border-white/5 bg-gradient-to-r from-gs-card/40 to-gs-card-alt/40 px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6 backdrop-blur-sm">
          {FEATURES.map(f => (
            <div key={f.label} className="flex items-center gap-3 justify-center sm:justify-start hover:scale-[1.02] transition-transform duration-300">
              <f.icon className="w-4.5 h-4.5 text-gs-red-bright flex-shrink-0 filter drop-shadow-[0_0_8px_rgba(205,56,29,0.3)]" />
              <span className="text-[10px] font-bold text-gs-text-secondary uppercase tracking-widest font-mono">{f.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mb-8 flex items-baseline justify-between border-b border-white/5 pb-4.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gs-text tracking-tight font-display">
            {category === 'All' ? "What Everyone's Watching" : category}
          </h1>
          <p className="text-gs-text-muted text-xs mt-1.5 leading-relaxed">Instant digital delivery. Payments secured via <span className="text-gs-text-secondary">bKash</span>, <span className="text-gs-text-secondary">Nagad</span>, and <span className="text-gs-text-secondary">Rocket</span>.</p>
        </div>
      </div>

      {loadingProducts ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-gs-red-bright animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-white/5 rounded-2xl bg-gs-card/40 backdrop-blur-sm">
          <div className="w-14 h-14 rounded-2xl bg-gs-card-alt/55 border border-white/5 flex items-center justify-center text-gs-text-muted mb-4 shadow-inner">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-gs-text-secondary font-semibold text-sm mb-1">No products found</p>
          <p className="text-gs-text-muted text-xs max-w-xs">Try searching for Netflix, Spotify, or choose another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {showHomeSections && featured.length > 0 && (
        <div className="mt-16">
          <div className="mb-6 border-b border-white/5 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-gs-text tracking-tight font-display">Featured Collection</h2>
            <p className="text-gs-text-muted text-xs mt-1.5">Our most popular picks this month.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {showHomeSections && (
        <div className="mt-24 border-t border-white/5 pt-16 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-1 text-amber-400 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.35)]" />)}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gs-text tracking-tight mb-2 font-display">Trusted by customers across Bangladesh</h3>
            <p className="text-gs-text-secondary text-xs">We provide active warranties and instant support for all subscriptions.</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-gs-card/60 to-gs-card-alt/60 p-6 md:p-8 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-bold text-gs-text mb-6 flex items-center gap-2.5 font-display border-b border-white/5 pb-4">
              <ShieldCheck className="w-5 h-5 text-gs-red-bright filter drop-shadow-[0_0_8px_rgba(205,56,29,0.35)]" /> FAQs &amp; Support Guide
            </h3>

            <div className="flex flex-col gap-4">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between text-left text-sm font-bold text-gs-text hover:text-gs-red-bright transition-all py-2"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-gs-text-muted transition-transform ${isOpen ? 'rotate-180 text-gs-red-bright' : ''}`} />
                    </button>
                    {isOpen && <p className="text-xs text-gs-text-secondary leading-relaxed mt-2.5 pl-1.5 transition-all duration-300 border-l border-gs-red-core/30">{faq.a}</p>}
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

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, ShoppingBag, ShieldCheck, ChevronDown, Award, Star } from 'lucide-react';
import { useStoreProducts } from '../../hooks/useStoreProducts';
import ProductCard from '../../components/store/ProductCard';

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

      {/* Hero Banner Promo */}
      {category === 'All' && !query && (
        <div className="mb-10 rounded-3xl overflow-hidden relative border border-white/5 bg-gradient-to-r from-red-950/20 via-black to-[#0c0717] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_45px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex-1 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e50914]/15 border border-[#e50914]/30 text-[#e50914] text-[10px] font-black uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" /> Best Streaming Deals in BD
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              Enjoy Unlimited <br />
              <span className="text-[#e50914] drop-shadow-[0_0_15px_rgba(229,9,20,0.3)]">Netflix Premium</span>
            </h2>
            <p className="text-white/60 text-sm max-w-sm mb-6 leading-relaxed">
              Unlock UHD 4K streaming on mobile, PC, or TV. Shared and private plans starting from just <strong className="text-white">৳349/mo</strong>.
            </p>
            <button 
              onClick={() => navigate('/browse/product/netflix-premium')}
              className="px-6 py-3.5 rounded-xl bg-[#e50914] hover:bg-[#b81d24] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:scale-105 active:scale-95"
            >
              Get Netflix Now
            </button>
          </div>
          <div className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[#e50914]/5 rounded-full filter blur-xl animate-pulse" />
            <img 
              src="/store/netflix.svg" 
              alt="Netflix Promo" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain z-10 drop-shadow-[0_8px_30px_rgba(229,9,20,0.4)] animate-bounce" 
              style={{ animationDuration: '4s' }}
            />
          </div>
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

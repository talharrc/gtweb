import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Minus, Plus, ShieldCheck, Smartphone, RotateCcw, MessageCircle, ChevronDown, Loader2, Star } from 'lucide-react';
import { useStoreProducts } from '../../hooks/useStoreProducts';
import { useStoreCart } from '../../context/StoreCartContext';
import ProductCard from '../../components/store/ProductCard';

const FAQS = [
  { q: 'How fast is delivery after payment?', a: 'Most orders are verified and delivered within 15–60 minutes during business hours. You can track the status anytime from your Customer Hub panel.' },
  { q: 'What payment methods do you accept?', a: 'bKash, Nagad, and Rocket. Send the amount to the number shown at checkout, then submit your transaction details (Sender Number and TrxID).' },
  { q: 'What if I have an issue with my order?', a: 'Contact us via WhatsApp or the Contact page and we’ll sort it out immediately — we provide active warranties for the entire duration of your plan.' },
];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, loadingProducts } = useStoreProducts();
  const { addToCart, openCart } = useStoreCart();

  const product = products.find(p => p.slug === slug);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openDescTab, setOpenDescTab] = useState(true);

  // Set default plan once products load
  useEffect(() => {
    if (product && !selectedPlanId) {
      setSelectedPlanId(product.plans[0]?.id ?? null);
    }
  }, [product, selectedPlanId]);

  if (loadingProducts) {
    return (
      <div className="flex justify-center py-24 bg-black min-h-screen items-center">
        <Loader2 className="w-8 h-8 text-[#e50914] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center bg-black min-h-screen flex flex-col justify-center items-center">
        <p className="text-white font-bold text-lg mb-2">Product not found</p>
        <p className="text-white/40 text-sm mb-6">This item may have been removed or renamed.</p>
        <button 
          onClick={() => navigate('/browse')} 
          className="px-6 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider transition-all"
        >
          Back to Store
        </button>
      </div>
    );
  }

  const selectedPlan = product.plans.find(pl => pl.id === selectedPlanId) ?? product.plans[0];
  const discount = selectedPlan?.originalPriceBDT
    ? Math.round(((selectedPlan.originalPriceBDT - selectedPlan.priceBDT) / selectedPlan.originalPriceBDT) * 100)
    : 0;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedPlan) return;
    for (let i = 0; i < quantity; i++) addToCart(product, selectedPlan);
    openCart();
  };

  const handleBuyNow = () => {
    if (!selectedPlan) return;
    for (let i = 0; i < quantity; i++) addToCart(product, selectedPlan);
    openCart();
    // Directly launch checkout by letting CartDrawer handle it
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Helmet>
        <title>{product.name} — Galaxa Store</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-8 flex-wrap">
        <Link to="/browse" className="hover:text-white transition-colors">Store</Link>
        <ChevronRight className="w-3.5 h-3.5 text-white/20" />
        <Link to={`/browse?category=${encodeURIComponent(product.category)}`} className="hover:text-white transition-colors">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-white/20" />
        <span className="text-white/80 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-start">
        {/* Image Display */}
        <div className="aspect-square bg-[#0a0710] border border-white/5 rounded-3xl overflow-hidden flex items-center justify-center p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_15px_30px_rgba(0,0,0,0.5)]">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-4/5 h-4/5 object-contain filter drop-shadow-[0_8px_20px_rgba(229,9,20,0.25)]" />
          ) : (
            <ShoppingBag className="w-20 h-20 text-white/10" />
          )}
        </div>

        {/* Details & Options */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#e50914]">{product.category}</span>
              {product.rating && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(2)} ({product.reviewCount ?? 50} reviews)</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">{product.name}</h1>
            <p className="text-white/50 text-sm mt-2 leading-relaxed">{product.shortDescription}</p>
          </div>

          <div className="flex items-baseline gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl">
            {discount > 0 && <span className="text-[#e50914] text-xl font-black shadow-[0_0_8px_rgba(229,9,20,0.2)]">-{discount}% OFF</span>}
            <span className="text-3xl font-black text-white">৳{selectedPlan?.priceBDT.toLocaleString()}</span>
            {selectedPlan?.originalPriceBDT && (
              <span className="text-sm text-white/35 line-through">৳{selectedPlan.originalPriceBDT.toLocaleString()}</span>
            )}
          </div>

          {/* Plan Selector Grid */}
          <div>
            <label className="text-[10px] font-black text-white uppercase tracking-widest block mb-3">Select Variant Plan</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {product.plans.map(pl => (
                <button
                  key={pl.id}
                  onClick={() => setSelectedPlanId(pl.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[100px] ${
                    selectedPlan.id === pl.id 
                      ? 'border-[#e50914] bg-[#e50914]/10 shadow-[0_0_12px_rgba(229,9,20,0.2)]' 
                      : 'border-white/5 bg-[#121212]/50 hover:border-white/20'
                  }`}
                >
                  <div>
                    <p className="text-white font-bold text-xs leading-snug">{pl.label}</p>
                    <p className="text-white/40 text-[9px] mt-1.5 uppercase font-bold tracking-wide">{pl.durationLabel}</p>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <p className="text-white font-black text-sm">৳{pl.priceBDT.toLocaleString()}</p>
                    {pl.originalPriceBDT && (
                      <p className="text-[9px] text-white/30 line-through">৳{pl.originalPriceBDT.toLocaleString()}</p>
                    )}
                  </div>
                  {selectedPlan.id === pl.id && (
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-[#e50914] shadow-[0_0_8px_rgba(229,9,20,0.5)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between border border-white/10 bg-[#121212] rounded-xl px-4 py-2.5 flex-shrink-0">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                className="text-white/40 hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-white w-10 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)} 
                className="text-white/40 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart} 
              className="flex-1 py-3 px-6 rounded-xl border border-white/10 hover:border-white/30 bg-[#121212] hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow} 
              className="flex-1 py-3 px-6 rounded-xl bg-[#e50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)]"
            >
              Buy It Now
            </button>
          </div>

          {/* Trust Badges Grid */}
          <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-6">
            {[
              { icon: ShieldCheck, title: 'Secure Checkouts', sub: 'bKash · Nagad' },
              { icon: Smartphone, title: 'Instant Delivery', sub: 'WhatsApp & Hub' },
              { icon: RotateCcw, title: 'Active Warranty', sub: '24/7 Cover' },
            ].map(b => (
              <div key={b.title} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl border border-white/5 bg-[#121212]/30">
                <b.icon className="w-5 h-5 text-[#e50914] drop-shadow-[0_0_8px_rgba(229,9,20,0.3)]" />
                <span className="text-[10px] text-white font-bold leading-tight uppercase tracking-wider">{b.title}</span>
                <span className="text-[9px] text-white/40 leading-tight">{b.sub}</span>
              </div>
            ))}
          </div>

          {/* Description & Warranty accordion */}
          <div className="border-t border-white/5 pt-6">
            <button
              onClick={() => setOpenDescTab(!openDescTab)}
              className="w-full flex items-center justify-between text-left text-xs font-bold text-white uppercase tracking-wider py-2 hover:text-[#e50914] transition-colors"
            >
              <span>Product Description &amp; Terms</span>
              <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${openDescTab ? 'rotate-180 text-[#e50914]' : ''}`} />
            </button>
            {openDescTab && (
              <div className="text-xs text-white/50 leading-relaxed mt-3 space-y-2 bg-[#121212]/20 border border-white/5 p-4 rounded-2xl">
                <p>{product.longDescription || product.shortDescription}</p>
                <div className="border-t border-white/5 pt-2.5 mt-2.5">
                  <p className="font-bold text-white/80 uppercase text-[9px] tracking-wide mb-1">How it works:</p>
                  <ul className="list-disc pl-4 space-y-1 text-white/40">
                    <li>Deliveries are fully automated via Customer Hub.</li>
                    <li>Credentials will appear in your Customer Orders dashboard once verified.</li>
                    <li>All plans come with active warranty replacement support.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* FAQs Accordion */}
          <div className="border-t border-white/5 pt-4">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-3">Frequently Asked Questions</h3>
            <div className="flex flex-col gap-2.5">
              {FAQS.map((faq, i) => (
                <div key={faq.q} className="border border-white/5 bg-[#121212]/30 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-xs font-bold text-white hover:text-[#e50914] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180 text-[#e50914]' : ''}`} />
                  </button>
                  {openFaq === i && <p className="px-4 pb-3.5 text-xs text-white/40 leading-relaxed">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>

          <a
            href="https://wa.me/8801959209103"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs text-white/40 hover:text-[#e50914] transition-colors pt-4 font-semibold"
          >
            <MessageCircle className="w-4 h-4" /> Questions? Chat with us on WhatsApp
          </a>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20 border-t border-white/5 pt-12">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

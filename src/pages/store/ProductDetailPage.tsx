import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Minus, Plus, ShieldCheck, Smartphone, RotateCcw, MessageCircle, ChevronDown, Loader2, Star } from 'lucide-react';
import { useStoreProducts } from '../../hooks/useStoreProducts';
import { useStoreCart } from '../../context/StoreCartContext';
import ProductCard from '../../components/store/ProductCard';

const PAYMENT_METHODS = [
  { key: 'bkash', label: 'bKash', color: '#EC1E8E' },
  { key: 'nagad', label: 'Nagad', color: '#FF7A45' },
  { key: 'rocket', label: 'Rocket', color: '#5B23A8' },
] as const;

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, loadingProducts } = useStoreProducts();
  const { addToCart, openCart } = useStoreCart();

  const product = products.find(p => p.slug === slug);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>('plan-details');

  useEffect(() => {
    if (product && !selectedLabel) {
      setSelectedLabel(product.plans[0]?.label ?? null);
      setSelectedDuration(product.plans[0]?.durationLabel ?? null);
    }
  }, [product, selectedLabel]);

  if (loadingProducts) {
    return <div className="flex justify-center py-24 min-h-screen items-center"><Loader2 className="w-8 h-8 text-[#CD381D] animate-spin" /></div>;
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center min-h-screen flex flex-col justify-center items-center">
        <p className="text-[#F4F1F8] font-bold text-lg mb-2">Product not found</p>
        <p className="text-[#A89EB8] text-sm mb-6">This item may have been removed or renamed.</p>
        <button onClick={() => navigate('/browse')} className="px-6 py-2.5 rounded-lg btn-primary-red text-white text-sm font-semibold">
          Back to Store
        </button>
      </div>
    );
  }

  const uniqueLabels: string[] = Array.from(new Set<string>(product.plans.map(p => p.label)));
  const uniqueDurations: string[] = Array.from(new Set<string>(product.plans.map(p => p.durationLabel)));

  const selectedPlan =
    product.plans.find(p => p.label === selectedLabel && p.durationLabel === selectedDuration) ??
    product.plans.find(p => p.label === selectedLabel) ??
    product.plans[0];

  const selectLabel = (label: string) => {
    setSelectedLabel(label);
    const match = product.plans.find(p => p.label === label && p.durationLabel === selectedDuration) ?? product.plans.find(p => p.label === label);
    if (match) setSelectedDuration(match.durationLabel);
  };

  const selectDuration = (duration: string) => {
    setSelectedDuration(duration);
    const match = product.plans.find(p => p.durationLabel === duration && p.label === selectedLabel) ?? product.plans.find(p => p.durationLabel === duration);
    if (match) setSelectedLabel(match.label);
  };

  const discount = selectedPlan?.originalPriceBDT
    ? Math.round(((selectedPlan.originalPriceBDT - selectedPlan.priceBDT) / selectedPlan.originalPriceBDT) * 100)
    : 0;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const addSelectedToCart = () => {
    if (!selectedPlan) return;
    for (let i = 0; i < quantity; i++) addToCart(product, selectedPlan);
  };

  const handleAddToCart = () => { addSelectedToCart(); openCart(); };
  const handleBuyNow = () => { addSelectedToCart(); openCart(); };

  const toggleSection = (key: string) => setOpenSection(openSection === key ? null : key);

  const SECTIONS = [
    { key: 'why-us', title: 'Why Choose Galaxa Store', body: 'Backed by the GalaxaTech brand, with fast WhatsApp/Customer Hub delivery and dedicated support for every order — not an anonymous reseller.' },
    { key: 'how-it-works', title: 'How It Works', body: 'Deliveries are handled through your Customer Hub dashboard: once your payment is verified, credentials appear under My Orders and are also sent via WhatsApp/Email. All plans include active warranty replacement support for their full duration.' },
    { key: 'plan-details', title: 'Plan Details', body: product.longDescription || product.shortDescription },
    { key: 'payment-refund', title: 'Payment & Refund Policy', body: 'Pay via bKash, Nagad, or Rocket by sending the order amount and submitting your Transaction ID at checkout. If an order can’t be fulfilled, it’s refunded.' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Helmet>
        <title>{product.name} — Galaxa Store</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-mono text-gs-text-muted mb-8 flex-wrap">
        <Link to="/browse" className="hover:text-gs-text transition-colors">Store</Link>
        <ChevronRight className="w-3 h-3 text-gs-text-muted" />
        <Link to={`/browse?category=${encodeURIComponent(product.category)}`} className="hover:text-gs-text transition-colors">{product.category}</Link>
        <ChevronRight className="w-3 h-3 text-gs-text-muted" />
        <span className="text-gs-text-secondary truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-start">
        <div className="aspect-square bg-gradient-to-b from-gs-card to-gs-card-alt border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-8 shadow-xl shadow-black/40 relative group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(170,30,18,0.06)_0%,transparent_70%)] pointer-events-none" />
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-4/5 h-4/5 object-contain rounded-xl group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <ShoppingBag className="w-20 h-20 text-gs-card-alt" />
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gs-red-bright font-mono">{product.category}</span>
              {product.rating && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gs-text leading-tight tracking-tight font-display">{product.name}</h1>
            <p className="text-gs-text-secondary text-sm mt-3 leading-relaxed">{product.shortDescription}</p>
          </div>

          <div className="flex items-baseline gap-3 font-rajdhani border-y border-white/5 py-4">
            {discount > 0 && <span className="text-gs-red-orange text-lg font-extrabold">-{discount}%</span>}
            <span className="text-3xl font-black text-gs-text">৳{selectedPlan?.priceBDT.toLocaleString()}</span>
            {selectedPlan?.originalPriceBDT && (
              <span className="text-sm text-gs-text-muted line-through font-semibold">৳{selectedPlan.originalPriceBDT.toLocaleString()}</span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gs-text-muted uppercase tracking-widest block mb-2 font-mono">Select Option</label>
              <div className="flex flex-wrap gap-2">
                {uniqueLabels.map(label => (
                  <button
                    key={label}
                    onClick={() => selectLabel(label)}
                    className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all duration-300 ${
                      selectedLabel === label
                        ? 'border-gs-red-bright bg-gs-red-core/10 text-gs-red-bright shadow-sm shadow-gs-red-core/15'
                        : 'border-white/10 bg-gs-card/30 text-gs-text-secondary hover:border-white/20 hover:text-gs-text'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gs-text-muted uppercase tracking-widest block mb-2 font-mono">Select Duration</label>
              <div className="flex flex-wrap gap-2">
                {uniqueDurations.map(duration => (
                  <button
                    key={duration}
                    onClick={() => selectDuration(duration)}
                    className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all duration-300 ${
                      selectedDuration === duration
                        ? 'border-gs-red-bright bg-gs-red-core/10 text-gs-red-bright shadow-sm shadow-gs-red-core/15'
                        : 'border-white/10 bg-gs-card/30 text-gs-text-secondary hover:border-white/20 hover:text-gs-text'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between border border-white/10 bg-gs-card/40 rounded-lg px-4 py-2.5 flex-shrink-0 shadow-inner">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-gs-text-muted hover:text-gs-text transition-colors p-1"><Minus className="w-4 h-4" /></button>
              <span className="text-sm font-bold text-gs-text w-10 text-center font-mono">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-gs-text-muted hover:text-gs-text transition-colors p-1"><Plus className="w-4 h-4" /></button>
            </div>

            <button onClick={handleAddToCart} className="flex-1 py-3.5 px-6 rounded-lg border border-white/10 hover:border-white/20 bg-gs-card/50 text-gs-text text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-gs-card-alt shadow-sm">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 py-3.5 px-6 rounded-lg btn-primary-red text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-gs-red-core/30">
              Buy It Now
            </button>
          </div>

          <div className="flex items-center gap-3.5 border-t border-white/5 pt-5">
            <span className="text-[9px] font-bold text-gs-text-muted uppercase tracking-widest font-mono">Pay with</span>
            <div className="flex gap-2">
              {PAYMENT_METHODS.map(m => (
                <span
                  key={m.key}
                  className="px-2.5 py-1 rounded-md text-[9px] font-bold text-white tracking-wider font-rajdhani uppercase shadow-sm"
                  style={{ backgroundColor: m.color }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-6">
            {[
              { icon: ShieldCheck, title: 'Secure Checkout', sub: 'bKash · Nagad · Rocket' },
              { icon: Smartphone, title: 'Instant Delivery', sub: 'WhatsApp & Hub' },
              { icon: RotateCcw, title: 'Active Warranty', sub: 'Full plan duration' },
            ].map(b => (
              <div key={b.title} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl border border-white/5 bg-gradient-to-b from-gs-card/50 to-gs-card-alt/50 shadow-sm">
                <b.icon className="w-5 h-5 text-gs-red-bright filter drop-shadow-[0_0_4px_rgba(205,56,29,0.25)]" />
                <span className="text-[10px] text-gs-text font-bold leading-tight">{b.title}</span>
                <span className="text-[9px] text-gs-text-muted leading-tight mt-0.5">{b.sub}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-5">
            <div className="flex flex-col gap-2.5">
              {SECTIONS.map(section => (
                <div key={section.key} className="border border-white/5 rounded-xl overflow-hidden bg-gs-card/20 hover:border-gs-red-bright/20 transition-all duration-300">
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider font-rajdhani text-gs-text hover:text-gs-red-bright transition-colors"
                  >
                    {section.title}
                    <ChevronDown className={`w-4 h-4 text-gs-text-muted flex-shrink-0 transition-transform ${openSection === section.key ? 'rotate-180 text-gs-red-bright' : ''}`} />
                  </button>
                  {openSection === section.key && (
                    <div className="px-4 pb-4.5 text-xs text-gs-text-secondary leading-relaxed border-l border-gs-red-core/30 ml-4 mb-1">
                      {section.body}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <a
            href="https://wa.me/8801959209103"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs font-semibold text-gs-text-secondary hover:text-gs-red-bright transition-colors pt-2"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> Questions? Chat with us on WhatsApp
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20 border-t border-white/5 pt-10">
          <h2 className="text-lg font-black text-gs-text mb-6 font-display">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

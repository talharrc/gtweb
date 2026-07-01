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

      <nav className="flex items-center gap-1.5 text-[11px] font-medium text-[#6E6480] mb-8 flex-wrap">
        <Link to="/browse" className="hover:text-[#F4F1F8] transition-colors">Store</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#6E6480]" />
        <Link to={`/browse?category=${encodeURIComponent(product.category)}`} className="hover:text-[#F4F1F8] transition-colors">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#6E6480]" />
        <span className="text-[#A89EB8] truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-start">
        <div className="aspect-square bg-[#16101E] border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-6">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-4/5 h-4/5 object-contain rounded-xl" />
          ) : (
            <ShoppingBag className="w-20 h-20 text-[#1E1428]" />
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#CD381D] font-mono">{product.category}</span>
              {product.rating && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(2)} ({product.reviewCount ?? 50} reviews)</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F1F8] leading-tight tracking-tight font-display">{product.name}</h1>
            <p className="text-[#A89EB8] text-sm mt-2 leading-relaxed">{product.shortDescription}</p>
          </div>

          <div className="flex items-baseline gap-3 font-rajdhani">
            {discount > 0 && <span className="text-[#E04420] text-lg font-bold">-{discount}%</span>}
            <span className="text-3xl font-black text-[#F4F1F8]">৳{selectedPlan?.priceBDT.toLocaleString()}</span>
            {selectedPlan?.originalPriceBDT && (
              <span className="text-sm text-[#6E6480] line-through">৳{selectedPlan.originalPriceBDT.toLocaleString()}</span>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-[#A89EB8] uppercase tracking-wide block mb-2 font-mono">Options</label>
            <div className="flex flex-wrap gap-2">
              {uniqueLabels.map(label => (
                <button
                  key={label}
                  onClick={() => selectLabel(label)}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    selectedLabel === label ? 'border-[#CD381D] bg-[#AA1E12]/10 text-[#CD381D]' : 'border-white/10 text-[#A89EB8] hover:border-white/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#A89EB8] uppercase tracking-wide block mb-2 font-mono">Duration</label>
            <div className="flex flex-wrap gap-2">
              {uniqueDurations.map(duration => (
                <button
                  key={duration}
                  onClick={() => selectDuration(duration)}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    selectedDuration === duration ? 'border-[#CD381D] bg-[#AA1E12]/10 text-[#CD381D]' : 'border-white/10 text-[#A89EB8] hover:border-white/20'
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between border border-white/10 rounded-lg px-4 py-2.5 flex-shrink-0">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-[#6E6480] hover:text-[#F4F1F8] transition-colors"><Minus className="w-4 h-4" /></button>
              <span className="text-sm font-bold text-[#F4F1F8] w-10 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-[#6E6480] hover:text-[#F4F1F8] transition-colors"><Plus className="w-4 h-4" /></button>
            </div>

            <button onClick={handleAddToCart} className="flex-1 py-3 px-6 rounded-lg border border-white/15 hover:border-white/25 bg-[#16101E] text-[#F4F1F8] text-xs font-bold uppercase tracking-wider transition-all">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 py-3 px-6 rounded-lg btn-primary-red text-white text-xs font-bold uppercase tracking-wider">
              Buy It Now
            </button>
          </div>

          <div className="flex items-center gap-3 border-t border-white/10 pt-5">
            <span className="text-[10px] font-bold text-[#6E6480] uppercase tracking-wide font-mono">Pay with</span>
            {PAYMENT_METHODS.map(m => (
              <span
                key={m.key}
                className="px-2.5 py-1 rounded-md text-[10px] font-bold text-white"
                style={{ backgroundColor: m.color }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {[
              { icon: ShieldCheck, title: 'Secure Checkout', sub: 'bKash · Nagad · Rocket' },
              { icon: Smartphone, title: 'Instant Delivery', sub: 'WhatsApp & Hub' },
              { icon: RotateCcw, title: 'Active Warranty', sub: 'Full plan duration' },
            ].map(b => (
              <div key={b.title} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl border border-white/10 bg-[#16101E]">
                <b.icon className="w-5 h-5 text-[#CD381D]" />
                <span className="text-[10px] text-[#F4F1F8] font-semibold leading-tight">{b.title}</span>
                <span className="text-[9px] text-[#6E6480] leading-tight">{b.sub}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex flex-col gap-2">
              {SECTIONS.map(section => (
                <div key={section.key} className="border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[#F4F1F8] hover:bg-[#16101E]"
                  >
                    {section.title}
                    <ChevronDown className={`w-4 h-4 text-[#6E6480] flex-shrink-0 transition-transform ${openSection === section.key ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === section.key && <p className="px-4 pb-3 text-xs text-[#A89EB8] leading-relaxed">{section.body}</p>}
                </div>
              ))}
            </div>
          </div>

          <a
            href="https://wa.me/8801959209103"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs text-[#A89EB8] hover:text-[#CD381D] transition-colors pt-2"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Questions? Chat with us on WhatsApp
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-8">
          <h2 className="text-lg font-bold text-[#F4F1F8] mb-4 font-display">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

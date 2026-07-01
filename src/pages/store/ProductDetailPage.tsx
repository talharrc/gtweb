import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Minus, Plus, ShieldCheck, Smartphone, RotateCcw, MessageCircle, ChevronDown, Loader2 } from 'lucide-react';
import { useStoreProducts } from '../../hooks/useStoreProducts';
import { useStoreCart } from '../../context/StoreCartContext';
import ProductCard from '../../components/store/ProductCard';

const FAQS = [
  { q: 'How fast is delivery after payment?', a: 'Most orders are verified and delivered within 15–60 minutes during business hours. You can track the status anytime from My Orders.' },
  { q: 'What payment methods do you accept?', a: 'bKash, Nagad, and Rocket. Send the amount to the number shown at checkout, then submit your Transaction ID.' },
  { q: 'What if I have an issue with my order?', a: 'Contact us via WhatsApp or the Contact page and we’ll sort it out — refunds are issued for orders we can’t fulfil.' },
];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, loadingProducts } = useStoreProducts();
  const { addToCart, openCart } = useStoreCart();

  const product = products.find(p => p.slug === slug);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(product?.plans[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (loadingProducts) {
    return <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>;
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-slate-900 font-bold text-lg mb-2">Product not found</p>
        <p className="text-slate-500 text-sm mb-6">This item may have been removed or renamed.</p>
        <button onClick={() => navigate('/browse')} className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">
          Back to Store
        </button>
      </div>
    );
  }

  const selectedPlan = product.plans.find(pl => pl.id === selectedPlanId) ?? product.plans[0];
  const discount = selectedPlan.originalPriceBDT
    ? Math.round(((selectedPlan.originalPriceBDT - selectedPlan.priceBDT) / selectedPlan.originalPriceBDT) * 100)
    : 0;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product, selectedPlan);
    openCart();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Helmet>
        <title>{product.name} — Galaxa Store</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-slate-400 mb-6 flex-wrap">
        <Link to="/browse" className="hover:text-blue-600 transition-colors">Store</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/browse?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10">
        {/* Image */}
        <div className="aspect-square bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <ShoppingBag className="w-16 h-16 text-slate-200" />
          )}
        </div>

        {/* Details + Buy box */}
        <div className="space-y-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">{product.category}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 leading-tight">{product.name}</h1>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">{product.shortDescription}</p>
          </div>

          <div className="flex items-baseline gap-3">
            {discount > 0 && <span className="text-red-600 text-lg font-bold">-{discount}%</span>}
            <span className="text-3xl font-extrabold text-slate-900">৳{selectedPlan.priceBDT.toLocaleString()}</span>
            {selectedPlan.originalPriceBDT && (
              <span className="text-sm text-slate-400 line-through">৳{selectedPlan.originalPriceBDT.toLocaleString()}</span>
            )}
          </div>

          {/* Plan selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-2">Choose a Plan</label>
            <div className="flex flex-col gap-2">
              {product.plans.map(pl => (
                <button
                  key={pl.id}
                  onClick={() => setSelectedPlanId(pl.id)}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-lg border text-left transition-all ${
                    selectedPlan.id === pl.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div>
                    <p className="text-slate-900 font-semibold text-sm">{pl.label}</p>
                    <p className="text-slate-500 text-xs">{pl.durationLabel}{pl.notes ? ` · ${pl.notes}` : ''}</p>
                  </div>
                  <p className="text-slate-900 font-bold text-sm">৳{pl.priceBDT.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + buttons */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-slate-400 hover:text-slate-800"><Minus className="w-4 h-4" /></button>
              <span className="text-sm font-semibold text-slate-900 w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-slate-400 hover:text-slate-800"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={handleAddToCart} className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
              Add to Cart
            </button>
            <button onClick={handleAddToCart} className="flex-1 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors">
              Buy Now
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-5">
            {[
              { icon: ShieldCheck, title: 'Secure', sub: 'Checkout' },
              { icon: Smartphone, title: 'bKash · Nagad', sub: 'Rocket' },
              { icon: RotateCcw, title: 'Refund if', sub: 'undelivered' },
            ].map(b => (
              <div key={b.title} className="flex flex-col items-center text-center gap-1 p-2 rounded-lg border border-slate-200">
                <b.icon className="w-5 h-5 text-blue-600" />
                <span className="text-[11px] text-slate-700 font-medium leading-tight">{b.title}</span>
                <span className="text-[11px] text-slate-400 leading-tight">{b.sub}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{product.longDescription || product.shortDescription}</p>
          </div>

          {/* FAQ */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Frequently Asked Questions</h3>
            <div className="flex flex-col gap-2">
              {FAQS.map((faq, i) => (
                <div key={faq.q} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    {faq.q}
                    <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && <p className="px-4 pb-3 text-xs text-slate-500 leading-relaxed">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>

          <a
            href="https://wa.me/8801959209103"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-blue-600 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Questions? Chat with us on WhatsApp
          </a>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

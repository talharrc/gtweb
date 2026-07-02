import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Flame, Star } from 'lucide-react';
import { Product } from '../../types';

// Maps product slugs to locally-hosted banner images.
// This guarantees rich images even if Firestore still has old SVG paths.
const BANNER_MAP: Record<string, string> = {
  'netflix-premium':           '/store/netflix-banner.png',
  'netflix-prime-combo':       '/store/netflix-prime-combo-banner.png',
  'prime-video':               '/store/prime-banner.png',
  'spotify-premium':           '/store/spotify-banner.png',
  'chatgpt-plus':              '/store/chatgpt-banner.png',
  'canva-pro':                 '/store/canva-banner.png',
  'disney-hotstar':            '/store/disney-banner.png',
  'apple-itunes-gift-card':    '/store/apple-banner.png',
  'pubg-mobile-uc-topup':      '/store/pubg-banner.png',
};

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const cheapest = product.plans.reduce((min, p) => (p.priceBDT < min.priceBDT ? p : min), product.plans[0]);
  const discount = cheapest?.originalPriceBDT
    ? Math.round(((cheapest.originalPriceBDT - cheapest.priceBDT) / cheapest.originalPriceBDT) * 100)
    : 0;

  // Prefer the banner map, fall back to Firestore imageUrl, then empty
  const resolvedImage = BANNER_MAP[product.slug] ?? product.imageUrl ?? '';

  return (
    <button
      onClick={() => navigate(`/browse/product/${product.slug}`)}
      className="text-left store-card overflow-hidden hover:-translate-y-1 transition-all duration-300 group flex flex-col relative"
    >
      <div className="relative aspect-square p-3">
        <div className="w-full h-full rounded-xl overflow-hidden bg-gs-card-alt/30 border border-white/5 relative">
          {resolvedImage ? (
            <img src={resolvedImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg" />
          ) : (
            <div className="w-full h-full bg-gs-card-alt flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-gs-text-muted" />
            </div>
          )}
        </div>
        {discount > 0 && (
          <span className="absolute top-5 left-5 bg-gradient-to-r from-gs-red-core to-gs-red-orange text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono shadow-sm shadow-gs-red-core/30">
            -{discount}%
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-5 right-5 bg-black/75 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 font-mono border border-white/5 shadow-sm shadow-black/25">
            <Flame className="w-2.5 h-2.5 text-gs-red-orange animate-pulse" /> Hot
          </span>
        )}
      </div>

      <div className="px-4 pb-4 pt-1.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gs-text leading-snug line-clamp-1 group-hover:text-gs-red-bright transition-colors duration-200">{product.name}</h3>
          {product.rating && (
            <div className="flex items-center gap-1 text-[10px] text-gs-text-secondary mt-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 filter drop-shadow-[0_0_2px_rgba(251,191,36,0.2)]" />
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-1.5 font-rajdhani">
            <span className="text-base font-bold text-gs-red-bright">৳{cheapest.priceBDT.toLocaleString()}</span>
            {cheapest.originalPriceBDT && (
              <span className="text-xs text-gs-text-muted line-through font-medium">৳{cheapest.originalPriceBDT.toLocaleString()}</span>
            )}
            {product.plans.length > 1 && <span className="text-[9px] text-gs-text-muted uppercase tracking-wider font-mono ml-0.5">from</span>}
          </div>
          <span className="text-[10px] font-bold font-rajdhani uppercase tracking-widest text-gs-red-bright opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-0.5">
            View →
          </span>
        </div>
      </div>
    </button>
  );
}

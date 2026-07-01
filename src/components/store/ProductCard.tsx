import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Flame, Star } from 'lucide-react';
import { Product } from '../../types';

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const cheapest = product.plans.reduce((min, p) => (p.priceBDT < min.priceBDT ? p : min), product.plans[0]);
  const discount = cheapest?.originalPriceBDT
    ? Math.round(((cheapest.originalPriceBDT - cheapest.priceBDT) / cheapest.originalPriceBDT) * 100)
    : 0;

  return (
    <button
      onClick={() => navigate(`/browse/product/${product.slug}`)}
      className="text-left store-card overflow-hidden hover:-translate-y-0.5 transition-all group flex flex-col"
    >
      <div className="relative aspect-square p-2.5">
        <div className="w-full h-full rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full bg-[#1E1428] flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-[#6E6480]" />
            </div>
          )}
        </div>
        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-[#AA1E12] to-[#CD381D] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
            -{discount}%
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-4 right-4 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1 font-mono">
            <Flame className="w-3 h-3 text-[#E04420]" /> Hot
          </span>
        )}
      </div>

      <div className="px-3 pb-3 pt-1">
        <h3 className="text-sm font-semibold text-[#F4F1F8] leading-snug line-clamp-1">{product.name}</h3>
        {product.rating && (
          <div className="flex items-center gap-1 text-[11px] text-[#A89EB8] mt-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-baseline gap-1.5 mt-1.5 font-rajdhani">
          <span className="text-base font-bold text-[#CD381D]">৳{cheapest.priceBDT.toLocaleString()}</span>
          {cheapest.originalPriceBDT && (
            <span className="text-xs text-[#6E6480] line-through">৳{cheapest.originalPriceBDT.toLocaleString()}</span>
          )}
          {product.plans.length > 1 && <span className="text-[11px] text-[#6E6480]">from</span>}
        </div>
      </div>
    </button>
  );
}

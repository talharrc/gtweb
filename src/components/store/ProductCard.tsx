import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Tag, Star } from 'lucide-react';
import { Product } from '../../types';

export default function ProductCard({ product }: { key?: React.Key; product: Product }): React.JSX.Element {
  const navigate = useNavigate();
  const cheapest = product.plans.reduce((min, p) => (p.priceBDT < min.priceBDT ? p : min), product.plans[0]);
  const discount = cheapest?.originalPriceBDT
    ? Math.round(((cheapest.originalPriceBDT - cheapest.priceBDT) / cheapest.originalPriceBDT) * 100)
    : 0;

  return (
    <button
      onClick={() => navigate(`/browse/product/${product.slug}`)}
      className="text-left bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:border-[#e50914]/40 hover:shadow-[0_0_20px_rgba(229,9,20,0.15)] transition-all group flex flex-col spotlight-sweep"
    >
      <div className="relative aspect-square bg-[#0a0710] flex items-center justify-center overflow-hidden border-b border-white/5">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <ShoppingBag className="w-10 h-10 text-white/20" />
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#e50914] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_8px_rgba(229,9,20,0.5)]">
            -{discount}% OFF
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#e50914] flex items-center gap-1">
            <Tag className="w-3 h-3" /> {product.category}
          </span>
          {product.rating && (
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-bold text-white leading-snug mb-1 line-clamp-1 group-hover:text-[#e50914] transition-colors">{product.name}</h3>
        <p className="text-xs text-white/50 leading-relaxed mb-3.5 line-clamp-2 flex-1">{product.shortDescription}</p>

        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-lg font-black text-white">৳{cheapest.priceBDT.toLocaleString()}</span>
          {cheapest.originalPriceBDT && (
            <span className="text-xs text-white/35 line-through">৳{cheapest.originalPriceBDT.toLocaleString()}</span>
          )}
          {product.plans.length > 1 && <span className="text-[10px] text-white/30 lowercase ml-0.5">from</span>}
        </div>

        <span className="w-full text-center py-2.5 rounded-xl bg-white/5 group-hover:bg-[#e50914] text-white text-xs font-bold transition-all border border-white/5 group-hover:border-[#e50914] shadow-[0_0_12px_rgba(229,9,20,0)] group-hover:shadow-[0_0_12px_rgba(229,9,20,0.3)]">
          {product.plans.length > 1 ? 'CHOOSE PLAN' : 'BUY NOW'}
        </span>
      </div>
    </button>
  );
}

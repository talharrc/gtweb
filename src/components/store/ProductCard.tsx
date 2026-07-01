import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Tag } from 'lucide-react';
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
      className="text-left bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col"
    >
      <div className="relative aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 mb-1 flex items-center gap-1">
          <Tag className="w-3 h-3" /> {product.category}
        </span>
        <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2 flex-1">{product.shortDescription}</p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-slate-900">৳{cheapest.priceBDT.toLocaleString()}</span>
          {cheapest.originalPriceBDT && (
            <span className="text-xs text-slate-400 line-through">৳{cheapest.originalPriceBDT.toLocaleString()}</span>
          )}
          {product.plans.length > 1 && <span className="text-[11px] text-slate-400">from</span>}
        </div>

        <span className="w-full text-center py-2 rounded-md bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
          {product.plans.length > 1 ? 'Choose Options' : 'Add to Cart'}
        </span>
      </div>
    </button>
  );
}

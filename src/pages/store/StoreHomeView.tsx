import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Loader2, ShoppingBag } from 'lucide-react';
import { useStoreProducts } from '../../hooks/useStoreProducts';
import ProductCard from '../../components/store/ProductCard';

export default function StoreHomeView() {
  const { products, loadingProducts } = useStoreProducts();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') ?? 'All';
  const query = (searchParams.get('q') ?? '').toLowerCase();

  const filtered = products.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.shortDescription.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Helmet>
        <title>Galaxa Store — Netflix, Spotify, ChatGPT Plus & More</title>
        <meta name="description" content="Buy Netflix, Spotify, ChatGPT Plus, Canva Pro, gift cards, and game top-ups in Bangladesh via bKash & Nagad." />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {category === 'All' ? 'All Products' : category}
        </h1>
        <p className="text-slate-500 text-sm mt-1">Instant digital delivery, secured checkout via bKash, Nagad, or Rocket.</p>
      </div>

      {loadingProducts ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300 mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-slate-600 font-semibold text-sm mb-1">No products found</p>
          <p className="text-slate-400 text-xs max-w-xs">Try a different category or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

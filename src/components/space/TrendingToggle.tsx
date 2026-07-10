import { useSearchParams } from 'react-router-dom';

export default function TrendingToggle() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') === 'trending' ? 'trending' : 'recent';

  const setSort = (value: 'recent' | 'trending') => {
    const next = new URLSearchParams(searchParams);
    if (value === 'recent') next.delete('sort'); else next.set('sort', value);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10">
      {(['recent', 'trending'] as const).map((value) => (
        <button
          key={value}
          onClick={() => setSort(value)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
            sort === value ? 'btn-primary-space text-white' : 'text-space-text-secondary hover:text-white'
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { SpacePost } from '../../types/space';

export default function TagFilterBar({ posts }: { posts: SpacePost[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag');

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 20);
  }, [posts]);

  const setTag = (tag: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (tag) next.set('tag', tag); else next.delete('tag');
    setSearchParams(next, { replace: true });
  };

  if (tags.length === 0 && !activeTag) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {activeTag && (
        <button
          onClick={() => setTag(null)}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full space-upvote-active"
        >
          #{activeTag} <X className="w-3 h-3" />
        </button>
      )}
      {!activeTag && tags.map((tag) => (
        <button
          key={tag}
          onClick={() => setTag(tag)}
          className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-space-text-secondary hover:text-white hover:border-[#7C3AED]/40 transition-all"
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}

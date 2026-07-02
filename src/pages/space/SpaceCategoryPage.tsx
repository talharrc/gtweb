import { useParams, useSearchParams } from 'react-router-dom';
import { useSpacePosts } from '../../hooks/useSpacePosts';
import { useSpaceSearch } from '../../hooks/useSpaceSearch';
import { SpaceCategory } from '../../types/space';
import { CATEGORY_META } from '../../components/space/CategoryIcon';
import TagFilterBar from '../../components/space/TagFilterBar';
import TrendingToggle from '../../components/space/TrendingToggle';
import PostCard from '../../components/space/PostCard';

export default function SpaceCategoryPage() {
  const { category } = useParams<{ category: SpaceCategory }>();
  const [searchParams] = useSearchParams();
  const sort = searchParams.get('sort') === 'trending' ? 'trending' : 'recent';
  const tag = searchParams.get('tag');
  const searchQuery = searchParams.get('q') ?? '';

  const meta = category ? CATEGORY_META[category] : undefined;
  const { posts, loading } = useSpacePosts({ category, sort });

  const tagged = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;
  const visible = useSpaceSearch(tagged, searchQuery);

  if (!meta) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-white font-bold text-xl flex items-center gap-2">
          <meta.icon className="w-5 h-5 text-[#7C3AED]" /> {meta.label}
        </h1>
        <TrendingToggle />
      </div>

      <TagFilterBar posts={posts} />

      {loading ? (
        <p className="text-space-text-muted text-sm">Loading posts…</p>
      ) : visible.length === 0 ? (
        <p className="text-space-text-muted text-sm">No posts in {meta.label} yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useSearchParams } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useSpacePosts } from '../../hooks/useSpacePosts';
import { useSpaceSearch } from '../../hooks/useSpaceSearch';
import { useSpaceWeeklyBest } from '../../hooks/useSpaceWeeklyBest';
import DailyThemeBanner from '../../components/space/DailyThemeBanner';
import FeaturedCarousel from '../../components/space/FeaturedCarousel';
import TagFilterBar from '../../components/space/TagFilterBar';
import TrendingToggle from '../../components/space/TrendingToggle';
import PostCard from '../../components/space/PostCard';

export default function SpaceFeedPage() {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get('sort') === 'trending' ? 'trending' : 'recent';
  const tag = searchParams.get('tag');
  const searchQuery = searchParams.get('q') ?? '';

  const { posts, loading } = useSpacePosts({ sort });
  const weeklyBest = useSpaceWeeklyBest();

  const featured = posts.filter((p) => p.isFeatured);
  const tagged = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;
  const visible = useSpaceSearch(tagged, searchQuery);

  return (
    <div>
      <DailyThemeBanner />
      <FeaturedCarousel posts={featured} />

      {weeklyBest && (
        <a
          href={`/space/post/${weeklyBest.id}`}
          className="space-card p-4 mb-6 flex items-center gap-3 hover:border-[#22D3EE]/40 transition-all"
        >
          <Trophy className="w-5 h-5 text-[#22D3EE] flex-shrink-0" />
          <div>
            <p className="text-space-text-muted text-[10px] font-mono uppercase tracking-widest">This Week's Best</p>
            <p className="text-white font-semibold text-sm">{weeklyBest.title}</p>
          </div>
        </a>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-white font-bold text-xl">Community Feed</h1>
        <TrendingToggle />
      </div>

      <TagFilterBar posts={posts} />

      {loading ? (
        <p className="text-space-text-muted text-sm">Loading posts…</p>
      ) : visible.length === 0 ? (
        <p className="text-space-text-muted text-sm">No posts yet. Be the first to post!</p>
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

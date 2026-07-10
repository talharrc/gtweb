import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Pin, Star } from 'lucide-react';
import { SpacePost } from '../../types/space';
import CategoryIcon, { CATEGORY_META } from './CategoryIcon';

export default function PostCard({ post }: { post: SpacePost }) {
  const createdLabel = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '';

  return (
    <Link to={`/space/post/${post.id}`} className="space-card p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2 text-xs">
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-space-text-secondary">
          <CategoryIcon category={post.category} className="w-3 h-3" />
          {CATEGORY_META[post.category].label}
        </span>
        {post.isPinned && <Pin className="w-3.5 h-3.5 text-[#22D3EE]" />}
        {post.isFeatured && <Star className="w-3.5 h-3.5 text-[#7C3AED]" />}
        <span className="text-space-text-muted ml-auto">{createdLabel}</span>
      </div>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="w-full h-36 object-cover rounded-lg border border-white/5" />
      )}

      <h3 className="font-semibold text-white text-base leading-snug line-clamp-2">{post.title}</h3>
      <p className="text-space-text-secondary text-sm line-clamp-2 flex-1">{post.body}</p>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-space-text-muted">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-space-text-muted pt-1 border-t border-white/5">
        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.upvoteCount}</span>
        <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.commentCount}</span>
      </div>
    </Link>
  );
}

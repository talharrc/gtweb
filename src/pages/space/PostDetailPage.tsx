import { useParams, Link } from 'react-router-dom';
import { Pin, Star, ExternalLink } from 'lucide-react';
import { useSpacePost } from '../../hooks/useSpacePost';
import { useSpaceUserById } from '../../hooks/useSpaceUserById';
import CategoryIcon, { CATEGORY_META } from '../../components/space/CategoryIcon';
import PostActionBar from '../../components/space/PostActionBar';
import CommentComposer from '../../components/space/CommentComposer';
import CommentThread from '../../components/space/CommentThread';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { post, comments, loading } = useSpacePost(id);
  const author = useSpaceUserById(post?.authorId);

  if (loading) return <p className="text-space-text-muted text-sm">Loading…</p>;
  if (!post) return <p className="text-space-text-muted text-sm">Post not found.</p>;

  const createdLabel = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-card p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-2 text-xs mb-3">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-space-text-secondary">
            <CategoryIcon category={post.category} className="w-3 h-3" />
            {CATEGORY_META[post.category].label}
          </span>
          {post.isPinned && <span className="flex items-center gap-1 text-[#22D3EE]"><Pin className="w-3.5 h-3.5" /> Pinned</span>}
          {post.isFeatured && <span className="flex items-center gap-1 text-[#7C3AED]"><Star className="w-3.5 h-3.5" /> Featured</span>}
        </div>

        <h1 className="text-white font-bold text-2xl leading-tight mb-3">{post.title}</h1>

        <div className="flex items-center gap-2 mb-5 text-xs text-space-text-muted">
          {author ? (
            <Link to={`/space/profile/${author.username}`} className="text-space-text-secondary hover:text-white font-semibold">
              {author.displayName}
            </Link>
          ) : (
            <span>Unknown author</span>
          )}
          <span>·</span>
          <span>{createdLabel}</span>
        </div>

        {post.imageUrl && (
          <img src={post.imageUrl} alt="" className="w-full max-h-96 object-cover rounded-xl border border-white/5 mb-5" />
        )}

        <p className="text-space-text-secondary text-sm whitespace-pre-wrap mb-5">{post.body}</p>

        {post.links.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-5">
            {post.links.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#22D3EE] text-sm hover:underline break-all"
              >
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" /> {link}
              </a>
            ))}
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/space?tag=${encodeURIComponent(tag)}`}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-space-text-muted hover:text-white"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {id && <PostActionBar postId={id} />}
      </div>

      <div className="space-card p-6 sm:p-8">
        <h2 className="text-white font-bold text-lg mb-4">
          {post.commentCount} comment{post.commentCount === 1 ? '' : 's'}
        </h2>
        {id && (
          <>
            <div className="mb-6">
              <CommentComposer postId={id} parentCommentId={null} />
            </div>
            <CommentThread postId={id} comments={comments} />
          </>
        )}
      </div>
    </div>
  );
}

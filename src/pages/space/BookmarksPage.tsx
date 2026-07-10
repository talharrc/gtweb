import { useSpaceAuth } from '../../context/SpaceAuthContext';
import { useSpaceBookmarksList } from '../../hooks/useSpaceBookmarksList';
import PostCard from '../../components/space/PostCard';

export default function BookmarksPage() {
  const { firebaseUser } = useSpaceAuth();
  const { posts, loading } = useSpaceBookmarksList(firebaseUser?.uid);

  return (
    <div>
      <h1 className="text-white font-bold text-xl mb-4">Your bookmarks</h1>
      {loading ? (
        <p className="text-space-text-muted text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-space-text-muted text-sm">You haven't saved any posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}

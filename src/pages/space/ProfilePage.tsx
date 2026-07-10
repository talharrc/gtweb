import { useParams } from 'react-router-dom';
import { useSpaceUserProfile } from '../../hooks/useSpaceUserProfile';
import PostCard from '../../components/space/PostCard';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { profile, posts, loading } = useSpaceUserProfile(username);

  if (loading) return <p className="text-space-text-muted text-sm">Loading…</p>;
  if (!profile) return <p className="text-space-text-muted text-sm">User not found.</p>;

  const joinedLabel = profile.joinedAt?.toDate
    ? profile.joinedAt.toDate().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : '';

  return (
    <div>
      <div className="space-card p-6 sm:p-8 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-space-gradient overflow-hidden flex-shrink-0">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            profile.displayName?.[0]?.toUpperCase() ?? '?'
          )}
        </div>
        <div>
          <h1 className="text-white font-bold text-xl">{profile.displayName}</h1>
          <p className="text-space-text-muted text-sm">@{profile.username}</p>
          {profile.bio && <p className="text-space-text-secondary text-sm mt-2">{profile.bio}</p>}
          <p className="text-space-text-muted text-xs mt-2">
            Joined {joinedLabel} · {profile.reputation} reputation
          </p>
        </div>
      </div>

      <h2 className="text-white font-bold text-lg mb-4">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-space-text-muted text-sm">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}

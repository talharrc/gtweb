import { useState } from 'react';
import { Heart, Bookmark, Flag, Link2 } from 'lucide-react';
import { useSpaceAuth } from '../../context/SpaceAuthContext';
import { useSpaceLikeBookmark } from '../../hooks/useSpaceLikeBookmark';
import ReportModal from './ReportModal';

export default function PostActionBar({ postId }: { postId: string }) {
  const { firebaseUser, isSignedIn } = useSpaceAuth();
  const { isLiked, isBookmarked, toggleLike, toggleBookmark } = useSpaceLikeBookmark(postId, firebaseUser?.uid);
  const [reportOpen, setReportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleLike}
        disabled={!isSignedIn}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all disabled:opacity-40 ${
          isLiked ? 'space-upvote-active' : 'bg-white/5 border border-white/10 text-space-text-secondary hover:text-white'
        }`}
      >
        <Heart className="w-3.5 h-3.5" fill={isLiked ? 'currentColor' : 'none'} /> Like
      </button>
      <button
        onClick={toggleBookmark}
        disabled={!isSignedIn}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all disabled:opacity-40 ${
          isBookmarked ? 'space-upvote-active' : 'bg-white/5 border border-white/10 text-space-text-secondary hover:text-white'
        }`}
      >
        <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} /> Save
      </button>
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-space-text-secondary hover:text-white transition-all"
      >
        <Link2 className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Share'}
      </button>
      {isSignedIn && (
        <button
          onClick={() => setReportOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-space-text-secondary hover:text-red-400 transition-all ml-auto"
        >
          <Flag className="w-3.5 h-3.5" /> Report
        </button>
      )}
      {reportOpen && <ReportModal targetType="post" targetId={postId} onClose={() => setReportOpen(false)} />}
    </div>
  );
}

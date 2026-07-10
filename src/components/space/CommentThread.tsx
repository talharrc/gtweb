import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SpaceComment } from '../../types/space';
import { useSpaceUserById } from '../../hooks/useSpaceUserById';
import CommentComposer from './CommentComposer';

function CommentAuthor({ authorId }: { authorId: string }) {
  const user = useSpaceUserById(authorId);
  if (!user) return <span className="text-white/50 text-xs font-semibold">…</span>;
  return (
    <Link to={`/space/profile/${user.username}`} className="text-white text-xs font-semibold hover:text-[#22D3EE]">
      {user.displayName}
    </Link>
  );
}

function CommentRow({ comment, canReply, postId }: { comment: SpaceComment; canReply: boolean; postId: string }) {
  const [replying, setReplying] = useState(false);
  const createdLabel = comment.createdAt?.toDate
    ? comment.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="py-3">
      <div className="flex items-center gap-2 mb-1">
        <CommentAuthor authorId={comment.authorId} />
        <span className="text-space-text-muted text-[10px]">{createdLabel}</span>
      </div>
      <p className="text-space-text-secondary text-sm whitespace-pre-wrap">{comment.body}</p>
      {canReply && (
        <button onClick={() => setReplying((v) => !v)} className="text-[#22D3EE] text-xs mt-1 hover:underline">
          {replying ? 'Cancel' : 'Reply'}
        </button>
      )}
      {replying && (
        <div className="mt-2">
          <CommentComposer postId={postId} parentCommentId={comment.id} onDone={() => setReplying(false)} placeholder="Write a reply…" />
        </div>
      )}
    </div>
  );
}

export default function CommentThread({ postId, comments }: { postId: string; comments: SpaceComment[] }) {
  const topLevel = comments.filter((c) => !c.parentCommentId);
  const repliesFor = (id: string) => comments.filter((c) => c.parentCommentId === id);

  if (topLevel.length === 0) {
    return <p className="text-space-text-muted text-sm">No comments yet — start the conversation.</p>;
  }

  return (
    <div className="divide-y divide-white/5">
      {topLevel.map((comment) => (
        <div key={comment.id}>
          <CommentRow comment={comment} canReply postId={postId} />
          {repliesFor(comment.id).length > 0 && (
            <div className="ml-6 pl-4 border-l border-white/10">
              {repliesFor(comment.id).map((reply) => (
                <CommentRow key={reply.id} comment={reply} canReply={false} postId={postId} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

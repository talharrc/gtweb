import { useState } from 'react';
import { useSpaceAuth } from '../../context/SpaceAuthContext';
import { createSpaceComment } from '../../services/spaceCommentService';

interface CommentComposerProps {
  postId: string;
  parentCommentId: string | null;
  onDone?: () => void;
  placeholder?: string;
}

export default function CommentComposer({ postId, parentCommentId, onDone, placeholder }: CommentComposerProps) {
  const { firebaseUser, isSignedIn } = useSpaceAuth();
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isSignedIn) {
    return <p className="text-space-text-muted text-sm">Log in to join the discussion.</p>;
  }

  const handleSubmit = async () => {
    if (!body.trim() || !firebaseUser) return;
    setSubmitting(true);
    await createSpaceComment({ postId, authorId: firebaseUser.uid, body: body.trim(), parentCommentId });
    setBody('');
    setSubmitting(false);
    onDone?.();
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder ?? 'Add a comment…'}
        rows={2}
        className="admin-input resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={submitting || !body.trim()}
        className="self-end btn-primary-space px-4 py-1.5 rounded-full text-white text-xs font-bold disabled:opacity-50"
      >
        {submitting ? 'Posting…' : 'Comment'}
      </button>
    </div>
  );
}

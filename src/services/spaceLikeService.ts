import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Atomically toggles a like doc and space_posts.upvoteCount together so the
// counter never drifts from the actual number of space_likes docs.
export async function toggleSpaceLike(userId: string, postId: string): Promise<boolean> {
  const likeRef = doc(db, 'space_likes', `${userId}_${postId}`);
  const postRef = doc(db, 'space_posts', postId);

  return runTransaction(db, async (tx) => {
    const likeSnap = await tx.get(likeRef);
    const postSnap = await tx.get(postRef);
    if (!postSnap.exists()) throw new Error('Post not found');

    const currentCount = (postSnap.data().upvoteCount as number) ?? 0;

    if (likeSnap.exists()) {
      tx.delete(likeRef);
      tx.update(postRef, { upvoteCount: Math.max(0, currentCount - 1) });
      return false;
    }

    tx.set(likeRef, { userId, postId, createdAt: serverTimestamp() });
    tx.update(postRef, { upvoteCount: currentCount + 1 });
    return true;
  });
}

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toggleSpaceLike } from '../services/spaceLikeService';
import { toggleSpaceBookmark } from '../services/spaceBookmarkService';

export function useSpaceLikeBookmark(postId: string | undefined, userId: string | undefined | null) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!postId || !userId) {
      setIsLiked(false);
      setIsBookmarked(false);
      return;
    }
    const key = `${userId}_${postId}`;
    getDoc(doc(db, 'space_likes', key)).then((snap) => setIsLiked(snap.exists()));
    getDoc(doc(db, 'space_bookmarks', key)).then((snap) => setIsBookmarked(snap.exists()));
  }, [postId, userId]);

  const toggleLike = async () => {
    if (!postId || !userId) return;
    const next = await toggleSpaceLike(userId, postId);
    setIsLiked(next);
  };

  const toggleBookmark = async () => {
    if (!postId || !userId) return;
    const next = await toggleSpaceBookmark(userId, postId);
    setIsBookmarked(next);
  };

  return { isLiked, isBookmarked, toggleLike, toggleBookmark };
}

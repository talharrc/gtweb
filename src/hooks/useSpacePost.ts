import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SpaceComment, SpacePost } from '../types/space';

export function useSpacePost(postId: string | undefined) {
  const [post, setPost] = useState<SpacePost | null>(null);
  const [comments, setComments] = useState<SpaceComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setPost(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = onSnapshot(doc(db, 'space_posts', postId), (snap) => {
      setPost(snap.exists() ? (snap.data() as SpacePost) : null);
      setLoading(false);
    });
    return unsub;
  }, [postId]);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      return;
    }
    const q = query(collection(db, 'space_comments'), where('postId', '==', postId), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => d.data() as SpaceComment));
    });
    return unsub;
  }, [postId]);

  return { post, comments, loading };
}

import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SpacePost } from '../types/space';

// The Sunday Cloud Function run tags its "Weekly Best Posts" summary post
// with 'weekly-best' so the frontend can find the latest one without
// re-deriving trending scores client-side.
export function useSpaceWeeklyBest() {
  const [post, setPost] = useState<SpacePost | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'space_posts'),
      where('tags', 'array-contains', 'weekly-best'),
      orderBy('createdAt', 'desc'),
      limit(1),
    );
    const unsub = onSnapshot(q, (snap) => setPost(snap.empty ? null : (snap.docs[0].data() as SpacePost)));
    return unsub;
  }, []);

  return post;
}

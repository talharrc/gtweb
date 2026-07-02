import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, Query, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SpaceCategory, SpacePost } from '../types/space';
import { sortByTrending } from '../lib/spaceTrending';
import { sevenDaysAgoTimestamp } from '../services/spacePostService';

interface UseSpacePostsOptions {
  category?: SpaceCategory;
  sort?: 'recent' | 'trending';
  limitCount?: number;
}

export function useSpacePosts({ category, sort = 'recent', limitCount = 60 }: UseSpacePostsOptions = {}) {
  const [posts, setPosts] = useState<SpacePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const constraints = [where('status', '==', 'active')];
    if (category) constraints.push(where('category', '==', category));
    if (sort === 'trending') constraints.push(where('createdAt', '>=', sevenDaysAgoTimestamp()));

    let q: Query<DocumentData> = query(
      collection(db, 'space_posts'),
      ...constraints,
      orderBy('createdAt', 'desc'),
      limit(sort === 'trending' ? 100 : limitCount),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const raw = snap.docs.map((d) => d.data() as SpacePost);
        setPosts(sort === 'trending' ? sortByTrending(raw) : raw);
        setLoading(false);
      },
      () => setLoading(false),
    );

    return unsub;
  }, [category, sort, limitCount]);

  return { posts, loading };
}

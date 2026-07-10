import { useEffect, useState } from 'react';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SpacePost } from '../types/space';
import { getUserBookmarkIds } from '../services/spaceBookmarkService';

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function useSpaceBookmarksList(userId: string | undefined | null) {
  const [posts, setPosts] = useState<SpacePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setPosts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    (async () => {
      const bookmarks = await getUserBookmarkIds(userId);
      const postIds = bookmarks.map((b) => b.postId);
      if (postIds.length === 0) {
        if (!cancelled) { setPosts([]); setLoading(false); }
        return;
      }

      const chunks = chunk(postIds, 10); // Firestore 'in' queries max out at 10 values
      const results = await Promise.all(
        chunks.map((ids) =>
          getDocs(query(collection(db, 'space_posts'), where(documentId(), 'in', ids))),
        ),
      );
      const byId = new Map(results.flatMap((snap) => snap.docs.map((d) => [d.id, d.data() as SpacePost])));
      const ordered = postIds.map((id) => byId.get(id)).filter((p): p is SpacePost => !!p);

      if (!cancelled) { setPosts(ordered); setLoading(false); }
    })();

    return () => { cancelled = true; };
  }, [userId]);

  return { posts, loading };
}

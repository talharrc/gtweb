import { SpacePost } from '../types/space';

// Pure, synchronous, in-memory search over an already-loaded post window.
// Isolated on purpose: swapping to a hosted search service (Algolia/Typesense)
// later only means changing this file's internals plus useSpaceSearch.ts —
// no caller anywhere else in the app touches search logic directly.
export function searchPosts(posts: SpacePost[], rawQuery: string): SpacePost[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return posts;

  const scored = posts
    .map((post) => {
      const title = post.title.toLowerCase();
      const body = post.body.toLowerCase();
      const tags = post.tags.map((t) => t.toLowerCase());

      let weight = 0;
      if (title.includes(q)) weight = Math.max(weight, 3);
      if (tags.some((t) => t.includes(q))) weight = Math.max(weight, 2);
      if (body.includes(q)) weight = Math.max(weight, 1);

      return { post, weight };
    })
    .filter((s) => s.weight > 0);

  scored.sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    const aTime = a.post.createdAt?.toDate?.().getTime() ?? 0;
    const bTime = b.post.createdAt?.toDate?.().getTime() ?? 0;
    return bTime - aTime;
  });

  return scored.map((s) => s.post);
}

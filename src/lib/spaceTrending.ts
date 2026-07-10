import { SpacePost } from '../types/space';

const MIN_HOURS = 1;

export function computeTrendingScore(post: SpacePost, now: Date): number {
  const createdMs = post.createdAt?.toDate?.().getTime() ?? now.getTime();
  const hoursSincePost = Math.max(MIN_HOURS, (now.getTime() - createdMs) / (1000 * 60 * 60));
  return (post.upvoteCount + post.commentCount) / Math.sqrt(hoursSincePost);
}

export function sortByTrending(posts: SpacePost[]): SpacePost[] {
  const now = new Date();
  return [...posts].sort((a, b) => computeTrendingScore(b, now) - computeTrendingScore(a, now));
}

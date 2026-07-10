import { useMemo } from 'react';
import { SpacePost } from '../types/space';
import { searchPosts } from '../lib/spaceSearch';

export function useSpaceSearch(posts: SpacePost[], queryString: string): SpacePost[] {
  return useMemo(() => searchPosts(posts, queryString), [posts, queryString]);
}

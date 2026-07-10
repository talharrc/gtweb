import {
  collection, doc, setDoc, updateDoc, serverTimestamp, increment, Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SpaceCategory } from '../types/space';

export interface CreateSpacePostInput {
  authorId: string;
  category: SpaceCategory;
  title: string;
  body: string;
  links: string[];
  tags: string[];
  imageUrl: string;
}

// Pre-generates the doc id so a Storage upload path (space/{postId}/{file})
// can be known before the post document itself is written.
export function newSpacePostId(): string {
  return doc(collection(db, 'space_posts')).id;
}

export async function createSpacePost(id: string, data: CreateSpacePostInput): Promise<void> {
  await setDoc(doc(db, 'space_posts', id), {
    id,
    ...data,
    upvoteCount: 0,
    commentCount: 0,
    createdAt: serverTimestamp(),
    isFeatured: false,
    isPinned: false,
    isSystemGenerated: false,
    status: 'active',
  });
}

export async function updateSpacePost(id: string, updates: Record<string, unknown>): Promise<void> {
  await updateDoc(doc(db, 'space_posts', id), updates);
}

export async function deleteSpacePost(id: string): Promise<void> {
  await updateDoc(doc(db, 'space_posts', id), { status: 'removed' });
}

export async function setPostFeatured(id: string, value: boolean): Promise<void> {
  await updateDoc(doc(db, 'space_posts', id), { isFeatured: value });
}

export async function setPostPinned(id: string, value: boolean): Promise<void> {
  await updateDoc(doc(db, 'space_posts', id), { isPinned: value });
}

export async function incrementCommentCount(postId: string, delta: number): Promise<void> {
  await updateDoc(doc(db, 'space_posts', postId), { commentCount: increment(delta) });
}

export function sevenDaysAgoTimestamp(): Timestamp {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return Timestamp.fromDate(d);
}

import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { incrementCommentCount } from './spacePostService';

export interface CreateSpaceCommentInput {
  postId: string;
  authorId: string;
  body: string;
  parentCommentId: string | null;
}

export async function createSpaceComment(data: CreateSpaceCommentInput): Promise<void> {
  const ref = doc(collection(db, 'space_comments'));
  await setDoc(ref, {
    id: ref.id,
    ...data,
    createdAt: serverTimestamp(),
  });
  await incrementCommentCount(data.postId, 1);
}

export async function deleteSpaceComment(id: string, postId: string): Promise<void> {
  await deleteDoc(doc(db, 'space_comments', id));
  await incrementCommentCount(postId, -1);
}

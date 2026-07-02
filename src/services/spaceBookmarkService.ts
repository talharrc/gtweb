import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function toggleSpaceBookmark(userId: string, postId: string): Promise<boolean> {
  const ref = doc(db, 'space_bookmarks', `${userId}_${postId}`);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await deleteDoc(ref);
    return false;
  }

  await setDoc(ref, { userId, postId, createdAt: serverTimestamp() });
  return true;
}

export async function getUserBookmarkIds(userId: string): Promise<{ postId: string; createdAt: unknown }[]> {
  const q = query(collection(db, 'space_bookmarks'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ postId: d.data().postId as string, createdAt: d.data().createdAt }));
}

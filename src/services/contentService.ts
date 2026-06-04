import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ContentItem } from '../types';

export async function createContent(data: Omit<ContentItem, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'content'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateContent(id: string, updates: Partial<ContentItem>) {
  await updateDoc(doc(db, 'content', id), updates as any);
}

export async function deleteContent(id: string) {
  await deleteDoc(doc(db, 'content', id));
}

import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GTProject } from '../types';

export async function createProject(data: Omit<GTProject, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, updates: Partial<GTProject>) {
  await updateDoc(doc(db, 'projects', id), updates as any);
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(db, 'projects', id));
}

export async function archiveProject(id: string) {
  await updateDoc(doc(db, 'projects', id), { status: 'archived' });
}

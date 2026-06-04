import { collection, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BuilderRequest } from '../types';

export async function createRequest(data: Omit<BuilderRequest, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'requests'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateRequestStatus(id: string, status: BuilderRequest['status']) {
  await updateDoc(doc(db, 'requests', id), { status });
}

import { collection, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GTForm } from '../types';

export async function createForm(data: Omit<GTForm, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'forms'), data);
  return ref.id;
}

export async function submitForm(formId: string, submittedData: Record<string, string | boolean>) {
  await updateDoc(doc(db, 'forms', formId), {
    status: 'submitted',
    submittedData,
    submittedAt: serverTimestamp(),
  });
}

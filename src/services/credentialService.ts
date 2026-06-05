import {
  collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { HubCredential } from '../types';

const COL = 'credentials';

export async function createCredential(
  data: Omit<HubCredential, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getCredentialByUsername(username: string): Promise<HubCredential | null> {
  const q = query(collection(db, COL), where('username', '==', username.trim().toLowerCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as HubCredential;
}

export async function getCredentialsByProject(projectId: string): Promise<HubCredential[]> {
  const q = query(collection(db, COL), where('projectId', '==', projectId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as HubCredential));
}

export async function deleteCredentialsByProject(projectId: string): Promise<void> {
  const creds = await getCredentialsByProject(projectId);
  await Promise.all(creds.map(c => deleteDoc(doc(db, COL, c.id))));
}

export function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = 'GT-';
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 12);
}

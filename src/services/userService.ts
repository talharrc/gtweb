import { doc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export async function provisionUser(uid: string, role: UserRole) {
  await updateDoc(doc(db, 'users', uid), { role });
}

export async function upsertUserProfile(uid: string, data: Partial<Omit<UserProfile, 'uid'>>) {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
}

export async function getUsersByRole(role: UserRole): Promise<UserProfile[]> {
  const q = query(collection(db, 'users'), where('role', '==', role));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data() } as UserProfile));
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ ...d.data() } as UserProfile));
}

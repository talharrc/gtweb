import { doc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export async function provisionUser(uid: string, role: UserRole) {
  await updateDoc(doc(db, 'users', uid), { role });
}

export async function approveUser(uid: string) {
  await updateDoc(doc(db, 'users', uid), { status: 'approved' });
}

export async function rejectUser(uid: string) {
  // Deleting the Firestore doc revokes hub access immediately.
  // The Firebase Auth account is preserved — the next sign-in attempt
  // will be rejected by AuthContext (no doc = sign out).
  // To fully delete the Auth account, use a server-side Cloud Function.
  await deleteDoc(doc(db, 'users', uid));
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

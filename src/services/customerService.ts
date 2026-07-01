import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CustomerProfile } from '../types';

export async function getCustomerProfile(username: string): Promise<CustomerProfile | null> {
  const snap = await getDoc(doc(db, 'customers', username.toLowerCase()));
  return snap.exists() ? (snap.data() as CustomerProfile) : null;
}

export async function upsertCustomerProfile(username: string, data: Partial<CustomerProfile>): Promise<void> {
  await setDoc(doc(db, 'customers', username.toLowerCase()), data, { merge: true });
}

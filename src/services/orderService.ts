import { collection, doc, addDoc, updateDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus, DeliveredCredential } from '../types';

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const ref = await addDoc(collection(db, 'orders'), {
    ...data,
    status: 'pending_payment' as OrderStatus,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra?: { adminNote?: string; verifiedAt?: unknown; fulfilledAt?: unknown }
): Promise<void> {
  await updateDoc(doc(db, 'orders', id), { status, ...extra } as any);
}

export async function deliverCredentials(id: string, credentials: DeliveredCredential[]): Promise<void> {
  await updateDoc(doc(db, 'orders', id), {
    deliveredCredentials: credentials,
    status: 'fulfilled' as OrderStatus,
    fulfilledAt: serverTimestamp(),
  } as any);
}

export async function getOrdersByCustomer(username: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('customerUsername', '==', username.toLowerCase()));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
}

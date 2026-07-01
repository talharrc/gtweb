import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

export async function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', id), { ...updates, updatedAt: serverTimestamp() } as any);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

export async function setProductActive(id: string, isActive: boolean): Promise<void> {
  await updateDoc(doc(db, 'products', id), { isActive, updatedAt: serverTimestamp() } as any);
}

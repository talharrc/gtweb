import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { PortfolioItem } from '../types';

export async function createPortfolioItem(data: Omit<PortfolioItem, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, 'portfolio'), { ...data, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function updatePortfolioItem(id: string, data: Partial<Omit<PortfolioItem, 'id' | 'createdAt'>>) {
  await updateDoc(doc(db, 'portfolio', id), data);
}

export async function deletePortfolioItem(id: string) {
  await deleteDoc(doc(db, 'portfolio', id));
}

export async function uploadPortfolioImage(
  slug: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(storage, `portfolio/${slug}/${Date.now()}_${file.name}`);
  await new Promise<void>((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      (snap) => onProgress && onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      () => resolve()
    );
  });
  return getDownloadURL(storageRef);
}

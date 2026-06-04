import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { GTDocument } from '../types';

export async function uploadDocument(
  projectId: string,
  file: File,
  meta: Omit<GTDocument, 'id' | 'fileUrl' | 'uploadedAt'>,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(storage, `projects/${projectId}/docs/${Date.now()}_${file.name}`);
  await new Promise<void>((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      (snap) => onProgress && onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      () => resolve()
    );
  });
  const fileUrl = await getDownloadURL(storageRef);
  const docRef = await addDoc(collection(db, 'documents'), {
    ...meta,
    projectId,
    fileUrl,
    uploadedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function markDocumentLatest(id: string, projectId: string, type: GTDocument['type']) {
  // Unmark previous latest of same type, then mark this one
  const { collection: col, query, where, getDocs, writeBatch, doc } = await import('firebase/firestore');
  const batch = writeBatch(db);
  const q = query(col(db, 'documents'), where('projectId', '==', projectId), where('type', '==', type), where('isLatest', '==', true));
  const snap = await getDocs(q);
  snap.docs.forEach(d => batch.update(d.ref, { isLatest: false }));
  batch.update(doc(db, 'documents', id), { isLatest: true });
  await batch.commit();
}

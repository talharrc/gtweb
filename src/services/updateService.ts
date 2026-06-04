import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { ProjectUpdate } from '../types';

export async function postUpdate(
  projectId: string,
  authorUid: string,
  summary: string,
  files: File[]
): Promise<string> {
  const attachments: string[] = [];
  for (const file of files) {
    const storageRef = ref(storage, `projects/${projectId}/updates/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    attachments.push(url);
  }
  const docRef = await addDoc(collection(db, 'updates'), {
    projectId,
    authorUid,
    summary,
    attachments,
    date: serverTimestamp(),
  });
  return docRef.id;
}

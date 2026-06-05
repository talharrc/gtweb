import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface GTMessage {
  id: string;
  projectId: string;
  senderUid: string;
  senderName: string;
  senderRole: 'admin' | 'client' | 'builder';
  body: string;
  createdAt: any;
  read: boolean;
}

export async function sendMessage(
  projectId: string,
  senderUid: string,
  senderName: string,
  senderRole: 'admin' | 'client' | 'builder',
  body: string,
): Promise<void> {
  await addDoc(collection(db, 'messages'), {
    projectId,
    senderUid,
    senderName,
    senderRole,
    body: body.trim(),
    createdAt: serverTimestamp(),
    read: false,
  });
}

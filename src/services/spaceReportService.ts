import { collection, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ReportReason, ReportTargetType } from '../types/space';

export interface CreateSpaceReportInput {
  targetType: ReportTargetType;
  targetId: string;
  reporterId: string;
  reason: ReportReason;
}

export async function createSpaceReport(data: CreateSpaceReportInput): Promise<void> {
  const ref = doc(collection(db, 'space_reports'));
  await setDoc(ref, {
    id: ref.id,
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function resolveSpaceReport(id: string, action: 'resolved' | 'dismissed'): Promise<void> {
  await updateDoc(doc(db, 'space_reports', id), { status: action });
}

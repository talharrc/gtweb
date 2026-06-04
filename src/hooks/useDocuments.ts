import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GTDocument } from '../types';

export function useDocuments(projectId: string | null) {
  const [documents, setDocuments] = useState<GTDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) { setDocuments([]); setLoading(false); return; }
    const q = query(
      collection(db, 'documents'),
      where('projectId', '==', projectId),
      orderBy('uploadedAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setDocuments(snap.docs.map(d => ({ id: d.id, ...d.data() } as GTDocument)));
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, [projectId]);

  return { documents, loading };
}

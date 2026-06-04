import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BuilderRequest } from '../types';

export function useRequests(projectId: string | null) {
  const [requests, setRequests] = useState<BuilderRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) { setRequests([]); setLoading(false); return; }
    const q = query(
      collection(db, 'requests'),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as BuilderRequest)));
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, [projectId]);

  return { requests, loading };
}

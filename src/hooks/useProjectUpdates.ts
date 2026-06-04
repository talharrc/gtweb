import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProjectUpdate } from '../types';

export function useProjectUpdates(projectId: string | null) {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) { setUpdates([]); setLoading(false); return; }
    const q = query(
      collection(db, 'updates'),
      where('projectId', '==', projectId),
      orderBy('date', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setUpdates(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectUpdate)));
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, [projectId]);

  return { updates, loading };
}

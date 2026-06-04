import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GTForm } from '../types';

export function useForms(projectId: string | null) {
  const [forms, setForms] = useState<GTForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) { setForms([]); setLoading(false); return; }
    const q = query(collection(db, 'forms'), where('projectId', '==', projectId));
    const unsub = onSnapshot(q, (snap) => {
      setForms(snap.docs.map(d => ({ id: d.id, ...d.data() } as GTForm)));
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, [projectId]);

  return { forms, loading };
}

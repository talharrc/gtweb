import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, Query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GTProject } from '../types';
import { useAuth } from '../context/AuthContext';

export function useProjects() {
  const { firebaseUser, role } = useAuth();
  const [projects, setProjects] = useState<GTProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) { setProjects([]); setLoading(false); return; }

    const col = collection(db, 'projects');
    let q: Query;
    if (role === 'admin') {
      q = query(col, orderBy('createdAt', 'desc'));
    } else if (role === 'client') {
      q = query(col, where('clientUid', '==', firebaseUser.uid), orderBy('createdAt', 'desc'));
    } else if (role === 'builder') {
      q = query(col, where('builderUids', 'array-contains', firebaseUser.uid), orderBy('createdAt', 'desc'));
    } else {
      setProjects([]); setLoading(false); return;
    }

    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as GTProject)));
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, [firebaseUser, role]);

  return { projects, loading };
}

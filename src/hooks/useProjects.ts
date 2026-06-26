import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, Query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GTProject } from '../types';
import { useAuth } from '../context/AuthContext';

export function useProjects() {
  const { firebaseUser, role, userProfile } = useAuth();
  const uid = firebaseUser?.uid ?? null;
  const email = userProfile?.email ?? null;
  const [projects, setProjects] = useState<GTProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setProjects([]); setLoading(false); return; }

    const col = collection(db, 'projects');
    let q: Query;

    if (role === 'admin') {
      q = query(col, orderBy('createdAt', 'desc'));
    } else if (role === 'client' && email) {
      q = query(col, where('clientEmail', '==', email));
    } else if (role === 'builder' && email) {
      q = query(col, where('builderEmails', 'array-contains', email));
    } else {
      setProjects([]); setLoading(false); return;
    }

    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as GTProject)));
      setLoading(false);
    }, () => { setLoading(false); });

    return () => unsub();
  }, [uid, role, email]);

  return { projects, loading };
}

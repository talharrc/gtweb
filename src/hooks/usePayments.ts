import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, Query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Payment } from '../types';
import { useAuth } from '../context/AuthContext';

export function usePayments(projectId?: string | null) {
  const { firebaseUser, role } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) { setPayments([]); setLoading(false); return; }

    const col = collection(db, 'payments');
    let q: Query;
    if (role === 'admin') {
      q = projectId
        ? query(col, where('projectId', '==', projectId))
        : query(col);
    } else if (role === 'builder') {
      q = projectId
        ? query(col, where('projectId', '==', projectId), where('builderUid', '==', firebaseUser.uid))
        : query(col, where('builderUid', '==', firebaseUser.uid));
    } else {
      setPayments([]); setLoading(false); return;
    }

    const unsub = onSnapshot(q, (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Payment)));
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, [firebaseUser, role, projectId]);

  return { payments, loading };
}

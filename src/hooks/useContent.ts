import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ContentItem } from '../types';
import { useAuth } from '../context/AuthContext';

export function useContent(type?: ContentItem['type'], membersOnly?: boolean) {
  const { firebaseUser, role } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, 'content');
    const constraints: any[] = [orderBy('createdAt', 'desc')];

    if (type) constraints.unshift(where('type', '==', type));

    if (role === 'admin') {
      // admin sees everything
    } else if (membersOnly && firebaseUser) {
      constraints.unshift(where('isPublic', '==', false));
    } else if (!membersOnly) {
      constraints.unshift(where('isPublic', '==', true));
    } else {
      // membersOnly but not signed in — return empty
      setItems([]); setLoading(false); return;
    }

    const q = query(col, ...constraints);
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as ContentItem)));
      setLoading(false);
    }, () => { setLoading(false); });
    return () => unsub();
  }, [firebaseUser, role, type, membersOnly]);

  return { items, loading };
}

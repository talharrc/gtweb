import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SpaceUser } from '../types/space';

const cache = new Map<string, SpaceUser | null>();

export function useSpaceUserById(uid: string | undefined) {
  const [user, setUser] = useState<SpaceUser | null>(uid ? cache.get(uid) ?? null : null);

  useEffect(() => {
    if (!uid) return;
    if (cache.has(uid)) { setUser(cache.get(uid) ?? null); return; }
    getDoc(doc(db, 'space_users', uid)).then((snap) => {
      const data = snap.exists() ? (snap.data() as SpaceUser) : null;
      cache.set(uid, data);
      setUser(data);
    });
  }, [uid]);

  return user;
}

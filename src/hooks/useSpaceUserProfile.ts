import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SpacePost, SpaceUser } from '../types/space';
import { getSpaceUserByUsername } from '../services/spaceUserService';

export function useSpaceUserProfile(username: string | undefined) {
  const [profile, setProfile] = useState<SpaceUser | null>(null);
  const [posts, setPosts] = useState<SpacePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getSpaceUserByUsername(username).then((user) => {
      setProfile(user);
      setLoading(false);
    });
  }, [username]);

  useEffect(() => {
    if (!profile?.uid) {
      setPosts([]);
      return;
    }
    const q = query(
      collection(db, 'space_posts'),
      where('authorId', '==', profile.uid),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(q, (snap) => setPosts(snap.docs.map((d) => d.data() as SpacePost)));
    return unsub;
  }, [profile?.uid]);

  return { profile, posts, loading };
}

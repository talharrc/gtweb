import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '../lib/firebase';
import { SpaceUser } from '../types/space';

interface EnsureSpaceUserDocInput {
  username: string;
  displayName: string;
  avatarUrl: string;
}

// Idempotent — safe to call on every sign-in (Google popup resolves identically
// for new and returning users). Only sets joinedAt/reputation the first time.
export async function ensureSpaceUserDoc(user: FirebaseUser, extra: EnsureSpaceUserDocInput): Promise<void> {
  const ref = doc(db, 'space_users', user.uid);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    return;
  }

  await setDoc(ref, {
    uid: user.uid,
    username: extra.username,
    displayName: extra.displayName,
    avatarUrl: extra.avatarUrl,
    bio: '',
    joinedAt: serverTimestamp(),
    reputation: 0,
  });
}

export async function updateSpaceUserProfile(uid: string, updates: Partial<Pick<SpaceUser, 'displayName' | 'bio' | 'avatarUrl'>>): Promise<void> {
  await setDoc(doc(db, 'space_users', uid), updates, { merge: true });
}

export async function getSpaceUserByUsername(username: string): Promise<SpaceUser | null> {
  const q = query(collection(db, 'space_users'), where('username', '==', username), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as SpaceUser;
}

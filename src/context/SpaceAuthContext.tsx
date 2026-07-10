import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, onSnapshot, getDocs, collection, query, where, limit } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { isSpaceAdmin } from '../lib/spaceAdmin';
import { ensureSpaceUserDoc } from '../services/spaceUserService';
import { SpaceUser } from '../types/space';

interface SpaceAuthContextValue {
  firebaseUser: FirebaseUser | null;
  spaceProfile: SpaceUser | null;
  isLoading: boolean;
  isSignedIn: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOutSpace: () => Promise<void>;
}

const SpaceAuthContext = createContext<SpaceAuthContextValue | undefined>(undefined);

async function isUsernameTaken(username: string): Promise<boolean> {
  const q = query(collection(db, 'space_users'), where('username', '==', username), limit(1));
  const snap = await getDocs(q);
  return !snap.empty;
}

export function SpaceAuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [spaceProfile, setSpaceProfile] = useState<SpaceUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      setSpaceProfile(null);
      return;
    }
    const unsub = onSnapshot(doc(db, 'space_users', firebaseUser.uid), (snap) => {
      setSpaceProfile(snap.exists() ? (snap.data() as SpaceUser) : null);
    });
    return unsub;
  }, [firebaseUser?.uid]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const fallbackUsername = result.user.email?.split('@')[0] ?? `user${result.user.uid.slice(0, 6)}`;
    await ensureSpaceUserDoc(result.user, {
      username: fallbackUsername,
      displayName: result.user.displayName ?? fallbackUsername,
      avatarUrl: result.user.photoURL ?? '',
    });
  };

  const signUpWithEmail = async (email: string, password: string, username: string, displayName: string) => {
    const taken = await isUsernameTaken(username);
    if (taken) {
      throw new Error('That username is already taken. Please choose another.');
    }
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await ensureSpaceUserDoc(result.user, { username, displayName, avatarUrl: '' });
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOutSpace = async () => {
    await firebaseSignOut(auth);
  };

  const value: SpaceAuthContextValue = {
    firebaseUser,
    spaceProfile,
    isLoading,
    isSignedIn: !!firebaseUser,
    isAdmin: isSpaceAdmin(firebaseUser?.uid),
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOutSpace,
  };

  return <SpaceAuthContext.Provider value={value}>{children}</SpaceAuthContext.Provider>;
}

export function useSpaceAuth(): SpaceAuthContextValue {
  const ctx = useContext(SpaceAuthContext);
  if (!ctx) throw new Error('useSpaceAuth must be used within a SpaceAuthProvider');
  return ctx;
}

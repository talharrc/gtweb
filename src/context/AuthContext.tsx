import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

const ADMIN_EMAIL = 'mail.galaxatech@gmail.com';

interface AuthContextValue {
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  role: UserRole;
  projectId: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isBuilder: boolean;
  isVisitor: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  userProfile: null,
  role: 'visitor',
  projectId: null,
  isLoading: true,
  isAdmin: false,
  isClient: false,
  isBuilder: false,
  isVisitor: false,
  isSignedIn: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      // Check if admin by email
      if (user.email === ADMIN_EMAIL) {
        setUserProfile({
          uid: user.uid,
          email: user.email ?? '',
          role: 'admin',
          displayName: user.displayName ?? 'Rihad Hamid',
          photoURL: user.photoURL ?? '',
          createdAt: null as any,
        });
        setIsLoading(false);
        return;
      }

      // Look up Firestore user doc for role + projectIds
      try {
        const profileRef = doc(db, 'users', user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setUserProfile({ uid: user.uid, ...profileSnap.data() } as UserProfile);
        } else {
          // New visitor via Google Sign-In — create profile
          const newProfile: Omit<UserProfile, 'createdAt'> & { createdAt: any } = {
            uid: user.uid,
            email: user.email ?? '',
            role: 'visitor',
            displayName: user.displayName ?? '',
            photoURL: user.photoURL ?? '',
            createdAt: serverTimestamp(),
          };
          await setDoc(profileRef, newProfile);
          setUserProfile({ ...newProfile, createdAt: null as any });
        }
      } catch {
        // Fall back to visitor if Firestore read fails
        setUserProfile({
          uid: user.uid,
          email: user.email ?? '',
          role: 'visitor',
          displayName: user.displayName ?? '',
          photoURL: user.photoURL ?? '',
          createdAt: null as any,
        });
      }

      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setFirebaseUser(null);
    setUserProfile(null);
  };

  const role: UserRole = userProfile?.role ?? 'visitor';
  const projectId: string | null = (userProfile as any)?.projectId ?? null;

  return (
    <AuthContext.Provider value={{
      firebaseUser,
      userProfile,
      role,
      projectId,
      isLoading,
      isAdmin: role === 'admin',
      isClient: role === 'client',
      isBuilder: role === 'builder',
      isVisitor: role === 'visitor',
      isSignedIn: firebaseUser !== null,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

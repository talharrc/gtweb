import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextValue {
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isBuilder: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  userProfile: null,
  role: 'visitor',
  isLoading: true,
  isAdmin: false,
  isClient: false,
  isBuilder: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserProfile({ id: snap.id, ...snap.data() } as unknown as UserProfile);
        } else {
          // First login — create visitor profile
          const profile: Omit<UserProfile, 'id'> = {
            uid: user.uid,
            email: user.email ?? '',
            role: 'visitor',
            displayName: user.displayName ?? '',
            photoURL: user.photoURL ?? '',
            createdAt: serverTimestamp() as any,
          };
          await setDoc(ref, profile);
          setUserProfile({ ...profile, createdAt: null as any } as unknown as UserProfile);
        }
      } catch {
        // Firestore not yet enabled or rules blocking — degrade gracefully
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const role: UserRole = userProfile?.role ?? 'visitor';

  return (
    <AuthContext.Provider value={{
      firebaseUser,
      userProfile,
      role,
      isLoading,
      isAdmin: role === 'admin',
      isClient: role === 'client',
      isBuilder: role === 'builder',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

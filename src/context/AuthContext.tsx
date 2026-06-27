import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { AUTH_DISABLED, MOCK_USER_ROLE } from '../config';
import { useDevRole } from './DevRoleContext';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'mail.galaxatech@gmail.com';

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
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
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
  authModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { devRole } = useDevRole();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  useEffect(() => {
    if (AUTH_DISABLED) {
      setFirebaseUser({ uid: 'dev-mock', email: 'dev@mock.local' } as any as User);
      setUserProfile({
        uid: 'dev-mock',
        email: 'dev@mock.local',
        role: MOCK_USER_ROLE,
        status: 'approved',
        displayName: 'Dev (Auth Disabled)',
        photoURL: '',
        createdAt: null as any,
      });
      setIsLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      // Admin is purely email-based — no Firestore doc required
      if (user.email === ADMIN_EMAIL) {
        setUserProfile({
          uid: user.uid,
          email: user.email ?? '',
          role: 'admin',
          status: 'approved',
          displayName: user.displayName ?? 'Rihad Hamid',
          photoURL: user.photoURL ?? '',
          createdAt: null as any,
        });
        setIsLoading(false);
        return;
      }

      // All other users must have a Firestore doc (created at signup)
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setUserProfile({ uid: user.uid, ...snap.data() } as UserProfile);
        } else {
          // Signed in via Firebase Auth but no Firestore doc — treat as unauthenticated
          await firebaseSignOut(auth);
          setFirebaseUser(null);
          setUserProfile(null);
        }
      } catch {
        setUserProfile(null);
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

  const role: UserRole = AUTH_DISABLED ? devRole : (userProfile?.role ?? 'visitor');
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
      isSignedIn: firebaseUser !== null && userProfile !== null,
      authModalOpen,
      openAuthModal,
      closeAuthModal,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

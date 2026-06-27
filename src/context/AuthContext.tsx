import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserRole } from '../types';

interface AuthSession {
  role: UserRole;
  email: string;
  projectId: string | null;
}

interface AuthContextValue {
  role: UserRole;
  email: string | null;
  projectId: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isBuilder: boolean;
  isVisitor: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  applySession: (session: AuthSession, firebaseToken: string | null) => Promise<void>;
  // Kept for legacy compatibility (HubLayout, Navbar)
  userProfile: { role: UserRole; displayName: string; email: string } | null;
  firebaseUser: null;
}

const AuthContext = createContext<AuthContextValue>({
  role: 'visitor',
  email: null,
  projectId: null,
  isLoading: true,
  isAdmin: false,
  isClient: false,
  isBuilder: false,
  isVisitor: true,
  isSignedIn: false,
  signOut: async () => {},
  applySession: async () => {},
  userProfile: null,
  firebaseUser: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('visitor');
  const [email, setEmail] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(async (data) => {
        if (data?.role) {
          setRole(data.role as UserRole);
          setEmail(data.email ?? null);
          setProjectId(data.projectId ?? null);
          // Refresh Firebase custom token so Firestore rules work
          if (data.firebaseToken) {
            try { await signInWithCustomToken(auth, data.firebaseToken); } catch {}
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const applySession = async (session: AuthSession, firebaseToken: string | null) => {
    setRole(session.role as UserRole);
    setEmail(session.email);
    setProjectId(session.projectId);
    if (firebaseToken) {
      try { await signInWithCustomToken(auth, firebaseToken); } catch {}
    }
  };

  const signOut = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
    try { await firebaseSignOut(auth); } catch {}
    setRole('visitor');
    setEmail(null);
    setProjectId(null);
  };

  const isSignedIn = email !== null;

  const userProfile = isSignedIn
    ? { role, displayName: email?.split('@')[0] ?? '', email: email ?? '' }
    : null;

  return (
    <AuthContext.Provider value={{
      role,
      email,
      projectId,
      isLoading,
      isAdmin: role === 'admin',
      isClient: role === 'client',
      isBuilder: role === 'builder',
      isVisitor: !isSignedIn || role === 'visitor',
      isSignedIn,
      signOut,
      applySession,
      userProfile,
      firebaseUser: null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

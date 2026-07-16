import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserRole } from '../types';

interface AuthSession {
  role: UserRole;
  email: string;
  projectId: string | null;
  projectName?: string | null;
}

interface AuthContextValue {
  role: UserRole;
  email: string | null;
  projectId: string | null;
  projectName: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isClient: boolean;
  isBuilder: boolean;
  isCustomer: boolean;
  isVisitor: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  applySession: (session: AuthSession, _firebaseToken?: string | null) => Promise<void>;
  userProfile: { role: UserRole; displayName: string; email: string } | null;
  firebaseUser: null;
  isDemo: boolean;
  setIsDemo: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextValue>({
  role: 'visitor',
  email: null,
  projectId: null,
  projectName: null,
  isLoading: true,
  isAdmin: false,
  isClient: false,
  isBuilder: false,
  isCustomer: false,
  isVisitor: true,
  isSignedIn: false,
  signOut: async () => {},
  applySession: async () => {},
  userProfile: null,
  firebaseUser: null,
  isDemo: false,
  setIsDemo: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('visitor');
  const [email, setEmail] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(() => {
    return new URLSearchParams(window.location.search).get('demo') === 'true';
  });

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.role) {
          setRole(data.role as UserRole);
          setEmail(data.email ?? null);
          setProjectId(data.projectId ?? null);
          setProjectName(data.projectName ?? null);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const applySession = async (session: AuthSession, _firebaseToken?: string | null) => {
    setRole(session.role as UserRole);
    setEmail(session.email);
    setProjectId(session.projectId);
    setProjectName(session.projectName ?? null);
  };

  const signOut = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
    localStorage.removeItem('gt_admin_ui');
    localStorage.removeItem('gt_client_ui');
    localStorage.removeItem('gt_builder_ui');
    setRole('visitor');
    setEmail(null);
    setProjectId(null);
    setProjectName(null);
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
      projectName,
      isLoading,
      isAdmin: role === 'admin',
      isClient: role === 'client',
      isBuilder: role === 'builder',
      isCustomer: role === 'customer',
      isVisitor: !isSignedIn || role === 'visitor',
      isSignedIn,
      signOut,
      applySession,
      userProfile,
      firebaseUser: null,
      isDemo,
      setIsDemo,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

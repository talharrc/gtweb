const SESSION_KEY = 'gt_local_session';
const ADMIN_EMAIL = 'mail.galaxatech@gmail.com';

export type LocalRole = 'admin' | 'client' | 'builder' | 'visitor';

export interface LocalSession {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: LocalRole;
  projectId?: string;
}

export function signInLocal(email: string, displayName?: string, role?: LocalRole, projectId?: string): LocalSession {
  const assignedRole: LocalRole =
    role ?? (email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'visitor');
  const session: LocalSession = {
    uid: `local_${btoa(email).replace(/[^a-zA-Z0-9]/g, '')}`,
    email,
    displayName: displayName ?? email.split('@')[0],
    photoURL: '',
    role: assignedRole,
    ...(projectId ? { projectId } : {}),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('gt-auth-change'));
  return session;
}

export function signInLocalWithUid(uid: string, email: string, displayName: string, role: LocalRole, projectId?: string): LocalSession {
  const session: LocalSession = {
    uid,
    email,
    displayName,
    photoURL: '',
    role,
    ...(projectId ? { projectId } : {}),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('gt-auth-change'));
  return session;
}

export function getLocalSession(): LocalSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as LocalSession) : null;
  } catch {
    return null;
  }
}

export function clearLocalSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('gt-auth-change'));
}

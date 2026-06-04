import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { auth, db, googleSignIn, logout, handleFirestoreError, OperationType } from '../lib/firebase';
import { PageType } from '../types';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'visitor' | 'client' | 'builder' | 'admin';
  createdAt: string;
  whatsapp?: string;
  photoURL?: string;
  builderShare?: number;
  builderRating?: number;
}

export interface Milestone {
  title: string;
  date: string;
  status: 'pending' | 'completed';
}

export interface Project {
  id: string;
  name: string;
  clientEmail: string;
  clientName: string;
  assignedBuilderId: string;
  assignedBuilderName: string;
  state: 'Planning' | 'Design' | 'Development' | 'Audit' | 'Completed';
  progress: number;
  deadline: string;
  whatsappLink: string;
  projectValue: number;
  builderPercentage: number;
  paidAmount: number;
  dueAmount: number;
  milestones: Milestone[];
  createdAt: any;
  builderHourlyRate?: number;
  builderPayoutHours?: number;
}

export interface ProjectUpdate {
  id: string;
  date: string;
  summary: string;
  attachmentName?: string;
  attachmentUrl?: string;
  createdAt: any;
}

export interface ActionCenterItem {
  id: string;
  title: string;
  description: string;
  type: 'form' | 'upload' | 'approval';
  status: 'pending' | 'completed';
  formSchema?: string;
  responseContent?: string;
  createdAt: any;
}

export interface VaultDocument {
  id: string;
  name: string;
  type: 'Agreement' | 'SOW' | 'Invoice' | 'Brief';
  url: string;
  createdAt: any;
}

export interface Invitation {
  id: string;
  email: string;
  role: 'client' | 'builder' | 'admin';
  used: boolean;
  projectDetails?: Partial<Project>;
  createdAt: string;
}

interface AppContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  activeInvite: Invitation | null;
  inviteError: string | null;
  projects: Project[];
  users: UserProfile[];
  invitations: Invitation[];
  refreshData: () => Promise<void>;
  claimInvite: () => Promise<boolean>;
  elevateToAdmin: (passcode: string) => Promise<boolean>;
  registerAsVisitor: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeInvite, setActiveInvite] = useState<Invitation | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Firestore lists
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // 1. Initial Page Load - Check for url invite coordinates
  useEffect(() => {
    const parseInvite = async () => {
      const params = new URLSearchParams(window.location.search);
      const inviteId = params.get('invite');
      if (inviteId) {
        try {
          const inviteRef = doc(db, 'invitations', inviteId);
          const snap = await getDoc(inviteRef);
          if (snap.exists()) {
            const data = snap.data() as Invitation;
            if (data.used) {
              setInviteError('This invitation has already been claimed.');
            } else {
              setActiveInvite({ ...data, id: snap.id });
              console.log('[Invite] Active invitation loaded:', data);
            }
          } else {
            setInviteError('Invalid invitation coordinates.');
          }
        } catch (err) {
          console.error('[Invite] Verification failure:', err);
        }
      }
    };
    parseInvite();
  }, []);

  // 2. Setup Auth state change listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Attempt profile lookup
          const pref = doc(db, 'users', user.uid);
          const snap = await getDoc(pref);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            // Check if we can auto-register based on email or existing invite
            setUserProfile(null);
          }
        } catch (err) {
          console.error('[Profile] Loading error:', err);
        }
      } else {
        setUserProfile(null);
        setProjects([]);
        setUsers([]);
        setInvitations([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 3. Real-time Firebase Subscriptions based on current user roles
  useEffect(() => {
    if (!currentUser || !userProfile) return;

    let unsubProjects = () => {};
    let unsubUsers = () => {};
    let unsubInvites = () => {};

    const loadRealtimeCollections = () => {
      try {
        const { role, email } = userProfile;

        // Admin Subscription - Can see everything
        if (role === 'admin') {
          const pQuery = collection(db, 'projects');
          unsubProjects = onSnapshot(pQuery, (snap) => {
            const list: Project[] = [];
            snap.forEach(d => list.push({ ...d.data() as Project, id: d.id }));
            setProjects(list);
          }, (err) => handleFirestoreError(err, OperationType.GET, 'projects'));

          const uQuery = collection(db, 'users');
          unsubUsers = onSnapshot(uQuery, (snap) => {
            const list: UserProfile[] = [];
            snap.forEach(d => list.push({ ...d.data() as UserProfile }));
            setUsers(list);
          }, (err) => handleFirestoreError(err, OperationType.GET, 'users'));

          const iQuery = collection(db, 'invitations');
          unsubInvites = onSnapshot(iQuery, (snap) => {
            const list: Invitation[] = [];
            snap.forEach(d => list.push({ ...d.data() as Invitation, id: d.id }));
            setInvitations(list);
          }, (err) => handleFirestoreError(err, OperationType.GET, 'invitations'));
        } 
        
        // Client Subscription - Only projects registered under client email
        else if (role === 'client') {
          const pQuery = query(collection(db, 'projects'), where('clientEmail', '==', email));
          unsubProjects = onSnapshot(pQuery, (snap) => {
            const list: Project[] = [];
            snap.forEach(d => list.push({ ...d.data() as Project, id: d.id }));
            setProjects(list);
          }, (err) => handleFirestoreError(err, OperationType.GET, 'projects(client)'));
        } 
        
        // Builder Subscription - Only projects assigned to builder ID
        else if (role === 'builder') {
          const pQuery = query(collection(db, 'projects'), where('assignedBuilderId', '==', currentUser.uid));
          unsubProjects = onSnapshot(pQuery, (snap) => {
            const list: Project[] = [];
            snap.forEach(d => list.push({ ...d.data() as Project, id: d.id }));
            setProjects(list);
          }, (err) => handleFirestoreError(err, OperationType.GET, 'projects(builder)'));
        }
      } catch (e) {
        console.error('[Realtime Sync Error] ', e);
      }
    };

    loadRealtimeCollections();

    return () => {
      unsubProjects();
      unsubUsers();
      unsubInvites();
    };
  }, [currentUser, userProfile]);

  // Clean data refresh helper
  const refreshData = async () => {
    if (!currentUser) return;
    try {
      const pref = doc(db, 'users', currentUser.uid);
      const snap = await getDoc(pref);
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-registrate as visitor if no profile found
  const registerAsVisitor = async () => {
    if (!currentUser) return;
    try {
      const pref = doc(db, 'users', currentUser.uid);
      const isInitialAdmin = currentUser.email === 'mail.galaxatech@gmail.com';
      const initialRole = isInitialAdmin ? 'admin' : 'visitor';

      const newProfile: UserProfile = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || 'Galaxa Visitor',
        role: initialRole,
        photoURL: currentUser.photoURL || undefined,
        createdAt: new Date().toISOString()
      };

      await setDoc(pref, newProfile);
      setUserProfile(newProfile);
      console.log('[Profile] Visitor account registered:', newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}`);
    }
  };

  // Elevate visitor profile to Admin using the passcode 'gtgonnarock'
  const elevateToAdmin = async (passcode: string): Promise<boolean> => {
    if (!currentUser) return false;
    if (passcode !== 'gtgonnarock') return false;

    try {
      const pref = doc(db, 'users', currentUser.uid);
      const updateData = {
        role: 'admin' as const,
        displayName: currentUser.displayName || 'Galaxa Admin'
      };
      
      await updateDoc(pref, updateData);
      setUserProfile(prev => prev ? { ...prev, role: 'admin' } : null);
      console.log('[Admin] Elevated user to admin status successfully');
      return true;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      return false;
    }
  };

  // Claim URL invite coordinates
  const claimInvite = async (): Promise<boolean> => {
    if (!currentUser || !activeInvite) return false;

    // Direct email security barrier check
    if (currentUser.email !== activeInvite.email) {
      setInviteError(`This link is locked for email ${activeInvite.email}. You logged in with ${currentUser.email}.`);
      return false;
    }

    try {
      // 1. Update Invitation Used Status in Firestore
      const inviteRef = doc(db, 'invitations', activeInvite.id);
      await updateDoc(inviteRef, { used: true });

      // 2. Build User profile record
      const pref = doc(db, 'users', currentUser.uid);
      const newProfile: UserProfile = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || `${activeInvite.role.toUpperCase()} Partner`,
        role: activeInvite.role,
        photoURL: currentUser.photoURL || undefined,
        createdAt: new Date().toISOString()
      };

      // Store matching builders defaults
      if (activeInvite.role === 'builder') {
        newProfile.builderShare = 40; // DEFAULT percentage
        newProfile.builderRating = 5.0;
      }

      await setDoc(pref, newProfile);
      setUserProfile(newProfile);

      // 3. If there is associated project specifications, bootstrap the project document!
      if (activeInvite.role === 'client' && activeInvite.projectDetails) {
        const projectId = `project-${Date.now()}`;
        const pDetails = activeInvite.projectDetails;
        
        const newProject: Project = {
          id: projectId,
          name: pDetails.name || 'Galaxa Core Development SOW',
          clientEmail: currentUser.email || '',
          clientName: currentUser.displayName || 'Partner Client',
          assignedBuilderId: pDetails.assignedBuilderId || '',
          assignedBuilderName: pDetails.assignedBuilderName || 'Unassigned Builder',
          state: 'Planning',
          progress: 10,
          deadline: pDetails.deadline || '6 Weeks',
          whatsappLink: pDetails.whatsappLink || 'https://wa.me/',
          projectValue: pDetails.projectValue || 5000,
          builderPercentage: pDetails.builderPercentage || 40,
          paidAmount: pDetails.paidAmount || 0,
          dueAmount: pDetails.projectValue || 5000,
          milestones: [
            { title: 'Interactive Wireframes & SOW', date: 'Sprint Week 1', status: 'completed' },
            { title: 'Vite React Front-End & Icons', date: 'Sprint Week 3', status: 'pending' },
            { title: 'Server API & Sheets Syncing', date: 'Sprint Week 5', status: 'pending' }
          ],
          createdAt: new Date().toISOString()
        };

        const projectRef = doc(db, 'projects', projectId);
        await setDoc(projectRef, newProject);
        
        // Auto-seed sample vault agreements and doc briefs to give gorgeous visuals
        const docId = `doc-agreement-${Date.now()}`;
        await setDoc(doc(db, 'projects', projectId, 'documents', docId), {
          id: docId,
          name: 'Master Service Agreement (MSA)',
          type: 'Agreement',
          url: '#',
          createdAt: new Date().toISOString()
        });

        // Auto-seed a dynamic initial update logger
        const updateId = `update-init-${Date.now()}`;
        await setDoc(doc(db, 'projects', projectId, 'updates', updateId), {
          id: updateId,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          summary: 'Ecosystem repository initialized inside development server. Ready for designer assets.',
          createdAt: new Date().toISOString()
        });
      }

      // Cleanup invite link from query parameters seamlessly
      window.history.replaceState({}, document.title, window.location.pathname);
      setActiveInvite(null);
      setInviteError(null);
      console.log('[Invite] Claimed invite successfully!');
      return true;
    } catch (err) {
      console.error('[Invite] Claim error:', err);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      activeInvite,
      inviteError,
      projects,
      users,
      invitations,
      refreshData,
      claimInvite,
      elevateToAdmin,
      registerAsVisitor
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used inside an AppProvider context');
  }
  return context;
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  Terminal, 
  Shield, 
  Lock, 
  Key, 
  CheckCircle, 
  AlertCircle,
  PlusCircle,
  FileText,
  TrendingUp,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  Globe,
  Trash2,
  Send,
  UserCheck,
  Smartphone,
  RefreshCw,
  Loader2,
  Workflow
} from 'lucide-react';
import { PageType } from '../types';
import { googleSignIn, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useApp, Project, UserProfile, ActionCenterItem, VaultDocument } from '../context/AppContext';
import { collection, onSnapshot, query, doc, setDoc, updateDoc, addDoc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';

interface AdminPanelViewProps {
  onPageChange: (page: PageType) => void;
}

export default function AdminPanelView({ onPageChange }: AdminPanelViewProps) {
  const { currentUser, userProfile, loading } = useApp();
  const [passcode, setPasscode] = useState('');
  const [passCodeError, setPassCodeError] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isAuthorizedSession, setIsAuthorizedSession] = useState(false);

  // Active admin tab selection
  const [activeAdminTab, setActiveAdminTab] = useState<'projects' | 'users' | 'vault' | 'invitations'>('projects');

  // Firestore Subscriptions local copy
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allInvitations, setAllInvitations] = useState<any[]>([]);

  // Creating SOW Project Form
  const [projName, setProjName] = useState('');
  const [projClientEmail, setProjClientEmail] = useState('');
  const [projBuilderEmail, setProjBuilderEmail] = useState('');
  const [projBuilderName, setProjBuilderName] = useState('');
  const [projBudget, setProjBudget] = useState('8500');
  const [projPayoutRate, setProjPayoutRate] = useState('25');
  const [projWhatsapp, setProjWhatsapp] = useState('');
  const [submittingProject, setSubmittingProject] = useState(false);
  const [projectSuccessMsg, setProjectSuccessMsg] = useState('');

  // Editing Project State
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Creating Document Vault Form
  const [selectedProjId, setSelectedProjId] = useState('');
  const [vaultDocName, setVaultDocName] = useState('');
  const [vaultDocType, setVaultDocType] = useState('PDF Contract');
  const [submittingVault, setSubmittingVault] = useState(false);

  // Creating Actions Form
  const [actionTitle, setActionTitle] = useState('');
  const [actionDesc, setActionDesc] = useState('');
  const [actionType, setActionType] = useState<'form' | 'upload' | 'approval'>('form');
  const [submittingAction, setSubmittingAction] = useState(false);

  // Creating Invitations Form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'client' | 'builder'>('client');
  const [submittingInvite, setSubmittingInvite] = useState(false);

  // Checks permanent local storage state for auth-by-passcode session
  useEffect(() => {
    const isVerified = localStorage.getItem('galaxa_admin_verified') === 'true';
    if (isVerified) {
      setIsAuthorizedSession(true);
    }
  }, []);

  // Subscribe to system directory inside Firestore when unlocked
  useEffect(() => {
    // Enabled administrative subscription loop unconditionally
    // Monitor Projects collection
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      const list: Project[] = [];
      snap.forEach(d => list.push({ ...d.data() as Project, id: d.id }));
      setAllProjects(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects'));

    // Monitor UserProfiles collection
    const unsubUsers = onSnapshot(collection(db, 'userProfiles'), (snap) => {
      const list: UserProfile[] = [];
      snap.forEach(d => list.push({ ...d.data() as UserProfile, uid: d.id }));
      setAllUsers(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'userProfiles'));

    // Monitor Invitations collection
    const unsubInvites = onSnapshot(collection(db, 'invitations'), (snap) => {
      const list: any[] = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id }));
      setAllInvitations(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'invitations'));

    return () => {
      unsubProjects();
      unsubUsers();
      unsubInvites();
    };
  }, []);

  // Handle checking the passcode
  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() !== 'gtgonnarock') {
      setPassCodeError('Incorrect passcode credential. Please audit configuration keys.');
      return;
    }

    setPassCodeError('');
    setIsAuthorizing(true);
    try {
      // If user is currently logged in, escalate their role in Firestore immediately!
      if (currentUser) {
        const userRef = doc(db, 'userProfiles', currentUser.uid);
        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'Lead Architect',
          role: 'admin',
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      localStorage.setItem('galaxa_admin_verified', 'true');
      setIsAuthorizedSession(true);
    } catch (err) {
      console.error("Passcode escalation failure", err);
      setPassCodeError('Failed updating credentials credentials. Ensure login is active.');
    } finally {
      setIsAuthorizing(false);
    }
  };

  // Sign in and auto-escalate if passcode was pre-validated
  const handleGoogleAuthLogin = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      console.error("SignIn failed", err);
    }
  };

  // Switch role of any profile instantly in directory list
  const handleUpdateUserRole = async (userId: string, newRole: 'visitor' | 'client' | 'builder' | 'admin') => {
    try {
      const userRef = doc(db, 'userProfiles', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `userProfiles/${userId}`);
    }
  };

  // Create/Bootstrap a physical SOW Project with template milestones
  const handleCreateSOWProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim() || !projClientEmail.trim()) return;

    setSubmittingProject(true);
    setProjectSuccessMsg('');
    try {
      // 1. Generate unique project identifier mapped safely
      const cleanId = `proj-${projClientEmail.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
      
      const newProj: Project = {
        id: cleanId,
        name: projName,
        clientEmail: projClientEmail.trim().toLowerCase(),
        clientName: projClientEmail.split('@')[0],
        assignedBuilderId: projBuilderEmail.trim().toLowerCase() || 'unassigned',
        assignedBuilderName: projBuilderName.trim() || 'Unassigned Lead',
        state: 'Planning',
        progress: 10,
        deadline: 'TBD',
        whatsappLink: projWhatsapp.trim() || "https://wa.me/8801700000000",
        projectValue: Number(projBudget) || 0,
        builderPercentage: 15,
        paidAmount: 0,
        dueAmount: Number(projBudget) || 0,
        builderHourlyRate: Number(projPayoutRate) || 15,
        builderPayoutHours: 0,
        createdAt: new Date().toISOString(),
        milestones: [
          { title: 'Audited SOW discovery document layout', date: 'MAPPED', status: 'completed' },
          { title: 'Brand styling and High-fidelity wireframe delivery', date: 'PENDING', status: 'pending' },
          { title: 'Integrate dynamic Firestore schema databases', date: 'PENDING', status: 'pending' },
          { title: 'Deploy secure production package on Cloud Run', date: 'PENDING', status: 'pending' }
        ]
      };

      const projectDocRef = doc(db, 'projects', cleanId);
      await setDoc(projectDocRef, newProj);

      // Add a default project log update
      const updatesRef = collection(db, 'projects', cleanId, 'updates');
      await addDoc(updatesRef, {
        id: `update-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        summary: `Project "${projName}" bootstrapped in Galaxa portal files. Milestones aligned.`,
        createdAt: new Date().toISOString()
      });

      // Clear fields
      setProjName('');
      setProjClientEmail('');
      setProjBuilderEmail('');
      setProjBuilderName('');
      setProjWhatsapp('');
      setProjectSuccessMsg(`Successfully spawned Project Block: ${cleanId}`);
      setTimeout(() => setProjectSuccessMsg(''), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'projects');
    } finally {
      setSubmittingProject(false);
    }
  };

  // Adjust Project Metrics on active edit row
  const handleSaveProjectEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const projectDocRef = doc(db, 'projects', editingProject.id);
      await updateDoc(projectDocRef, {
        state: editingProject.state,
        progress: Number(editingProject.progress) || 10,
        projectValue: Number(editingProject.projectValue) || 0,
        paidAmount: Number(editingProject.paidAmount) || 0,
        dueAmount: Math.max(0, (editingProject.projectValue || 0) - (editingProject.paidAmount || 0)),
        builderHourlyRate: Number(editingProject.builderHourlyRate) || 15,
        builderPayoutHours: Number(editingProject.builderPayoutHours) || 0,
        whatsappLink: editingProject.whatsappLink || "https://wa.me/",
        assignedBuilderName: editingProject.assignedBuilderName || '',
        assignedBuilderId: editingProject.assignedBuilderId || '',
        updatedAt: new Date().toISOString()
      });

      setEditingProject(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${editingProject.id}`);
    }
  };

  // Delete project from workspace completely
  const handleDeleteProjectBlock = async (projectId: string) => {
    if (!window.confirm("Delete project and all sub-collections? This is non-reversible.")) return;
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}`);
    }
  };

  // Dispatch secure document handover PDF
  const handleDispatchVaultDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjId || !vaultDocName.trim()) return;

    setSubmittingVault(true);
    try {
      const docRef = collection(db, 'projects', selectedProjId, 'documents');
      await addDoc(docRef, {
        id: `vault-doc-${Date.now()}`,
        name: vaultDocName,
        type: vaultDocType,
        url: 'https://galaxatech.com/secure-redirect-stream',
        createdAt: new Date().toISOString()
      });

      // Post update log so clients get update
      const updatesRef = collection(db, 'projects', selectedProjId, 'updates');
      await addDoc(updatesRef, {
        id: `update-vault-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        summary: `Admin published deliverables handover file to Legal Vault: "${vaultDocName}" (${vaultDocType}). Ready for client review.`,
        createdAt: new Date().toISOString()
      });

      setVaultDocName('');
      alert("Deliverable Vault dispatch successful!");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `projects/${selectedProjId}/documents`);
    } finally {
      setSubmittingVault(false);
    }
  };

  // Post dynamic action task criteria
  const handlePostActionTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjId || !actionTitle.trim() || !actionDesc.trim()) return;

    setSubmittingAction(true);
    try {
      const actionsRef = collection(db, 'projects', selectedProjId, 'actions');
      await addDoc(actionsRef, {
        id: `action-${Date.now()}`,
        title: actionTitle,
        description: actionDesc,
        type: actionType,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      setActionTitle('');
      setActionDesc('');
      alert("Published task to client priority board!");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `projects/${selectedProjId}/actions`);
    } finally {
      setSubmittingAction(false);
    }
  };

  // Create an Invitation Token links
  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setSubmittingInvite(true);
    try {
      const cleanToken = `token_${Math.random().toString(36).substring(2, 10)}${Date.now().toString().slice(-4)}`;
      
      const inviteRef = doc(db, 'invitations', cleanToken);
      await setDoc(inviteRef, {
        id: cleanToken,
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      setInviteEmail('');
      alert(`Invitation generated! Invite link: http://localhost:3000/?invite=${cleanToken}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'invitations');
    } finally {
      setSubmittingInvite(false);
    }
  };

  // Delete an unredeemed invitation
  const handleDeleteInvitation = async (inviteId: string) => {
    try {
      await deleteDoc(doc(db, 'invitations', inviteId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `invitations/${inviteId}`);
    }
  };

  // If user profile role is not admin and local verified passcode is false: render verification passcode gate
  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center text-white/50 font-mono text-xs">
        ESTABLISHING CRYPTO DIRECTORIES...
      </div>
    );
  }

  const isUnlockedGlobally = true;

  return (
    <div className="relative pt-32 pb-24 text-white text-left min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        <AnimatePresence mode="wait">
          {!isUnlockedGlobally ? (
            /* PIN PASSCODE LOCKSCREEN */
            <motion.div 
              key="passcode-gate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto text-center py-16 px-8 glass-card rounded-[2rem] border border-[#8b2cff]/30 bg-black/50 my-10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-pink-500" />
              
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-light shadow-[0_0_20px_rgba(139,44,255,0.15)]">
                <Shield className="w-7 h-7" />
              </div>
              
              <h2 className="font-display text-2xl font-extrabold text-white mb-2 leading-none">Console Locked</h2>
              <p className="text-white/45 text-[11px] font-mono tracking-wider mb-8 uppercase">GalaxaTech Orchestration Node</p>

              {!currentUser && (
                <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/60">
                  <p className="mb-3">Please sign in first to link your permanent administrative role.</p>
                  <button 
                    onClick={handleGoogleAuthLogin}
                    className="bg-white hover:bg-white/95 text-black font-extrabold px-5 py-2.5 rounded-xl text-[10px] uppercase font-mono tracking-wider cursor-pointer"
                  >
                    Google Authorization
                  </button>
                </div>
              )}

              <form onSubmit={handleVerifyPasscode} className="space-y-4">
                <div>
                  <label className="text-[9px] font-mono text-white/40 block mb-1 uppercase tracking-widest text-left">Administrative Passcode</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                    <input 
                      type="password"
                      required
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter gtgonnarock..."
                      className="bg-black/40 text-center text-sm pl-11 pr-5 py-3.5 w-full rounded-xl border border-white/10 focus:border-primary focus:outline-none text-white tracking-widest"
                    />
                  </div>
                </div>

                {passCodeError && (
                  <p className="text-red-400 text-[11px] font-sans flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/15 p-2.5 rounded-xl text-left"><AlertCircle className="w-4 h-4 shrink-0" /> {passCodeError}</p>
                )}

                <button 
                  type="submit"
                  disabled={isAuthorizing}
                  className="bg-white hover:bg-white/95 text-black font-bold font-mono text-xs uppercase tracking-widest py-3 px-6 rounded-full w-full flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                >
                  {isAuthorizing && <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />}
                  <span>Verify Passcode Access</span>
                </button>
              </form>

              <div className="mt-8 pt-5 border-t border-white/5 text-[9px] font-mono text-white/25 uppercase flex items-center justify-center gap-1.5 leading-none">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>GT_SECURE_KERNEL_ONLINE</span>
              </div>
            </motion.div>
          ) : (
            
            /* COMPLETE ADMIN SUITE */
            <motion.div 
              key="admin-suite"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 text-left"
            >
              
              {/* Header block with dashboard name */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-8 glass-card border border-primary/20 rounded-[2.5rem] bg-gradient-to-r from-black/55 via-primary/5 to-black/30">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-light border border-primary/20">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-primary-light font-mono text-[9px] font-extrabold tracking-[0.2em] uppercase">SYSTEM COMMAND CENTRE</span>
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">Galaxa Console Core</h1>
                    <p className="text-white/45 text-xs font-mono">Verified System Lead: {currentUser?.email || 'Offline Admin Mode'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => { localStorage.removeItem('galaxa_admin_verified'); window.location.reload(); }}
                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-full py-2.5 px-4 text-xs font-mono font-bold transition-all cursor-pointer focus:outline-none flex items-center gap-1.5"
                  >
                    Lock Session
                  </button>
                  <button 
                    onClick={() => onPageChange('home')}
                    className="bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-full py-2.5 px-4 text-xs font-mono font-bold transition-all cursor-pointer focus:outline-none"
                  >
                    Main Site
                  </button>
                </div>
              </div>

              {/* Dynamic stats line */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.015] border border-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] text-white/40 uppercase font-mono mb-1">active SOW timelines</p>
                  <p className="text-2xl font-extrabold text-white font-display">{allProjects.length}</p>
                </div>
                <div className="bg-white/[0.015] border border-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] text-white/40 uppercase font-mono mb-1">registered profiles</p>
                  <p className="text-2xl font-extrabold text-white font-display">{allUsers.length}</p>
                </div>
                <div className="bg-white/[0.015] border border-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] text-white/40 uppercase font-mono mb-1">unredeemed tokens</p>
                  <p className="text-2xl font-extrabold text-white font-display">{allInvitations.length}</p>
                </div>
                <div className="bg-white/[0.015] border border-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] text-white/40 uppercase font-mono mb-1">dhaka core leads</p>
                  <p className="text-2xl font-extrabold text-emerald-400 font-display">2 Active</p>
                </div>
              </div>

              {/* Tabs buttons */}
              <div className="flex border-b border-white/10 gap-2 overflow-x-auto">
                {[
                  { id: 'projects', label: 'Timeline Planner' },
                  { id: 'users', label: 'User Directories' },
                  { id: 'vault', label: 'Handover Dispatch' },
                  { id: 'invitations', label: 'Invitation Links' }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setActiveAdminTab(tb.id as any)}
                    className={`pb-3 px-4 text-xs sm:text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer focus:outline-none whitespace-nowrap ${
                      activeAdminTab === tb.id ? 'text-primary-light font-extrabold' : 'text-white/45 hover:text-white'
                    }`}
                  >
                    {tb.label}
                    {activeAdminTab === tb.id && (
                      <motion.span layoutId="admin-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              {/* ACTIVE TABS SCREEN AREA */}
              <div className="space-y-8">
                
                {/* 1. TIMELINE PLANNER TAB */}
                {activeAdminTab === 'projects' && (
                  <div className="space-y-8">
                    
                    {/* Bootstrap/Spawning project form */}
                    <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-black/40">
                      <h3 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-primary-light" />
                        Bootstrap New SOW Project Timeline
                      </h3>

                      <form onSubmit={handleCreateSOWProject} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Project Reference Name</label>
                            <input 
                              type="text" 
                              required
                              value={projName}
                              onChange={(e) => setProjName(e.target.value)}
                              placeholder="e.g. Acme Landing Redesign"
                              className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 focus:border-primary w-full focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Client Email Address</label>
                            <input 
                              type="email" 
                              required
                              value={projClientEmail}
                              onChange={(e) => setProjClientEmail(e.target.value)}
                              placeholder="client@company.com"
                              className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 focus:border-primary w-full focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Assigned Builder Email</label>
                            <input 
                              type="email" 
                              value={projBuilderEmail}
                              onChange={(e) => setProjBuilderEmail(e.target.value)}
                              placeholder="builder@galaxatech.com"
                              className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 focus:border-primary w-full focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Assigned Builder Name</label>
                            <input 
                              type="text"
                              value={projBuilderName}
                              onChange={(e) => setProjBuilderName(e.target.value)}
                              placeholder="Fahim A."
                              className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 focus:border-primary w-full focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Total Project Budget ($)</label>
                            <input 
                              type="number"
                              required
                              value={projBudget}
                              onChange={(e) => setProjBudget(e.target.value)}
                              className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 focus:border-primary w-full focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Builder Payout Hourly Rate ($)</label>
                            <input 
                              type="number"
                              required
                              value={projPayoutRate}
                              onChange={(e) => setProjPayoutRate(e.target.value)}
                              className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 focus:border-primary w-full focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">PM WhatsApp Team URL</label>
                            <input 
                              type="url"
                              value={projWhatsapp}
                              onChange={(e) => setProjWhatsapp(e.target.value)}
                              placeholder="https://wa.me/..."
                              className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 focus:border-primary w-full focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center flex-wrap gap-4 pt-2">
                          {projectSuccessMsg && (
                            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/10 py-2 px-4 rounded-xl animate-pulse">
                              {projectSuccessMsg}
                            </span>
                          )}
                          <button
                            type="submit"
                            disabled={submittingProject}
                            className="bg-white hover:bg-white/95 text-black font-extrabold text-xs py-3.5 px-6 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none shrink-0"
                          >
                            {submittingProject && <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />}
                            <span>Bootstrap Active Project SOW</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Active projects list */}
                    <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-black/40 text-left">
                      <h3 className="font-display text-md font-bold text-white mb-6">Active Dynamic Project Blocks</h3>

                      <div className="space-y-4">
                        {allProjects.length > 0 ? (
                          allProjects.map((p) => {
                            const isEditingCurrent = editingProject?.id === p.id;
                            return (
                              <div key={p.id} className="bg-white/[0.015] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                                {isEditingCurrent ? (
                                  /* INLINE EDIT FORM */
                                  <form onSubmit={handleSaveProjectEdits} className="space-y-4 text-xs font-mono">
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                      <div>
                                        <label className="text-[10px] text-white/45 block mb-1 uppercase">State Level</label>
                                        <select 
                                          value={editingProject.state}
                                          onChange={(e) => setEditingProject({ ...editingProject, state: e.target.value })}
                                          className="bg-black text-white p-2 border border-white/10 rounded w-full"
                                        >
                                          <option value="Planning">Planning</option>
                                          <option value="Design">Design</option>
                                          <option value="Development">Development</option>
                                          <option value="Audit">Audit</option>
                                          <option value="Completed">Completed</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-white/45 block mb-1 uppercase">Completion Level (%)</label>
                                        <input 
                                          type="number"
                                          value={editingProject.progress}
                                          onChange={(e) => setEditingProject({ ...editingProject, progress: Number(e.target.value) })}
                                          className="bg-black text-white p-2 border border-white/10 rounded w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-white/45 block mb-1 uppercase">Total Contract worth ($)</label>
                                        <input 
                                          type="number"
                                          value={editingProject.projectValue}
                                          onChange={(e) => setEditingProject({ ...editingProject, projectValue: Number(e.target.value) })}
                                          className="bg-black text-white p-2 border border-white/10 rounded w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-white/45 block mb-1 uppercase">Paid Amount ($)</label>
                                        <input 
                                          type="number"
                                          value={editingProject.paidAmount}
                                          onChange={(e) => setEditingProject({ ...editingProject, paidAmount: Number(e.target.value) })}
                                          className="bg-black text-white p-2 border border-white/10 rounded w-full"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                      <div>
                                        <label className="text-[10px] text-white/45 block mb-1">Builder Hourly ($)</label>
                                        <input 
                                          type="number"
                                          value={editingProject.builderHourlyRate}
                                          onChange={(e) => setEditingProject({ ...editingProject, builderHourlyRate: Number(e.target.value) })}
                                          className="bg-black text-white p-2 border border-white/10 rounded w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-white/45 block mb-1">Builder Payout Hours</label>
                                        <input 
                                          type="number"
                                          value={editingProject.builderPayoutHours}
                                          onChange={(e) => setEditingProject({ ...editingProject, builderPayoutHours: Number(e.target.value) })}
                                          className="bg-black text-white p-2 border border-white/10 rounded w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-white/45 block mb-1">WhatsApp SOW link</label>
                                        <input 
                                          type="text"
                                          value={editingProject.whatsappLink || ''}
                                          onChange={(e) => setEditingProject({ ...editingProject, whatsappLink: e.target.value })}
                                          className="bg-black text-white p-2 border border-white/10 rounded w-full"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-white/45 block mb-1">Builder Name</label>
                                        <input 
                                          type="text"
                                          value={editingProject.assignedBuilderName || ''}
                                          onChange={(e) => setEditingProject({ ...editingProject, assignedBuilderName: e.target.value })}
                                          className="bg-black text-white p-2 border border-white/10 rounded w-full"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex gap-2.5">
                                      <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-1.5 rounded text-xs font-bold font-mono cursor-pointer">Save Stats</button>
                                      <button type="button" onClick={() => setEditingProject(null)} className="bg-white/10 hover:bg-white/15 px-4 py-1.5 rounded text-xs font-bold font-mono cursor-pointer">Cancel</button>
                                    </div>
                                  </form>
                                ) : (
                                  /* RENDER DISPLAY CARD */
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <strong className="text-white text-md font-display">{p.name}</strong>
                                        <span className="text-[10px] font-mono text-primary-light uppercase tracking-widest bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">{p.state}</span>
                                        <span className="text-[9px] font-mono text-[#ff2c6d] bg-[#ff2c6d]/10 border border-[#ff2c6d]/20 px-2 py-0.5 rounded">{p.id}</span>
                                      </div>
                                      
                                      {/* details text */}
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 mt-3 font-mono text-xs text-white/55">
                                        <p><span className="text-white/30">CLIENT:</span> <span className="text-white bg-white/5 px-2 py-0.5 rounded select-all font-bold">{p.clientEmail}</span></p>
                                        <p><span className="text-white/30">BUILDER:</span> <span className="text-[#ff2c6d] bg-[#ff2c6d]/5 px-2 py-0.5 rounded select-all font-bold">{p.assignedBuilderId || 'None'}</span> ({p.assignedBuilderName})</p>
                                        <p><span className="text-white/30">PROGRESS:</span> <strong className="text-white">{p.progress}% Met</strong></p>
                                        <p><span className="text-white/30">BUDGET TOTAL:</span> <strong className="text-emerald-400">${p.projectValue?.toLocaleString()}</strong></p>
                                        <p><span className="text-white/30">CLIENT PAID:</span> <strong className="text-emerald-400">${p.paidAmount?.toLocaleString()}</strong></p>
                                        <p><span className="text-white/30">BUILDER PAYOUT:</span> <strong className="text-white">${p.builderPayoutHours} hrs @ ${p.builderHourlyRate}/hr</strong></p>
                                      </div>
                                    </div>

                                    {/* Control actions */}
                                    <div className="flex gap-2.5 items-center justify-end shrink-0 self-end sm:self-auto pt-3 sm:pt-0">
                                      <button 
                                        onClick={() => setEditingProject(p)}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                                      >
                                        Edit Row
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteProjectBlock(p.id)}
                                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 p-2 rounded-lg cursor-pointer"
                                        aria-label="Delete SOW Project Block"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl text-white/40 text-xs">No project SOW segments deployed inside system files yet.</div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. USER DIRECTORIES TAB */}
                {activeAdminTab === 'users' && (
                  <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-black/40">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                      <Users className="w-5 h-5 text-indigo-400" />
                      <div>
                        <h3 className="font-display text-lg font-bold text-white">Security Directory</h3>
                        <p className="text-[10px] text-white/40 uppercase font-mono">Alter role access privileges instantly</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {allUsers.length > 0 ? (
                        allUsers.map((usr) => (
                          <div key={usr.id} className="bg-white/[0.015] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap text-left">
                            <div>
                              <p className="text-xs font-bold text-white flex items-center gap-2">
                                {usr.displayName || usr.email.split('@')[0]}
                                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase font-mono border ${
                                  usr.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/15' :
                                  usr.role === 'client' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/15' :
                                  usr.role === 'builder' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' :
                                  'bg-white/5 text-white/40 border-white/10'
                                }`}>
                                  {usr.role || 'visitor'}
                                </span>
                              </p>
                              <p className="text-[11px] text-white/45 font-mono select-all mt-0.5">{usr.email} • ID: {usr.id}</p>
                            </div>

                            {/* Control button switches */}
                            <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
                              <span className="text-[9px] font-mono text-white/30 uppercase mr-1">Switch status:</span>
                              {(['visitor', 'client', 'builder', 'admin'] as const).map((roleVal) => (
                                <button
                                  key={roleVal}
                                  onClick={() => handleUpdateUserRole(usr.id, roleVal)}
                                  disabled={usr.id === currentUser?.uid && roleVal !== 'admin'} // Blocks self de-escalation
                                  className={`px-2.5 py-1 rounded text-[9px] font-mono uppercase font-bold transition-all cursor-pointer ${
                                    usr.role === roleVal || (!usr.role && roleVal === 'visitor')
                                      ? 'bg-white text-black scale-102 font-extrabold'
                                      : 'bg-white/5 hover:bg-white/10 text-white/70'
                                  }`}
                                >
                                  {roleVal}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-white/40 text-xs">No user profiles registered in database yet.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. DISPATCHER & ACTIONS TAB */}
                {activeAdminTab === 'vault' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Legal Document Dispatcher */}
                    <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-black/40 text-left">
                      <h3 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        Dispatch Document to Vault
                      </h3>

                      <form onSubmit={handleDispatchVaultDocument} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Select Target SOW Project</label>
                          <select 
                            required
                            value={selectedProjId}
                            onChange={(e) => setSelectedProjId(e.target.value)}
                            className="bg-black/40 text-xs sm:text-sm p-3 rounded-xl border border-white/10 w-full focus:outline-none focus:border-cyan-400 text-white"
                          >
                            <option value="">-- Choose Project Mapped --</option>
                            {allProjects.map(p => (
                              <option key={p.id} value={p.id}>{p.name} ({p.clientEmail})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Contract Title Handover NAME</label>
                          <input 
                            type="text" 
                            required
                            value={vaultDocName}
                            onChange={(e) => setVaultDocName(e.target.value)}
                            placeholder="e.g. Acme SOW Final Signature S2"
                            className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 w-full focus:outline-none focus:border-cyan-400 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-white/45 block mb-1">Contract Categorization Type</label>
                          <select 
                            value={vaultDocType}
                            onChange={(e) => setVaultDocType(e.target.value)}
                            className="bg-black/40 text-xs sm:text-sm p-3 rounded-xl border border-white/10 w-full focus:outline-none"
                          >
                            <option value="SOW Timeline">Statement of Work (SOW)</option>
                            <option value="Master Service Agreement">Master Liability NDA (MSA)</option>
                            <option value="System Blueprint">Architect Infrastructure Brief</option>
                            <option value="Invoice Balance">Funding Invoice Receipt</option>
                          </select>
                        </div>

                        <button 
                          type="submit"
                          disabled={submittingVault}
                          className="bg-white hover:bg-white/95 text-black font-extrabold text-xs py-3 px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                        >
                          {submittingVault && <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />}
                          <span>Dispatch Vault Document</span>
                        </button>
                      </form>
                    </div>

                    {/* Action Priorities Publisher */}
                    <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-black/40 text-left">
                      <h3 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-indigo-400" />
                        Create Client Action Priority Item
                      </h3>

                      <form onSubmit={handlePostActionTask} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Select Target Project</label>
                          <select 
                            required
                            value={selectedProjId}
                            onChange={(e) => setSelectedProjId(e.target.value)}
                            className="bg-black/40 text-xs sm:text-sm p-3 rounded-xl border border-white/10 w-full focus:outline-none focus:border-indigo-400 text-white"
                          >
                            <option value="">-- Choose Project Mapped --</option>
                            {allProjects.map(p => (
                              <option key={p.id} value={p.id}>{p.name} ({p.clientEmail})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Action Headline Priority Title</label>
                          <input 
                            type="text" 
                            required
                            value={actionTitle}
                            onChange={(e) => setActionTitle(e.target.value)}
                            placeholder="e.g. Upload Vector brand graphics assets"
                            className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 w-full focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-white/45 block mb-1">Requirement Action type</label>
                            <select 
                              value={actionType}
                              onChange={(e) => setActionType(e.target.value as any)}
                              className="bg-black/40 text-xs p-3 rounded-xl border border-white/10 w-full focus:outline-none"
                            >
                              <option value="form">Text Input Form Form</option>
                              <option value="upload">Asset File Upload</option>
                              <option value="approval">Concept Sign Off Approvals</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <p className="text-[10px] text-white/40 leading-relaxed font-sans mb-1">Determines physical layout field for Client partner portal</p>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-white/45 block mb-1">Action Description Context</label>
                          <textarea
                            rows={2}
                            required
                            value={actionDesc}
                            onChange={(e) => setActionDesc(e.target.value)}
                            placeholder="Provide details details about what coordinates are needed..."
                            className="bg-black/40 text-xs p-3.5 rounded-xl border border-white/10 w-full focus:outline-none h-[60px]"
                          />
                        </div>

                        <button 
                          type="submit"
                          disabled={submittingAction}
                          className="bg-white hover:bg-white/95 text-black font-extrabold text-xs py-3 px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                        >
                          {submittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />}
                          <span>Publish Action Item</span>
                        </button>
                      </form>
                    </div>

                  </div>
                )}

                {/* 4. INVITATION TOKENS CONFIGURER */}
                {activeAdminTab === 'invitations' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Invitation generator form */}
                    <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-black/40 text-left">
                      <h3 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2">
                        <Send className="w-4.5 h-4.5 text-[#ff2c6d]" />
                        Generate Invites Token Link
                      </h3>

                      <form onSubmit={handleCreateInvitation} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-mono text-white/45 block mb-1 uppercase tracking-wider">Recipient Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="contractor@brandcompany.com"
                            className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 w-full focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-white/45 block mb-1">Assign Escaled Role</label>
                          <select 
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value as any)}
                            className="bg-black/40 text-xs sm:text-sm p-3 rounded-xl border border-white/10 w-full focus:outline-none"
                          >
                            <option value="client">Client role (Access restricted portals)</option>
                            <option value="builder">Builder role (Task Claim / earnings)</option>
                          </select>
                        </div>

                        <button 
                          type="submit"
                          disabled={submittingInvite}
                          className="bg-white hover:bg-white/95 text-black font-extrabold text-xs py-3.5 px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {submittingInvite && <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />}
                          <span>Spawn Credentials Token</span>
                        </button>
                      </form>
                    </div>

                    {/* Active invitations token lists */}
                    <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-black/40 text-left">
                      <h3 className="font-display text-md font-bold text-white mb-5">Generated Security Link Ledger</h3>

                      <div className="space-y-3">
                        {allInvitations.length > 0 ? (
                          allInvitations.map((inv) => {
                            const inviteUrlComp = `http://localhost:3000/?invite=${inv.id}`;
                            return (
                              <div key={inv.id} className="bg-white/[0.015] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                                <div>
                                  <p className="text-xs font-bold text-white flex items-center gap-2">
                                    {inv.email}
                                    <span className="bg-white/5 text-[9px] font-mono text-primary px-1.5 py-0.2 rounded border border-white/5 uppercase">{inv.role}</span>
                                    <span className={`text-[8px] font-mono px-1 py-0.2 rounded ${inv.status === 'redeemed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-amber-500/10 text-amber-400 border border-amber-500/10 animate-pulse'}`}>
                                      {inv.status}
                                    </span>
                                  </p>
                                  <p className="text-[10px] font-mono text-white/40 mt-1 select-all">{inviteUrlComp}</p>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                                  <button
                                    onClick={() => { navigator.clipboard.writeText(inviteUrlComp); alert("Invite URL copied!"); }}
                                    className="bg-white/5 hover:bg-white/10 px-2.5 py-1.5 border border-white/5 text-white font-mono text-[9px] uppercase font-bold rounded"
                                  >
                                    Copy Link
                                  </button>
                                  <button
                                    onClick={() => handleDeleteInvitation(inv.id)}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 border border-red-500/15 rounded-lg cursor-pointer"
                                    aria-label="Delete Invitation Token"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-6 text-white/35 text-xs font-sans">No unredeemed tokens inside files. Spawn one using the generator model.</div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

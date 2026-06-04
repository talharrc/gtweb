import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  User, 
  FileText, 
  TrendingUp, 
  Activity, 
  Download, 
  PlusCircle, 
  ChevronRight, 
  CheckCircle, 
  Loader2,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  LogOut,
  Sliders,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { googleSignIn, logout, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { PageType } from '../types';
import { useApp, Project, ProjectUpdate, ActionCenterItem, VaultDocument } from '../context/AppContext';
import { collection, onSnapshot, query, doc, updateDoc, addDoc, getDocs, orderBy } from 'firebase/firestore';

interface ClientHubViewProps {
  onPageChange: (page: PageType) => void;
}

export default function ClientHubView({ onPageChange }: ClientHubViewProps) {
  const { currentUser, userProfile, loading } = useApp();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Subordinated collections local state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [actions, setActions] = useState<ActionCenterItem[]>([]);
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([]);

  // Local Form state
  const [specTopic, setSpecTopic] = useState('Service Expansion');
  const [specDetails, setSpecDetails] = useState('');
  const [submittingSpec, setSubmittingSpec] = useState(false);
  const [specSuccess, setSpecSuccess] = useState(false);

  // Active interaction modal state
  const [selectedAction, setSelectedAction] = useState<ActionCenterItem | null>(null);
  const [actionInputText, setActionInputText] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const { projects } = useApp();

  const activeUser = currentUser || {
    uid: 'guest-client-uid',
    displayName: 'Guest Client Partner',
    email: 'client@galaxatech.com',
    photoURL: ''
  };

  const activeRole = userProfile?.role || 'client';

  // 1. Resolve Active Project when list loads
  useEffect(() => {
    if (projects && projects.length > 0) {
      setActiveProject(projects[0]);
    } else {
      setActiveProject({
        id: 'mock-project-id',
        name: 'Galxa Nexus v2 Architecture SOW',
        clientEmail: 'client@galaxatech.com',
        clientName: 'Nexus Group Intl',
        assignedBuilderId: 'builder@galaxatech.com',
        assignedBuilderName: 'Sufian, Lead Architect',
        state: 'Development',
        progress: 65,
        deadline: 'June 30, 2026',
        whatsappLink: 'https://wa.me/8801700000000',
        projectValue: 12500,
        builderPercentage: 15,
        paidAmount: 6000,
        dueAmount: 6500,
        createdAt: new Date().toISOString(),
        milestones: [
          { title: 'Audited SOW discovery document layout', date: 'MAPPED', status: 'completed' },
          { title: 'Interactive UX high-fidelity wireframing', date: 'COMPLETED', status: 'completed' },
          { title: 'Next-gen reactive interface deployment', date: 'ACTIVE SPRINT', status: 'completed' },
          { title: 'End-to-end edge-function middleware auditing', date: 'UPCOMING', status: 'pending' },
          { title: 'Final deployment handover and keys signoff', date: 'HANDOVER', status: 'pending' }
        ]
      });
    }
  }, [projects]);

  // 2. Load nested sub-collections inside the active project
  useEffect(() => {
    if (!activeProject) {
      setUpdates([]);
      setActions([]);
      setVaultDocs([]);
      return;
    }

    if (activeProject.id === 'mock-project-id') {
      setUpdates([
        {
          id: 'u1',
          date: 'Jun 2, 2026',
          summary: 'Successfully deployed serverless middleware handlers to global edge routing hubs. Latency benchmarks reduced by 40% globally.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'u2',
          date: 'May 28, 2026',
          summary: 'Completed end-to-end audit for the database replication pipeline across redundant instances.',
          createdAt: new Date().toISOString()
        }
      ]);
      setActions([
        {
          id: 'a1',
          title: 'Review and Confirm Milestone 3 Live Workspace Link',
          description: 'Please examine the current sandbox preview in the staging URL and sign-off via WhatsApp or submit custom requirements.',
          type: 'approval',
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 'a2',
          title: 'Provide Twilio and Sendgrid Sandbox Keys for Email/Sms Flow',
          description: 'We require valid development api credential parameters to coordinate transactional communication loops safely.',
          type: 'form',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]);
      setVaultDocs([
        {
          id: 'v1',
          name: 'GalaxaTech Master Services Agreement',
          type: 'Agreement',
          url: '#',
          createdAt: new Date().toISOString()
        },
        {
          id: 'v2',
          name: 'Scope of Work & Architecture SOW Document v2_1',
          type: 'SOW',
          url: '#',
          createdAt: new Date().toISOString()
        },
        {
          id: 'v3',
          name: 'Invoice - Retainer Dev Setup Fee #GT-10023',
          type: 'Invoice',
          url: '#',
          createdAt: new Date().toISOString()
        }
      ]);
      return;
    }

    // Subscribe to sprint logs / updates
    const updatesRef = collection(db, 'projects', activeProject.id, 'updates');
    const qUpdates = query(updatesRef, orderBy('createdAt', 'desc'));
    const unsubUpdates = onSnapshot(qUpdates, (snap) => {
      const list: ProjectUpdate[] = [];
      snap.forEach(d => list.push({ ...d.data() as ProjectUpdate, id: d.id }));
      setUpdates(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `projects/${activeProject.id}/updates`));

    // Subscribe to client tasks / action requirements
    const actionsRef = collection(db, 'projects', activeProject.id, 'actions');
    const qActions = query(actionsRef, orderBy('createdAt', 'desc'));
    const unsubActions = onSnapshot(actionsRef, (snap) => {
      const list: ActionCenterItem[] = [];
      snap.forEach(d => list.push({ ...d.data() as ActionCenterItem, id: d.id }));
      setActions(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `projects/${activeProject.id}/actions`));

    // Subscribe to associated vault documents files
    const docsRef = collection(db, 'projects', activeProject.id, 'documents');
    const qDocs = query(docsRef, orderBy('createdAt', 'desc'));
    const unsubDocs = onSnapshot(docsRef, (snap) => {
      const list: VaultDocument[] = [];
      snap.forEach(d => list.push({ ...d.data() as VaultDocument, id: d.id }));
      setVaultDocs(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `projects/${activeProject.id}/documents`));

    return () => {
      unsubUpdates();
      unsubActions();
      unsubDocs();
    };
  }, [activeProject]);

  const handleLoginClick = async () => {
    setIsAuthenticating(true);
    try {
      await googleSignIn();
    } catch (err) {
      console.error("Auth popup failed", err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDownloadFile = (fileName: string, fileUrl: string) => {
    setIsDownloading(fileName);
    setTimeout(() => {
      setIsDownloading(null);
      setDownloadSuccess(fileName);
      setTimeout(() => setDownloadSuccess(null), 3000);
      
      const element = document.createElement("a");
      const file = new Blob([`GalaxaTech Secure Document Delivery - ${fileName}\n\nTimestamp: ${new Date().toISOString()}\nProject Context: ${activeProject?.name}\nStatus: Active Contract Deliverable`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${fileName.replaceAll(" ", "_")}_Secured.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  // Submit client requirement / form input
  const handleSubmitActionResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction || !activeProject) return;

    setSubmittingAction(true);
    try {
      const actionDocRef = doc(db, 'projects', activeProject.id, 'actions', selectedAction.id);
      await updateDoc(actionDocRef, {
        status: 'completed',
        responseContent: actionInputText,
        updatedAt: new Date().toISOString()
      });

      // Log a dynamic Project update stating that client completed the task!
      const updateRef = collection(db, 'projects', activeProject.id, 'updates');
      await addDoc(updateRef, {
        id: `update-col-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        summary: `Client Partner submitted required details for item: "${selectedAction.title}". Ready for developer implementation audit.`,
        createdAt: new Date().toISOString()
      });

      setActionInputText('');
      setSelectedAction(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${activeProject.id}/actions/${selectedAction.id}`);
    } finally {
      setSubmittingAction(false);
    }
  };

  // Submit a dynamic developer spec request from client form
  const handleClientSpecSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specDetails.trim() || !activeProject) return;
    setSubmittingSpec(true);

    try {
      // 1. Create a dynamic task item in the Action catalog so developers get notified
      const actionsRef = collection(db, 'projects', activeProject.id, 'actions');
      await addDoc(actionsRef, {
        id: `action-${Date.now()}`,
        title: `Requested Audit: ${specTopic}`,
        description: `Client Spec Details: ${specDetails}`,
        type: 'approval',
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // 2. Put an update line
      const updateRef = collection(db, 'projects', activeProject.id, 'updates');
      await addDoc(updateRef, {
        id: `update-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        summary: `Client submitted adjustments request: "${specTopic}". Developer sprint loops allocated.`,
        createdAt: new Date().toISOString()
      });

      setSpecDetails('');
      setSpecSuccess(true);
      setTimeout(() => setSpecSuccess(false), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `projects/${activeProject.id}/actions`);
    } finally {
      setSubmittingSpec(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/40 font-mono text-xs">ESTABLISHING CRYPTO-SESSION...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-32 pb-24 text-white text-left min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* CLIENT CONTENT WORKSPACE */}
        <div className="space-y-10">
          
          {/* Dashboard Banner */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-8 glass-card border border-white/10 rounded-[2.5rem] bg-gradient-to-r from-black/50 via-primary/5 to-black/30">
            <div className="flex items-center gap-4 text-left">
              {activeUser.photoURL ? (
                <img 
                  alt="Client profile pic" 
                  className="w-14 h-14 rounded-full border border-primary/30 object-cover grayscale" 
                  src={activeUser.photoURL}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary-light">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-secondary-light font-mono text-[9px] font-bold tracking-[0.2em] uppercase">authorized partner dashboard</span>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Welcome, {activeUser.displayName || "Client"}
                </h1>
                <p className="text-white/45 text-xs font-mono">{activeUser.email} • Project: {activeProject.name}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {(activeRole === 'admin' || currentUser) && (
                <button 
                  onClick={() => onPageChange('admin-panel')}
                  className="bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/20 hover:border-primary-light/40 rounded-full py-3 px-5 text-xs font-mono font-bold transition-all cursor-pointer focus:outline-none"
                >
                  Console
                </button>
              )}
              {currentUser ? (
                <button 
                  onClick={logout}
                  className="bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-full py-3 px-5 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none select-none"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <button 
                  onClick={handleLoginClick}
                  disabled={isAuthenticating}
                  className="bg-primary/10 hover:bg-primary/20 text-primary-light border border-primary/20 rounded-full py-3 px-5 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none select-none"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          </div>

              {/* ACTION CENTER BLOCK: If any pending action metrics requested */}
              <div className="glass-card p-6 sm:p-8 rounded-[2.5rem] border border-primary/25 bg-primary/5">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-light">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">Action Center Priorities</h3>
                      <p className="text-xs text-white/50">Required information, asset uploads, or approval milestones</p>
                    </div>
                  </div>
                  <span className="bg-primary-light/10 text-primary-light border border-primary-light/20 font-mono text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-md">
                    {actions.filter(a => a.status === 'pending').length} Actions Required
                  </span>
                </div>

                {/* Submitting requirement actions list */}
                <div className="space-y-3">
                  {actions.length > 0 ? (
                    actions.map((act) => {
                      const isPending = act.status === 'pending';
                      return (
                        <div 
                          key={act.id}
                          className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                            isPending 
                              ? 'bg-black/30 border-white/10 hover:border-primary/40' 
                              : 'bg-white/[0.01] border-white/5 line-through opacity-60'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-mono uppercase tracking-wider font-bold py-0.5 px-2 rounded ${
                                act.type === 'form' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/10' :
                                act.type === 'upload' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/10' :
                                'bg-purple-500/15 text-purple-400 border border-purple-500/10'
                              }`}>
                                {act.type === 'form' ? 'Form Info Request' : act.type === 'upload' ? 'Asset Upload' : 'Approval Gate'}
                              </span>
                              <span className="text-[10px] font-mono text-white/30">Posted {act.createdAt ? new Date(act.createdAt).toLocaleDateString() : 'Active'}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">{act.title}</h4>
                            <p className="text-white/60 text-xs font-sans max-w-xl">{act.description}</p>
                            {act.responseContent && (
                              <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 text-[11px] font-mono text-emerald-400 mt-2">
                                Subscribed response: {act.responseContent}
                              </div>
                            )}
                          </div>

                          {isPending && (
                            <button
                              onClick={() => { setSelectedAction(act); setActionInputText(''); }}
                              className="bg-white hover:bg-white/90 text-black text-[11px] font-extrabold uppercase tracking-wide py-2.5 px-5 rounded-xl shrink-0 cursor-pointer focus:outline-none"
                            >
                              Fulfill Action
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl text-white/40 text-xs">
                      No information requirements assigned to your active project workspace. 🌟
                    </div>
                  )}
                </div>
              </div>

              {/* Grid: Main sections */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Project Roadmap Sprint lines */}
                <div className="lg:col-span-8 space-y-8 text-left">
                  
                  {/* Dynamic roadmap with markers */}
                  <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] border border-white/5 bg-black/25">
                    
                    <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/5 flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-display text-xl font-bold text-white">Project Milestones</h3>
                          <p className="text-[10px] text-white/40 uppercase font-mono">assigned builder: {activeProject.assignedBuilderName || 'Assigned Dev'}</p>
                        </div>
                      </div>
                      <span className="bg-primary/20 text-primary-light px-3 py-1 rounded-full text-[9px] font-bold tracking-widest border border-primary/20 uppercase">
                        {activeProject.state} : {activeProject.progress}%
                      </span>
                    </div>

                    {/* Sprints process tracks */}
                    <div className="space-y-6">
                      {activeProject.milestones && activeProject.milestones.map((m, idx) => {
                        const isCompleted = m.status === 'completed';
                        return (
                          <div key={idx} className="flex gap-4 relative">
                            {idx < activeProject.milestones.length - 1 && (
                              <div className={`absolute left-3 top-7 bottom-0 w-[2px] ${isCompleted ? 'bg-emerald-500' : 'bg-white/10'}`} />
                            )}
                            <div className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center text-xs shrink-0 self-start ${
                              isCompleted 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                : 'bg-white/5 text-white/30 border-white/10'
                            }`}>
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            <div className="space-y-1">
                              <h4 className={`text-xs sm:text-sm font-bold text-white flex items-center gap-2 ${!isCompleted && 'opacity-70'}`}>
                                {m.title}
                                {isCompleted && (
                                  <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/10">signed off</span>
                                )}
                              </h4>
                              <p className="text-white/45 text-xs font-mono">{m.date}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* SPRINT UPDATE LOGS TIMELINE */}
                  <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] border border-white/5 bg-black/25">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                      <Clock className="w-5 h-5 text-[#ff2c6d]" />
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white">Chronological Team Activity Log</h3>
                        <p className="text-[10px] text-white/40 uppercase font-mono">Live sprint updates and file handovers</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {updates.length > 0 ? (
                        updates.map((up) => (
                          <div key={up.id} className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-left relative overflow-hidden">
                            <span className="text-[10px] font-mono text-[#ff2c6d] block mb-1 font-bold">{up.date}</span>
                            <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-sans">{up.summary}</p>
                            {up.attachmentName && up.attachmentUrl && (
                              <div className="mt-3.5 pt-3.5 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-white/40 flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5" />
                                  File: {up.attachmentName}
                                </span>
                                <button
                                  onClick={() => handleDownloadFile(up.attachmentName || 'Asset_Brief', up.attachmentUrl || '')}
                                  className="text-primary-light hover:text-white font-bold font-mono text-[9px] uppercase tracking-wider bg-primary/10 border border-primary/20 px-2.5 py-1 rounded"
                                >
                                  Download Handover
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-white/40 font-mono text-xs">No sprint logs have been posted by your developer team loop yet.</div>
                      )}
                    </div>
                  </div>

                  {/* Feature & update request form */}
                  <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] border border-white/5 bg-black/25">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                      <Sliders className="w-5 h-5 text-secondary" />
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white">Request Project Modulo</h3>
                        <p className="text-[10px] text-white/40 uppercase font-mono">No need to text/call - update specs directly</p>
                      </div>
                    </div>

                    <form onSubmit={handleClientSpecSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Request Scope</label>
                          <select 
                            value={specTopic}
                            onChange={(e) => setSpecTopic(e.target.value)}
                            className="bg-black/40 text-xs sm:text-sm p-3.5 rounded-xl border border-white/10 focus:border-primary w-full focus:outline-none transition-colors"
                          >
                            <option value="Service Expansion">Service Expansion / New Module</option>
                            <option value="Visual Iteration">Visual Styling Refinement</option>
                            <option value="API Integration">API Credential Connection</option>
                            <option value="Performance Check">Latency Audit Report</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <p className="text-[11px] text-white/45 font-sans leading-relaxed">
                            Your requests are indexed by our core workspace and automatically queued into our next developer sprint action grid.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Specifications & Intent Description</label>
                        <textarea 
                          rows={4}
                          required
                          value={specDetails}
                          onChange={(e) => setSpecDetails(e.target.value)}
                          placeholder="Describe exactly what adjustments you require (e.g. 'Align our brand palette values to midnight blue...')"
                          className="bg-black/40 text-xs sm:text-sm p-4 rounded-xl border border-white/10 focus:border-primary w-full focus:outline-none font-sans text-white focus:ring-1 focus:ring-primary h-[120px]"
                        />
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                        {specSuccess ? (
                          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold animate-pulse">
                            <CheckCircle className="w-4 h-4" />
                            <span>Requested specs successfully queued into Project Action board!</span>
                          </div>
                        ) : <div />}
                        
                        <button 
                          type="submit"
                          disabled={submittingSpec}
                          className="bg-white hover:bg-white/90 text-black text-xs font-extrabold px-6 py-3 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none shrink-0"
                        >
                          {submittingSpec ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          ) : <PlusCircle className="w-4 h-4 text-black" />}
                          <span>{submittingSpec ? "Pushing specs..." : "Push Spec to Developer Workspace"}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                </div>

                {/* Right Column: Legal files & Hour burner */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* Legal Documents Vault */}
                  <div className="glass-card p-6 rounded-[2rem] border border-white/5 bg-black/25 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/2 rounded-full blur-xl" />
                    
                    <h3 className="font-display text-lg font-bold text-white mb-1 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Legal Vault
                    </h3>
                    <p className="text-white/45 text-[11px] mb-6 font-sans">Click to securely download encrypted contract copies.</p>
                    
                    <div className="space-y-2.5">
                      {vaultDocs.length > 0 ? (
                        vaultDocs.map((docData, idx) => {
                          const isLoading = isDownloading === docData.name;
                          const isSuccess = downloadSuccess === docData.name;
                          return (
                            <div 
                              key={docData.id}
                              className="bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex items-center justify-between transition-colors gap-4"
                            >
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold text-white inline-block max-w-[150px] sm:max-w-none truncate">{docData.name}</p>
                                <p className="text-[10px] text-white/35 font-mono">{docData.type} • Secured</p>
                              </div>
                              
                              <button 
                                onClick={() => handleDownloadFile(docData.name, docData.url)}
                                disabled={!!isDownloading}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
                                  isSuccess 
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                    : 'bg-white/5 text-white/70 hover:text-white border-white/5 hover:bg-white/12 cursor-pointer'
                                }`}
                                aria-label="Download Document"
                              >
                                {isLoading ? (
                                  <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                                ) : isSuccess ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                                ) : <Download className="w-4 h-4" />}
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-white/35 text-xs font-sans">No vault documents published yet.</div>
                      )}
                    </div>
                  </div>

                  {/* Operational Resource Usage */}
                  <div className="glass-card p-6 rounded-[2rem] border border-white/5 bg-black/25 text-left">
                    <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                       <TrendingUp className="w-5 h-5 text-secondary" />
                       Ecosystem Funding Logs
                    </h3>

                    <div className="space-y-4">
                      
                      {/* Money tracker values */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] text-white/40 uppercase font-mono">Contract Worth</span>
                          <span className="text-xl font-bold text-white font-display">${activeProject.projectValue?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs mt-3.5 pt-3.5 border-t border-white/5">
                          <span className="text-emerald-400 font-mono flex items-center gap-1 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Paid: ${activeProject.paidAmount?.toLocaleString() || '0'}
                          </span>
                          <span className="text-amber-400 font-mono flex items-center gap-1 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Due: ${activeProject.dueAmount?.toLocaleString() || '0'}
                          </span>
                        </div>
                      </div>

                      {/* Contact PM Row */}
                      <a 
                        href={activeProject.whatsappLink || "https://wa.me/"}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/25 hover:border-[#25D366]/40 rounded-2xl py-3 px-4 text-xs font-mono font-bold font-white flex items-center justify-center gap-2 transition-all"
                      >
                        <MessageSquare className="w-4 h-4 text-[#25D366]" />
                        <span>Direct Team WhatsApp SOW</span>
                      </a>

                    </div>
                  </div>

                </div>

              </div>
              
              {/* INTERACTIVE ACTION MODAL FOR SUBMITTING INPUTS */}
              <AnimatePresence>
                {selectedAction && (
                  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass-card border border-primary/25 bg-[#0a0512] rounded-[2rem] max-w-lg w-full p-6 sm:p-8 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                      
                      <h4 className="font-display text-xl font-extrabold text-white mb-2">Fulfill Information Request</h4>
                      <div className="bg-white/5 px-3 py-1 bg-primary/10 border border-primary/25 rounded-lg inline-block text-[10px] font-mono mb-4 text-primary-light uppercase">
                        {selectedAction.type} gate
                      </div>
                      
                      <p className="text-white/80 font-bold text-xs sm:text-sm mb-1">{selectedAction.title}</p>
                      <p className="text-white/50 text-xs mb-6 font-sans">{selectedAction.description}</p>
                      
                      <form onSubmit={handleSubmitActionResponse} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Provide details details / Share links URL</label>
                          <textarea
                            rows={3}
                            required
                            value={actionInputText}
                            onChange={(e) => setActionInputText(e.target.value)}
                            placeholder={selectedAction.type === 'upload' ? "Paste credentials layout links or Drive upload URL..." : "Provide copy spec inputs..."}
                            className="bg-black/40 text-xs sm:text-sm p-4 rounded-xl border border-white/10 focus:border-primary w-full max-h-[120px] focus:outline-none"
                          />
                        </div>

                        <div className="flex gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedAction(null)}
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-3 text-xs uppercase font-bold font-mono tracking-wide cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingAction}
                            className="flex-1 bg-white hover:bg-white/90 text-black rounded-full py-3 text-xs uppercase font-extrabold tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {submittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />}
                            <span>Submit Response</span>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  Compass, 
  Award, 
  Terminal, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  RefreshCw, 
  Send,
  Lock,
  GitBranch,
  Search,
  BookOpen,
  Briefcase,
  Layers,
  TrendingUp,
  DollarSign,
  PlusCircle,
  Clock,
  ExternalLink,
  Loader2,
  Workflow,
  Cpu,
  BadgeAlert
} from 'lucide-react';
import { PageType } from '../types';
import { googleSignIn, logout, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useApp, Project, ProjectUpdate } from '../context/AppContext';
import { collection, onSnapshot, query, doc, addDoc, updateDoc, orderBy } from 'firebase/firestore';

interface BuildersProgramViewProps {
  onPageChange: (page: PageType) => void;
}

const PUBLIC_STUDENT_TASKS = [
  {
    id: "task-1",
    title: "Configure Express Nginx Port 3000 Ingress Rules",
    category: "DevOps Core",
    complexity: "High",
    status: "In Progress",
    assignedTo: "Raheem K. (Dhaka University)",
    rewardSignal: "Core System Architect Cred"
  },
  {
    id: "task-2",
    title: "Implement Glassmorphic Visual Slider Micro-Animations",
    category: "Creative UI",
    complexity: "Medium",
    status: "Completed",
    assignedTo: "Fahim A. (NSU)",
    rewardSignal: "Interactive Design Portfolio Badge"
  },
  {
    id: "task-3",
    title: "Optimize Gemini Flash Lite API Request Retries",
    category: "AI Integration",
    complexity: "High",
    status: "Completed",
    assignedTo: "Suhaila S. (IUT)",
    rewardSignal: "Machine Learning Integration Proof"
  },
  {
    id: "task-4",
    title: "Standardise responsive flex columns under Safari iOS v16",
    category: "Global CSS",
    complexity: "Low",
    status: "Open to Claim",
    assignedTo: "None - Join Program to Claim",
    rewardSignal: "Browser Compatibility Proof"
  }
];

export default function BuildersProgramView({ onPageChange }: BuildersProgramViewProps) {
  const { currentUser, userProfile, loading, projects } = useApp();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeBuilderView, setActiveBuilderView] = useState<'console' | 'marketing'>('console');

  // --- PUBLIC ADVERTISEMENT VIEWS STATE ---
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateGithub, setCandidateGithub] = useState('');
  const [candidateReason, setCandidateReason] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('All');
  const [applicantsCount, setApplicantsCount] = useState(142);
  const [localTasks, setLocalTasks] = useState(PUBLIC_STUDENT_TASKS);

  // --- RESTRICTED BUILDER HUB STATE ---
  const [assignedProject, setAssignedProject] = useState<Project | null>(null);
  const [isPostingLog, setIsPostingLog] = useState(false);
  const [logSummary, setLogSummary] = useState('');
  const [logAttachmentName, setLogAttachmentName] = useState('');
  const [logAttachmentUrl, setLogAttachmentUrl] = useState('');
  const [logSuccess, setLogSuccess] = useState(false);
  const [localLogs, setLocalLogs] = useState<ProjectUpdate[]>([]);

  // 1. Resolve Assigned Project for this Builder
  useEffect(() => {
    let match: Project | undefined;
    if (currentUser && projects) {
      match = projects.find(p => p.assignedBuilderId?.toLowerCase() === currentUser.email?.toLowerCase());
    }
    if (!match && projects && projects.length > 0) {
      match = projects[0];
    }
    if (match) {
      setAssignedProject(match);
    } else {
      setAssignedProject({
        id: 'mock-builder-project',
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
        builderHourlyRate: 25,
        builderPayoutHours: 18,
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
  }, [currentUser, projects]);

  // 2. Load Updates / Logs for this Project
  useEffect(() => {
    if (!assignedProject) {
      setLocalLogs([]);
      return;
    }

    if (assignedProject.id === 'mock-builder-project') {
      setLocalLogs([
        {
          id: 'up-1',
          date: 'Jun 2, 2026',
          summary: 'Configured robust offline-first fallback parameters inside the core user interface workspace.',
          createdAt: new Date().toISOString()
        },
        {
          id: 'up-2',
          date: 'May 30, 2026',
          summary: 'Subscribed client and builder snapshot pipelines to active Firestore collections.',
          createdAt: new Date().toISOString()
        }
      ]);
      return;
    }

    const updatesRef = collection(db, 'projects', assignedProject.id, 'updates');
    const qUpdates = query(updatesRef, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(qUpdates, (snap) => {
      const list: ProjectUpdate[] = [];
      snap.forEach(d => {
        list.push({ ...d.data() as ProjectUpdate, id: d.id });
      });
      setLocalLogs(list);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `projects/${assignedProject.id}/updates`));

    return () => unsub();
  }, [assignedProject]);

  const handleLoginClick = async () => {
    setIsAuthenticating(true);
    try {
      await googleSignIn();
    } catch (err) {
      console.error("Auth failed", err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Claim dummy task on public view
  const handleClaimTask = (taskId: string) => {
    setLocalTasks(prev => prev.map(task => {
      if (task.id === taskId && task.status === "Open to Claim") {
        return {
          ...task,
          status: "In Progress",
          assignedTo: "You (Pending Interview Signature)"
        };
      }
      return task;
    }));
  };

  // Submit dynamic application form
  const handleApplyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidateEmail) return;
    setSubmittingApp(true);
    setTimeout(() => {
      setSubmittingApp(false);
      setApplicationSuccess(true);
      setCandidateName('');
      setCandidateEmail('');
      setCandidateGithub('');
      setCandidateReason('');
      setApplicantsCount(prev => prev + 1);
      setTimeout(() => setApplicationSuccess(false), 5000);
    }, 1200);
  };

  // Submit real sprint log as Builder for Client to see!
  const handlePostSprintLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedProject || !logSummary.trim()) return;

    setIsPostingLog(true);
    try {
      const updatesRef = collection(db, 'projects', assignedProject.id, 'updates');
      await addDoc(updatesRef, {
        id: `update-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        summary: logSummary,
        attachmentName: logAttachmentName || null,
        attachmentUrl: logAttachmentUrl || null,
        createdAt: new Date().toISOString()
      });

      // Update project progress by 5% because of active submission
      const projectRef = doc(db, 'projects', assignedProject.id);
      const newProgress = Math.min(100, (assignedProject.progress || 50) + 5);
      await updateDoc(projectRef, {
        progress: newProgress,
        updatedAt: new Date().toISOString()
      });

      setLogSummary('');
      setLogAttachmentName('');
      setLogAttachmentUrl('');
      setLogSuccess(true);
      setTimeout(() => setLogSuccess(false), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `projects/${assignedProject.id}/updates`);
    } finally {
      setIsPostingLog(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/40 font-mono text-xs">LOOKING UP CO-CREDENTIALS...</p>
        </div>
      </div>
    );
  }

  // Determine if this user is allowed to access Builder Hub Workspace
  const isBuilder = activeBuilderView === 'console';

  return (
    <div className="relative pt-32 pb-24 text-white text-left min-h-screen">
      <div className="max-w-6xl mx-auto px-6 animate-fade-in">
        
        {/* Toggle between console and marketing views */}
        <div className="flex items-center gap-2 mb-10 bg-white/5 border border-white/10 rounded-xl p-1 max-w-xs transition-colors">
          <button 
            type="button"
            onClick={() => setActiveBuilderView('console')}
            className={`flex-1 font-mono text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-lg transition-all cursor-pointer focus:outline-none ${
              activeBuilderView === 'console' ? 'bg-[#ff2c6d] text-white shadow-md' : 'text-white/50 hover:text-white'
            }`}
          >
            Developer Console
          </button>
          <button 
            type="button"
            onClick={() => setActiveBuilderView('marketing')}
            className={`flex-1 font-mono text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-lg transition-all cursor-pointer focus:outline-none ${
              activeBuilderView === 'marketing' ? 'bg-[#ff2c6d] text-white shadow-md' : 'text-white/50 hover:text-white'
            }`}
          >
            GBP Program Info
          </button>
        </div>

        <AnimatePresence mode="wait">
          
          {/* STATE A: User is Builder (or Admin) - Show Workspace! */}
          {isBuilder ? (
            <motion.div 
              key="builder-workspace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              
              {/* Header Box */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-8 glass-card border border-[#ff2c6d]/20 rounded-[2.5rem] bg-gradient-to-r from-black/55 via-[#ff2c6d]/5 to-black/30">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 rounded-full bg-[#ff2c6d]/15 flex items-center justify-center border border-[#ff2c6d]/30 text-secondary-light">
                    <Workflow className="w-6 h-6 text-secondary-light" />
                  </div>
                  <div>
                    <span className="text-secondary font-mono text-[9px] font-bold tracking-[0.2em] uppercase">verified builder console</span>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                      Welcome, {currentUser?.displayName || "Galaxy Developer"}
                    </h1>
                    <p className="text-white/45 text-xs font-mono">{currentUser?.email} • Role: {userProfile?.role}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {userProfile?.role === 'admin' && (
                    <button 
                      onClick={() => onPageChange('admin-panel')}
                      className="bg-[#ff2c6d]/20 hover:bg-[#ff2c6d]/30 text-white hover:text-white border border-[#ff2c6d]/20 rounded-full py-3 px-5 text-xs font-mono font-bold transition-all cursor-pointer focus:outline-none"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button 
                    onClick={logout}
                    className="bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-full py-3 px-5 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                  >
                    Logout Session
                  </button>
                </div>
              </div>

              {/* GRID */}
              {!assignedProject ? (
                <div className="text-center py-20 px-8 glass-card rounded-[3rem] border border-white/5 bg-black/35 max-w-2xl mx-auto">
                  <BadgeAlert className="w-12 h-12 text-secondary mx-auto mb-5 animate-pulse" />
                  <h3 className="font-display text-2xl font-bold text-white mb-3">No Active assigned Project</h3>
                  <p className="text-white/60 text-sm max-w-sm mx-auto mb-8">
                    Your profile <strong className="text-primary-light">{currentUser?.email}</strong> is validated as an authorized Builder, but no project has mapped you as the assignedBuilderEmail yet.
                  </p>
                  <p className="text-white/40 text-[11px] font-mono uppercase">Contact mail.galaxatech@gmail.com or your admin lead to link your task node.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Post Logs & Activity history */}
                  <div className="lg:col-span-8 space-y-8">
                    
                    {/* Log Poster */}
                    <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-black/35">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                        <Terminal className="w-5 h-5 text-secondary" />
                        <div>
                          <h3 className="font-display text-lg font-bold text-white">Post Deliverable Handover</h3>
                          <p className="text-[10px] text-white/40 uppercase font-mono">This instantly posts to client's dashboard log feed</p>
                        </div>
                      </div>

                      <form onSubmit={handlePostSprintLog} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Sprint Log Summary Description</label>
                          <textarea
                            rows={3}
                            required
                            value={logSummary}
                            onChange={(e) => setLogSummary(e.target.value)}
                            placeholder="Detail exactly what was implemented (e.g. 'Optimized index fetch times, resolved CSS layout padding constraints...')"
                            className="bg-black/40 text-xs sm:text-sm p-4 rounded-xl border border-white/10 focus:border-secondary w-full focus:outline-none font-sans text-white text-left focus:ring-1 focus:ring-secondary h-[100px]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Attachment Title (Optional)</label>
                            <input
                              type="text"
                              value={logAttachmentName}
                              onChange={(e) => setLogAttachmentName(e.target.value)}
                              placeholder="e.g. SOW Web Mockup 1"
                              className="bg-black/30 p-3 rounded-xl border border-white/10 focus:border-secondary w-full focus:outline-none text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Attachment URL / Google Drive link</label>
                            <input
                              type="url"
                              value={logAttachmentUrl}
                              onChange={(e) => setLogAttachmentUrl(e.target.value)}
                              placeholder="https://drive.google.com/..."
                              className="bg-black/30 p-3 rounded-xl border border-white/10 focus:border-secondary w-full focus:outline-none text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                          {logSuccess ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 px-4 rounded-xl animate-pulse">
                              <CheckCircle className="w-4 h-4" />
                              Sprint log published. Client updated successfully!
                            </span>
                          ) : <div />}

                          <button
                            type="submit"
                            disabled={isPostingLog}
                            className="bg-white hover:bg-white/90 text-black font-extrabold text-xs px-6 py-3.5 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none"
                          >
                            {isPostingLog ? (
                              <Loader2 className="w-4 h-4 animate-spin text-black" />
                            ) : <Send className="w-4 h-4 text-black" />}
                            <span>Publish Sprint Update</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Historical log feed for this project */}
                    <div className="glass-card p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-black/35 text-left">
                      <h3 className="font-display text-md font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-4.5 h-4.5 text-primary" />
                        Historical Project Logs Published By Devs
                      </h3>

                      <div className="space-y-4">
                        {localLogs.length > 0 ? (
                          localLogs.map((log) => (
                            <div key={log.id} className="bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                              <div className="flex items-center justify-between font-mono text-[10px] text-white/40 mb-1.5">
                                <span className="font-bold text-secondary">{log.date}</span>
                                <span>ID: {log.id.slice(0, 8)}</span>
                              </div>
                              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{log.summary}</p>
                              {log.attachmentName && (
                                <div className="mt-3 inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded px-2.5 py-1 text-[10px] text-white/60">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>{log.attachmentName}</span>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-white/35 text-xs font-mono">No sprint logs registered yet. Submit your first coordinate above.</div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Financials & operational logs */}
                  <div className="lg:col-span-4 space-y-8">
                    
                    {/* Project Specifications Card */}
                    <div className="glass-card p-6 rounded-[2rem] border border-white/5 bg-black/35 text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-xl" />
                      <h3 className="font-display text-lg font-bold text-white mb-1.5 flex items-center gap-1.5">
                        <Cpu className="w-5 h-5 text-secondary" />
                        Target Project Block
                      </h3>
                      <p className="text-[11px] text-white/40 font-mono uppercase mb-4">MAPPED SOW SCHEMASTICS</p>

                      <div className="space-y-3 font-mono text-[11px] text-white/75 bg-black/30 border border-white/5 rounded-xl p-4">
                        <p className="flex justify-between"><span className="text-white/40">NAME:</span> <strong className="text-white">{assignedProject.name}</strong></p>
                        <p className="flex justify-between"><span className="text-white/40">CLIENT EMAIL:</span> <span className="text-primary-light font-bold select-all">{assignedProject.clientEmail}</span></p>
                        <p className="flex justify-between"><span className="text-white/40">SOW TYPE:</span> <span>{assignedProject.category}</span></p>
                        <p className="flex justify-between"><span className="text-white/40">STATUS LEVEL:</span> <span className="text-emerald-400 font-bold uppercase">{assignedProject.state}</span></p>
                        <p className="flex justify-between"><span className="text-white/40">ACCORD LEVEL:</span> <span>{assignedProject.progress}% Done</span></p>
                      </div>
                    </div>

                    {/* Builder Payout Card */}
                    <div className="glass-card p-6 rounded-[2rem] border border-white/5 bg-black/35 text-left">
                      <h3 className="font-display text-md font-bold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-4.5 h-4.5 text-indigo-400" />
                        Dynamic Payout Calculator
                      </h3>

                      <div className="space-y-4 font-mono text-xs">
                        <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                          <span className="text-white/45">Builder Hourly Rate:</span>
                          <strong className="text-white">${assignedProject.builderHourlyRate || '15'} / hour</strong>
                        </div>

                        <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                          <span className="text-white/45">Completed Lab Hours:</span>
                          <strong className="text-white">{assignedProject.builderPayoutHours || '0'} hrs</strong>
                        </div>

                        <div className="bg-[#ff2c6d]/10 border border-[#ff2c6d]/25 p-4 rounded-xl text-left">
                          <p className="text-[9px] text-white/45 uppercase tracking-wider mb-1">AGGREGATED REVENUE ACCORD</p>
                          <p className="text-2xl font-extrabold text-white font-display">
                            ${(Number(assignedProject.builderPayoutHours || 0) * Number(assignedProject.builderHourlyRate || 15)).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-[#ff2c6d] font-bold mt-1 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Status: Dispatched via BKash / Visa
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </motion.div>
          ) : (
            /* STATE B: User is NOT Builder - Show public marketing and ingestion form! */
            <motion.div 
              key="pulic-marketing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              
              {/* Marketing Header */}
              <div className="relative z-10 mb-16">
                <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4 shadow-[0_0_15px_rgba(255,44,109,0.15)]">
                  <GitBranch className="w-4 h-4 text-secondary-light" />
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] text-[#fff] uppercase">
                    GALAXA BUILDERS PROGRAM (GBP)
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.08]">
                  Not a course. Not an internship. <br className="hidden md:block" />
                  <span className="text-gradient">Real-World Execution.</span>
                </h1>
                
                <p className="text-white/70 text-xs sm:text-base max-w-2xl font-sans leading-relaxed">
                  The Galaxa Builders Program is an active, project-driven ecosystem where select students develop by working directly on real live SOW project blocks of GalaxaTech. Code with genuine developer modules, map Firestore rules, and configure Nginx pipelines.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <button 
                    onClick={handleLoginClick}
                    disabled={isAuthenticating}
                    className="bg-white hover:bg-white/95 text-black font-extrabold text-xs px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer focus:outline-none transition-colors"
                  >
                    {isAuthenticating ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Lock className="w-4 h-4 text-black" />}
                    <span>{isAuthenticating ? "Opening Security..." : "Sign in to Claim Tasks"}</span>
                  </button>
                  <p className="text-white/40 text-xs font-mono">Sign in to check task credentials or claim open tickets.</p>
                </div>
              </div>

              {/* Beneficiary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 relative z-10">
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 bg-black/45 hover:border-secondary/20 transition-all duration-300 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl" />
                  <span className="font-mono text-[9px] font-black text-secondary tracking-widest block uppercase mb-1 font-bold">GBP INCENTIVE FOR STUDENTS</span>
                  <h3 className="font-display text-2xl font-extrabold text-white mb-6">Build Absolute Credibility</h3>
                  <div className="space-y-4 font-sans text-xs sm:text-sm text-white/70">
                    <p>• <strong>Real-world SOW Systems:</strong> Work with live operational servers, production structures, and authentic client demands.</p>
                    <p>• <strong>Immutable Portfolio Evidence:</strong> Your code blocks load into standard enterprise setups. Prove your worth directly to future recruiters with live links.</p>
                    <p>• <strong>No Artificial Sandboxes:</strong> Solve genuine real-user friction points rather than theoretical codecamp templates.</p>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 bg-black/45 hover:border-primary/20 transition-all duration-300 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                  <span className="font-mono text-[9px] font-black text-primary tracking-widest block uppercase mb-1 font-bold">GBP VALUE FOR GALAXATECH</span>
                  <h3 className="font-display text-2xl font-extrabold text-white mb-6">Sustainable Quality Engineering</h3>
                  <div className="space-y-4 font-sans text-xs sm:text-sm text-white/70">
                    <p>• <strong>Active Resource Scalability:</strong> Micro-tasks are segmented cleanly, accelerating design speeds while keeping development overhead contained.</p>
                    <p>• <strong>Dhaka Direct Filtration:</strong> We hire our full-time permanent personnel directly from program graduates with proven precision.</p>
                    <p>• <strong>Continuous Auditing loops:</strong> Fresh developer minds continuously inspect responsive layouts, checking loading latencies.</p>
                  </div>
                </div>
              </div>

              {/* Live Student Taskboard */}
              <div id="builders-taskboard" className="glass-card p-6 sm:p-10 rounded-[2.5rem] border border-white/5 bg-black/25 mb-16 relative z-10 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-light flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 animate-pulse" />
                      Live Sprints Sandbox
                    </span>
                    <h2 className="font-display text-2xl font-extrabold text-white mt-1">Real-Time Academy Sprints</h2>
                    <p className="text-white/45 text-[11px] font-sans mt-0.5">Check current claimable scripts to assess baseline complexity.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['All', 'In Progress', 'Completed', 'Open to Claim'].map((filterName) => (
                      <button
                        key={filterName}
                        onClick={() => setSelectedTaskFilter(filterName)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer focus:outline-none ${
                          selectedTaskFilter === filterName
                            ? 'bg-primary text-black font-extrabold scale-102 border border-primary'
                            : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                        }`}
                      >
                        {filterName}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {localTasks
                    .filter(t => selectedTaskFilter === 'All' || t.status === selectedTaskFilter)
                    .map((task) => {
                      const isOpen = task.status === "Open to Claim";
                      return (
                        <div 
                          key={task.id}
                          className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-3xl p-6 flex flex-col justify-between text-left group transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-white/50">{task.category}</span>
                              <span className={`px-2.5 py-0.5 rounded text-[8px] font-extrabold font-mono tracking-wider uppercase border ${
                                task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                                task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/10' :
                                'bg-primary/20 text-primary-light border-primary/20'
                              }`}>
                                {task.status}
                              </span>
                            </div>

                            <h4 className="font-display text-sm sm:text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">{task.title}</h4>
                            <p className="text-white/45 text-xs font-mono">Mapped Coordinate: {task.assignedTo}</p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-[10px] font-mono">
                            <div>
                              <span className="text-white/30 block">GBP REWARD SIGNAL</span>
                              <span className="text-primary-light font-bold uppercase">{task.rewardSignal}</span>
                            </div>

                            {isOpen ? (
                              <button
                                onClick={() => handleClaimTask(task.id)}
                                className="bg-white hover:bg-white/90 text-black font-extrabold text-[10px] tracking-wider uppercase px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer focus:outline-none"
                              >
                                Claim Ticket
                              </button>
                            ) : (
                              <span className="text-white/30">Node Registered</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Application Inbound Portal */}
              <div className="max-w-xl mx-auto glass-card p-8 sm:p-10 rounded-[2.5rem] border border-white/10 bg-black/45 relative overflow-hidden z-10 text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                
                <div className="text-center mb-8">
                  <span className="font-mono text-[9px] font-bold text-secondary tracking-widest block uppercase mb-1">Apply to Join Sprints</span>
                  <h3 className="font-display text-2xl font-extrabold text-white">Academy Application</h3>
                  <p className="text-white/45 text-xs font-sans mt-1">Dhaka Core Office will coordinate coordinates within 48-hours.</p>
                </div>

                <form onSubmit={handleApplyForm} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Fahim Ahmed"
                      className="bg-black/30 p-3.5 rounded-xl border border-white/10 focus:border-secondary w-full focus:outline-none text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="e.g. fahim@gmail.com"
                      className="bg-black/30 p-3.5 rounded-xl border border-white/10 focus:border-secondary w-full focus:outline-none text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider font-bold">GitHub profile link</label>
                    <input 
                      type="url" 
                      value={candidateGithub}
                      onChange={(e) => setCandidateGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="bg-black/30 p-3.5 rounded-xl border border-white/10 focus:border-secondary w-full focus:outline-none text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Why are you ready for production tasks?</label>
                    <textarea 
                      rows={3}
                      required
                      value={candidateReason}
                      onChange={(e) => setCandidateReason(e.target.value)}
                      placeholder="List key packages, databases or frameworks you have built with..."
                      className="bg-black/30 p-4 rounded-xl border border-white/10 focus:border-secondary w-full focus:outline-none text-xs sm:text-sm text-white font-sans h-[80px]"
                    />
                  </div>

                  <div className="pt-4 flex flex-col items-center gap-4">
                    {applicationSuccess && (
                      <div className="w-full text-center p-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-xs animate-pulse">
                        💡 Application submitted successfully! Check your inbox for program coordinates.
                      </div>
                    )}
                    
                    <button 
                      type="submit"
                      disabled={submittingApp}
                      className="bg-white hover:bg-white/90 text-black font-extrabold text-xs sm:text-sm py-4 px-8 rounded-full flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none w-full"
                    >
                      {submittingApp ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      ) : <Send className="w-4 h-4 text-black" />}
                      <span>Submit Ingestion Details</span>
                    </button>

                    <p className="text-[10px] font-mono text-white/30 text-center uppercase font-bold">
                      ACADEMY ACTIVE METRIC: {applicantsCount} APPLICATIONS PROCESSED SUCCESSFULLY
                    </p>
                  </div>
                </form>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}

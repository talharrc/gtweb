import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { GTProject } from '../../types';
import { LogOut, Loader2, FolderOpen, Clock, Code2, Users, DollarSign, CheckCircle2, ChevronRight, Send, HelpCircle, Laptop, MessageSquare, Compass, ListTodo } from 'lucide-react';
import MessagesSection from '../shared/MessagesSection';

interface SprintTask {
  id: string;
  name: string;
  project: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
}

type Tab = 'dashboard' | 'chat' | 'performance' | 'tasks';

const MOCK_TASKS: SprintTask[] = [
  { id: '1', name: 'Refactor 3D Globe mobile touch hijacking prevention', project: 'GalaxaTech HQ', status: 'in_progress', priority: 'high' },
  { id: '2', name: 'Develop checkout billing workflow & Stripe webhooks', project: 'Alpha Brands', status: 'done', priority: 'high' },
  { id: '3', name: 'Redesign tactile Join Team switch utilizing display font', project: 'GalaxaTech HQ', status: 'done', priority: 'medium' },
  { id: '4', name: 'Assemble Browse tech storefront routes & cards', project: 'GalaxaTech HQ', status: 'done', priority: 'high' },
];

export default function BuilderHubView() {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState<GTProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [sprintTasks, setSprintTasks] = useState<SprintTask[]>([]);
  const [logText, setLogText] = useState('');
  const [logStatus, setLogStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const email = userProfile?.email ?? null;
  const isDemo = new URLSearchParams(location.search).get('demo') === 'true' || !email;

  // Load project assignments
  useEffect(() => {
    if (isDemo || !email) {
      // Mock Demo Projects & Milestones
      setProjects([
        { 
          id: 'demo_proj', 
          name: 'GalaxaTech Platform v2', 
          status: 'In Progress', 
          progressPercent: 92,
          milestones: [
            { id: 'm1', title: 'Refactor Globe Prevention', status: 'completed' },
            { id: 'm2', title: 'Tactile Switch Animation', status: 'completed' },
            { id: 'm3', title: 'Deployment Validation', status: 'active' },
          ]
        },
        { 
          id: 'demo_proj2', 
          name: 'Alpha Brands Inc.', 
          status: 'In Progress', 
          progressPercent: 76,
          milestones: [
            { id: 'm4', title: 'Stripe Gateway Hookup', status: 'completed' },
            { id: 'm5', title: 'PostgreSQL RDS Clustering', status: 'completed' },
            { id: 'm6', title: 'UAT Sign-off', status: 'pending' },
          ]
        }
      ] as any);
      setSprintTasks(MOCK_TASKS);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'projects'), where('builderEmails', 'array-contains', email.toLowerCase()));
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as GTProject));
      setProjects(list);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [email, isDemo]);

  // Set first project as active initially
  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId]);

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logText.trim() || !activeProjectId) return;
    setLogStatus('submitting');

    const builderName = userProfile?.displayName ?? email?.split('@')[0] ?? 'Builder';

    if (isDemo) {
      setTimeout(() => {
        setLogStatus('success');
        setLogText('');
        setTimeout(() => setLogStatus('idle'), 2500);
      }, 1200);
    } else {
      try {
        await addDoc(collection(db, 'projects', activeProjectId, 'updates'), {
          text: logText.trim(),
          postedBy: `${builderName} (Builder)`,
          timestamp: serverTimestamp(),
        });
        setLogStatus('success');
        setLogText('');
        setTimeout(() => setLogStatus('idle'), 2500);
      } catch (err) {
        console.error("Failed to submit work log to Firestore:", err);
        setLogStatus('idle');
      }
    }
  };

  const handleUpdateMilestoneStatus = async (milestoneId: string, newStatus: 'pending' | 'active' | 'completed') => {
    if (!activeProject) return;

    const updatedMilestones = (activeProject.milestones ?? []).map(m => 
      m.id === milestoneId ? { ...m, status: newStatus } : m
    );

    // Calculate progressPercent
    const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
    const totalCount = updatedMilestones.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // If in demo mode, update local state
    if (isDemo) {
      setProjects(prev => prev.map(p => 
        p.id === activeProject.id 
          ? { ...p, milestones: updatedMilestones, progressPercent } 
          : p
      ));
      return;
    }

    try {
      await updateDoc(doc(db, 'projects', activeProject.id), {
        milestones: updatedMilestones,
        progressPercent,
      });
    } catch (err) {
      console.error("Failed to update milestone status in Firestore:", err);
    }
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'chat', label: 'Chat thread', icon: MessageSquare },
    { id: 'tasks', label: 'Scope', icon: ListTodo },
    { id: 'performance', label: 'Performance', icon: Users },
  ];

  const activeProject = projects.find(p => p.id === activeProjectId) ?? projects[0] ?? null;

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-[#0A0717] text-white">
      {/* Sleek Left Sidebar for Desktop (visible on sm and larger) */}
      <aside className="hidden sm:flex flex-col w-64 border-r border-white/[0.07] bg-black/20 backdrop-blur-md p-5 sticky top-0 h-screen flex-shrink-0">
        {/* Branding */}
        <div className="flex items-center gap-2.5 mb-8">
          <button onClick={() => navigate('/')} className="hover:scale-105 transition-transform flex items-center gap-2 text-left">
            <img src="/logo.png" alt="GalaxaTech" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <span className="text-white font-bold text-sm font-display block">Builder Hub</span>
              {isDemo && (
                <span className="text-[9px] font-mono font-bold text-emerald-400 block mt-0.5">
                  Builder Sandbox
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow flex flex-col gap-1">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border text-left ${
                  isActive
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                    : 'bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Profile & Close */}
        <div className="border-t border-white/5 pt-4 flex flex-col gap-2.5">
          <span className="text-white/40 text-[10px] truncate font-mono">
            {isDemo ? 'architect-talha@galaxatech.com' : email}
          </span>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 text-xs font-bold uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Close Hub
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header (hidden on sm and larger) */}
        <header className="sm:hidden flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-black/40 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate('/')} className="hover:scale-105 transition-transform flex items-center gap-2">
              <img src="/logo.png" alt="GalaxaTech" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-white font-bold text-sm font-display">Builder Hub</span>
            </button>
            {isDemo && (
              <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                Sandbox
              </span>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Close
          </button>
        </header>

        <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6 pb-24 sm:pb-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
          ) : (
            <>
              {/* Project Switcher Selector */}
              {projects.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
                  <div>
                    <h4 className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Active Assignment</h4>
                    <p className="text-white text-sm font-bold mt-0.5">{activeProject?.name || 'Loading assignment...'}</p>
                  </div>
                  {projects.length > 1 && (
                    <select
                      value={activeProjectId ?? ''}
                      onChange={e => setActiveProjectId(e.target.value)}
                      className="bg-[#120E22] border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* TAB CONTENT: Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8 flex flex-col gap-6 w-full">
                    {/* Active Sprint Board */}
                    <div className="glass-card-premium rounded-3xl p-7 border border-white/10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold text-lg font-display flex items-center gap-2">
                          <Code2 className="w-5 h-5 text-primary" /> Active Sprints
                        </h3>
                        <span className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full uppercase">
                          Sprint #12 Active
                        </span>
                      </div>

                      <div className="flex flex-col gap-3">
                        {sprintTasks.map(t => (
                          <div key={t.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:border-emerald-500/20 transition-all">
                            <div>
                              <div className="flex items-center gap-2.5 mb-1.5">
                                <span className="text-[9px] font-mono text-white/30 uppercase">{t.project}</span>
                                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                  t.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                  {t.priority}
                                </span>
                              </div>
                              <p className="text-white/80 text-xs font-semibold">{t.name}</p>
                            </div>

                            <div className="flex-shrink-0">
                              {t.status === 'done' ? (
                                <span className="text-[9px] font-mono font-bold bg-green-500/15 text-green-400 border border-green-500/20 px-2.5 py-1 rounded">
                                  Done
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono font-bold bg-primary/15 text-primary border border-primary/20 px-2.5 py-1 rounded">
                                  In Progress
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Commit and Action Log submitter */}
                    {activeProjectId && (
                      <div className="glass-card-premium rounded-3xl p-7 border border-white/10">
                        <h3 className="text-white font-bold text-lg font-display mb-2 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-secondary" /> Submit Work Log
                        </h3>
                        <p className="text-white/50 text-xs mb-5">Broadcast updates directly to the client dashboard feed and sync deployment state.</p>

                        <form onSubmit={handleSubmitLog} className="flex flex-col gap-4">
                          <textarea
                            value={logText}
                            onChange={e => setLogText(e.target.value)}
                            rows={3}
                            placeholder="e.g. Completed integration tests on PostgreSQL node and established Vercel preview routes..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                            required
                          />
                          <button
                            type="submit"
                            disabled={logStatus === 'submitting' || !logText.trim()}
                            className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer self-start flex items-center gap-1.5 min-h-[42px]"
                          >
                            {logStatus === 'submitting' ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Synchronizing Commit...
                              </>
                            ) : logStatus === 'success' ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-green-400" /> Committed Successfully!
                              </>
                            ) : (
                              <>
                                Submit Log <Send className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>

                  {/* Right: Metrics & Payout tracker (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col gap-6 w-full">
                    <div className="glass-card-premium rounded-3xl p-6 border border-white/10">
                      <h3 className="text-white font-bold font-display mb-4 text-sm flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" /> Builder Metrics
                      </h3>
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-white/40 text-[10px] font-mono uppercase">Delivery Precision</span>
                            <span className="text-emerald-400 text-xs font-mono font-bold">98%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-400" style={{ width: '98%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-white/40 text-[10px] font-mono uppercase">Sprint Accuracy</span>
                            <span className="text-primary text-xs font-mono font-bold">92%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: '92%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Chat Room */}
              {activeTab === 'chat' && activeProjectId && (
                <div className="glass-card-premium rounded-3xl p-6 border border-white/10 max-w-full">
                  <MessagesSection projectId={activeProjectId} />
                </div>
              )}

              {/* TAB CONTENT: Scope Checklists */}
              {activeTab === 'tasks' && activeProject && (
                <div className="glass-card-premium rounded-3xl p-6 border border-white/10">
                  <h3 className="text-white font-bold font-display mb-2 text-sm flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-emerald-400" /> Milestone Manager
                  </h3>
                  <p className="text-white/45 text-xs mb-5">Update milestone states to instantly synchronize with the client's timeline.</p>
                  
                  <div className="flex flex-col gap-3">
                    {activeProject.milestones && activeProject.milestones.length > 0 ? (
                      activeProject.milestones.map((m) => (
                        <div key={m.id} className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:border-emerald-500/20 transition-all">
                          <div>
                            <p className={`text-xs sm:text-sm font-semibold ${m.status === 'completed' ? 'text-white/50 line-through' : 'text-white'}`}>{m.title}</p>
                            <p className="text-[9px] font-mono text-white/30 uppercase mt-0.5">{m.status}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <select
                              value={m.status}
                              onChange={(e) => handleUpdateMilestoneStatus(m.id, e.target.value as any)}
                              className="bg-[#120E22] border border-white/10 rounded-lg px-2.5 py-1 text-white text-[11px] focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/30 text-xs text-center py-6">No scope items set yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Performance & Financial Ledger */}
              {activeTab === 'performance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Financial Ledger */}
                  <div className="glass-card-premium rounded-3xl p-6 border border-white/10">
                    <h3 className="text-white font-bold font-display mb-4 text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-secondary" /> Financial Ledger
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      {[
                        { id: '1042', amount: '৳137,500', status: 'Paid', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                        { id: '1043', amount: '৳357,500', status: 'Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                      ].map((inv, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <div>
                            <p className="text-white text-xs font-medium font-mono">Invoice #{inv.id}</p>
                            <p className="text-white/35 text-[9px] font-mono mt-0.5 font-display">Sprint Execution Payout</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold text-xs font-mono">{inv.amount}</p>
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded ${inv.color} mt-1 inline-block`}>
                              {inv.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ratings & reviews coming soon */}
                  <div className="glass-card-premium rounded-3xl p-6 border border-white/10 flex flex-col justify-center items-center text-center">
                    <p className="text-white/30 text-sm">Ratings & reviews coming soon</p>
                    <p className="text-white/20 text-xs mt-1">Client feedback will appear here after project delivery</p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Mobile Bottom Navigation Bar (fixed at bottom of screen on mobile viewport) */}
        {projects.length > 0 && !loading && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#0A0717]/90 border-t border-white/[0.08] backdrop-blur-md px-6 py-2.5 flex items-center justify-between z-40">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 text-[9px] font-semibold transition-all ${
                    isActive ? 'text-emerald-400' : 'text-white/40'
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                  <span>{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

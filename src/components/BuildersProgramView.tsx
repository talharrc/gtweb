import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  Briefcase
} from 'lucide-react';
import { PageType } from '../types';
import { getCredentialByUsername } from '../services/credentialService';
import { signInLocalWithUid } from '../lib/localAuth';

interface BuildersProgramViewProps {
  currentUser: any | null;
  onPageChange: (page: PageType) => void;
}

const LIVE_STUDENT_TASKS = [
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

export default function BuildersProgramView({ currentUser, onPageChange }: BuildersProgramViewProps) {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateGithub, setCandidateGithub] = useState('');
  const [candidateReason, setCandidateReason] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('All');
  const [applicantsCount, setApplicantsCount] = useState(142);

  const [localTasks, setLocalTasks] = useState(LIVE_STUDENT_TASKS);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) return;
    setIsAuthenticating(true);
    setLoginError('');
    try {
      const cred = await getCredentialByUsername(loginUsername.trim().toLowerCase());
      if (!cred || cred.password !== loginPassword) {
        setLoginError('Invalid username or password.');
        return;
      }
      if (cred.role !== 'builder') {
        setLoginError('These credentials are not for the Builders Hub.');
        return;
      }
      signInLocalWithUid(cred.uid, cred.username, cred.displayName, 'builder', cred.projectId);
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

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
    }, 1500);
  };

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

  return (
    <div className="relative pt-32 pb-24 text-white text-left min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {!currentUser ? (
          <div className="max-w-xl mx-auto text-center py-16 px-10 glass-card rounded-[2.5rem] border border-white/10 bg-black/45 shadow-3xl select-none my-12">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Lock className="w-7 h-7 animate-bounce" />
            </div>
            
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Builders Academy Locked
            </h2>
            
            <p className="text-white/60 text-xs sm:text-sm mb-8 leading-relaxed font-sans max-w-sm mx-auto">
              Enter your builder credentials to access the Hub. From here, you can view live tasks, review guidelines, and submit your builder coordinates directly to the Galaxa core team.
            </p>

            <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-3 text-left">
              <input
                type="text"
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
              />
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
              />
              {loginError && (
                <p className="text-red-400 text-xs text-center">{loginError}</p>
              )}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 text-white font-bold text-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isAuthenticating ? 'Verifying...' : 'Access Builders Hub'}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Main Title Badge */}
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
            The Galaxa Builders Program is an active, project-driven ecosystem where select students develop by working directly on the real live project tasks of GalaxaTech. No artificial training servers, no dry templates, and no passive listening.
          </p>
        </div>

        {/* Cohesive Win-Win Beneficiary System Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 relative z-10">
          
          {/* Card 1: Students Benefits */}
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 bg-black/45 hover:border-secondary/20 transition-all duration-300 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl" />
            <span className="font-mono text-[9px] font-black text-secondary tracking-widest block uppercase mb-1">GBP INCENTIVE FOR STUDENTS</span>
            <h3 className="font-display text-2xl font-extrabold text-white mb-6">Build Absolute Credibility</h3>
            
            <div className="space-y-4 font-sans text-xs sm:text-sm">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 mt-0.5">&bull;</div>
                <div>
                  <p className="font-bold text-white">Real-world Project Exposure</p>
                  <p className="text-white/50 text-xs mt-0.5">Work with high-frequency development servers, API keys, and enterprise databases used by paying global clients.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 mt-0.5">&bull;</div>
                <div>
                  <p className="font-bold text-white">Structured Execution Portfolio Proof</p>
                  <p className="text-white/50 text-xs mt-0.5">Your work is live-compiled inside our core operations. Point directly to production modules you coded to verify your expertise.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 mt-0.5">&bull;</div>
                <div>
                  <p className="font-bold text-white">Direct Executive Mentorship</p>
                  <p className="text-white/50 text-xs mt-0.5">Learn professional git-flow habits, optimization limits, and UI spacing alongside executive software engineers from Dhaka.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Business Benefits */}
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 bg-black/45 hover:border-primary/20 transition-all duration-300 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <span className="font-mono text-[9px] font-black text-primary tracking-widest block uppercase mb-1">GBP VALUE FOR GALAXATECH</span>
            <h3 className="font-display text-2xl font-extrabold text-white mb-6">Sustainable Quality Engineering</h3>
            
            <div className="space-y-4 font-sans text-xs sm:text-sm">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">&bull;</div>
                <div>
                  <p className="font-bold text-white">Low-Cost Active Workforce Pipeline</p>
                  <p className="text-white/50 text-xs mt-0.5">Structures micro-module tasks cleanly, accelerating visual asset deployments while managing project overhead efficiently.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">&bull;</div>
                <div>
                  <p className="font-bold text-white">Continuous Dynamic Audit Engine</p>
                  <p className="text-white/50 text-xs mt-0.5">Multiple minds reviewing state loops, checking console limits, and pushing responsive tests across various browser sizes.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">&bull;</div>
                <div>
                  <p className="font-bold text-white">Direct Filtration hiring pipeline</p>
                  <p className="text-white/50 text-xs mt-0.5">No arbitrary CV screening. We hire our permanent full-time devs directly by tracking who handles real-project briefs with supreme craft.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Live Builders Taskboard Section */}
        <div id="builders-taskboard" className="glass-card p-6 sm:p-10 rounded-[2.5rem] border border-white/5 bg-black/25 mb-16 relative z-10 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-primary-light flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                Live Sprints Database
              </p>
              <h2 className="font-display text-2xl font-extrabold text-white mt-1">Real-Time Core Sprints</h2>
              <p className="text-white/45 text-[11px] font-sans mt-0.5">These are actual live micro-tasks students compile to earn verified portfolio proof.</p>
            </div>

            {/* Filter buttons */}
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

          {/* Grid of micro tasks */}
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
                          task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/10 animate-pulse' :
                          'bg-primary/20 text-primary-light border-primary/20'
                        }`}>
                          {task.status}
                        </span>
                      </div>

                      <h4 className="font-display text-sm sm:text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">{task.title}</h4>
                      <p className="text-white/45 text-xs font-mono">Assigned Node: {task.assignedTo}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-[10px] font-mono">
                      <div>
                        <span className="text-white/30 block">GBP REWARD VALUE</span>
                        <span className="text-primary-light font-bold uppercase">{task.rewardSignal}</span>
                      </div>

                      {isOpen ? (
                        <button
                          onClick={() => handleClaimTask(task.id)}
                          className="bg-white hover:bg-white/90 text-black font-extrabold text-[10px] tracking-wider uppercase px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer focus:outline-none"
                        >
                          Claim Micro-Task
                        </button>
                      ) : (
                        <span className="text-white/30">Node Claimed</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

        </div>

        {/* Interactive Application Terminal Form */}
        <div className="max-w-xl mx-auto glass-card p-8 sm:p-10 rounded-[2.5rem] border border-white/10 bg-black/45 relative overflow-hidden z-10 text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
          
          <div className="text-center mb-8">
            <span className="font-mono text-[9px] font-bold text-secondary tracking-widest block uppercase mb-1">apply to program</span>
            <h3 className="font-display text-2xl font-extrabold text-white">GBP Ingestion Portal</h3>
            <p className="text-white/45 text-xs font-sans mt-1">Review process is direct and swift. Dhaka office coordinates within 48-hours.</p>
          </div>

          <form onSubmit={handleApplyForm} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Candidate Name</label>
              <input 
                type="text" 
                required
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Name..."
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
                placeholder="Email..."
                className="bg-black/30 p-3.5 rounded-xl border border-white/10 focus:border-secondary w-full focus:outline-none text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">GitHub / Portfolio Coordinates (Optional)</label>
              <input 
                type="url" 
                value={candidateGithub}
                onChange={(e) => setCandidateGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="bg-black/30 p-3.5 rounded-xl border border-white/10 focus:border-secondary w-full focus:outline-none text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase tracking-wider">Why are you ready for real-world tasks?</label>
              <textarea 
                rows={3}
                required
                value={candidateReason}
                onChange={(e) => setCandidateReason(e.target.value)}
                placeholder="Brief description of active tasks you completed locally..."
                className="bg-black/30 p-4 rounded-xl border border-white/10 focus:border-secondary w-full focus:outline-none text-xs sm:text-sm text-white font-sans h-[80px]"
              />
            </div>

            <div className="pt-4 flex flex-col items-center gap-4">
              {applicationSuccess && (
                <div className="w-full text-center p-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-xs animate-pulse">
                  ✔ Applied successfully! Check your inbox for program coordinates.
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
                <span>{submittingApp ? "Ingesting details..." : "Apply to Galaxa Builders Program"}</span>
              </button>

              <p className="text-[10px] font-mono text-white/30 text-center uppercase">
                ACTIVE RECRUIT TALLY: {applicantsCount} SUFFICIENT APPLICATIONS REGISTERED
              </p>
            </div>
          </form>

        </div>

        </>
        )}

      </div>
    </div>
  );
}

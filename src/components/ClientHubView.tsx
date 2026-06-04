import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  User, 
  FileText, 
  TrendingUp, 
  Cpu, 
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
  AlertCircle
} from 'lucide-react';
import { googleSignIn, logout } from '../lib/firebase';
import { PageType } from '../types';

interface ClientHubViewProps {
  currentUser: any | null;
  onPageChange: (page: PageType) => void;
}

export default function ClientHubView({ currentUser, onPageChange }: ClientHubViewProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  
  // Custom request log state
  const [specTopic, setSpecTopic] = useState('Service Expansion');
  const [specDetails, setSpecDetails] = useState('');
  const [submittingSpec, setSubmittingSpec] = useState(false);
  const [specSuccess, setSpecSuccess] = useState(false);
  const [specLogs, setSpecLogs] = useState<any[]>([
    { id: "log-1", topic: "Visual Logo Update", status: "Completed", date: "May 24, 2026", desc: "Aligned SVG vector brandmark paths globally." },
    { id: "log-2", topic: "Nginx Sub-Routing", status: "In Reviews", date: "May 28, 2026", desc: "Configuring reverse proxy rules on development instances." }
  ]);

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

  const handleDownloadFile = (fileName: string) => {
    setIsDownloading(fileName);
    setTimeout(() => {
      setIsDownloading(null);
      setDownloadSuccess(fileName);
      setTimeout(() => setDownloadSuccess(null), 3000);
      
      // Prompt/Simulate real download
      const element = document.createElement("a");
      const file = new Blob([`GalaxaTech - Secure Client Document Mock (${fileName})\n\nThis is a securely encrypted visual preview compiled dynamically for the Client Portal.\n\nApproved: Admin\nStatus: Finalised`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${fileName.replaceAll(" ", "_")}_Draft.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  const handleSpecRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specDetails.trim()) return;
    setSubmittingSpec(true);
    setTimeout(() => {
      const newLog = {
        id: `log-${Date.now()}`,
        topic: specTopic,
        status: "Received",
        date: "JUST NOW",
        desc: specDetails
      };
      setSpecLogs([newLog, ...specLogs]);
      setSpecDetails('');
      setSubmittingSpec(false);
      setSpecSuccess(true);
      setTimeout(() => setSpecSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="relative pt-32 pb-24 text-white text-left min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* If user is not authenticated, show secure gateway */}
        <AnimatePresence mode="wait">
          {!currentUser ? (
            <motion.div 
              key="auth-gateway"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto text-center py-16 px-10 glass-card rounded-[2.5rem] border border-white/10 bg-black/45 shadow-3xl select-none"
            >
              <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary shadow-[0_0_20px_rgba(139,44,255,0.2)]">
                <Lock className="w-7 h-7" />
              </div>
              
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Client Hub Access Blocked
              </h2>
              
              <p className="text-white/60 text-xs sm:text-sm mb-10 leading-relaxed font-sans max-w-sm mx-auto">
                Authentication required. Once you become a Galaxa Tech client with active agreements, we grant instant dashboard credentials to access legal agreements, milestones, and task boards.
              </p>

              {/* Official Google Sign In button styling */}
              <button 
                onClick={handleLoginClick}
                disabled={isAuthenticating}
                className="gsi-material-button mx-auto focus:outline-none cursor-pointer flex items-center justify-center"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper flex items-center gap-2">
                  <div className="gsi-material-button-icon shrink-0">
                    {isAuthenticating ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : (
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-900 pr-1 select-none">
                    {isAuthenticating ? "Opening security pipeline..." : "Sign in with Google"}
                  </span>
                </div>
              </button>

              <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-[9px] font-mono tracking-wider text-white/30 uppercase">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Encrypted secure Google login protocol verified</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-10"
            >
              
              {/* Dashboard Banner */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-8 glass-card border border-white/10 rounded-[2.5rem] bg-gradient-to-r from-black/50 via-primary/5 to-black/30">
                <div className="flex items-center gap-4 text-left">
                  {currentUser.photoURL ? (
                    <img 
                      alt="Client profile picture" 
                      className="w-14 h-14 rounded-full border border-primary/30 object-cover grayscale" 
                      src={currentUser.photoURL}
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
                      Welcome back, {currentUser.displayName || "Client"}
                    </h1>
                    <p className="text-white/45 text-xs font-mono">{currentUser.email}</p>
                  </div>
                </div>

                <button 
                  onClick={logout}
                  className="bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-full py-3 px-5 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer focus:outline-none select-none"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Dashboard
                </button>
              </div>

              {/* Grid: Main sections */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Project Roadmap Sprint lines */}
                <div className="lg:col-span-8 space-y-8 text-left">
                  <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] border border-white/5 bg-black/25">
                    
                    <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-display text-xl font-bold text-white">Live Project Update</h3>
                          <p className="text-[10px] text-white/40 uppercase font-mono">automated tracker node: online</p>
                        </div>
                      </div>
                      <span className="bg-primary/20 text-primary-light px-3 py-1 rounded-full text-[9px] font-bold tracking-widest border border-primary/20 uppercase">
                        Sprint Stage 3 / 4
                      </span>
                    </div>

                    {/* Sprints process tracks */}
                    <div className="space-y-6">
                      
                      {/* Sprint item 1 */}
                      <div className="flex gap-4 relative">
                        <div className="absolute left-3 top-7 bottom-0 w-[2px] bg-emerald-500" />
                        <div className="w-6.5 h-6.5 rounded-full bg-emerald-500/25 border border-emerald-400 flex items-center justify-center text-emerald-400 text-xs shrink-0 self-start">
                          ✔
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                            Phase 01: Audit Discovery & Blueprint
                            <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/10">signed off</span>
                          </h4>
                          <p className="text-white/50 text-xs font-sans max-w-xl">
                            5-minute brand specification audited. User journey mapped, and core requirements layout locked. Completed successfully on May 15, 2026.
                          </p>
                        </div>
                      </div>

                      {/* Sprint item 2 */}
                      <div className="flex gap-4 relative">
                        <div className="absolute left-3 top-7 bottom-0 w-[2px] bg-emerald-500" />
                        <div className="w-6.5 h-6.5 rounded-full bg-emerald-500/25 border border-emerald-400 flex items-center justify-center text-emerald-400 text-xs shrink-0 self-start">
                          ✔
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                            Phase 02: High-Fidelity UI/UX & Layout Sprints
                            <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/10">signed off</span>
                          </h4>
                          <p className="text-white/50 text-xs font-sans max-w-xl">
                            Avant-garde dark wireframes drafted. Brand identity asset vectors constructed and rendered natively. Approved on May 22, 2026.
                          </p>
                        </div>
                      </div>

                      {/* Sprint item 3 */}
                      <div className="flex gap-4 relative">
                        <div className="absolute left-3 top-7 bottom-0 w-[2px] bg-primary/40" />
                        <div className="w-6.5 h-6.5 rounded-full bg-primary/20 border border-primary-light flex items-center justify-center text-primary-light text-xs shrink-0 self-start animate-pulse">
                          ⚡
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                            Phase 03: Full-Stack React & Server Integration
                            <span className="bg-primary/20 text-primary-light text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-primary/20 animate-pulse">Active sprint</span>
                          </h4>
                          <p className="text-white/80 text-xs font-sans max-w-xl">
                            Programming the interactive React panels. Linking OAuth scopes and Google Sheets autonomous synchronization pipelines. High-fidelity layouts currently launching inside development environments.
                          </p>
                          {/* Progress bar visual */}
                          <div className="w-full bg-white/5 rounded-full h-1.5 mt-3 relative overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "75%" }}
                              transition={{ duration: 1.5 }}
                              className="bg-primary h-full rounded-full"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-white/40 block">Component Completion Level: 75%</span>
                        </div>
                      </div>

                      {/* Sprint item 4 */}
                      <div className="flex gap-4">
                        <div className="w-6.5 h-6.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-xs shrink-0 self-start">
                          -
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white/55">
                            Phase 04: Cloud Run Infrastructure Launch
                          </h4>
                          <p className="text-white/30 text-xs font-sans max-w-xl">
                            Deploying compiled production packages and executing deep security audits. 
                          </p>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Feature & update request form */}
                  <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] border border-white/5 bg-black/25">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                      <Sliders className="w-5 h-5 text-secondary" />
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white">Client Project Request</h3>
                        <p className="text-[10px] text-white/40 uppercase font-mono">No need to text/call - update specs directly</p>
                      </div>
                    </div>

                    <form onSubmit={handleSpecRequest} className="space-y-4">
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
                            Your requests are indexed by our core workspace and automatically queued into our next sprint dashboard.
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
                            <span>Requested specs successfully queued into Sprint 3!</span>
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

                    {/* Developer logs */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-left">
                      <h4 className="text-xs uppercase font-mono tracking-wider text-white/55 mb-4">Historical Spec Manifests</h4>
                      <div className="space-y-3.5">
                        {specLogs.map((log) => (
                          <div key={log.id} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex-wrap sm:flex-nowrap gap-4">
                            <div>
                              <p className="text-xs font-bold text-white">{log.topic}</p>
                              <p className="text-[11px] text-white/45 font-sans mt-0.5">{log.desc}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                              <span className="text-[10px] font-mono text-white/30">{log.date}</span>
                              <span className={`px-2.5 py-0.5 rounded text-[8px] font-extrabold font-mono tracking-wider uppercase border ${
                                log.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/10' :
                                log.status === 'In Reviews' ? 'bg-amber-500/15 text-amber-400 border-amber-500/10' :
                                'bg-primary/20 text-primary-light border-primary/20'
                              }`}>
                                {log.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

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
                      {[
                        "Master Services Agreement (MSA)",
                        "Statement of Work (SOW) - Core UI",
                        "Galaxa Tech Mutual NDA"
                      ].map((docName, idx) => {
                        const isLoading = isDownloading === docName;
                        const isSuccess = downloadSuccess === docName;
                        return (
                          <div 
                            key={idx}
                            className="bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex items-center justify-between transition-colors gap-4"
                          >
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-white inline-block max-w-[150px] sm:max-w-none truncate">{docName}</p>
                              <p className="text-[10px] text-white/35 font-mono">Secured PDF • 182 KB</p>
                            </div>
                            
                            <button 
                              onClick={() => handleDownloadFile(docName)}
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
                      })}
                    </div>
                  </div>

                  {/* Operational Resource Usage */}
                  <div className="glass-card p-6 rounded-[2rem] border border-white/5 bg-black/25 text-left">
                    <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#ff2c6d]" />
                      Sprint Consumption
                    </h3>

                    <div className="space-y-4">
                      
                      {/* Meter 1 */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60">Development Credit Used</span>
                          <span className="font-mono text-white/85">32 of 40 Hours</span>
                        </div>
                        <div className="bg-white/5 rounded-full h-2 w-full overflow-hidden">
                          <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full" style={{ width: "80%" }} />
                        </div>
                      </div>

                      {/* Meter 2 */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60">Visual Assets Rendered</span>
                          <span className="font-mono text-white/85">15 of 15 Units</span>
                        </div>
                        <div className="bg-white/5 rounded-full h-2 w-full overflow-hidden">
                          <div className="bg-[#ff2c6d] h-full rounded-full" style={{ width: "100%" }} />
                        </div>
                      </div>

                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mt-6">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-bold text-white font-display">$8,400</span>
                          <span className="text-[10px] text-white/40 uppercase font-mono">Contract Total</span>
                        </div>
                        <p className="text-[10px] text-emerald-400 font-mono mt-1 font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Invoice Status: Paid & Finalised
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

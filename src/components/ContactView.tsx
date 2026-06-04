import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Mail, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  ArrowRight, 
  User, 
  Building, 
  MessageSquare, 
  DollarSign,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { PageType } from '../types';

interface ContactViewProps {
  inquiryPreset: string;
  onClearPreset: () => void;
}

const ROADMAPS = {
  dev: [
    { week: "Week 1-2", step: "System Requirement & Tech Stack Blueprinting" },
    { week: "Week 3-4", step: "API Middleware Dev & Client-Side Design Wiring" },
    { week: "Week 5-6", step: "Sprint Integrations & Cloud Deployment Setup" },
    { week: "Week 8", step: "Responsive Audit & Staged Code Production Launch" }
  ],
  design: [
    { week: "Week 1-2", step: "Brand Moodboards & Typography Setup Reviews" },
    { week: "Week 3-4", step: "Figma High-Fidelity Desktop Mockups Generation" },
    { week: "Week 5", step: "Interactive Micro-Animation Prototypes" },
    { week: "Week 6", step: "Complete Brand Manual Export & Delivery" }
  ],
  marketing: [
    { week: "Week 1", step: "Google SEO Audit & Competitor Mapping Analysis" },
    { week: "Week 2", step: "Landing Page CRO and Lead Form Integrations" },
    { week: "Week 3", step: "Paid Campaign Setup & Target Audience Config" },
    { week: "Week 4", step: "Continuous Performance Logging & Insights" }
  ]
};

export default function ContactView({ inquiryPreset, onClearPreset }: ContactViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    ventureGroup: 'dev' as 'dev' | 'design' | 'marketing',
    budget: '5k-10k',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  // Pre-populate message if preset exists
  useEffect(() => {
    if (inquiryPreset) {
      setFormData(prev => ({
        ...prev,
        message: inquiryPreset,
        // Auto match venture based on preset contents
        ventureGroup: inquiryPreset.includes('Estimate') 
          ? (inquiryPreset.includes('Creative UI/UX') ? 'design' : 'dev')
          : 'dev'
      }));
    }
  }, [inquiryPreset]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Generate random mock tracking ref
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    setTicketRef(`GT-${randomHex}`);
    setSubmitted(true);
    onClearPreset();
  };

  const activeRoadmap = ROADMAPS[formData.ventureGroup];

  return (
    <div className="relative pt-32 pb-24 text-left">
      
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-secondary font-bold tracking-[0.25em] text-xs uppercase mb-3 block">
          Initiate Sprints
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight max-w-3xl mx-auto">
          Book a Free <br />
          <span className="text-gradient">Software Audit</span>
        </h1>
        <p className="text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
          Log an official project inquiry into our Dhaka Studio system. Choose your specialized division to preview your custom product milestones.
        </p>
      </section>

      {/* 2. Form & Roadmap Layout */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              
              {/* Left Form Panel */}
              <form 
                onSubmit={handleSubmit}
                className="lg:col-span-7 bg-black/35 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-3xl flex flex-col gap-6"
              >
                <div className="text-left mb-4">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1.5 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span>Inquiry Intake Form</span>
                  </h3>
                  <p className="text-white/50 text-xs font-sans">
                    Complete your details to alert our team leads in Dhaka, Bangladesh.
                  </p>
                </div>

                {/* Input 1: name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/70 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>Full Name *</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Leo Galaxe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all font-medium placeholder:text-white/20"
                    />
                  </div>

                  {/* Input 2: email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/70 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      <span>Corporate Email *</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. leo@galaxatech.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all font-medium placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
                  {/* Input 3: Company */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/70 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-primary" />
                      <span>Company Name</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. GalaxaTech Global"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all font-medium placeholder:text-white/20"
                    />
                  </div>

                  {/* Input 4: Budget Range */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/70 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-primary" />
                      <span>Estimate Target Budget</span>
                    </label>
                    <select 
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="bg-black/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all font-medium cursor-pointer"
                    >
                      <option value="under-5k">Under $5k (MVP Prototype)</option>
                      <option value="5k-10k">$5k - $10k (Custom System)</option>
                      <option value="10k-25k">$10k - $25k (Luxury Scaled)</option>
                      <option value="above-25k">Above $25k+ (Enterprise Platform)</option>
                    </select>
                  </div>
                </div>

                {/* Input 5: Venture target selection to change timeline milestones */}
                <div className="flex flex-col gap-2 font-sans">
                  <label className="text-xs font-bold text-white/70">Select Target Venture Division</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, ventureGroup: 'design'})}
                      className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold border transition-all cursor-pointer focus:outline-none ${
                        formData.ventureGroup === 'design' 
                          ? 'bg-primary/20 border-primary text-white' 
                          : 'bg-white/5 border-white/8 text-white/50 hover:border-white/12'
                      }`}
                    >
                      GalaxaTech Creative
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, ventureGroup: 'dev'})}
                      className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold border transition-all cursor-pointer focus:outline-none ${
                        formData.ventureGroup === 'dev' 
                          ? 'bg-primary/20 border-primary text-white' 
                          : 'bg-white/5 border-white/8 text-white/50 hover:border-white/12'
                      }`}
                    >
                      GalaxaTech Software
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, ventureGroup: 'marketing'})}
                      className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold border transition-all cursor-pointer focus:outline-none ${
                        formData.ventureGroup === 'marketing' 
                          ? 'bg-primary/20 border-primary text-white' 
                          : 'bg-white/5 border-white/8 text-white/50 hover:border-white/12'
                      }`}
                    >
                      GalaxaTech Connect
                    </button>
                  </div>
                </div>

                {/* Input 6: message */}
                <div className="flex flex-col gap-2 font-sans">
                  <label className="text-xs font-bold text-white/70 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span>Venture Ambition Description</span>
                  </label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Briefly describe what you're intending to design or code..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all font-medium placeholder:text-white/20 resize-none"
                  />
                </div>

                {/* Submit trigger */}
                <button
                  type="submit"
                  className="w-full text-center py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest primary-gradient text-white hover:opacity-95 transition-all shadow-xl mt-4 cursor-pointer focus:outline-none"
                >
                  Log Booking Inquiry
                </button>

              </form>

              {/* Right simulated roadmap milestones panel */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-primary/10 blur-[50px] rounded-full pointer-events-none -translate-y-12 translate-x-12" />
                
                <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-[0.21em] text-white/40 mb-2 font-display">
                    Simulated Sprints Roadmap
                  </h4>
                  <h3 className="font-display text-lg font-bold text-white mb-6 leading-relaxed">
                    Milestone Delivery
                  </h3>

                  {/* Milestone lines */}
                  <div className="space-y-6 relative pl-4 border-l border-white/10 font-sans">
                    {activeRoadmap.map((mile, mIdx) => (
                      <div key={mIdx} className="relative py-1">
                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary border-4 border-black" />
                        <span className="text-[10px] font-bold text-primary block mb-0.5">{mile.week}</span>
                        <p className="text-xs text-white/70 font-medium leading-relaxed">{mile.step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 bg-black/45 rounded-xl p-4.5 border border-white/5 font-sans">
                  <div className="flex gap-2 text-[10px] font-bold text-white uppercase mb-1 items-center">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Studio Lead Allocation</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Upon login, a Senior Solutions Architect is assigned within 4 working hours of Dhaka Standard operation. Code tests are configured automatically.
                  </p>
                </div>

              </div>

            </motion.div>
          ) : (
            
            // Submitting Success Card Ticket State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-black/45 backdrop-blur-2xl border border-white/12 rounded-[3rem] p-10 md:p-16 text-center shadow-3xl flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 mb-8 animate-pulse">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h2 className="font-display text-3xl font-extrabold text-white mb-3">
                Inquiry Logged Successfully
              </h2>

              <p className="text-white/60 text-xs sm:text-sm max-w-md leading-relaxed font-sans mb-8">
                Thank you, <span className="text-white font-bold">{formData.name}</span>. Your booking estimate ticket has been processed by our server-side router. Our Dhaka engineering team will connect via <span className="text-white font-bold">{formData.email}</span>.
              </p>

              {/* Booking Ticket Details Sheet */}
              <div className="w-full bg-[#0b1326] border border-white/8 rounded-2xl p-6 text-left mb-10 font-sans text-xs">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-primary mb-4 block font-display">
                  Official Studio Ticket Summary
                </h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-white/60">
                  <div>
                    <span className="text-[10px] font-bold text-white/40 block mb-0.5">Ticket Reference</span>
                    <span className="font-mono text-white font-bold tracking-wide">{ticketRef}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/40 block mb-0.5">Venture Group</span>
                    <span className="text-white font-medium uppercase font-mono">{formData.ventureGroup} Sprints</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/40 block mb-0.5">Target Budget Limit</span>
                    <span className="text-white font-semibold">${formData.budget} EST</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/40 block mb-0.5">Status</span>
                    <span className="text-green-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Queueing Assignment
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSubmitted(false)}
                className="px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer focus:outline-none"
              >
                Log another inquiry
              </button>

            </motion.div>
          )}
        </AnimatePresence>

      </section>

    </div>
  );
}

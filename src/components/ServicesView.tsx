import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brush, 
  Terminal, 
  Megaphone, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { PageType, ServiceDetail } from '../types';

interface ServicesProps {
  onPageChange: (page: PageType) => void;
  onSetInquiryPreset: (preset: string) => void;
}

const DIVISIONS = [
  {
    id: "creative",
    title: "GalaxaTech Creative",
    tagline: "Avant-Garde UI/UX & Brand Design Studio",
    icon: Brush,
    price: "$2,800",
    color: "from-primary/20 to-primary/5",
    accent: "text-primary border-primary/20",
    bentoHeader: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvEFPfB8GtdlYUeTiz-4dQ9IQrt1C8Anbk4ltjkUS8N0sIJAviSus6Yh2ov_IKcDW_zYBCrEjx6Yv5DR0Grz2qjhOQZWT7Z1e9jsHG4oDBFe59dkwxxOheAOGCKvBZ5AlNcdzTFOwx4D4GI8e88_cBnjMGF9HkR6IRILMXfpxK2Se0YlqNpEPS9cw3HlurX-ciybxaY4FkY_f_weKy1n5Dd_Ux79d_aEABj1UgSvnAhZRZUtruWW90RRBAI2dl0emFO4bsjJBng6E",
    features: [
      "Dynamic typography & graphic design systems",
      "Interactive high-fidelity Figma prototypes",
      "Comprehensive digital brand manuals",
      "1 Dedicated senior designer",
      "Unlimited feedback iterations",
      "Weekly design reviews in Slack"
    ]
  },
  {
    id: "dev",
    title: "GalaxaTech Software",
    tagline: "High-Octane Full-Stack Engineering Forge",
    icon: Terminal,
    price: "$4,500",
    color: "from-blue-500/20 to-blue-500/5",
    accent: "text-tertiary border-tertiary/20",
    bentoHeader: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjQ5sP8dVfbWPzUI062A6VR2rbpzdaMI9V6jyDD1K0Ey8PuLxUGESg28nw-85mxJDBwYzzEsUu0oKovGlRD800kTb5jFUNIQMTWRzKC_4Vhdhye0txxBq0XnbckCr_jXo9nCsV5tYPT_Sx6nVTUoyoth2gkcAlj5KlbSyrrDw0JU5ojp8uzkNYHadobD1ynCRbveoGPoxxDam3krGNpvwMfyCYGc4vJ_I-qw3lKT0QLdyinIT5iWPKTxNxSjx5auscHuL6fLhxd-A",
    features: [
      "Performance-tuned TypeScript React/Vite setups",
      "Bespoke backend APIs with secure API key proxying",
      "Comprehensive automated linting & type safety tests",
      "2 Dedicated senior full-stack developers",
      "GitHub pull request staging dashboards",
      "Continuous support & technical documentation"
    ]
  },
  {
    id: "connect",
    title: "GalaxaTech Connect",
    tagline: "Strategic Conversion, Growth & SEO Division",
    icon: Megaphone,
    price: "$1,600",
    color: "from-secondary/20 to-secondary/5",
    accent: "text-secondary border-secondary/20",
    bentoHeader: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6eaROwD9hbriZlnyZIF2HQA5nJ_Mf-XPIz_eHw8WBUj-BYtWAe_InluLBG64WYjbiu4vA8fRtEYq8eVvT3efDQAwkLoqZ4Y_DTqXCNeMQ5Rquy2jN5i0kQRm5KOw3v5NvnXwfrlqfF9Y25Du3D8nmaUKQsBftikByMN3xoTKk3KamVGTV2OhWODBXEqMeqU1433qYkaT07MG5t9RQXop8tAxK_0ivbRO5utoRn6aMYZ4p1EqmOhQSyVZmIOpl75NzjfQUItmIYKs",
    features: [
      "Comprehensive search positioning audit",
      "Continuous optimization of dynamic keywords",
      "Conversion rate optimization (CRO) funnel audits",
      "Google Analytics & Mixpanel configuration",
      "Monthly campaign reports and insight analysis",
      "1 Dedicated campaign operations manager"
    ]
  }
];

export default function ServicesView({ onPageChange, onSetInquiryPreset }: ServicesProps) {
  const [selectedDivision, setSelectedDivision] = useState<string>("dev");
  
  // Interactive Launch Cost Estimator variables
  const [serviceType, setServiceType] = useState<'design' | 'dev' | 'both'>('dev');
  const [scaleSize, setScaleSize] = useState<'startup' | 'business' | 'enterprise'>('business');
  const [urgencyMode, setUrgencyMode] = useState<'flexible' | 'standard' | 'express'>('standard');

  const getEstimatedPrice = () => {
    let base = 0;
    if (serviceType === 'design') base = 3500;
    else if (serviceType === 'dev') base = 6000;
    else base = 8500; // both

    let scaleMulti = 1;
    if (scaleSize === 'startup') scaleMulti = 0.8;
    else if (scaleSize === 'enterprise') scaleMulti = 1.8;

    let urgencyMulti = 1.0;
    if (urgencyMode === 'flexible') urgencyMulti = 0.9;
    else if (urgencyMode === 'express') urgencyMulti = 1.25;

    return Math.round(base * scaleMulti * urgencyMulti);
  };

  const handleApplyEstimate = () => {
    const selectedServiceLabel = serviceType === 'design' ? 'Creative UI/UX' : serviceType === 'dev' ? 'Full-Stack Development' : 'Creative Design + Software Dev';
    const selectedScaleLabel = scaleSize === 'startup' ? 'Startup Launch' : scaleSize === 'business' ? 'Standard Business' : 'Luxury Enterprise';
    const estimateTotal = getEstimatedPrice();
    const presetText = `Hi GalaxaTech, I ran your Cost Estimator tool and would like to register a project. Service: ${selectedServiceLabel}, Scale: ${selectedScaleLabel}, Budget Range: $${estimateTotal}. Let's chat!`;

    onSetInquiryPreset(presetText);
    onPageChange('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative pt-32 pb-24 text-left">
      
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <span className="text-primary font-bold tracking-[0.25em] text-xs uppercase mb-3 block">
          Core Divisions
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight max-w-3xl mx-auto">
          Three Focused Divisions. <br />
          <span className="text-gradient">One Unified Standard.</span>
        </h1>
        <p className="text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
          We combine avant-garde system visualizers with high-performance code pipelines. No buffers, no delays. Optimized for velocity.
        </p>

        {/* Tab Selection */}
        <div className="flex justify-center mt-12">
          <div className="p-1 glass-card rounded-full flex gap-1">
            {DIVISIONS.map((div) => (
              <button
                key={div.id}
                onClick={() => setSelectedDivision(div.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                  selectedDivision === div.id 
                    ? 'primary-gradient text-white shadow-lg' 
                    : 'text-white/65 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center bg-black/30 text-white">
                  <div className={`w-3 h-3 ${selectedDivision === div.id ? 'text-white' : 'text-white/50'}`}>&bull;</div>
                </div>
                <span>{div.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. active Plan breakdown */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <AnimatePresence mode="wait">
          {DIVISIONS.filter(d => d.id === selectedDivision).map((div) => {
            const IconComponent = div.icon;
            return (
              <motion.div
                key={div.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-black/35 backdrop-blur-2xl rounded-[3rem] p-8 md:p-14 border border-white/10 shadow-3xl text-left"
              >
                {/* Details side */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold tracking-widest uppercase mb-6">
                      <IconComponent className="w-3.5 h-3.5 text-primary" />
                      <span>{div.title}</span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-3">
                      {div.tagline}
                    </h2>
                    <p className="text-white/60 text-xs sm:text-sm mb-8 leading-relaxed font-sans max-w-lg">
                      We offer full deployment support, high client communication, and complete transparency. Rest assured, your visual brand guidelines are maintained securely.
                    </p>

                    <ul className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {div.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2.5 text-xs text-white/70">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="font-sans leading-relaxed">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <button 
                      onClick={handleApplyEstimate}
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-extrabold uppercase tracking-widest primary-gradient text-white hover:opacity-90 shadow-2xl transition-all cursor-pointer focus:outline-none"
                    >
                      <span>Inquire division package</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Cover side */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-white/5 border border-white/10 rounded-[2rem] p-8 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/10 blur-[60px] rounded-full pointer-events-none -translate-y-12 translate-x-12" />
                  
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2">Package Investment</h4>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="font-display text-4xl sm:text-5xl font-black text-white">{div.price}</span>
                      <span className="text-white/45 text-xs">/ month starting</span>
                    </div>
                    <div className="h-[1.5px] bg-white/10 w-full mb-6" />
                  </div>

                  <p className="text-white/50 text-xs leading-relaxed font-sans mb-8">
                    Get priority designer & developer support directly in Slack/GitHub. Flexible 30-day cancellation and clear audit reporting logs on demand.
                  </p>

                  <div className="bg-black/40 rounded-xl p-4.5 border border-white/5">
                    <h5 className="text-[10px] uppercase font-bold text-white/80 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      <span>Dhaka Studio standard</span>
                    </h5>
                    <p className="text-[10px] text-white/40 leading-relaxed font-sans">
                      All systems are built using our strict internal audit, keeping responsive code and semantic accessibility standard.
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </section>

      {/* 3. Interactive Custom Cost Estimator (Highly Interactive UI) */}
      <section className="py-24 bg-[#060d20]/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-secondary font-bold tracking-[0.2em] text-xs uppercase mb-1 block">Dynamic Plan Sandbox</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">Create Your Sprints Estimate</h2>
            <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto mt-2 font-sans">
              Adjust variables like scale, velocity, and design requirements to calculate an instant estimated timeline budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 bg-black/40 rounded-[2.5rem] p-6 sm:p-12 border border-white/8 text-left">
            {/* Variables Panel */}
            <div className="md:col-span-8 flex flex-col gap-8">
              
              {/* Option 1: Venture Service Division */}
              <div>
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-white/50 mb-3.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Venture Service Selection</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => setServiceType('design')}
                    className={`p-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between min-h-[90px] focus:outline-none cursor-pointer ${
                      serviceType === 'design' 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-white/5 border-white/8 text-white/60 hover:border-white/15'
                    }`}
                  >
                    <Brush className="w-4 h-4 mb-3 text-primary" />
                    <span>Creative UI/UX Design</span>
                  </button>
                  <button 
                    onClick={() => setServiceType('dev')}
                    className={`p-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between min-h-[90px] focus:outline-none cursor-pointer ${
                      serviceType === 'dev' 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-white/5 border-white/8 text-white/60 hover:border-white/15'
                    }`}
                  >
                    <Terminal className="w-4 h-4 mb-3 text-tertiary" />
                    <span>Software Engineering</span>
                  </button>
                  <button 
                    onClick={() => setServiceType('both')}
                    className={`p-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between min-h-[90px] focus:outline-none cursor-pointer ${
                      serviceType === 'both' 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-white/5 border-white/8 text-white/60 hover:border-white/15'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mb-3 text-secondary" />
                    <span>Design + Development</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Project Scale Size */}
              <div>
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-white/50 mb-3.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Target Project Scale</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => setScaleSize('startup')}
                    className={`p-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between min-h-[90px] focus:outline-none cursor-pointer ${
                      scaleSize === 'startup' 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-white/5 border-white/8 text-white/60 hover:border-white/15'
                    }`}
                  >
                    <span className="text-[10px] text-white/40 block mb-3">0-1 Prototype</span>
                    <span>Startup MVP Launch</span>
                  </button>
                  <button 
                    onClick={() => setScaleSize('business')}
                    className={`p-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between min-h-[90px] focus:outline-none cursor-pointer ${
                      scaleSize === 'business' 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-white/5 border-white/8 text-white/60 hover:border-white/15'
                    }`}
                  >
                    <span className="text-[10px] text-white/40 block mb-3">Custom System</span>
                    <span>Standard Scale system</span>
                  </button>
                  <button 
                    onClick={() => setScaleSize('enterprise')}
                    className={`p-4 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between min-h-[90px] focus:outline-none cursor-pointer ${
                      scaleSize === 'enterprise' 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-white/5 border-white/8 text-white/60 hover:border-white/15'
                    }`}
                  >
                    <span className="text-[10px] text-white/40 block mb-3">Full Infrastructure</span>
                    <span>Luxury Enterprise</span>
                  </button>
                </div>
              </div>

              {/* Option 3: Lead Urgency Mode */}
              <div>
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-white/50 mb-3.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Sprint Urgency & Timeline</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => setUrgencyMode('flexible')}
                    className={`p-4 rounded-xl text-xs font-bold border justify-between transition-all text-left flex flex-col min-h-[90px] focus:outline-none cursor-pointer ${
                      urgencyMode === 'flexible' 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-white/5 border-white/8 text-white/60 hover:border-white/15'
                    }`}
                  >
                    <span className="text-[10px] text-white/40 mb-3">12+ Weeks</span>
                    <span>Flexible Support</span>
                  </button>
                  <button 
                    onClick={() => setUrgencyMode('standard')}
                    className={`p-4 rounded-xl text-xs font-bold border justify-between transition-all text-left flex flex-col min-h-[90px] focus:outline-none cursor-pointer ${
                      urgencyMode === 'standard' 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-white/5 border-white/8 text-white/60 hover:border-white/15'
                    }`}
                  >
                    <span className="text-[10px] text-white/40 mb-3">6-10 Weeks</span>
                    <span>Standard Sprints</span>
                  </button>
                  <button 
                    onClick={() => setUrgencyMode('express')}
                    className={`p-4 rounded-xl text-xs font-bold border justify-between transition-all text-left flex flex-col min-h-[90px] focus:outline-none cursor-pointer ${
                      urgencyMode === 'express' 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-white/5 border-white/8 text-white/60 hover:border-white/15'
                    }`}
                  >
                    <span className="text-[10px] text-secondary font-black mb-3">&#9889; 4-5 Weeks</span>
                    <span>Express Delivery</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Calculated Estimate Box */}
            <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6.5 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-secondary/10 blur-[50px] rounded-full pointer-events-none -translate-y-12 translate-x-12" />
              
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2">Calculated Estimate</h4>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="font-display text-4xl font-black text-white">${getEstimatedPrice().toLocaleString()}</span>
                  <span className="text-white/40 text-[11px]">one-off est.</span>
                </div>
                <div className="h-[1px] bg-white/10 w-full mb-6" />
                
                <div className="space-y-3 font-sans text-xs text-white/60 mb-8">
                  <div className="flex justify-between">
                    <span>Active Engineers:</span>
                    <span className="text-white font-medium">{serviceType === 'both' ? '3 Leads' : '1.5 Leads'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Wireframing:</span>
                    <span className="text-white font-medium">{serviceType !== 'dev' ? 'Figma System' : 'Standard Web'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Sprints Duration:</span>
                    <span className="text-white font-semibold">
                      {urgencyMode === 'express' ? '4 Weeks (Fast)' : urgencyMode === 'flexible' ? '12 Weeks' : '8 Weeks'}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleApplyEstimate}
                className="w-full text-center py-3 rounded-full text-xs font-bold uppercase tracking-wider primary-gradient text-white hover:opacity-95 transition-all text-white/95 cursor-pointer focus:outline-none"
              >
                Inquire With Estimate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Partner With Us section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6 text-left">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-1 block">Value Proposition</span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              A Partnership Driven by <br />
              <span className="text-gradient">Total Transparency</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed font-sans mt-2">
              Unlike legacy design agencies who build assets in silos, we invite our clients directly into our Slack war-rooms and GitHub repositories. You track progress as code commits are pushed daily.
            </p>

            <div className="mt-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Weekly Incremental Audits</h4>
                  <p className="text-xs text-white/55 font-sans leading-relaxed">
                    Every Friday, our clients receive a video screencast outlining our exact completed development sprints.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">State-of-The-Art Tech Stock</h4>
                  <p className="text-xs text-white/55 font-sans leading-relaxed">
                    We deploy entirely using blazing-fast compiled assets (compiled via Vite/ESbuild) securing lightning cold boots on production.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-video lg:aspect-square bg-[#061025] rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
            <img 
              alt="Rigorous Development Sprint" 
              className="w-full h-full object-cover grayscale opacity-75 object-center" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6eaROwD9hbriZlnyZIF2HQA5nJ_Mf-XPIz_eHw8WBUj-BYtWAe_InluLBG64WYjbiu4vA8fRtEYq8eVvT3efDQAwkLoqZ4Y_DTqXCNeMQ5Rquy2jN5i0kQRm5KOw3v5NvnXwfrlqfF9Y25Du3D8nmaUKQsBftikByMN3xoTKk3KamVGTV2OhWODBXEqMeqU1433qYkaT07MG5t9RQXop8tAxK_0ivbRO5utoRn6aMYZ4p1EqmOhQSyVZmIOpl75NzjfQUItmIYKs"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-8 flex items-baseline justify-between text-left">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1">Dhaka Engineering HQ</p>
                <h5 className="font-display text-sm font-bold text-white">Interactive Software Sandbox</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

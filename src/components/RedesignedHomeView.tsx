import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Info, Sparkles, X, Mail, Lock, Zap, Terminal, Code, Cpu, Layers, Star, Phone, Facebook, Twitter } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Counter from './shared/Counter';

interface Props {
  isDhakaOpen: boolean;
  dhakaTime: string;
  currentUser: any | null;
}

const HERO_BG = '#f6eadf';
const DARK_BG = '#080810';
const CARD_BG = '#151515';

const GLASS_STYLE: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.065), rgba(255,255,255,0.018))',
  border: '1px solid rgba(255,255,255,0.15)',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 28px rgba(255,77,6,0.05), 0 20px 60px rgba(0,0,0,0.50)',
};

const FRAME_ASPECT = 1600 / 900;

function useCoverBox(ref: React.RefObject<HTMLElement>, aspect: number) {
  const [box, setBox] = useState({ width: 0, height: 0, left: 0, top: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const cw = el.clientWidth, ch = el.clientHeight;
      if (!cw || !ch) return;
      const containerAspect = cw / ch;
      const width = containerAspect < aspect ? ch * aspect : cw;
      const height = containerAspect < aspect ? ch : cw / aspect;
      setBox({ width, height, left: (cw - width) / 2, top: (ch - height) / 2 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, aspect]);
  return box;
}

// ==========================================
// 1. HERO SECTION
// ==========================================
function HeroSection({ isDhakaOpen, dhakaTime }: { isDhakaOpen: boolean; dhakaTime: string }) {
  const navigate = useNavigate();
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: 'auto' }); };

  const glassPill: React.CSSProperties = {
    background: 'linear-gradient(160deg, rgba(255,255,255,0.7), rgba(255,255,255,0.32))',
    backdropFilter: 'blur(16px) saturate(160%)',
    WebkitBackdropFilter: 'blur(16px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.55)',
    borderTop: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 14px 30px rgba(11,11,11,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
  };
  const orangeBadge: React.CSSProperties = {
    background: 'radial-gradient(circle at 35% 30%, #FF8A50 0%, #FF4D06 55%, #D93F00 100%)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -3px 6px rgba(0,0,0,0.15), 0 4px 10px rgba(255,77,6,0.4)',
  };

  return (
    <section className="relative w-full aspect-[16/9] overflow-hidden bg-[#f6eadf] text-[#0b0b0b] flex flex-col justify-between p-8 md:p-12">
      
      {/* Top Section: Dhaka Status */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 border border-black/5 bg-black/5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide">
          <Sparkles size={12} className="text-[#ff4d06]" />
          Systems-First Tech Agency
        </div>
        <div className="flex flex-col items-end gap-0.5 font-mono uppercase tracking-wider text-right text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isDhakaOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="font-bold">{isDhakaOpen ? 'Agents Active' : 'Agents Offline'}</span>
          </div>
          <div className="text-[10px] text-black/50">
            Studio time: <span className="text-[#ff4d06] font-bold">{dhakaTime}</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Main Text & Robot Illustration */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 flex-grow my-auto">
        <div className="max-w-2xl text-left">
          <h1 className="text-4xl md:text-[5.5rem] font-black font-display leading-[0.95] tracking-tight mb-4 uppercase">
            We're Not <br />
            Your Typical <br />
            <span className="text-[#ff4d06]">Agency.</span>
          </h1>
          <p className="text-xs md:text-sm text-black/60 font-mono max-w-md leading-relaxed">
            Strategy that drives growth. Daily deployment. Outlier logic. We replace manual workflows with automated deployment grids.
          </p>
        </div>

        {/* Coded SVG Robot Visualizer */}
        <div className="w-[300px] h-[300px] hidden md:flex items-center justify-center relative">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Robot Head */}
            <rect x="65" y="45" width="70" height="55" rx="10" fill="#2d2d3a" stroke="#0b0b0b" strokeWidth="3" />
            {/* Robot Screen */}
            <rect x="75" y="53" width="50" height="38" rx="6" fill="#1e1e24" stroke="#ff4d06" strokeWidth="1.5" />
            {/* Screen code lines */}
            <line x1="82" y1="62" x2="105" y2="62" stroke="#ff4d06" strokeWidth="2" strokeLinecap="round" />
            <line x1="82" y1="70" x2="118" y2="70" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
            <line x1="82" y1="78" x2="98" y2="78" stroke="#ff4d06" strokeWidth="2" strokeLinecap="round" />
            
            {/* Antennas */}
            <line x1="100" y1="45" x2="100" y2="25" stroke="#0b0b0b" strokeWidth="3" />
            <circle cx="100" cy="22" r="5" fill="#ff4d06" className="animate-pulse" />

            {/* Neck */}
            <rect x="90" y="100" width="20" height="15" fill="#4a4a5a" stroke="#0b0b0b" strokeWidth="3" />

            {/* Body */}
            <rect x="55" y="115" width="90" height="70" rx="12" fill="#2d2d3a" stroke="#0b0b0b" strokeWidth="3" />
            
            {/* Hands holding flower */}
            <path d="M 40,140 Q 55,145 65,135" fill="none" stroke="#0b0b0b" strokeWidth="3" />
            <path d="M 160,140 Q 145,145 135,135" fill="none" stroke="#0b0b0b" strokeWidth="3" />

            {/* Orange Flower */}
            <path d="M 100,145 C 90,135 110,135 100,125" fill="none" stroke="green" strokeWidth="2" />
            <circle cx="100" cy="120" r="6" fill="#ff4d06" />
            <circle cx="95" cy="116" r="4" fill="#FF8A50" />
            <circle cx="105" cy="116" r="4" fill="#FF8A50" />
            <circle cx="95" cy="124" r="4" fill="#FF8A50" />
            <circle cx="105" cy="124" r="4" fill="#FF8A50" />
          </svg>
        </div>
      </div>

      {/* Bottom Section: CTAs & Proof Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-black/5 pt-6">
        {/* Real CTAs */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => go('/audit')}
            style={glassPill}
            className="group flex items-center rounded-full cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg px-6 py-3 gap-3"
          >
            <span className="flex flex-col items-start leading-tight">
              <span className="font-extrabold uppercase tracking-wide text-[#0B0B0B] text-xs">Are you typical?</span>
              <span className="font-bold uppercase tracking-wide text-[#ff4d06] text-[10px]">Claim a free audit!</span>
            </span>
            <span style={orangeBadge} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </span>
          </button>
          
          <button
            onClick={() => go('/audit')}
            style={glassPill}
            className="group flex items-center rounded-full font-bold uppercase tracking-wide text-[#0B0B0B] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg px-6 py-3 gap-3 text-xs"
          >
            <span>Book an audit</span>
            <span style={orangeBadge} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </span>
          </button>
        </div>

        {/* proof counters */}
        <div className="flex items-center gap-6 sm:gap-12">
          <div className="text-center">
            <span className="block font-bold text-[#FF4D06] font-display text-lg tracking-tight">
              <Counter value={50} suffix="+" />
            </span>
            <span className="block font-mono tracking-[0.15em] text-zinc-500 text-[8px] uppercase">Projects Delivered</span>
          </div>
          <div className="w-px bg-zinc-300 h-6 flex-shrink-0" />
          <div className="text-center">
            <span className="block font-bold text-[#FF4D06] font-display text-lg tracking-tight">
              <Counter value={12} suffix="M+" />
            </span>
            <span className="block font-mono tracking-[0.15em] text-zinc-500 text-[8px] uppercase">Client Revenue</span>
          </div>
          <div className="w-px bg-zinc-300 h-6 flex-shrink-0" />
          <div className="text-center">
            <span className="block font-bold text-[#FF4D06] font-display text-lg tracking-tight">
              <Counter value={99.9} decimals={1} suffix="%" />
            </span>
            <span className="block font-mono tracking-[0.15em] text-zinc-500 text-[8px] uppercase">System Uptime</span>
          </div>
        </div>
      </div>

      {/* Shaded bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />
    </section>
  );
}

// ==========================================
// 2. SERVICES SECTION
// ==========================================
function ServicesSection() {
  const stats = [
    { label: "Delivery Speed", value: 10, suffix: "x" },
    { label: "Cost Offset", value: 3, display: "1/3" },
    { label: "Idea Focus", value: 100, suffix: "%" }
  ];

  return (
    <section className="relative w-full aspect-[16/9] overflow-hidden bg-[#080810] text-white flex flex-col justify-between p-8 md:p-12">
      
      {/* Top Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide w-fit text-[#ff4d06]">
          <Code size={12} />
          Systems Redefinition
        </div>
        <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight">
          Reimagining Web Development
        </h2>
        <p className="text-[10px] md:text-xs font-mono text-zinc-400">
          AI TAKES OVER. YOU FOCUS ON WHAT MATTERS.
        </p>
      </div>

      {/* Interactive Columns Comparison */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center my-auto">
        {/* The Old Way */}
        <div className="flex-1 border border-white/5 bg-white/[0.02] p-6 rounded-2xl flex flex-col justify-between relative group hover:border-red-500/20 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-zinc-500 uppercase">Traditional dev</span>
              <span className="text-red-500 font-mono text-[10px]">WEEKS TO MONTHS</span>
            </div>
            <h4 className="text-lg font-bold font-display text-zinc-400 mb-2">THE OLD WAY</h4>
            <ul className="text-[11px] font-mono text-zinc-500 space-y-2">
              <li>- Handcrafted markup and redundant code loops</li>
              <li>- Protracted visual layout approvals</li>
              <li>- Static, slow responsive iteration processes</li>
            </ul>
          </div>
          {/* Coded Typewriter SVG */}
          <div className="absolute right-4 bottom-4 w-12 h-12 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
              <rect x="10" y="50" width="80" height="40" rx="4" />
              <path d="M 20,50 L 20,20 L 80,20 L 80,50" />
              <line x1="30" y1="35" x2="70" y2="35" />
            </svg>
          </div>
        </div>

        {/* The AI Way */}
        <div className="flex-1 border border-[#ff4d06]/20 bg-[#ff4d06]/5 p-6 rounded-2xl flex flex-col justify-between relative group hover:border-[#ff4d06]/40 transition-all duration-300 shadow-[0_0_30px_rgba(255,77,6,0.05)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-[#ff4d06] uppercase">Galaxa Engine</span>
              <span className="text-[#ff4d06] font-mono text-[10px] font-bold">DAYS NOT WEEKS</span>
            </div>
            <h4 className="text-lg font-bold font-display text-[#ff4d06] mb-2">THE AI WAY</h4>
            <ul className="text-[11px] font-mono text-zinc-300 space-y-2">
              <li>+ Clean layouts output directly via design variables</li>
              <li>+ Interactive modular components compiled instantly</li>
              <li>+ Clean, scalable React + Tailwind architecture</li>
            </ul>
          </div>
          {/* Coded Laptop SVG */}
          <div className="absolute right-4 bottom-4 w-12 h-12 opacity-20 group-hover:opacity-45 transition-opacity text-[#ff4d06]">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
              <rect x="20" y="20" width="60" height="40" rx="4" />
              <path d="M 10,70 L 90,70 L 80,80 L 20,80 Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Counter Bar */}
      <div className="flex items-center justify-center gap-8 border-t border-white/5 pt-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FF4D06]" />
            <div>
              <span className="block font-bold text-[#FF4D06] font-display text-sm tracking-tight">
                {stat.display ?? <Counter value={stat.value} suffix={stat.suffix} />}
              </span>
              <span className="block font-mono text-zinc-500 text-[8px] uppercase">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Shaded gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />
    </section>
  );
}

// ==========================================
// 3. BILLBOARD SECTION
// ==========================================
function BillboardSection() {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setIsNight(prev => !prev), 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`relative w-full aspect-[16/9] overflow-hidden flex flex-col justify-center items-center p-8 transition-colors duration-1000 ${
      isNight ? 'bg-[#05050a] text-white' : 'bg-[#FAF7F2] text-[#0b0b0b]'
    }`}>
      
      {/* Real coded 3D perspective Billboard */}
      <div className={`w-full max-w-4xl p-10 border rounded-3xl transition-all duration-1000 flex flex-col justify-center items-center text-center relative ${
        isNight 
          ? 'border-white/5 bg-white/[0.01] shadow-[0_0_80px_rgba(0,240,255,0.03)]' 
          : 'border-black/5 bg-[#f6eadf] shadow-[0_0_80px_rgba(255,77,6,0.03)]'
      }`}>
        <span className="text-[#ff4d06] font-mono uppercase text-[10px] tracking-widest mb-4">Creative Manifesto</span>
        
        <h2 className="text-3xl md:text-6xl font-black font-display uppercase tracking-tight leading-none mb-6">
          Posting <br />
          Isn't <br />
          <span className={isNight ? 'text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'text-[#ff4d06]'}>
            {isNight ? 'Marketing' : 'Strategy'}
          </span>
        </h2>
        
        <p className={`text-[9px] font-mono uppercase tracking-widest ${isNight ? 'text-zinc-500' : 'text-black/50'}`}>
          {isNight ? 'WE CURATE BRANDS' : 'WE BUILD SYSTEM STRUCTURES'}
        </p>
      </div>

      {/* Shaded gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />
    </section>
  );
}

// ==========================================
// 4. PROCESS SECTION
// ==========================================
function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const progressTransform = useTransform(scrollYProgress, [0.15, 0.6], [0, 0.72]);
  const progressSpring = useSpring(progressTransform, { stiffness: 100, damping: 30 });
  const progressScaleX = shouldReduceMotion ? 0.72 : progressSpring;

  const steps = [
    { title: "Autonomous Discovery", role: "Verification" },
    { title: "Dynamic Layout Generation", role: "Interface compilation" },
    { title: "Interactive Node Injection", role: "Custom modules" },
    { title: "Cloud Deployment Node", role: "Live updates" }
  ];

  return (
    <section ref={sectionRef} className="relative w-full aspect-[16/9] overflow-hidden bg-[#FAF7F2] text-[#0b0b0b] flex flex-col justify-between p-8 md:p-12">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 border border-black/5 bg-black/5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide w-fit">
          <Layers size={12} className="text-[#ff4d06]" />
          Operation Protocol
        </div>
        <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight">
          Luxurious Client Service
        </h2>
        <p className="text-[10px] md:text-xs font-mono text-black/50">
          YOUR OWNED CLIENT PORTAL NODE
        </p>
      </div>

      {/* Main Row: Client Portal Mockup Grid */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between my-auto">
        <div className="max-w-md">
          <h4 className="text-lg font-bold font-display uppercase mb-4">Dedicated Progress Tracking</h4>
          <p className="text-xs font-mono text-black/60 leading-relaxed mb-6">
            Log in to monitor development streams, review code revisions, and sync layouts directly inside your private portal node.
          </p>
        </div>

        {/* Mobile Mockup Portal Container */}
        <div className="w-[280px] border border-black/10 bg-white rounded-[32px] p-4 shadow-xl flex flex-col gap-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/5 pb-2">
            <span className="text-[10px] font-mono text-zinc-400">Portal Sync</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="border border-black/5 bg-[#f6eadf]/20 p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-[10px] text-black leading-tight">{step.title}</h5>
                  <p className="text-[8px] font-mono text-zinc-400 uppercase mt-0.5">{step.role}</p>
                </div>
                <div className="w-3.5 h-3.5 rounded-full border border-[#ff4d06] flex items-center justify-center">
                  {i === 0 && <div className="w-2 h-2 bg-[#ff4d06] rounded-full" />}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-[8px] font-mono text-zinc-400">
              <span>Overall Build Progress</span>
              <span>72%</span>
            </div>
            <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
              <motion.div style={{ scaleX: progressScaleX, originX: 0 }} className="h-full bg-[#ff4d06] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-black/5 pt-6 text-[10px] font-mono text-zinc-400 text-center">
        PROVED DEPLOYMENT METRICS · LIVE SYNCHRONIZATION
      </div>

      {/* Shaded gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />
    </section>
  );
}

// ==========================================
// 5. PORTFOLIO SECTION
// ==========================================
function PortfolioSection() {
  const navigate = useNavigate();

  const mockScreens = [
    { title: "Vesper.ai", role: "Analytics Dashboard", color: "from-cyan-950 to-[#080810]" },
    { title: "Elane Studio", role: "Aesthetic Portfolio", color: "from-purple-950 to-[#080810]" },
    { title: "Merova", role: "Finance Engine Panel", color: "from-amber-950 to-[#080810]" }
  ];

  return (
    <section className="relative w-full aspect-[16/9] overflow-hidden bg-[#080810] text-white flex flex-col justify-between p-8 md:p-12">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide w-fit text-[#ff4d06]">
          <Cpu size={12} />
          Systems Outputs
        </div>
        <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight">
          Brands We Built
        </h2>
        <p className="text-[10px] md:text-xs font-mono text-zinc-500">
          SELECT LIVE SHIELD PROJECTS
        </p>
      </div>

      {/* Mock Device Screens Grid */}
      <div className="flex flex-row justify-center gap-6 my-auto items-center overflow-x-auto py-4">
        {mockScreens.map((screen, idx) => (
          <div
            key={idx}
            onClick={() => { navigate('/portfolio'); window.scrollTo(0, 0); }}
            className={`w-[180px] h-[250px] border border-white/10 rounded-2xl p-3 flex flex-col justify-between bg-gradient-to-b ${screen.color} cursor-pointer hover:border-[#ff4d06]/40 transition-all duration-300 shadow-lg flex-shrink-0 group`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Mobile view</span>
              <ArrowUpRight size={12} className="text-zinc-500 group-hover:text-[#ff4d06] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div>
              <h4 className="font-bold text-sm mb-1 font-display tracking-tight">{screen.title}</h4>
              <p className="text-[8px] font-mono text-zinc-400 uppercase">{screen.role}</p>
            </div>

            {/* Simulated app screen elements */}
            <div className="space-y-1.5 border-t border-white/5 pt-2">
              <div className="h-1 bg-white/10 rounded-full w-2/3" />
              <div className="h-1.5 bg-[#ff4d06]/20 rounded-full w-full" />
              <div className="h-1 bg-white/10 rounded-full w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Proof bar */}
      <div className="border-t border-white/5 pt-6 text-[10px] font-mono text-zinc-500 text-center">
        CLICK CARD TO ACCESS FULL CASE STUDY REPORTS
      </div>

      {/* Shaded gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />
    </section>
  );
}

// ==========================================
// 6. BUILDERS SECTION
// ==========================================
function BuildersSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const box = useCoverBox(containerRef, FRAME_ASPECT);
  const fs = (fraction: number) => Math.max(9, box.width * fraction);

  const [toggled, setToggled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = () => {
    const next = !toggled;
    setToggled(next);
    if (next) setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), { email: email.trim(), joinedAt: serverTimestamp(), source: 'builders_program' });
      setSubmitted(true);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative w-full aspect-[16/9] overflow-hidden bg-[#080810] text-white flex flex-col justify-between p-8 md:p-12">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide w-fit text-[#ff4d06]">
          <Terminal size={12} />
          Collaborators Node
        </div>
        <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight">
          Galaxa Builder's Program
        </h2>
        <p className="text-[10px] md:text-xs font-mono text-zinc-500">
          WANNA JOIN THE GALAXA TEAM?
        </p>
      </div>

      {/* Coded Retro CRT Workstation UI */}
      <div ref={containerRef} className="flex flex-col md:flex-row gap-6 items-center justify-center my-auto relative">
        <div className="max-w-md text-center md:text-left">
          <h4 className="text-lg font-bold font-display uppercase mb-2">Systems Engineering Circle</h4>
          <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-6">
            We collaborate with elite engineers, designers, and systems architects to build premium interactive tools.
          </p>
        </div>

        {/* Real Toggle Switch aligned inside the component */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Enrollment Status</span>
          <div
            role="switch"
            aria-checked={toggled}
            aria-label="Join the Galaxa Builder's Program"
            onClick={handleToggle}
            className="relative flex items-center rounded-full cursor-pointer select-none hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            style={{
              width: fs(0.12),
              height: fs(0.026),
              padding: fs(0.002),
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255, 77, 6, 0.25)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: fs(0.002),
                left: fs(0.002),
                width: fs(0.056),
                height: fs(0.020),
                borderRadius: '999px',
                background: '#FF4D06',
                transform: toggled ? `translateX(${fs(0.059)}px)` : 'translateX(0px)',
                transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 12px rgba(255, 77, 6, 0.3)',
              }}
            />
            <span style={{ fontSize: fs(0.0055), color: toggled ? 'rgba(255,255,255,0.4)' : '#0B0B0B' }} className="relative z-10 flex-1 text-center font-bold uppercase tracking-wider transition-colors duration-300 font-display">
              Still not
            </span>
            <span style={{ fontSize: fs(0.0055), color: toggled ? '#0B0B0B' : 'rgba(255,255,255,0.4)' }} className="relative z-10 flex-1 text-center font-bold uppercase tracking-wider transition-colors duration-300 font-display">
              In
            </span>
          </div>
        </div>
      </div>

      {/* Shaded gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10" />

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-sm p-5 sm:p-8"
              style={{ ...GLASS_STYLE, borderRadius: '24px', borderColor: 'rgba(255,77,6,0.45)', boxShadow: '0 0 80px rgba(255,77,6,0.30), inset 0 1px 0 rgba(255,255,255,0.1)' }}
            >
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <X className="w-4 h-4 text-white/60" />
              </button>

              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <Sparkles className="w-8 h-8" style={{ color: '#FF4D06' }} />
                  <p className="text-white font-bold text-lg font-display">You're in the circle.</p>
                  <p className="text-white/40 text-sm">We'll reach out with opportunities first.</p>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-full border border-[#FF4D06]/20 flex items-center justify-center mb-5" style={{ background: 'rgba(255,77,6,0.08)' }}>
                    <Mail className="w-5 h-5 text-[#FF4D06]" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1 font-display">Join the Galaxa Builders</h3>
                  <p className="text-white/45 text-sm mb-5 leading-relaxed">Get early access, opportunities, and builder-only updates.</p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label htmlFor="builders-email" className="sr-only">Email address</label>
                    <input
                      id="builders-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: submitting ? 'rgba(255,77,6,0.5)' : '#FF4D06', color: '#0B0B0B', boxShadow: '0 8px 30px rgba(255,77,6,0.35)' }}
                    >
                      {submitting ? 'Sending…' : <>Join the circle <ArrowUpRight className="w-4 h-4" /></>}
                    </button>
                    <p className="text-white/25 text-[11px] text-center flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> No spam. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ==========================================
// 7. FOOTER IMAGE SECTION
// ==========================================
function FooterImageSection() {
  const navigate = useNavigate();
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <footer className="relative w-full aspect-[16/9] overflow-hidden bg-[#080810] text-white flex flex-col justify-between p-8 md:p-12">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center">
            <img alt="GalaxaTech" className="w-7 h-7 object-contain" src="/logo-light.png" />
          </div>
          <div>
            <h4 className="font-display text-lg font-bold tracking-wider uppercase leading-none mb-1">GalaxaTech</h4>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#FF4D06]">Strategy That Drives Growth.</p>
          </div>
        </div>

        <button
          onClick={() => go('/audit')}
          className="group flex items-center gap-3 text-[#0B0B0B] bg-[#FF4D06] hover:bg-[#FF4D06]/90 font-mono font-bold py-2.5 px-5 transition-all duration-300 text-xs"
        >
          <span className="w-5 h-5 bg-[#0B0B0B] text-[#FF4D06] flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
            <ArrowUpRight className="w-3 h-3" />
          </span>
          <span className="text-[10px] uppercase tracking-widest">Book a Free Audit</span>
        </button>
      </div>

      {/* Information columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-auto">
        <div>
          <h5 className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase mb-4 text-[#FF4D06]">Dhaka Studio</h5>
          <p className="text-[11px] font-mono text-zinc-400 leading-relaxed max-w-xs">
            Systems-driven creative tech agency building digital platforms for global brands from Dhaka, BD.
          </p>
        </div>

        <div>
          <h5 className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase mb-4 text-[#FF4D06]">Inquire</h5>
          <ul className="text-[11px] font-mono text-zinc-400 space-y-1.5">
            <li>Email: mail.galaxatech@gmail.com</li>
            <li>Tel: +880 1959 209103</li>
          </ul>
        </div>

        <div>
          <h5 className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase mb-4 text-[#FF4D06]">Company</h5>
          <div className="flex gap-4 text-[11px] font-mono text-zinc-400">
            <button onClick={() => go('/about')} className="hover:text-white transition-colors">About</button>
            <button onClick={() => go('/portfolio')} className="hover:text-white transition-colors">Portfolio</button>
            <button onClick={() => go('/gbp')} className="hover:text-white transition-colors">Builders</button>
            <button onClick={() => go('/contact')} className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </div>

      {/* Bottom Bar info */}
      <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center text-[9px] font-mono text-zinc-500 gap-4">
        <span>© 2026 GalaxaTech. All rights reserved.</span>
        <div className="flex gap-4">
          <button onClick={() => go('/privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
          <button onClick={() => go('/terms')} className="hover:text-white transition-colors">Terms of Service</button>
        </div>
      </div>

      {/* Shaded gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-10" />
    </footer>
  );
}

// ==========================================
// MAIN HOMEPAGE VIEW
// ==========================================
export default function RedesignedHomeView({ isDhakaOpen, dhakaTime }: Props) {
  return (
    <div className="bg-black flex flex-col gap-8 md:gap-12">
      <HeroSection isDhakaOpen={isDhakaOpen} dhakaTime={dhakaTime} />
      <ServicesSection />
      <BillboardSection />
      <ProcessSection />
      <PortfolioSection />
      <BuildersSection />
      <FooterImageSection />
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight,
  Laptop, Smartphone, TrendingUp, Cpu, Brush, Workflow,
  Globe, MessageCircle, Sparkles, Send,
  Search, Code2, Rocket, Shield, Package, FileText, Mail,
  Zap, Users, CheckCircle, X,
  HelpCircle, Clock, DollarSign, BookOpen, Monitor, PhoneCall,
  FolderOpen, Lock,
} from 'lucide-react';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../lib/mockData';
import GalaxyBackground from './shared/GalaxyBackground';
import Counter from './shared/Counter';
import SpotlightCard from './shared/SpotlightCard';
import InteractiveGlobe from './shared/InteractiveGlobe';

interface HomeViewProps {
  isDhakaOpen: boolean;
  dhakaTime: string;
  currentUser: any | null;
}

const TYPEWRITER_WORDS = ['Website Presence', 'Social Media Engagement', 'Client conversion'];

const SERVICES = [
  { num: '01', icon: Laptop,         label: 'Web Development',         desc: 'Fast, secure, and scalable websites built for performance and growth.',              anchor: 'web-development',    color: '#FF7A45' },
  { num: '02', icon: Smartphone,     label: 'App Development',         desc: 'High-performance mobile and web apps tailored to user needs and business goals.',    anchor: 'app-development',    color: '#EC1E8E' },
  { num: '03', icon: MessageCircle,  label: 'Social Media & Content',  desc: 'Engaging content and social strategies that build brand presence and loyalty.',      anchor: 'social-media',       color: '#5B23A8' },
  { num: '04', icon: Cpu,            label: 'AI & Automation',         desc: 'Intelligent automation that streamlines workflows and boosts productivity.',          anchor: 'ai-automation',      color: '#EC1E8E' },
  { num: '05', icon: Brush,          label: 'Brand Identity & Design', desc: 'Distinctive visuals and brand experiences that leave a lasting impression.',         anchor: 'brand-identity',     color: '#FF7A45' },
  { num: '06', icon: Workflow,       label: 'Systems Consulting',      desc: 'Strategic guidance and system architectures that drive sustainable growth.',         anchor: 'systems-consulting', color: '#5B23A8' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Discover',   desc: 'Understand goals, users, and opportunities.',       Icon: Search   },
  { num: '02', title: 'Strategize', desc: 'Shape the roadmap, system, and execution plan.',    Icon: Workflow },
  { num: '03', title: 'Build',      desc: 'Design and develop the core solution.',             Icon: Code2    },
  { num: '04', title: 'Deploy',     desc: 'Launch, refine, and optimize for growth.',          Icon: Rocket   },
];

const PROJECTS = [
  { slug: 'harmans-trading',  num: '01', name: 'Harmans Trading',  type: 'Trading Platform',      color: '#FF7A45', bg: 'linear-gradient(135deg,rgba(255,122,69,0.28) 0%,rgba(236,30,142,0.25) 60%,rgba(0,0,0,0.6) 100%)' },
  { slug: 'sunnah-grandeur',  num: '02', name: 'Sunnah Grandeur',  type: 'E-Commerce Platform',   color: '#EC1E8E', bg: 'linear-gradient(135deg,rgba(236,30,142,0.3) 0%,rgba(91,35,168,0.25) 60%,rgba(0,0,0,0.6) 100%)' },
  { slug: 'salfas-bazar',     num: '03', name: 'Salfas Bazar',     type: 'Organic Food Platform', color: '#5B23A8', bg: 'linear-gradient(135deg,rgba(91,35,168,0.3) 0%,rgba(236,30,142,0.2) 60%,rgba(0,0,0,0.6) 100%)' },
];

const FAQS = [
  { icon: Users,         q: 'What kind of businesses do you work with?', a: 'We work with startups, SMEs, and established businesses across multiple countries, primarily in tech, e-commerce, and service industries.' },
  { icon: Clock,         q: 'How long does a typical project take?',     a: 'Timelines vary by scope. A website takes 2–4 weeks; a full app can take 6–10 weeks. We agree on timelines upfront.' },
  { icon: DollarSign,    q: 'How does pricing work?',                    a: 'Projects are quoted individually based on scope. We provide a detailed proposal before any agreement is signed.' },
  { icon: BookOpen,      q: 'What is the Galaxa Builders Program?',      a: 'GBP is our execution ecosystem for students. Real projects, real tasks, real output. Not a course — an experience.' },
  { icon: Monitor,       q: 'How do I track my project?',                a: 'Every client gets access to a dedicated Client Hub — a private dashboard with live progress, updates, documents, and direct team contact.' },
  { icon: PhoneCall,     q: 'Can I book a free consultation?',           a: "Yes. Book an audit or reach out via WhatsApp. We'll respond within 24 hours." },
];

const WHY_CHOOSE_US = [
  { icon: Workflow,      title: 'Systems-First Approach',              desc: 'We architect before we build — strategy is never an afterthought.' },
  { icon: Rocket,        title: 'End-to-End Delivery',                 desc: 'From strategy through deployment, one team owns the entire journey.' },
  { icon: Users,         title: 'Builders Mindset',                    desc: 'We run our own builder program — execution is in our DNA.' },
  { icon: Globe,         title: 'Global Standards, Local Understanding', desc: 'Serving clients across continents with cultural context built in.' },
  { icon: MessageCircle, title: 'Fast, Transparent Communication',     desc: 'WhatsApp-first, real-time updates — you are never left guessing.' },
];

const COUNTRIES = [
  { flag: '🇺🇸', name: 'USA',          code: 'us' },
  { flag: '🇬🇧', name: 'UK',           code: 'gb' },
  { flag: '🇵🇰', name: 'Pakistan',     code: 'pk' },
  { flag: '🇸🇦', name: 'Saudi Arabia', code: 'sa' },
  { flag: '🇮🇳', name: 'India',        code: 'in' },
  { flag: '🇧🇩', name: 'Bangladesh',   code: 'bd' },
];

const GLASS_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '20px',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 28px rgba(236,30,142,0.05), 0 20px 60px rgba(0,0,0,0.50)',
};

function getCarouselOffset(i: number, active: number, total: number): number {
  let offset = i - active;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

export default function HomeView({ isDhakaOpen, dhakaTime, currentUser }: HomeViewProps) {
  const navigate = useNavigate();
  const { isDemo } = useAuth();

  const [wordIndex, setWordIndex] = useState(0);
  const [buildMins, setBuildMins] = useState(42);
  const [activeBuildersCount, setActiveBuildersCount] = useState<number | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCarouselIndex, setHoveredCarouselIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragRef = useRef<{ startX: number; moved: boolean } | null>(null);
  const [illuminatedSteps, setIlluminatedSteps] = useState<Set<number>>(new Set());
  const [folderHovered, setFolderHovered] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [circleModalOpen, setCircleModalOpen] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [carouselAutoScrollDir, setCarouselAutoScrollDir] = useState<'left' | 'right' | null>(null);
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isDemo) {
          const count = mockDb.getGbpApps().filter(a => a.status === 'approved').length;
          if (!cancelled) setActiveBuildersCount(count);
        } else {
          const snap = await getCountFromServer(query(collection(db, 'gbp_applications'), where('status', '==', 'accepted')));
          if (!cancelled) setActiveBuildersCount(snap.data().count);
        }
      } catch {
        // leave as null — badge is simply omitted
      }
    })();
    return () => { cancelled = true; };
  }, [isDemo]);

  useEffect(() => {
    const m = new Date().getMinutes();
    setBuildMins(m === 0 ? 60 : m);
    const iv = setInterval(() => setBuildMins(p => p >= 59 ? 1 : p + 1), 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setWordIndex(p => (p + 1) % TYPEWRITER_WORDS.length), 3200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setIlluminatedSteps(prev => new Set([...prev, i])); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    if (!carouselAutoScrollDir) { autoScrollTimerRef.current = null; return; }
    autoScrollTimerRef.current = setInterval(() => {
      if (carouselAutoScrollDir === 'right') setActiveIndex((p: number) => (p + 1) % SERVICES.length);
      else setActiveIndex((p: number) => (p - 1 + SERVICES.length) % SERVICES.length);
    }, 900);
    return () => { if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current); };
  }, [carouselAutoScrollDir]);

  const carouselPrev = () => setActiveIndex((p: number) => (p - 1 + SERVICES.length) % SERVICES.length);
  const carouselNext = () => setActiveIndex((p: number) => (p + 1) % SERVICES.length);

  const handleCarouselPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { startX: e.clientX, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleCarouselPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const d = e.clientX - dragRef.current.startX;
    if (Math.abs(d) > 6) {
      dragRef.current.moved = true;
    }
    setDragOffset(d);
  };
  const handleCarouselPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const d = e.clientX - dragRef.current.startX;
    const xStep = isMobile ? 155 : 245;
    if (Math.abs(d) > xStep * 0.2) {
      if (d < 0) {
        carouselNext();
      } else {
        carouselPrev();
      }
    }
    setDragOffset(0);
    dragRef.current = null;
  };

  const handleToggle = () => {
    const next = !toggled;
    setToggled(next);
    if (next) setCircleModalOpen(true);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), { email: subEmail.trim(), joinedAt: serverTimestamp() });
      setSubmitted(true);
    } catch { setSubmitting(false); }
  };

  const maxIlluminated = illuminatedSteps.size > 0 ? Math.max(...illuminatedSteps) : -1;
  const lineProgress = maxIlluminated >= 0 ? (maxIlluminated / (PROCESS_STEPS.length - 1)) * 100 : 0;

  return (
    <div className="relative bg-[#0B0710]">
      <Helmet>
        <title>GalaxaTech — Ecosystems, Optimized</title>
        <meta name="description" content="GalaxaTech is a systems-driven creative tech agency from Dhaka, building digital ecosystems for brands worldwide." />
        <meta property="og:title" content="GalaxaTech — Ecosystems, Optimized" />
        <meta property="og:description" content="Systems-driven creative tech agency. Web, App, Social, AI, Brand, and Consulting." />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", "name": "GalaxaTech", "url": "https://gt-web-iota.vercel.app", "description": "Systems-driven creative tech agency", "address": { "@type": "PostalAddress", "addressLocality": "Dhaka", "addressCountry": "BD" } })}</script>
      </Helmet>

      {/* ── CSS ─────────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes dot-pulse-glow {
          0%,100% { box-shadow: 0 0 6px #ef4444, 0 0 14px rgba(239,68,68,0.4); opacity: 1; }
          50%      { box-shadow: 0 0 14px #ef4444, 0 0 28px rgba(239,68,68,0.65); opacity: 0.6; }
        }
        .dot-pulse-glow { animation: dot-pulse-glow 2s ease-in-out infinite; }
        .faq-item:hover { box-shadow: 0 0 30px rgba(236,30,142,0.2), inset 0 1px 0 rgba(255,255,255,0.08); }
        .modal-backdrop { animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .modal-panel { animation: slideUp 0.3s cubic-bezier(0.2,0.7,0.2,1); }
        
        @keyframes flow-right {
          0% { left: 0; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-flow-right { animation: flow-right 1.5s linear infinite; }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[82vh] sm:min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-4 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0 select-none overflow-hidden bg-[#0B0710]">
          <div
            className="w-full h-full opacity-90 pointer-events-none"
            style={{
              maskImage: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 100%)',
            }}
          >
            <GalaxyBackground />
          </div>
          {/* Dark base tint */}
          <div className="absolute inset-0 bg-[#0B0710]/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0710]/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0B0710] via-[#0B0710]/40 to-transparent pointer-events-none" />
          {/* Atmospheric pink/coral blob glows */}
          <div className="absolute top-1/3 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-[#EC1E8E]/12 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[420px] h-[420px] bg-[#FF7A45]/10 blur-[110px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5B23A8]/12 blur-[100px] rounded-full pointer-events-none" />
          {/* Diagonal spotlight beam */}
          <div className="absolute top-0 right-0 w-[45vw] h-full bg-gradient-to-bl from-white/[0.02] via-transparent to-transparent pointer-events-none" style={{ clipPath: 'polygon(100% 0, 30% 0, 100% 100%)' }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 pt-8 sm:pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>
            <div className="eyebrow-badge rounded-full px-4 sm:px-5 py-2 sm:py-2.5 mb-12 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] max-w-[92vw]">
              <span className="w-2 h-2 rounded-full bg-red-500 dot-pulse-glow flex-shrink-0" />
              <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-wide sm:tracking-widest text-white uppercase leading-tight">
                <span className="hidden sm:inline">AUTONOMOUS OPTIMIZATION • AGENTS ACTIVE • </span>
                <span className="sm:hidden">AGENTS ACTIVE • </span>
                LAST BUILD: {buildMins}M AGO
              </span>
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16,1,0.3,1] }} className="font-display text-[2rem] sm:text-[3.25rem] md:text-[5.5rem] font-extrabold tracking-[-0.03em] text-white mb-4 leading-[1.06] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Assure your brand's <br className="hidden md:block" />
            <span className="font-serif italic font-semibold typewriter-container block min-h-[1.2em] mt-3 pb-1 overflow-hidden" style={{ filter: 'drop-shadow(0 0 18px rgba(236,30,142,0.55))' }}>
              <AnimatePresence mode="wait">
                <motion.span key={wordIndex} initial={{ y: 35, opacity: 0, filter: 'blur(5px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -35, opacity: 0, filter: 'blur(5px)' }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className="inline-block text-gradient">
                  {TYPEWRITER_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16,1,0.3,1] }} className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Tell us about your business in 5 minutes — we'll map out exactly how to grow your digital presence.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.16,1,0.3,1] }} className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
            <button
              onClick={() => navigate('/audit')}
              className="group flex items-center gap-4 text-white hover:text-white font-bold py-3.5 px-8 rounded-full transition-all duration-500 cursor-pointer hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto justify-center shadow-xl glass-card-premium spotlight-sweep border border-white/10"
            >
              <span className="w-9 h-9 primary-gradient text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 flex-shrink-0">
                <ArrowUpRight className="w-4.5 h-4.5" />
              </span>
              <span className="text-sm font-semibold tracking-wider uppercase font-mono">Book an Audit</span>
            </button>
            <button
              onClick={() => navigate('/portfolio')}
              className="group flex items-center gap-3 text-white/70 hover:text-white font-semibold py-3.5 px-7 rounded-full transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center border border-white/15 hover:border-white/30 backdrop-blur-sm"
            >
              <span className="text-sm tracking-wide">See Our Work</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

          {/* Stat proof bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45, ease: [0.16,1,0.3,1] }} className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 mt-8 sm:mt-10">
            <div className="text-center">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-white font-display tracking-tight">
                <Counter value={50} suffix="+" />
              </span>
              <span className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mt-1">Projects</span>
            </div>
            <div className="w-px h-8 bg-white/10 flex-shrink-0" />
            <div className="text-center">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-white font-display tracking-tight">
                <Counter value={12} suffix="M+" />
              </span>
              <span className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mt-1">Client Revenue</span>
            </div>
            <div className="w-px h-8 bg-white/10 flex-shrink-0" />
            <div className="text-center">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-white font-display tracking-tight">
                <Counter value={99.9} decimals={1} suffix="%" />
              </span>
              <span className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mt-1">System Uptime</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-none">
          <span className="text-[9px] font-mono tracking-[0.22em] text-white/20 uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-3.5 h-3.5 text-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Global Presence ──────────────────────────────────────────────────── */}
      <section className="relative py-16 px-6 overflow-hidden" style={{ background: '#100918' }}>
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0710] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0710] to-transparent pointer-events-none z-10" />
        {/* Atmospheric blobs */}
        <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-[#FF7A45]/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-[#EC1E8E]/7 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
                <span className="text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase block mb-3">00 — Global Reach</span>
                <div className="flex items-end justify-between mb-8 gap-6">
                  <div>
                    <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                      Clients<br />
                      <span style={{ WebkitTextStroke: '1.5px rgba(236,30,142,0.88)', color: 'transparent' }}>Across</span><br />
                      <span className="pill-word-coral">Nations.</span>
                    </h2>
                  </div>
                  <div className="flex items-end gap-5">
                    <div className="text-[60px] sm:text-[80px] font-black leading-none select-none animate-pulse" style={{ color: 'rgba(255,255,255,0.14)', fontFamily: 'var(--font-display)' }}>6+</div>
                    <p className="text-white/55 text-xs max-w-[130px] leading-relaxed pb-1 border-l border-white/15 pl-4">Delivering real digital systems across global markets.</p>
                  </div>
                </div>

                {/* Marquee pills */}
                <div
                  className="w-full mb-8 overflow-hidden"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                  }}
                  onMouseEnter={e => { const t = e.currentTarget.querySelector('.mq-track') as HTMLDivElement | null; if (t) t.style.animationPlayState = 'paused'; }}
                  onMouseLeave={e => { const t = e.currentTarget.querySelector('.mq-track') as HTMLDivElement | null; if (t) t.style.animationPlayState = 'running'; }}
                >
                  <div
                    className="mq-track"
                    style={{ display: 'flex', width: 'max-content', animation: 'marquee-scroll 28s linear infinite', willChange: 'transform' }}
                  >
                    {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
                      <div key={i} className="flex items-center gap-2.5 mx-2.5 select-none px-4 py-2 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', minWidth: 'max-content' }}>
                        <img src={`https://flagcdn.com/20x15/${c.code}.png`} alt={c.name} width="20" height="15" className="flex-shrink-0 rounded-[2px]" />
                        <span className="text-white/80 font-semibold text-xs" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Shield className="w-5 h-5 text-primary/50 flex-shrink-0" />
                  <span className="text-white/40 text-xs sm:text-sm">Trusted by businesses worldwide to drive growth and innovation.</span>
                </div>
              </motion.div>
            </div>

            {/* Right Globe Column */}
            <div className="md:col-span-5 flex justify-center items-center w-full h-[360px] sm:h-[420px]">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                className="w-full h-full"
              >
                <InteractiveGlobe />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0B0710 0%, #100918 50%, #0B0710 100%)' }}>
        {/* Atmospheric blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-[#EC1E8E]/7 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FF7A45]/6 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }} className="relative">
              {/* Dotted grid accent */}
              <div className="absolute -right-8 -top-4 w-20 h-20 dotted-grid opacity-35 rounded-lg" />
              <span className="text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase block mb-3">01 — Why GalaxaTech</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                Why<br />
                <span style={{ WebkitTextStroke: '1.5px rgba(236,30,142,0.85)', color: 'transparent' }}>Choose</span><br />
                <span className="pill-word">Us.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
              Five reasons clients trust GalaxaTech to build their digital future.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            {/* Card 1: Systems-First Approach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="md:col-span-4 min-h-[220px]"
            >
              <SpotlightCard className="w-full h-full flex flex-col justify-between p-7 rounded-3xl glass-card-premium border border-white/10 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#EC1E8E]/30 bg-[#EC1E8E]/10 flex-shrink-0">
                      <span className="text-[9px] font-mono font-bold text-[#EC1E8E]">01</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                      <Workflow className="w-5.5 h-5.5 text-lavender" />
                    </div>
                  </div>
                  {/* Interactive Node Graph Infographic */}
                  <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-2.5 border border-white/5 relative overflow-hidden select-none">
                    <div className="flex items-center gap-2 relative z-10">
                      <div className="w-3 h-3 rounded-full bg-[#FF7A45] animate-pulse" title="Discover" />
                      <span className="w-6 h-px border-t border-dashed border-white/20 relative">
                        <span className="absolute top-[-2px] left-0 w-1.5 h-1.5 rounded-full bg-white animate-flow-right" />
                      </span>
                      <div className="w-3 h-3 rounded-full bg-[#EC1E8E]" title="Architect" />
                      <span className="w-6 h-px border-t border-dashed border-white/20 relative">
                        <span className="absolute top-[-2px] left-0 w-1.5 h-1.5 rounded-full bg-white animate-flow-right" style={{ animationDelay: '0.6s' }} />
                      </span>
                      <div className="w-3 h-3 rounded-full bg-[#5B23A8] animate-pulse" title="Optimize" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-6 items-end justify-between">
                  <div className="max-w-md">
                    <h3 className="text-white font-bold text-base mb-2 font-display">Systems-First Approach</h3>
                    <p className="text-white/65 text-xs leading-relaxed">We architect before we build — mapping workflows, infrastructure, and dependencies so strategy is never an afterthought.</p>
                  </div>
                  <div className="flex flex-col gap-1 w-full sm:w-auto font-mono text-[9px] text-primary/70 bg-primary/5 rounded-lg p-2.5 border border-primary/10">
                    <div className="flex justify-between gap-4"><span>Sys.Map:</span><span className="text-white font-semibold">Active</span></div>
                    <div className="flex justify-between gap-4"><span>Integrity:</span><span className="text-emerald-400 font-semibold">99.8%</span></div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Card 2: End-to-End Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="md:col-span-2 min-h-[220px]"
            >
              <SpotlightCard className="w-full h-full flex flex-col justify-between p-7 rounded-3xl glass-card-premium border border-white/10 group">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#EC1E8E]/30 bg-[#EC1E8E]/10 flex-shrink-0">
                    <span className="text-[9px] font-mono font-bold text-[#EC1E8E]">02</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                    <Rocket className="w-5.5 h-5.5 text-lavender" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-white font-bold text-base mb-2 font-display">End-to-End</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-4">From roadmap planning through production code deployment, our team owns the entire lifecycle.</p>
                  
                  {/* Multi-Stage Pipeline Infographic */}
                  <div className="flex flex-col gap-2.5 w-full bg-white/5 rounded-2xl p-3 border border-white/5 font-mono text-[9px] text-white/50">
                    <div className="flex items-center justify-between">
                      <span>PLAN</span>
                      <div className="w-[60%] bg-white/10 rounded-full h-1 overflow-hidden border border-white/5">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-[#FF7A45] to-[#EC1E8E] rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>CODE</span>
                      <div className="w-[60%] bg-white/10 rounded-full h-1 overflow-hidden border border-white/5">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-[#EC1E8E] to-[#5B23A8] rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>DEPLOY</span>
                      <div className="w-[60%] bg-white/10 rounded-full h-1 overflow-hidden border border-white/5">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-[#5B23A8] to-emerald-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Card 3: Builders Mindset */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="md:col-span-2 min-h-[220px]"
            >
              <SpotlightCard className="w-full h-full flex flex-col justify-between p-7 rounded-3xl glass-card-premium border border-white/10 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#EC1E8E]/30 bg-[#EC1E8E]/10 flex-shrink-0">
                      <span className="text-[9px] font-mono font-bold text-[#EC1E8E]">03</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                      <Users className="w-5.5 h-5.5 text-lavender" />
                    </div>
                  </div>
                  {!!activeBuildersCount && (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase animate-pulse">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      {activeBuildersCount} Live
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-white font-bold text-base mb-2 font-display">Builders Mindset</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-3">We run our own builder community ecosystem — direct production and fast iteration are in our DNA.</p>
                  
                  {/* Builder Tag Cloud Infographic */}
                  <div className="flex items-center gap-1.5 flex-wrap bg-white/5 rounded-2xl p-2.5 border border-white/5 font-mono text-[8px] select-none">
                    <span className="px-2 py-0.5 rounded bg-[#EC1E8E]/10 text-[#EC1E8E] border border-[#EC1E8E]/20 font-bold">DEV</span>
                    <span className="px-2 py-0.5 rounded bg-[#FF7A45]/10 text-[#FF7A45] border border-[#FF7A45]/20 font-bold">ARCH</span>
                    <span className="px-2 py-0.5 rounded bg-[#5B23A8]/10 text-[#5B23A8] border border-[#5B23A8]/20 font-bold">AI</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">PROD</span>
                    {!!activeBuildersCount && <span className="text-white/30 font-bold ml-1">+{activeBuildersCount} Active</span>}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Card 4: Global Standards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="md:col-span-2 min-h-[220px]"
            >
              <SpotlightCard className="w-full h-full flex flex-col justify-between p-7 rounded-3xl glass-card-premium border border-white/10 group">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#EC1E8E]/30 bg-[#EC1E8E]/10 flex-shrink-0">
                    <span className="text-[9px] font-mono font-bold text-[#EC1E8E]">04</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                    <Globe className="w-5.5 h-5.5 text-lavender" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-white font-bold text-base mb-2 font-display">Global Standard</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-3">Serving clients across 6 countries with enterprise stability and low-latency operational support.</p>
                  
                  {/* Network Ping Monitor Infographic */}
                  <div className="flex flex-col gap-1.5 bg-white/5 rounded-2xl p-2.5 border border-white/5 font-mono text-[9px] w-full">
                    <div className="flex justify-between items-center text-white/40">
                      <span>DHAKA → USA</span>
                      <span className="text-emerald-400 font-bold animate-pulse">12ms · stable</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40">
                      <span>DHAKA → EUR</span>
                      <span className="text-emerald-400 font-bold animate-pulse" style={{ animationDelay: '0.4s' }}>38ms · active</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Card 5: Fast Operations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="md:col-span-2 min-h-[220px]"
            >
              <SpotlightCard className="w-full h-full flex flex-col justify-between p-7 rounded-3xl glass-card-premium border border-white/10 group">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#EC1E8E]/30 bg-[#EC1E8E]/10 flex-shrink-0">
                    <span className="text-[9px] font-mono font-bold text-[#EC1E8E]">05</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                    <MessageCircle className="w-5.5 h-5.5 text-lavender" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-white font-bold text-base mb-2 font-display">Fast Operations</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-3">WhatsApp-first, live Client Hub dashboards, and daily updates — you're never left guessing.</p>
                  
                  {/* Live Chat Bubbles Infographic */}
                  <div className="flex flex-col gap-2 rounded-2xl p-2.5 border border-white/[0.06] select-none text-[9px] font-sans w-full" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex flex-col items-start max-w-[85%]">
                      <div className="bg-white/5 rounded-2xl rounded-tl-sm px-2.5 py-1 border border-white/5 text-white/70 leading-normal">
                        Status of build?
                      </div>
                    </div>
                    <div className="flex flex-col items-end w-full">
                      <div className="primary-gradient rounded-2xl rounded-tr-sm px-2.5 py-1 text-white leading-normal font-medium shadow-md shadow-[#EC1E8E]/10">
                        Live now. Integrity: 99.8%!
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[7px] font-mono text-white/35">
                        <span>delivered</span>
                        <span className="text-emerald-400 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── What We Build — 3D Service Carousel ──────────────────────────────── */}
      <section className="py-16 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0B0710 0%, #100918 50%, #0B0710 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#5B23A8]/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase block mb-3">02 — Services</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                What<br />
                <span style={{ WebkitTextStroke: '1.5px rgba(236,30,142,0.85)', color: 'transparent' }}>We</span><br />
                <span className="pill-word-coral">Build.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[320px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
              We architect high-performance digital ecosystems, custom AI pipelines, and bespoke brand platforms built for scale.
            </motion.p>
          </div>

          {/* 3D Carousel */}
          <div
            className="relative select-none"
            ref={carouselContainerRef}
            style={{ perspective: isMobile ? '800px' : '1400px', height: isMobile ? '300px' : '450px', touchAction: 'pan-y' }}
            onPointerDown={handleCarouselPointerDown}
            onPointerMove={handleCarouselPointerMove}
            onPointerUp={handleCarouselPointerUp}
            onPointerCancel={() => { dragRef.current = null; setDragOffset(0); }}
            onMouseMove={e => {
              if (!carouselContainerRef.current || dragRef.current) return;
              const rect = carouselContainerRef.current.getBoundingClientRect();
              const relX = e.clientX - rect.left;
              // Left 35% scrolls left, Right 35% scrolls right, Middle 30% pauses
              if (relX > rect.width * 0.65) {
                setCarouselAutoScrollDir('right');
              } else if (relX < rect.width * 0.35) {
                setCarouselAutoScrollDir('left');
              } else {
                setCarouselAutoScrollDir(null);
              }
            }}
            onMouseLeave={() => setCarouselAutoScrollDir(null)}
          >
            {SERVICES.map((svc, i) => {
              const offset = getCarouselOffset(i, activeIndex, SERVICES.length);
              const xStep = isMobile ? 155 : 330;
              
              // Apparent fractional offset including real-time drag displacement
              const apparentOffset = offset + (dragOffset / xStep);
              const absOff = Math.abs(apparentOffset);
              
              // Show peek on both sides
              const visible = isMobile ? absOff <= 1.8 : absOff <= 2.8;

              // Calculate real-time visual positioning
              const x = offset * xStep + dragOffset;
              const rotY = isMobile ? apparentOffset * 10 : apparentOffset * 15;
              const z = -absOff * (isMobile ? 70 : 120);
              const scale = 1 - absOff * 0.08;

              // Smoothly fade — keeps side cards visible as peek
              const opacity = visible ? Math.max(0, 1 - absOff * 0.32) : 0;
              const isActive = absOff < 0.5;
              const cardWidth = isMobile ? '175px' : '320px';
              return (
                <div
                  key={svc.anchor}
                  onClick={() => { if (dragRef.current?.moved) return; if (Math.abs(apparentOffset) >= 0.5) setActiveIndex(i); else navigate(`/services#${svc.anchor}`); }}
                  onMouseEnter={() => setHoveredCarouselIndex(i)}
                  onMouseLeave={() => setHoveredCarouselIndex(null)}
                  style={{
                    position: 'absolute', left: '50%', top: '50%', width: cardWidth,
                    transform: `translateX(calc(-50% + ${x}px)) translateY(-50%) rotateY(${rotY}deg) translateZ(${z}px) scale(${scale * (hoveredCarouselIndex === i ? 1.02 : 1)})`,
                    opacity,
                    // If actively dragging, disable transition for real-time tracking, otherwise use smooth animation
                    transition: dragOffset !== 0 ? 'none' : 'all 0.35s cubic-bezier(.2,.7,.2,1)',
                    pointerEvents: visible ? 'auto' : 'none', cursor: 'pointer',
                    zIndex: Math.round(10 - absOff * 2), // Keep correct 3D stacking order dynamically
                    background: 'rgba(10, 8, 37, 0.45)',
                    backdropFilter: 'blur(20px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: isActive
                      ? hoveredCarouselIndex === i
                        ? `0 0 70px ${svc.color}45, 0 10px 30px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12)`
                        : `0 0 50px ${svc.color}25, 0 10px 30px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12)`
                      : '0 8px 25px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                    padding: '28px 24px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Neon backing glow inside card */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${svc.color} 0%, transparent 70%)`,
                      opacity: isActive ? 0.22 : 0.06,
                    }}
                  />
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${svc.color}15`, border: `1px solid ${svc.color}25` }}>
                      <svc.icon className="w-6 h-6" style={{ color: svc.color }} />
                    </div>
                    <span className="text-[11px] font-mono text-white/20 font-semibold">{svc.num}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2 font-display relative z-10">{svc.label}</h3>
                  <p className="text-white/70 text-sm leading-relaxed relative z-10">{svc.desc}</p>
                  {isActive && (
                    <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold relative z-10" style={{ color: '#FF7A45' }}>
                      Explore Service <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {!isActive && (
                    <div className="mt-5 relative z-10">
                      <ArrowUpRight className="w-4 h-4 text-white/35" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How We Work ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0B0710 0%, #100918 50%, #0B0710 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#5B23A8]/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#EC1E8E]/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-[#FF7A45]/7 blur-[110px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase block mb-3">03 — Process</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                How<br />
                <span style={{ WebkitTextStroke: '1.5px rgba(236,30,142,0.85)', color: 'transparent' }}>We</span><br />
                <span className="text-gradient">Work.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
              A clear, collaborative journey from idea to deployed digital systems.
            </motion.p>
          </div>

          {/* Illuminated progress rail — fills as steps scroll into view */}
          <div className="relative h-1 rounded-full bg-white/8 mb-8 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 primary-gradient rounded-full"
              animate={{ width: `${lineProgress}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* 2×2 Process card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PROCESS_STEPS.map((step, i) => {
              const StepIcon = step.Icon;
              const isIlluminated = illuminatedSteps.has(i);
              return (
                <motion.div
                  key={step.num}
                  ref={el => { stepRefs.current[i] = el; }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="relative flex flex-col"
                >
                  <SpotlightCard
                    className="w-full h-full p-7 rounded-3xl glass-card-premium border transition-colors duration-500 group"
                    style={{ borderColor: isIlluminated ? 'rgba(236,30,142,0.4)' : 'rgba(255,255,255,0.1)' }}
                  >
                    <div className="absolute right-5 bottom-4 font-black select-none pointer-events-none leading-none z-0" style={{ fontSize: '100px', color: 'rgba(236,30,142,0.06)', fontFamily: 'var(--font-display)' }}>{step.num}</div>
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20 group-hover:bg-primary/15 group-hover:border-primary/35 transition-colors duration-300">
                        <StepIcon className="w-5 h-5 text-lavender" />
                      </div>
                      <span className="text-[11px] font-mono text-primary/70 font-semibold bg-primary/8 px-2.5 py-1 rounded-full border border-primary/15">{step.num}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2 font-display relative z-10">{step.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed relative z-10">{step.desc}</p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="flex justify-center mt-10">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-primary/55" />
              <span className="text-white/45 text-sm">Powered by the <span className="text-primary/80">GalaxaTech</span> intelligence layer</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Selected Work — glassmorphic folder ───────────────────────────────── */}
      <section className="py-16 px-6 overflow-x-hidden relative" style={{ background: 'linear-gradient(to bottom, #0B0710 0%, #100918 50%, #0B0710 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#5B23A8]/8 blur-[160px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase block mb-3">05 — Portfolio</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                Selected<br />
                <span className="text-grad">Work.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
              A few projects, systems, and brands we've helped shape.
            </motion.p>
          </div>

          {/* 3D Glass Folder Reveal Scene */}
          {(() => {
            const folderMaskSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Cpath d='M 0 380 L 0 80 A 20 20 0 0 1 20 60 L 160 60 A 20 20 0 0 1 180 80 A 20 20 0 0 0 200 100 L 580 100 A 20 20 0 0 1 600 120 L 600 380 A 20 20 0 0 1 580 400 L 20 400 A 20 20 0 0 1 0 380 Z' fill='black'/%3E%3C/svg%3E")`;
            
            const glassStyle: React.CSSProperties = {
              maskImage: folderMaskSvg,
              WebkitMaskImage: folderMaskSvg,
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              backdropFilter: 'blur(32px) saturate(140%)',
              WebkitBackdropFilter: 'blur(32px) saturate(140%)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.015))',
            };

            const backGlassStyle: React.CSSProperties = {
              maskImage: folderMaskSvg,
              WebkitMaskImage: folderMaskSvg,
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.005))',
            };

            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center w-full"
              >
                <div
                  className="relative cursor-pointer w-full max-w-[700px] flex items-center justify-center"
                  onMouseEnter={() => setFolderHovered(true)}
                  onMouseLeave={() => setFolderHovered(false)}
                  onClick={() => navigate('/portfolio')}
                  style={{
                    height: isMobile ? '380px' : '480px',
                    perspective: '1600px',
                    touchAction: isMobile ? 'auto' : 'none',
                  }}
                >
                  {/* Core 3D Scene Wrapper - Facing forward, tilts slightly on hover */}
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                      transform: folderHovered
                        ? 'rotateX(6deg) rotateY(-2deg) scale(1.03)'
                        : 'rotateX(0deg) rotateY(0deg) scale(1)',
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Soft ambient neon background glow behind folder */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-35 pointer-events-none transition-all duration-700"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, #5B23A8 0%, transparent 70%)',
                        transform: folderHovered ? 'translateZ(-90px) scale(1.3)' : 'translateZ(-90px) scale(0.9)',
                        filter: 'blur(40px)',
                      }}
                    />

                    {/* FOLDER BACK COVER PLATE */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{
                        bottom: isMobile ? '20px' : '30px',
                        width: isMobile ? '320px' : '480px',
                        height: isMobile ? '213px' : '320px', // exact 1.5 ratio
                        transform: folderHovered ? 'translateZ(-40px)' : 'translateZ(-40px)',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        zIndex: 1,
                      }}
                    >
                      <div style={backGlassStyle} className="absolute inset-0 w-full h-full" />
                      <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full pointer-events-none">
                        <path
                          d="M 0 380 L 0 80 A 20 20 0 0 1 20 60 L 160 60 A 20 20 0 0 1 180 80 A 20 20 0 0 0 200 100 L 580 100 A 20 20 0 0 1 600 120 L 600 380 A 20 20 0 0 1 580 400 L 20 400 A 20 20 0 0 1 0 380 Z"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>

                    {/* REVEALED PROJECT CARDS (They float up and pop out in 3D) */}
                    {PROJECTS.map((proj, i) => {
                      // Coordinate physics for cinematic pop out
                      // Closed state: Stacked inside folder
                      // Open state: Fly outwards with rotation, scale, and offset
                      // Subtle fan peek — cards visible and fanned by default
                      const peekDesktop = [
                        { x: -30, y: 14, z: -22, rotX: 0, rotY: 0, rotZ: -13, scale: 0.86 },
                        { x: 0,   y: -8, z: -5,  rotX: 0, rotY: 0, rotZ: 0,   scale: 0.92 },
                        { x: 30,  y: 14, z: -22, rotX: 0, rotY: 0, rotZ: 13,  scale: 0.86 },
                      ];
                      const peekMobile = [
                        { x: -18, y: 10, z: -16, rotX: 0, rotY: 0, rotZ: -10, scale: 0.84 },
                        { x: 0,   y: -6, z: -4,  rotX: 0, rotY: 0, rotZ: 0,   scale: 0.90 },
                        { x: 18,  y: 10, z: -16, rotX: 0, rotY: 0, rotZ: 10,  scale: 0.84 },
                      ];
                      const peek = isMobile ? peekMobile[i] : peekDesktop[i];
                      let x = peek.x, y = peek.y, z = peek.z;
                      let rotX = peek.rotX, rotY = peek.rotY, rotZ = peek.rotZ;
                      let scale = peek.scale;
                      let opacity = i === 1 ? 0.82 : 0.72;
                      let cardBlur = '0px';

                      if (folderHovered) {
                        cardBlur = '0px';
                        opacity = 1;
                        if (isMobile) {
                          // Compact mobile coordinates
                          const coords = [
                            { x: -75, y: -75, z: 40, rotX: -5, rotY: -8, rotZ: -18, scale: 0.92 },
                            { x: 0,   y: -105, z: 70, rotX: -5, rotY: 0,   rotZ: 0,  scale: 0.98 },
                            { x: 75,  y: -75, z: 40, rotX: -5, rotY: 8,   rotZ: 18,  scale: 0.92 }
                          ];
                          ({ x, y, z, rotX, rotY, rotZ, scale } = coords[i]);
                        } else {
                          // Cinematic desktop coordinates
                          const coords = [
                            { x: -170, y: -140, z: 80, rotX: -5, rotY: -10, rotZ: -22, scale: 0.98 },
                            { x: 0,    y: -190, z: 120, rotX: -5, rotY: 0,   rotZ: 0,   scale: 1.05 },
                            { x: 170,  y: -140, z: 80, rotX: -5, rotY: 10,  rotZ: 22,  scale: 0.98 }
                          ];
                          ({ x, y, z, rotX, rotY, rotZ, scale } = coords[i]);
                        }
                      }

                      const cardW = isMobile ? '150px' : '190px';
                      const cardH = isMobile ? '195px' : '240px';

                      return (
                        <div
                          key={proj.slug}
                          style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: isMobile ? '30px' : '50px',
                            width: cardW,
                            height: cardH,
                            marginLeft: isMobile ? '-75px' : '-95px',
                            transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
                            transformStyle: 'preserve-3d',
                            opacity,
                            filter: `blur(${cardBlur})`,
                            transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease, filter 0.6s ease`,
                            zIndex: 10 + i,
                            borderRadius: '20px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderTop: `1px solid ${proj.color}40`,
                            boxShadow: folderHovered
                              ? `0 15px 35px ${proj.color}33, 0 0 15px rgba(0,0,0,0.6)`
                              : '0 6px 15px rgba(0,0,0,0.5)',
                          }}
                        >
                          {/* Card visual contents */}
                          <div className="h-[55%] relative flex items-center justify-center overflow-hidden" style={{ background: proj.bg }}>
                            {/* Glow backing inside card */}
                            <div
                              className="absolute inset-0 opacity-20"
                              style={{
                                background: `radial-gradient(circle at center, ${proj.color} 0%, transparent 70%)`
                              }}
                            />
                            <Globe className="w-9 h-9 opacity-25" style={{ color: proj.color }} />
                            <span className="absolute top-3 left-3 text-[9px] font-mono text-white/50">{proj.num}</span>
                          </div>
                          <div 
                            className="p-3.5 h-[45%] flex flex-col justify-between transition-all duration-500" 
                            style={{ 
                              background: 'rgba(10,8,37,0.92)', 
                              backdropFilter: 'blur(5px)',
                              opacity: folderHovered ? 1 : 0,
                              transform: folderHovered ? 'translateY(0)' : 'translateY(12px)',
                            }}
                          >
                            <div>
                              <p className="text-white font-bold text-xs sm:text-sm leading-tight font-display">{proj.name}</p>
                              <p className="text-white/40 text-[9px] mt-0.5 font-sans">{proj.type}</p>
                            </div>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                              Explore <ArrowUpRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* FOLDER FRONT GLASS COVER */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{
                        bottom: isMobile ? '20px' : '30px',
                        width: isMobile ? '320px' : '480px',
                        height: isMobile ? '213px' : '320px', // exact 1.5 ratio
                        transformOrigin: 'bottom center',
                        transform: folderHovered
                          ? 'translateZ(40px) rotateX(-12deg)'
                          : 'translateZ(40px) rotateX(0deg)',
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        zIndex: 20,
                      }}
                    >
                      {/* Glass base */}
                      <div style={glassStyle} className="absolute inset-0 w-full h-full" />
                      
                      {/* Stroke overlay */}
                      <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                          <linearGradient id="neonBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#EC1E8E" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="#FF7A45" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#5B23A8" stopOpacity="0.5" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 380 L 0 80 A 20 20 0 0 1 20 60 L 160 60 A 20 20 0 0 1 180 80 A 20 20 0 0 0 200 100 L 580 100 A 20 20 0 0 1 600 120 L 600 380 A 20 20 0 0 1 580 400 L 20 400 A 20 20 0 0 1 0 380 Z"
                          fill="none"
                          stroke="url(#neonBorderGrad)"
                          strokeWidth="1.5"
                        />
                      </svg>

                      {/* Content */}
                      <div className="flex flex-col justify-between h-full p-6 sm:p-8 relative z-30">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-primary/20 flex items-center justify-center bg-primary/10">
                            <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-lavender" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            <p className="text-white font-bold text-sm sm:text-base font-display leading-tight">Open Portfolio</p>
                            <span className="text-white/45 text-[9px] sm:text-[10px] font-mono tracking-wider">GALAXATECH © 2026</span>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); navigate('/portfolio'); }}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-[1.1] primary-gradient cursor-pointer"
                            style={{ boxShadow: '0 8px 30px rgba(236,30,142,0.4)' }}
                          >
                            <ArrowUpRight className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <p className="text-white/45 text-[11px] font-mono mt-6">Hover or tap to reveal</p>
              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* ── Common Questions ─────────────────────────────────────────────────────── */}
      <section className="py-10 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0B0710 0%, #100918 60%, #0B0710 100%)' }}>
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#EC1E8E]/7 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase block mb-3">04 — FAQ</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                Common<br />
                <span className="pill-word">Questions.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
              Everything you need to know before working with us.
            </motion.p>
          </div>

          <div className="flex flex-col gap-2">
            {FAQS.map((faq, i) => {
              const FaqIcon = faq.icon;
              const isActive = activeFAQ === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                    border: `1px solid ${isActive ? 'rgba(236,30,142,0.45)' : 'rgba(255,255,255,0.10)'}`,
                    transition: 'border-color 0.25s',
                  }}
                >
                  <button
                    onClick={() => setActiveFAQ(isActive ? null : i)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
                  >
                    <FaqIcon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? '#EC1E8E' : 'rgba(236,30,142,0.55)' }} />
                    <span className="text-sm font-semibold flex-1 leading-snug" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.75)' }}>{faq.q}</span>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-200" style={{ color: isActive ? '#EC1E8E' : 'rgba(255,255,255,0.25)', transform: isActive ? 'rotate(90deg)' : 'none' }} />
                  </button>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-white/65 text-sm leading-relaxed px-4 pb-4 pl-11">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Closing CTA — toggle + modal ─────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0B0710 0%, #100918 50%, #0B0710 100%)' }}>
        {/* Layered atmospheric blob glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#EC1E8E]/9 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[#FF7A45]/7 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#5B23A8]/10 blur-[120px] rounded-full pointer-events-none" />
        {/* Floating geometric rings */}
        {[
          { size: 140, left: '5%',  top: '10%', duration: 9,  delay: 0   },
          { size: 90,  left: '82%', top: '8%',  duration: 11, delay: 1.5 },
          { size: 70,  left: '8%',  top: '68%', duration: 8,  delay: 3   },
          { size: 110, left: '78%', top: '62%', duration: 10, delay: 0.8 },
          { size: 50,  left: '48%', top: '5%',  duration: 7,  delay: 2.2 },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/[0.12] pointer-events-none"
            style={{ width: s.size, height: s.size, left: s.left, top: s.top, background: 'radial-gradient(circle, rgba(124,42,235,0.06) 0%, transparent 70%)' }}
            animate={{ y: [0, -18, 0], rotate: [0, 180, 360] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        {/* Ghost "JOIN" text decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black select-none pointer-events-none leading-none whitespace-nowrap" style={{ fontSize: 'clamp(80px, 20vw, 180px)', color: 'rgba(236,30,142,0.05)', fontFamily: 'var(--font-display)', letterSpacing: '-0.05em' }}>JOIN</div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25" style={{ background: 'rgba(236,30,142,0.08)' }}>
              <Sparkles className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary/70 uppercase">Builders Community</span>
            </div>
          </div>

          <h2 className="font-black text-white mb-5 leading-[0.9]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>
            Wanna join the<br />
            <span style={{ WebkitTextStroke: '2px rgba(236,30,142,0.88)', color: 'transparent' }}>Galaxa</span>{' '}
            <span className="pill-word">team?</span>
          </h2>
          <p className="text-white/45 text-base mb-10 leading-relaxed max-w-md mx-auto">
            Flip the switch to join our builders community and be the first to hear about every opportunity.
          </p>

          {/* Tactile 3D-effect toggle button */}
          <div className="flex flex-col items-center gap-4">
            <div
              role="switch"
              aria-checked={toggled}
              aria-label="Join Galaxa community"
              className="relative flex items-center rounded-full p-1 cursor-pointer select-none hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
              style={{
                width: 'min(300px, calc(100vw - 3rem))',
                height: '56px',
                background: 'rgba(255, 255, 255, 0.042)',
                backdropFilter: 'blur(22px) saturate(140%)',
                WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                border: '1px solid rgba(181, 141, 255, 0.25)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.09), 0 10px 30px rgba(0,0,0,0.5)',
              }}
              onClick={handleToggle}
            >
              {/* Tactile Glowing Knob */}
              <div
                style={{
                  position: 'absolute',
                  top: '5px',
                  left: '5px',
                  width: '142px',
                  height: '44px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, rgba(236, 30, 142, 0.25) 0%, rgba(255, 122, 69, 0.25) 100%)',
                  border: '1px solid rgba(236, 30, 142, 0.6)',
                  boxShadow: '0 0 24px rgba(236, 30, 142, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transform: toggled ? 'translateX(144px)' : 'translateX(0px)',
                  transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              <span className="relative z-10 flex-1 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-300 font-display" style={{ color: toggled ? 'rgba(255,255,255,0.4)' : 'white' }}>Not yet</span>
              <span className="relative z-10 flex-1 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-300 font-display" style={{ color: toggled ? 'white' : 'rgba(255,255,255,0.4)' }}>Yes, I'm in</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Circle Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {circleModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
              onClick={() => setCircleModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-sm"
                style={{ ...GLASS_STYLE, borderRadius: '24px', padding: isMobile ? '20px' : '32px', borderColor: 'rgba(236,30,142,0.45)', boxShadow: '0 0 80px rgba(236,30,142,0.30), inset 0 1px 0 rgba(255,255,255,0.1)' }}
              >
                <button
                  onClick={() => setCircleModalOpen(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>

                {submitted ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <Sparkles className="w-8 h-8" style={{ color: '#EC1E8E' }} />
                    <p className="text-white font-bold text-lg font-display">You're in the circle.</p>
                    <p className="text-white/40 text-sm">We'll reach out with opportunities first.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-full border border-primary/20 flex items-center justify-center mb-5" style={{ background: 'rgba(236,30,142,0.08)' }}>
                      <Mail className="w-5 h-5 text-primary/70" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-1 font-display">
                      Join the <span className="text-gradient">Galaxa</span> circle
                    </h3>
                    <p className="text-white/45 text-sm mb-5 leading-relaxed">Get early access, opportunities, and builder-only updates.</p>
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                      <label htmlFor="circle-email" className="sr-only">Email address</label>
                      <input
                        id="circle-email"
                        type="email"
                        placeholder="you@example.com"
                        value={subEmail}
                        onChange={e => setSubEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: submitting ? 'rgba(236,30,142,0.5)' : 'linear-gradient(135deg,#EC1E8E,#FF7A45)', boxShadow: '0 8px 30px rgba(236,30,142,0.35)' }}
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

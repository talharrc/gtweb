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
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import heroLaptopDashboard from '../assets/images/hero.jpeg';

interface HomeViewProps {
  isDhakaOpen: boolean;
  dhakaTime: string;
  currentUser: any | null;
}

const TYPEWRITER_WORDS = ['Website Presence', 'Social Media Engagement', 'Client conversion'];

const SERVICES = [
  { num: '01', icon: Laptop,         label: 'Web Development',         desc: 'Fast, secure, and scalable websites built for performance and growth.',              anchor: 'web-development',    color: '#78D5FF' },
  { num: '02', icon: Smartphone,     label: 'App Development',         desc: 'High-performance mobile and web apps tailored to user needs and business goals.',    anchor: 'app-development',    color: '#B58DFF' },
  { num: '03', icon: MessageCircle,  label: 'Social Media & Content',  desc: 'Engaging content and social strategies that build brand presence and loyalty.',      anchor: 'social-media',       color: '#7C2AEB' },
  { num: '04', icon: Cpu,            label: 'AI & Automation',         desc: 'Intelligent automation that streamlines workflows and boosts productivity.',          anchor: 'ai-automation',      color: '#7C2AEB' },
  { num: '05', icon: Brush,          label: 'Brand Identity & Design', desc: 'Distinctive visuals and brand experiences that leave a lasting impression.',         anchor: 'brand-identity',     color: '#78D5FF' },
  { num: '06', icon: Workflow,       label: 'Systems Consulting',      desc: 'Strategic guidance and system architectures that drive sustainable growth.',         anchor: 'systems-consulting', color: '#B58DFF' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Discover',   desc: 'Understand goals, users, and opportunities.',       Icon: Search   },
  { num: '02', title: 'Strategize', desc: 'Shape the roadmap, system, and execution plan.',    Icon: Workflow },
  { num: '03', title: 'Build',      desc: 'Design and develop the core solution.',             Icon: Code2    },
  { num: '04', title: 'Deploy',     desc: 'Launch, refine, and optimize for growth.',          Icon: Rocket   },
];

const PROJECTS = [
  { slug: 'harmans-trading',  num: '01', name: 'Harmans Trading',  type: 'Trading Platform',      color: '#78D5FF', bg: 'linear-gradient(135deg,rgba(120,213,255,0.25) 0%,rgba(124,42,235,0.3) 60%,rgba(0,0,0,0.6) 100%)' },
  { slug: 'sunnah-grandeur',  num: '02', name: 'Sunnah Grandeur',  type: 'E-Commerce Platform',   color: '#B58DFF', bg: 'linear-gradient(135deg,rgba(124,42,235,0.3) 0%,rgba(181,141,255,0.2) 60%,rgba(0,0,0,0.6) 100%)' },
  { slug: 'salfas-bazar',     num: '03', name: 'Salfas Bazar',     type: 'Organic Food Platform', color: '#78FFB5', bg: 'linear-gradient(135deg,rgba(0,180,120,0.2) 0%,rgba(124,42,235,0.25) 60%,rgba(0,0,0,0.6) 100%)' },
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
  { flag: '🇺🇸', name: 'USA' },
  { flag: '🇬🇧', name: 'UK' },
  { flag: '🇵🇰', name: 'Pakistan' },
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇮🇳', name: 'India' },
  { flag: '🇧🇩', name: 'Bangladesh' },
];

const GLASS_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '20px',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 28px rgba(124,42,235,0.05), 0 20px 60px rgba(0,0,0,0.50)',
};

function getCarouselOffset(i: number, active: number, total: number): number {
  let offset = i - active;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

export default function HomeView({ isDhakaOpen, dhakaTime, currentUser }: HomeViewProps) {
  const navigate = useNavigate();

  const [wordIndex, setWordIndex] = useState(0);
  const [buildMins, setBuildMins] = useState(42);
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

  const carouselPrev = () => setActiveIndex(p => (p - 1 + SERVICES.length) % SERVICES.length);
  const carouselNext = () => setActiveIndex(p => (p + 1) % SERVICES.length);

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
    <div className="relative bg-[#05030F]">
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
        .faq-item:hover { box-shadow: 0 0 30px rgba(124,42,235,0.2), inset 0 1px 0 rgba(255,255,255,0.08); }
        .modal-backdrop { animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .modal-panel { animation: slideUp 0.3s cubic-bezier(0.2,0.7,0.2,1); }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[82vh] sm:min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-4 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0 select-none overflow-hidden bg-[#05030F]">
          <img
            alt="GalaxaTech Hero"
            className="w-full h-full object-cover object-center opacity-70 pointer-events-none"
            style={{
              maskImage: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0) 100%)',
            }}
            src={heroLaptopDashboard}
            referrerPolicy="no-referrer"
          />
          {/* Subtle dark-to-purple tint */}
          <div className="absolute inset-0 bg-[#05030F]/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05030F]/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#05030F] via-[#05030F]/60 to-transparent pointer-events-none" />
          {/* Ambient purple glows */}
          <div className="absolute top-1/3 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#7C2AEB]/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-[#7C2AEB]/8 blur-[100px] rounded-full pointer-events-none" />
          {/* Diagonal spotlight beam */}
          <div className="absolute top-0 right-0 w-[45vw] h-full bg-gradient-to-bl from-white/[0.025] via-transparent to-transparent pointer-events-none" style={{ clipPath: 'polygon(100% 0, 30% 0, 100% 100%)' }} />
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
            <span className="font-serif italic font-normal typewriter-container block min-h-[1.2em] mt-3 pb-1 overflow-hidden">
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
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-white font-display tracking-tight">50+</span>
              <span className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mt-1">Projects</span>
            </div>
            <div className="w-px h-8 bg-white/10 flex-shrink-0" />
            <div className="text-center">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-white font-display tracking-tight">6</span>
              <span className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mt-1">Countries</span>
            </div>
            <div className="w-px h-8 bg-white/10 flex-shrink-0" />
            <div className="text-center">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-white font-display tracking-tight">6</span>
              <span className="block text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mt-1">Services</span>
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
      <section className="relative py-16 px-6 overflow-hidden" style={{ background: '#0A0717' }}>
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#05030F] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#05030F] to-transparent pointer-events-none z-10" />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="relative z-20">
          <div className="max-w-5xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
                <span className="text-[10px] font-mono text-primary/40 tracking-[0.3em] uppercase block mb-3">00 — Global Reach</span>
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                  Clients<br />
                  <span style={{ WebkitTextStroke: '1.5px rgba(181,141,255,0.55)', color: 'transparent' }}>Across</span><br />
                  <span style={{ color: '#B58DFF' }}>6 Nations.</span>
                </h2>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="flex items-end gap-5 sm:pb-1">
                <div className="text-[80px] sm:text-[110px] font-black leading-none select-none" style={{ color: 'rgba(255,255,255,0.04)', fontFamily: 'var(--font-display)' }}>6+</div>
                <p className="text-white/35 text-sm max-w-[150px] leading-relaxed pb-2 border-l border-white/10 pl-4">Delivering real digital systems across global markets.</p>
              </motion.div>
            </div>
          </div>
          {/* Marquee pills */}
          <div
            className="max-w-5xl mx-auto mb-10 overflow-hidden"
            onMouseEnter={e => { const t = e.currentTarget.querySelector('.mq-track') as HTMLDivElement | null; if (t) t.style.animationPlayState = 'paused'; }}
            onMouseLeave={e => { const t = e.currentTarget.querySelector('.mq-track') as HTMLDivElement | null; if (t) t.style.animationPlayState = 'running'; }}
          >
            <div
              className="mq-track"
              style={{ display: 'flex', width: 'max-content', animation: 'marquee-scroll 28s linear infinite', willChange: 'transform' }}
            >
              {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 mx-3 select-none px-5 py-2.5 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', minWidth: 'max-content' }}>
                  <span style={{ fontSize: '1.5rem', lineHeight: 1, display: 'inline-block', fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}>{c.flag}</span>
                  <span className="text-white/75 font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary/50" />
              <span className="text-white/40 text-sm">Trusted by businesses worldwide to drive growth and innovation.</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #0A0717 50%, #05030F 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-primary/40 tracking-[0.3em] uppercase block mb-3">01 — Why GalaxaTech</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                Why<br />
                <span style={{ WebkitTextStroke: '1.5px rgba(181,141,255,0.55)', color: 'transparent' }}>Choose</span><br />
                <span style={{ color: '#B58DFF' }}>Us.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/35 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
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
              className="md:col-span-4 flex flex-col justify-between p-7 rounded-3xl glass-card-premium spotlight-sweep border border-white/10 group min-h-[220px]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                  <Workflow className="w-5.5 h-5.5 text-lavender" />
                </div>
                {/* Micro tech chart inside Card 1 */}
                <div className="hidden sm:flex items-center gap-1.5 font-mono text-[9px] text-white/35 bg-white/5 rounded-lg px-2.5 py-1 border border-white/5">
                  <span>DISCOVER</span>
                  <span className="text-primary">→</span>
                  <span>ARCHITECT</span>
                  <span className="text-primary">→</span>
                  <span>OPTIMIZE</span>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-6 items-end justify-between">
                <div className="max-w-md">
                  <h3 className="text-white font-bold text-base mb-2 font-display">Systems-First Approach</h3>
                  <p className="text-white/50 text-xs leading-relaxed">We architect before we build — mapping workflows, infrastructure, and dependencies so strategy is never an afterthought.</p>
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-auto font-mono text-[9px] text-primary/70 bg-primary/5 rounded-lg p-2.5 border border-primary/10">
                  <div className="flex justify-between gap-4"><span>Sys.Map:</span><span className="text-white font-semibold">Active</span></div>
                  <div className="flex justify-between gap-4"><span>Integrity:</span><span className="text-emerald-400 font-semibold">99.8%</span></div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: End-to-End Delivery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 flex flex-col justify-between p-7 rounded-3xl glass-card-premium spotlight-sweep border border-white/10 group min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                <Rocket className="w-5.5 h-5.5 text-lavender" />
              </div>
              <div className="mt-4">
                <h3 className="text-white font-bold text-base mb-2 font-display">End-to-End</h3>
                <p className="text-white/50 text-xs leading-relaxed mb-4">From roadmap planning through production code deployment, our team owns the entire lifecycle.</p>
                <div className="w-full bg-white/5 rounded-full h-1 border border-white/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-primary to-lavender rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Card 3: Builders Mindset */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2 flex flex-col justify-between p-7 rounded-3xl glass-card-premium spotlight-sweep border border-white/10 group min-h-[220px]"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                  <Users className="w-5.5 h-5.5 text-lavender" />
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">Live</span>
              </div>
              <div className="mt-4">
                <h3 className="text-white font-bold text-base mb-2 font-display">Builders Mindset</h3>
                <p className="text-white/50 text-xs leading-relaxed mb-3">We run our own builder community ecosystem — direct production and fast iteration are in our DNA.</p>
                <div className="flex flex-wrap gap-[3px] mb-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < 18 ? `hsl(${265 + (i % 6) * 18}, 65%, ${55 + (i % 3) * 12}%)` : 'rgba(255,255,255,0.08)' }} />
                  ))}
                  <span className="text-[9px] font-mono text-white/25 self-end ml-0.5">+130</span>
                </div>
                <div className="font-mono text-[10px] text-white/30">Active: <span className="text-white font-bold">148+ builders</span></div>
              </div>
            </motion.div>

            {/* Card 4: Global Standards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2 flex flex-col justify-between p-7 rounded-3xl glass-card-premium spotlight-sweep border border-white/10 group min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                <Globe className="w-5.5 h-5.5 text-lavender" />
              </div>
              <div className="mt-4">
                <h3 className="text-white font-bold text-base mb-2 font-display">Global Standard</h3>
                <p className="text-white/50 text-xs leading-relaxed mb-3">Serving clients across 6 countries with enterprise stability and low-latency operational support.</p>
                <div className="font-mono text-[9px] flex flex-col gap-1">
                  <span style={{ color: '#78D5FF' }}>23.685°N 90.356°E</span>
                  <span className="text-white/25 tracking-widest">DHAKA → WORLD</span>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-white/30">US <span className="text-emerald-400 font-bold">12ms</span></span>
                    <span className="text-white/30">EU <span className="text-emerald-400 font-bold">38ms</span></span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 5: Fast Communication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-2 flex flex-col justify-between p-7 rounded-3xl glass-card-premium spotlight-sweep border border-white/10 group min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                <MessageCircle className="w-5.5 h-5.5 text-lavender" />
              </div>
              <div className="mt-4">
                <h3 className="text-white font-bold text-base mb-2 font-display">Fast Operations</h3>
                <p className="text-white/50 text-xs leading-relaxed mb-3">WhatsApp-first, live Client Hub dashboards, and daily updates — you're never left guessing.</p>
                <div className="rounded-xl overflow-hidden border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.05]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                    <span className="font-mono text-[9px] text-white/40">Update sent · just now</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-1.5 h-1.5 rounded-full bg-white/25 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                    <span className="font-mono text-[9px] text-white/20 ml-1">client typing…</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── What We Build — 3D Service Carousel ──────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #0A0717 50%, #05030F 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-primary/40 tracking-[0.3em] uppercase block mb-3">02 — Services</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                What<br />
                <span style={{ WebkitTextStroke: '1.5px rgba(181,141,255,0.55)', color: 'transparent' }}>We</span><br />
                <span style={{ color: '#B58DFF' }}>Build.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/35 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
              Drag or tap the carousel to explore all six service verticals.
            </motion.p>
          </div>

          {/* 3D Carousel */}
          <div
            className="relative select-none overflow-hidden"
            style={{ perspective: isMobile ? '800px' : '1400px', height: isMobile ? '300px' : '360px', touchAction: 'pan-y' }}
            onPointerDown={handleCarouselPointerDown}
            onPointerMove={handleCarouselPointerMove}
            onPointerUp={handleCarouselPointerUp}
            onPointerCancel={() => { dragRef.current = null; setDragOffset(0); }}
          >
            {SERVICES.map((svc, i) => {
              const offset = getCarouselOffset(i, activeIndex, SERVICES.length);
              const xStep = isMobile ? 155 : 245;
              
              // Apparent fractional offset including real-time drag displacement
              const apparentOffset = offset + (dragOffset / xStep);
              const absOff = Math.abs(apparentOffset);
              
              // We make a slightly wider visible threshold because cards are moving dynamically
              const visible = isMobile ? absOff <= 1.5 : absOff <= 2.5;
              
              // Calculate real-time visual positioning
              const x = offset * xStep + dragOffset;
              const rotY = isMobile ? apparentOffset * 14 : apparentOffset * 22;
              const z = -absOff * (isMobile ? 70 : 100);
              const scale = 1 - absOff * 0.13;
              
              // Smoothly fade out as card moves away from center
              const opacity = visible ? Math.max(0, 1 - absOff * 0.4) : 0;
              const isActive = absOff < 0.5;
              const cardWidth = isMobile ? '175px' : '240px';
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
                  <p className="text-white/45 text-sm leading-relaxed relative z-10">{svc.desc}</p>
                  {isActive && (
                    <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold relative z-10" style={{ color: '#B58DFF' }}>
                      Explore Service <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {!isActive && (
                    <div className="mt-5 relative z-10">
                      <ArrowUpRight className="w-4 h-4 text-white/20" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nav */}
          <div className="flex items-center justify-center gap-5 mt-8">
            <button onClick={carouselPrev} aria-label="Previous service" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-all duration-200 hover:scale-[1.05] active:scale-[0.98]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 rounded-full border border-white/10 text-[11px] font-mono text-white/40">
              {String(activeIndex + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
            </div>
            <div className="flex gap-2" role="tablist" aria-label="Service slides">
              {SERVICES.map((svc, i) => (
                <button key={i} onClick={() => setActiveIndex(i)} role="tab" aria-selected={i === activeIndex} aria-label={svc.label} className="rounded-full transition-all duration-300" style={{ width: i === activeIndex ? '24px' : '8px', height: '8px', background: i === activeIndex ? '#7C2AEB' : 'rgba(255,255,255,0.2)' }} />
              ))}
            </div>
            <button onClick={carouselNext} aria-label="Next service" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-all duration-200 hover:scale-[1.05] active:scale-[0.98]">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── How We Work — vertical timeline ──────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #0A0717 50%, #05030F 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-primary/40 tracking-[0.3em] uppercase block mb-3">03 — Process</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                How<br />
                <span style={{ color: '#B58DFF' }}>We Work.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/35 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
              A clear, collaborative journey from idea to deployed digital systems.
            </motion.p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* SVG curved connector line */}
            <svg
              className="absolute pointer-events-none"
              style={{ left: '14px', top: '29px', width: '32px', height: 'calc(100% - 58px)', overflow: 'visible' }}
              viewBox="0 0 32 400"
              preserveAspectRatio="none"
            >
              {/* Background wave */}
              <path
                d="M16,0 C4,50 28,100 16,150 C4,200 28,250 16,300 C4,350 16,400 16,400"
                fill="none"
                stroke="rgba(124,42,235,0.15)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              {/* Animated fill wave */}
              <path
                d="M16,0 C4,50 28,100 16,150 C4,200 28,250 16,300 C4,350 16,400 16,400"
                fill="none"
                stroke="url(#waveGrad)"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (lineProgress / 100) * 1000}
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.2,.7,.2,1)', filter: 'drop-shadow(0 0 8px rgba(124,42,235,0.65))' }}
              />
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C2AEB" />
                  <stop offset="100%" stopColor="#B58DFF" />
                </linearGradient>
              </defs>
            </svg>
 
            <div className="flex flex-col gap-5">
              {PROCESS_STEPS.map((step, i) => {
                const lit = illuminatedSteps.has(i);
                const StepIcon = step.Icon;
                return (
                  <div key={step.num} ref={el => { stepRefs.current[i] = el; }} className="flex items-center gap-5 relative z-10">
                    <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center flex-shrink-0 relative" style={{ transition: '0.6s cubic-bezier(.2,.7,.2,1)' }}>
                      {/* Outer border ring */}
                      <div className="absolute inset-0 rounded-full border" style={{ borderColor: lit ? '#7C2AEB' : 'rgba(124,42,235,0.2)', transition: '0.6s' }} />
                      {/* Mid glowing backing */}
                      <div className="absolute inset-1 rounded-full blur-[4px]" style={{ background: lit ? 'rgba(124, 42, 235, 0.45)' : 'rgba(124, 42, 235, 0.05)', transition: '0.6s' }} />
                      {/* Inner ring */}
                      <div className="absolute inset-[3px] rounded-full bg-[#0A0717]/95 flex items-center justify-center border border-white/5" style={{ boxShadow: lit ? '0 0 20px rgba(124,42,235,0.4)' : 'none', transition: '0.6s' }}>
                        <StepIcon className="w-5 h-5" style={{ color: lit ? '#B58DFF' : 'rgba(181,141,255,0.3)', transition: '0.6s' }} />
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-between p-5 rounded-3xl relative overflow-hidden" style={{
                      background: 'rgba(10, 8, 37, 0.55)',
                      backdropFilter: 'blur(20px) saturate(140%)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderTop: lit ? '1px solid rgba(181,141,255,0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: lit ? '0 0 35px rgba(124,42,235,0.18), 0 10px 30px rgba(0,0,0,0.5)' : '0 8px 25px rgba(0,0,0,0.35)',
                      transition: '0.6s cubic-bezier(.2,.7,.2,1)'
                    }}>
                      {/* Ghost step number */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black select-none pointer-events-none leading-none" style={{ fontSize: '80px', color: lit ? 'rgba(124,42,235,0.12)' : 'rgba(124,42,235,0.04)', fontFamily: 'var(--font-display)', transition: '0.6s' }}>{step.num}</div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="text-[10px] font-mono" style={{ color: lit ? '#7C2AEB' : 'rgba(124,42,235,0.35)' }}>{step.num}</span>
                          <h3 className="font-bold text-base font-display" style={{ color: lit ? '#fff' : 'rgba(255,255,255,0.35)' }}>{step.title}</h3>
                        </div>
                        <p className="text-sm" style={{ color: lit ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}>{step.desc}</p>
                      </div>
                      <button className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ml-4 cursor-pointer relative z-10" style={{ borderColor: lit ? 'rgba(124,42,235,0.5)' : 'rgba(255,255,255,0.08)', background: lit ? 'rgba(124,42,235,0.15)' : 'transparent' }}>
                        <ChevronRight className="w-4 h-4" style={{ color: lit ? '#B58DFF' : 'rgba(255,255,255,0.2)' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="flex justify-center mt-12">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-primary/40" />
              <span className="text-sm text-white/30">Powered by the <span className="text-primary/60">GalaxaTech</span> intelligence layer</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Selected Work — glassmorphic folder ───────────────────────────────── */}
      <section className="py-16 px-6 overflow-x-hidden" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #0A0717 50%, #05030F 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-primary/40 tracking-[0.3em] uppercase block mb-3">05 — Portfolio</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                Selected<br />
                <span className="text-grad">Work.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/35 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
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
              backdropFilter: 'blur(16px) saturate(140%)',
              WebkitBackdropFilter: 'blur(16px) saturate(140%)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.015))',
            };

            const backGlassStyle: React.CSSProperties = {
              maskImage: folderMaskSvg,
              WebkitMaskImage: folderMaskSvg,
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
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
                    touchAction: 'none',
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
                        background: 'radial-gradient(circle at 50% 50%, #7C2AEB 0%, transparent 70%)',
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
                      let x = 0;
                      let y = isMobile ? 30 : 20;
                      let z = (i + 1) * -8; // Slightly staggered depth when closed
                      let rotX = 0;
                      let rotY = 0;
                      let rotZ = 0;
                      let scale = 0.9 - i * 0.03;
                      let opacity = 0.45 - i * 0.1;
                      let cardBlur = '4px';

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
                          <div className="p-3.5 h-[45%] flex flex-col justify-between" style={{ background: 'rgba(10,8,37,0.92)', backdropFilter: 'blur(5px)' }}>
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
                            <stop offset="0%" stopColor="#B58DFF" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="#78D5FF" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#7C2AEB" stopOpacity="0.5" />
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
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-primary/20 flex items-center justify-center bg-primary/10">
                              <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-lavender" />
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm sm:text-base font-display">Open Portfolio</p>
                              <p className="text-white/40 text-[10px] sm:text-xs font-sans">Hover to reveal selected projects</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-white/35 text-[9px] sm:text-xs font-semibold tracking-wider font-mono">GALAXATECH © 2026</span>
                          <button
                            onClick={e => { e.stopPropagation(); navigate('/portfolio'); }}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-[1.1] primary-gradient cursor-pointer"
                            style={{ boxShadow: '0 8px 30px rgba(124,42,235,0.4)' }}
                          >
                            <ArrowUpRight className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <p className="text-white/25 text-[11px] font-mono mt-6">Hover or tap to reveal</p>
              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* ── FAQ — two-column with icons ───────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #0A0717 60%, #05030F 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-primary/40 tracking-[0.3em] uppercase block mb-3">04 — FAQ</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                Common<br />
                <span style={{ color: '#B58DFF' }}>Questions.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/35 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
              Everything you need to know before working with us.
            </motion.p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left: question list */}
            <div className="flex flex-col gap-3 w-full lg:w-[45%]">
              {FAQS.map((faq, i) => {
                const FaqIcon = faq.icon;
                const isActive = activeFAQ === i;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    onClick={() => setActiveFAQ(isActive ? null : i)}
                    className="faq-item w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all duration-300"
                    style={{
                      ...GLASS_STYLE,
                      borderColor: isActive ? 'rgba(124,42,235,0.5)' : 'rgba(255,255,255,0.12)',
                      boxShadow: isActive ? '0 0 30px rgba(124,42,235,0.25), inset 0 1px 0 rgba(255,255,255,0.1)' : GLASS_STYLE.boxShadow,
                      borderRadius: '16px',
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300" style={{ background: isActive ? 'rgba(124,42,235,0.25)' : 'rgba(124,42,235,0.1)', border: `1px solid ${isActive ? 'rgba(181,141,255,0.4)' : 'rgba(181,141,255,0.15)'}` }}>
                      <FaqIcon className="w-4 h-4" style={{ color: isActive ? '#B58DFF' : 'rgba(181,141,255,0.5)' }} />
                    </div>
                    <span className="text-sm font-semibold flex-1 text-left leading-snug" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.65)' }}>{faq.q}</span>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300" style={{ color: isActive ? '#B58DFF' : 'rgba(255,255,255,0.2)', transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                  </motion.button>
                );
              })}
            </div>

            {/* Right: answer panel */}
            <div className="w-full lg:w-[55%] lg:sticky lg:top-28">
              <AnimatePresence mode="wait">
                {activeFAQ !== null ? (
                  <motion.div
                    key={activeFAQ}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 rounded-2xl"
                    style={{ ...GLASS_STYLE, borderColor: 'rgba(124,42,235,0.3)', boxShadow: '0 0 60px rgba(124,42,235,0.12), inset 0 1px 0 rgba(255,255,255,0.1)', minHeight: '200px' }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      {activeFAQ !== null && (() => {
                        const ActiveIcon = FAQS[activeFAQ].icon;
                        return (
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,42,235,0.2)', border: '1px solid rgba(181,141,255,0.3)' }}>
                            <ActiveIcon className="w-5 h-5" style={{ color: '#B58DFF' }} />
                          </div>
                        );
                      })()}
                      <h3 className="text-white font-bold text-base leading-snug" style={{ fontFamily: 'var(--font-display)' }}>{FAQS[activeFAQ].q}</h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{FAQS[activeFAQ].a}</p>
                    <div className="mt-6 pt-5 border-t border-white/8">
                      <span className="text-[10px] font-mono text-white/25 tracking-widest uppercase">GalaxaTech · Common Questions</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center rounded-2xl"
                    style={{ ...GLASS_STYLE, minHeight: '200px', borderColor: 'rgba(255,255,255,0.08)', opacity: 0.5 }}
                  >
                    <HelpCircle className="w-8 h-8 text-white/20 mb-3" />
                    <p className="text-white/25 text-sm">Select a question to see the answer</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA — toggle + modal ─────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #0A0717 50%, #05030F 100%)' }}>
        {/* Deep ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/8 blur-[160px] rounded-full pointer-events-none" />
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black select-none pointer-events-none leading-none whitespace-nowrap" style={{ fontSize: 'clamp(80px, 20vw, 180px)', color: 'rgba(124,42,235,0.04)', fontFamily: 'var(--font-display)', letterSpacing: '-0.05em' }}>JOIN</div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25" style={{ background: 'rgba(124,42,235,0.08)' }}>
              <Sparkles className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary/70 uppercase">Builders Community</span>
            </div>
          </div>

          <h2 className="font-black text-white mb-5 leading-[0.9]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>
            Wanna join the<br />
            <span style={{ WebkitTextStroke: '2px rgba(181,141,255,0.6)', color: 'transparent' }}>Galaxa</span>{' '}
            <span style={{ color: '#B58DFF' }}>team?</span>
          </h2>
          <p className="text-white/45 text-base mb-10 leading-relaxed max-w-md mx-auto">
            Toggle in to join our builders / newsletter community and hear about opportunities first.
          </p>

          {/* Tactile 3D-effect toggle button */}
          <div className="flex flex-col items-center gap-4">
            <div
              role="switch"
              aria-checked={toggled}
              aria-label="Join Galaxa community"
              className="relative flex items-center rounded-full p-1 cursor-pointer select-none hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
              style={{
                width: 'min(280px, calc(100vw - 3rem))',
                height: '54px',
                background: 'rgba(10, 8, 37, 0.65)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)',
              }}
              onClick={handleToggle}
            >
              {/* Tactile Glowing Knob */}
              <div
                style={{
                  position: 'absolute',
                  top: '5px',
                  left: '5px',
                  width: '132px',
                  height: '42px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #7C2AEB 0%, #B58DFF 100%)',
                  boxShadow: '0 4px 18px rgba(124, 42, 235, 0.6), inset 0 1px 1px rgba(255,255,255,0.3)',
                  transform: toggled ? 'translateX(133px)' : 'translateX(0px)',
                  transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              <span className="relative z-10 flex-1 text-center text-xs font-bold uppercase tracking-wider font-mono transition-colors duration-300" style={{ color: toggled ? 'rgba(255,255,255,0.35)' : 'white' }}>Not yet</span>
              <span className="relative z-10 flex-1 text-center text-xs font-bold uppercase tracking-wider font-mono transition-colors duration-300" style={{ color: toggled ? 'white' : 'rgba(255,255,255,0.35)' }}>Yes, I'm in</span>
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
                style={{ ...GLASS_STYLE, borderRadius: '24px', padding: isMobile ? '20px' : '32px', borderColor: 'rgba(124,42,235,0.45)', boxShadow: '0 0 80px rgba(124,42,235,0.35), inset 0 1px 0 rgba(255,255,255,0.1)' }}
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
                    <Sparkles className="w-8 h-8" style={{ color: '#B58DFF' }} />
                    <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>You're in the circle.</p>
                    <p className="text-white/40 text-sm">We'll reach out with opportunities first.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-full border border-primary/20 flex items-center justify-center mb-5" style={{ background: 'rgba(124,42,235,0.1)' }}>
                      <Mail className="w-5 h-5 text-primary/70" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                      Join the <span style={{ color: '#B58DFF' }}>Galaxa</span> circle
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
                        style={{ background: submitting ? 'rgba(124,42,235,0.5)' : 'linear-gradient(135deg,#7C2AEB,#B58DFF)', boxShadow: '0 8px 30px rgba(124,42,235,0.35)' }}
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

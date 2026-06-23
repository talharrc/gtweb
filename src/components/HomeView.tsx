import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight, ChevronDown, ChevronRight,
  Laptop, Smartphone, TrendingUp, Cpu, Brush, Workflow,
  Globe, Sparkles, Search, Code, Rocket,
  Package, BookOpen, Clock, Users, Lock,
  Zap,
} from 'lucide-react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface HomeViewProps {
  isDhakaOpen: boolean;
  dhakaTime: string;
  currentUser: any | null;
}

interface FeedItem {
  category: string;
  headline: string;
  summary: string;
  time: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const HERO_WORDS = ['Digital Presence', 'AI Infrastructure', 'Growth Engine'];

const SERVICES = [
  { icon: Laptop,     label: 'Web Development',       desc: 'Fast, secure, and scalable websites built for performance and measurable growth.',         color: '#78D5FF', num: '01', tag: 'Frontend + Backend',  anchor: 'web-development' },
  { icon: Smartphone, label: 'App Development',        desc: 'High-performance mobile and web apps tailored precisely to user needs and business goals.', color: '#B58DFF', num: '02', tag: 'iOS + Android + Web', anchor: 'app-development' },
  { icon: TrendingUp, label: 'Social & Content',       desc: 'Engaging content and social strategies that build real brand presence and loyalty.',        color: '#FF8DC7', num: '03', tag: 'Growth + Community',  anchor: 'social-media' },
  { icon: Cpu,        label: 'AI & Automation',        desc: 'Intelligent agents and automation pipelines that eliminate manual work and unlock scale.',   color: '#7C2AEB', num: '04', tag: 'LLMs + Agents',      anchor: 'ai-automation' },
  { icon: Brush,      label: 'Brand Identity',         desc: 'Distinctive visual systems and brand experiences that leave a lasting, memorable impression.',color: '#FFD47A', num: '05', tag: 'Design + Systems',  anchor: 'brand-identity' },
  { icon: Workflow,   label: 'Systems Consulting',     desc: 'Strategic guidance and system architectures that drive sustainable, compounding growth.',    color: '#5EEB8B', num: '06', tag: 'Notion + Process',  anchor: 'systems-consulting' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Discover',   desc: 'Understand goals, users, and market opportunities deeply.', icon: Search },
  { num: '02', title: 'Strategize', desc: 'Shape the roadmap, system design, and execution plan.', icon: Workflow },
  { num: '03', title: 'Build',      desc: 'Design and develop the core solution with precision.', icon: Code },
  { num: '04', title: 'Deploy',     desc: 'Launch, refine, and optimize for continuous growth.', icon: Rocket },
];

const PROJECTS = [
  {
    slug: 'sunnah-grandeur',
    num: '02',
    name: 'Sunnah Grandeur',
    clientType: 'Islamic Lifestyle E-Commerce',
    country: '🇧🇩 Bangladesh',
    services: ['Web Dev', 'App Dev', 'Systems'],
    desc: 'E-commerce web platform + Flutter app with unified Supabase backend and Stripe payments.',
    accent: '#B58DFF',
    accentBg: 'rgba(181,141,255,0.08)',
  },
  {
    slug: 'harmans-trading',
    num: '01',
    name: 'Harmans Trading',
    clientType: 'Recruitment Firm',
    country: '🇸🇦 Saudi Arabia',
    services: ['Web Development', 'Brand Identity'],
    desc: 'A multilingual corporate website (EN/BN/AR with RTL) serving international recruitment clients.',
    accent: '#78D5FF',
    accentBg: 'rgba(120,213,255,0.08)',
  },
  {
    slug: 'salfas-bazar',
    num: '03',
    name: 'Salfas Bazar',
    clientType: 'Organic Food Business',
    country: '🇧🇩 Bangladesh',
    services: ['Brand Identity', 'Web Development'],
    desc: 'Full brand kit and website for an organic food brand highlighting natural quality and trust.',
    accent: '#5EEB8B',
    accentBg: 'rgba(94,235,139,0.08)',
  },
];

const IMPACT_STATS = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 6,  suffix: '+', label: 'Countries Served' },
  { value: 24, suffix: 'h', label: 'Avg. Response Time' },
  { value: 100,suffix: '%', label: 'Client Success Rate' },
];

const COUNTRIES = [
  { flag: '🇺🇸', name: 'United States' },
  { flag: '🇬🇧', name: 'United Kingdom' },
  { flag: '🇵🇰', name: 'Pakistan' },
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇮🇳', name: 'India' },
  { flag: '🇧🇩', name: 'Bangladesh' },
];

const FAQS = [
  { q: 'What kind of businesses do you work with?', a: 'We work with startups, SMEs, and established businesses across 6 countries, primarily in tech, e-commerce, and service industries.' },
  { q: 'How long does a typical project take?', a: 'Timelines vary by scope. A website takes 2–4 weeks; a full app can take 6–10 weeks. We agree on timelines upfront.' },
  { q: 'How does pricing work?', a: 'Projects are quoted individually based on scope. We provide a detailed proposal before any agreement is signed.' },
  { q: 'What is the Galaxa Builders Program?', a: 'GBP is our execution ecosystem for students. Real projects, real tasks, real output. Not a course — an experience.' },
  { q: 'How do I track my project?', a: 'Every client gets access to a dedicated Client Hub — a private dashboard with live progress, updates, documents, and direct team contact.' },
  { q: 'Can I book a free consultation?', a: "Yes. Book an audit or reach out via WhatsApp. We'll respond within 24 hours." },
];

const PLACEHOLDER_FEED: FeedItem[] = [
  { category: 'TOOLS', headline: 'Open-source agent stacks gain traction', summary: 'Teams are adopting lightweight agent frameworks to automate workflows across operations and support.', time: '2h ago' },
  { category: 'RESEARCH', headline: 'Multimodal models improve workflow accuracy', summary: 'New advances in multimodal reasoning boost accuracy in document and visual understanding tasks.', time: '5h ago' },
  { category: 'MARKET', headline: 'SMBs accelerate AI adoption in operations', summary: 'Rising demand for automation and customer support tools drives strong momentum in SMEs globally.', time: 'Today' },
];

const TERMINAL_LINES = [
  { text: '$ galaxa.agents.init()', cls: 'text-white/50' },
  { text: '✓ 8 optimization agents online', cls: 'text-emerald-400' },
  { text: '> Scanning ecosystem...', cls: 'text-white/50' },
  { text: '✓ Performance: 94 / 100', cls: 'text-emerald-400' },
  { text: '✓ SEO gaps: 12 found', cls: 'text-emerald-400' },
  { text: '> Building growth roadmap', cls: 'text-white/50' },
  { text: '▓▓▓▓▓▓░░░░ 73%', cls: 'text-primary' },
  { text: '> Deploying to production', cls: 'text-white/50' },
  { text: '✓ Live — response time 94ms', cls: 'text-emerald-400' },
];

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedStat({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const startTime = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setCount(Math.floor(eased * value));
            if (t < 1) requestAnimationFrame(tick);
            else setCount(value);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function HomeView({ isDhakaOpen, dhakaTime, currentUser }: HomeViewProps) {
  const navigate = useNavigate();

  // Hero
  const [wordIndex, setWordIndex] = useState(0);
  const [buildMins, setBuildMins] = useState(42);
  const [termLineCount, setTermLineCount] = useState(1);

  // FAQ
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Daily AI Feed
  const [feedItems, setFeedItems] = useState<FeedItem[]>(PLACEHOLDER_FEED);

  // Process step highlight
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [litSteps, setLitSteps] = useState<Set<number>>(new Set());

  // Newsletter
  const [subEmail, setSubEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Hovered service
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  // ── Effects ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const m = new Date().getMinutes();
    setBuildMins(m === 0 ? 60 : m);
    const iv = setInterval(() => setBuildMins(p => p >= 59 ? 1 : p + 1), 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setWordIndex(p => (p + 1) % HERO_WORDS.length), 3000);
    return () => clearInterval(iv);
  }, []);

  // Terminal animation loop
  useEffect(() => {
    const iv = setInterval(() => {
      setTermLineCount(p => {
        if (p >= TERMINAL_LINES.length) return 1;
        return p + 1;
      });
    }, 900);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    getDoc(doc(db, 'daily_feed', 'today'))
      .then(snap => { if (snap.exists() && snap.data().items?.length) setFeedItems(snap.data().items.slice(0, 3)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setLitSteps(prev => new Set([...prev, i])); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: subEmail.trim(),
        joinedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    const c = cat.toUpperCase();
    if (c.includes('TOOL')) return <Package className="w-3.5 h-3.5" />;
    if (c.includes('RESEARCH')) return <BookOpen className="w-3.5 h-3.5" />;
    if (c.includes('MARKET')) return <TrendingUp className="w-3.5 h-3.5" />;
    return <Sparkles className="w-3.5 h-3.5" />;
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="relative overflow-x-hidden">
      <Helmet>
        <title>GalaxaTech — Ecosystems, Optimized</title>
        <meta name="description" content="GalaxaTech is a systems-driven creative tech agency from Dhaka, building digital ecosystems for brands across 6 countries." />
        <meta property="og:title" content="GalaxaTech — Ecosystems, Optimized" />
        <meta property="og:description" content="Systems-driven creative tech agency. Web, App, Social, AI, Brand, and Consulting." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "GalaxaTech",
          "url": "https://gt-web-iota.vercel.app",
          "description": "Systems-driven creative tech agency",
          "address": { "@type": "PostalAddress", "addressLocality": "Dhaka", "addressCountry": "BD" }
        })}</script>
      </Helmet>

      {/* ── Shared global styles ─────────────────────────────────────────────── */}
      <style>{`
        /* Orb drift animations */
        @keyframes orb-a {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(60px,-40px) scale(1.08); }
          66%      { transform: translate(-30px,50px) scale(0.95); }
        }
        @keyframes orb-b {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-50px,60px) scale(0.92); }
          66%      { transform: translate(40px,-30px) scale(1.05); }
        }
        @keyframes orb-c {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(30px,50px) scale(1.1); }
        }
        .orb-a { animation: orb-a 18s ease-in-out infinite; }
        .orb-b { animation: orb-b 22s ease-in-out infinite; }
        .orb-c { animation: orb-c 14s ease-in-out infinite; }

        /* Marquee */
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-wrapper {
          mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
        }
        .marquee-wrapper:hover .marquee-track { animation-play-state: paused; }

        /* Gradient keyword shimmer */
        .gradient-word {
          background: linear-gradient(135deg, #C4A0FF 0%, #9B59FF 35%, #7C2AEB 65%, #5E29E8 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-sweep 5s linear infinite;
          display: inline-block;
        }
        @keyframes shimmer-sweep {
          0%   { background-position: 0% center; }
          100% { background-position: 250% center; }
        }

        /* Particle drift */
        @keyframes particle-drift {
          0%   { transform: translateY(0px) translateX(0px) scale(1);    opacity: 0; }
          12%  { opacity: 0.6; }
          85%  { opacity: 0.25; }
          100% { transform: translateY(-90px) translateX(14px) scale(0.3); opacity: 0; }
        }

        /* Floating badge */
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        .animate-float { animation: float-y 3.5s ease-in-out infinite; }

        /* Stats glow pulse */
        @keyframes stats-glow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        /* Service card number */
        .svc-num {
          font-size: 6rem;
          line-height: 1;
          font-weight: 900;
          color: rgba(181,141,255,0.07);
          position: absolute;
          top: -8px;
          right: 16px;
          font-family: 'Satoshi', sans-serif;
          pointer-events: none;
          user-select: none;
          transition: color 0.35s ease;
        }
        .svc-card:hover .svc-num { color: rgba(181,141,255,0.14); }

        /* Dot grid for hero */
        .dot-grid {
          background-image: radial-gradient(circle, rgba(181,141,255,0.18) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        /* Process connecting line */
        @keyframes line-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .process-line { transform-origin: left center; }

        /* Terminal cursor blink */
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .term-cursor { animation: cursor-blink 1s ease-in-out infinite; }

        /* Fade up reveal */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ╔══════════════════════════════════════════════════════════════════════╗ */}
      {/* ║  HERO                                                               ║ */}
      {/* ╚══════════════════════════════════════════════════════════════════════╝ */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[#05030F]">

        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb-a absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.18]"
            style={{ background: 'radial-gradient(circle, #7C2AEB, #5E29E8)', top: '-10%', left: '-8%' }} />
          <div className="orb-b absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.12]"
            style={{ background: 'radial-gradient(circle, #78D5FF, #B58DFF)', bottom: '-5%', right: '-6%' }} />
          <div className="orb-c absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.08]"
            style={{ background: '#7C2AEB', top: '40%', right: '20%' }} />
          <div className="dot-grid absolute inset-0 opacity-30" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05030F] to-transparent" />
        </div>

        {/* Particles */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {[0,1,2,3,4,5,6,7,8].map(pi => (
            <span key={pi} className="absolute rounded-full bg-violet-400"
              style={{ width: pi%3===0?'3px':'2px', height: pi%3===0?'3px':'2px', left:`${5+pi*11}%`, top:`${8+(pi%4)*22}%`, opacity:0, animation:`particle-drift ${2.5+pi*0.4}s ${pi*0.3}s ease-in-out infinite` }} />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-16 lg:pb-20 flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">

          {/* ── Left: Text ── */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
              className="inline-flex items-center gap-2.5 bg-black/50 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.08)] animate-float"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
              <span className="font-mono font-bold tracking-widest text-white/80 uppercase text-[8px] sm:text-[10px]">
                <span className="sm:hidden">Agents Active · {buildMins}m ago</span>
                <span className="hidden sm:inline">Live Studio • Agents Active • Last build: {buildMins}m ago</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16,1,0.3,1] }}
              className="font-display text-[2.1rem] sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-3 sm:mb-4"
            >
              Build your brand's
              <span className="block mt-1 sm:mt-2 font-serif italic min-h-[1.15em] overflow-hidden w-full">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: 32, opacity: 0, filter: 'blur(6px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: -32, opacity: 0, filter: 'blur(6px)' }}
                    transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
                    className="block text-gradient"
                  >
                    {HERO_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16,1,0.3,1] }}
              className="text-sm sm:text-base lg:text-lg text-white/55 max-w-xs sm:max-w-lg mb-8 sm:mb-10 leading-relaxed"
            >
              GalaxaTech engineers web, app, AI, and brand systems that work together — for clients across 6 countries.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16,1,0.3,1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
            >
              <button
                onClick={() => navigate('/audit')}
                className="group flex items-center justify-center gap-3 bg-gradient-to-tr from-[#5E29E8] to-[#7C2AEB] text-white font-bold py-3.5 px-7 rounded-full transition-all duration-300 shadow-[0_8px_32px_rgba(124,42,235,0.45)] hover:shadow-[0_12px_48px_rgba(124,42,235,0.65)] hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer"
              >
                <span>Book a Free Audit</span>
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </button>
              <button
                onClick={() => navigate('/portfolio')}
                className="flex items-center justify-center gap-2 text-white/70 hover:text-white border border-white/10 hover:border-white/25 py-3.5 px-7 rounded-full font-semibold transition-all duration-300 active:scale-[0.97] cursor-pointer"
              >
                View Our Work <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-2 sm:gap-3 mt-8 sm:mt-12"
            >
              {[
                { num: '2024', label: 'Founded' },
                { num: '6+',   label: 'Countries' },
                { num: '50+',  label: 'Projects' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm"
                  style={{ animation: `stats-glow ${2.5 + i * 0.4}s ease-in-out ${i * 0.2}s infinite` }}
                >
                  <span className="text-sm sm:text-base font-extrabold text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>{s.num}</span>
                  <span className="text-[8px] sm:text-[9px] font-mono text-white/35 tracking-widest uppercase">{s.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-primary/30 bg-primary/8 backdrop-blur-sm"
                style={{ animation: 'stats-glow 2.2s ease-in-out 0.6s infinite' }}>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span className="text-[8px] sm:text-[9px] font-mono text-white/55 tracking-widest uppercase">Client Success</span>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Terminal Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16,1,0.3,1] }}
            className="hidden lg:flex flex-col w-[380px] flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.035)',
              backdropFilter: 'blur(24px) saturate(140%)',
              WebkitBackdropFilter: 'blur(24px) saturate(140%)',
              border: '1px solid rgba(181,141,255,0.22)',
              borderRadius: '20px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 32px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(124,42,235,0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Terminal header bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.07] bg-white/[0.02]">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-[11px] font-mono text-white/40">galaxa.terminal — agents v2.4</span>
              <span className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400">LIVE</span>
              </span>
            </div>

            {/* Terminal body */}
            <div className="p-5 font-mono text-[12px] leading-[1.9] min-h-[260px] flex flex-col justify-between">
              <div className="flex flex-col gap-0.5">
                {TERMINAL_LINES.slice(0, termLineCount).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={line.cls}
                  >
                    {line.text}
                  </motion.div>
                ))}
                {termLineCount <= TERMINAL_LINES.length && (
                  <span className="text-primary term-cursor">█</span>
                )}
              </div>

              {/* Mini metrics */}
              {termLineCount >= TERMINAL_LINES.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.07]"
                >
                  {[
                    { label: 'Response', val: '94ms' },
                    { label: 'Uptime', val: '99.9%' },
                    { label: 'Score', val: '94/100' },
                  ].map(m => (
                    <div key={m.label} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-white/35 uppercase tracking-wider">{m.label}</span>
                      <span className="text-white font-bold text-[13px]">{m.val}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Subtle glow at bottom */}
            <div className="h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════════════╗ */}
      {/* ║  GLOBAL PRESENCE MARQUEE                                           ║ */}
      {/* ╚══════════════════════════════════════════════════════════════════════╝ */}
      <section className="py-10 sm:py-12 border-y border-white/[0.06] bg-[#0A0825] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center gap-3 justify-center">
          <Globe className="w-3.5 h-3.5 text-primary/60" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase">Serving clients across 6 countries</span>
          <Globe className="w-3.5 h-3.5 text-primary/60" />
        </div>
        <div className="marquee-wrapper overflow-hidden">
          <div className="marquee-track">
            {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 mx-2.5 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] select-none hover:border-primary/30 hover:bg-primary/[0.04] transition-all duration-300 cursor-default"
                style={{ minWidth: 'max-content' }}
              >
                <span className="text-xl leading-none">{c.flag}</span>
                <span className="text-white/60 font-semibold text-sm">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════════════╗ */}
      {/* ║  SERVICES GRID                                                      ║ */}
      {/* ╚══════════════════════════════════════════════════════════════════════╝ */}
      <section className="relative py-16 sm:py-24 lg:py-28 px-5 sm:px-6 bg-[#05030F]">
        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(124,42,235,0.05)_0%,transparent_70%)]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/[0.04] text-[10px] font-mono tracking-[0.2em] text-primary/60 uppercase mb-5">
              <Zap className="w-3 h-3 text-primary/60" />
              What We Build
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Six ways we <span className="gradient-word">level you up</span>
            </h2>
            <p className="text-white/45 text-sm sm:text-base max-w-sm sm:max-w-lg mx-auto">
              Digital systems that grow your brand, streamline operations, and convert visitors into customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.anchor}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16,1,0.3,1] }}
                className="svc-card relative overflow-hidden rounded-[20px] p-5 sm:p-7 cursor-pointer group"
                style={{
                  background: hoveredService === i
                    ? `linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))`
                    : 'rgba(255,255,255,0.032)',
                  backdropFilter: 'blur(20px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                  border: hoveredService === i
                    ? `1px solid ${svc.color}40`
                    : '1px solid rgba(181,141,255,0.14)',
                  boxShadow: hoveredService === i
                    ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${svc.color}14, inset 0 1px 0 rgba(255,255,255,0.12)`
                    : 'inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.4)',
                  transition: 'all 0.35s cubic-bezier(0.2,0.7,0.2,1)',
                  transform: hoveredService === i ? 'translateY(-4px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                onClick={() => navigate(`/services#${svc.anchor}`)}
              >
                {/* Large faded number */}
                <span className="svc-num">{svc.num}</span>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-all duration-300"
                  style={{
                    background: `${svc.color}15`,
                    border: `1px solid ${svc.color}28`,
                    boxShadow: hoveredService === i ? `0 0 20px ${svc.color}22` : 'none',
                  }}
                >
                  <svc.icon className="w-5.5 h-5.5" style={{ color: svc.color, width: '22px', height: '22px' }} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-extrabold text-[17px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                      {svc.label}
                    </h3>
                  </div>
                  <span
                    className="inline-block text-[9px] font-mono tracking-wider px-2 py-0.5 rounded mb-3"
                    style={{ color: svc.color, background: `${svc.color}12`, border: `1px solid ${svc.color}20` }}
                  >
                    {svc.tag}
                  </span>
                  <p className="text-white/45 text-sm leading-relaxed group-hover:text-white/65 transition-colors duration-300">
                    {svc.desc}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  className="absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: hoveredService === i ? `${svc.color}18` : 'transparent',
                    border: hoveredService === i ? `1px solid ${svc.color}35` : '1px solid rgba(255,255,255,0.08)',
                    color: hoveredService === i ? svc.color : 'rgba(255,255,255,0.3)',
                    transform: hoveredService === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex justify-center"
          >
            <button
              onClick={() => navigate('/services')}
              className="flex items-center gap-2 text-white/50 hover:text-white border border-white/[0.08] hover:border-white/20 py-3 px-8 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer"
            >
              Explore all services <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════════════╗ */}
      {/* ║  HOW WE WORK                                                        ║ */}
      {/* ╚══════════════════════════════════════════════════════════════════════╝ */}
      <section className="relative py-16 sm:py-24 lg:py-28 px-5 sm:px-6 bg-[#0A0825] overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,42,235,0.07)_0%,transparent_65%)]" />
          {[0,1,2,3,4].map(pi => (
            <span key={pi} className="absolute rounded-full bg-violet-500"
              style={{ width:'2px', height:'2px', left:`${12+pi*18}%`, top:`${20+(pi%3)*30}%`, opacity:0, animation:`particle-drift ${2.8+pi*0.4}s ${pi*0.35}s ease-in-out infinite` }} />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/[0.04] text-[10px] font-mono tracking-[0.2em] text-primary/60 uppercase mb-5">
              <Sparkles className="w-3 h-3 text-primary/60" />
              Process
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              How we <span className="gradient-word">work</span>
            </h2>
            <p className="text-white/45 text-sm sm:text-base max-w-sm sm:max-w-xl mx-auto">
              A clear, collaborative journey from first conversation to deployed digital ecosystem.
            </p>
          </motion.div>

          {/* Steps grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-[60px] left-[12.5%] right-[12.5%] h-px pointer-events-none z-0"
              style={{ background: 'linear-gradient(to right, rgba(94,41,232,0.2), rgba(181,141,255,0.5), rgba(94,41,232,0.2))' }}>
              <div className="absolute inset-0 h-px"
                style={{ background: 'repeating-linear-gradient(to right, rgba(181,141,255,0.5) 0, rgba(181,141,255,0.5) 6px, transparent 6px, transparent 14px)' }} />
            </div>

            {PROCESS_STEPS.map((step, i) => {
              const lit = litSteps.has(i);
              return (
                <motion.div
                  key={step.num}
                  ref={el => { stepRefs.current[i] = el; }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
                  className="relative z-10 flex flex-col items-center text-center p-4 sm:p-6 rounded-[16px] sm:rounded-[20px] group"
                  style={{
                    background: lit ? 'rgba(255,255,255,0.048)' : 'rgba(255,255,255,0.022)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: lit ? '1px solid rgba(181,141,255,0.30)' : '1px solid rgba(181,141,255,0.10)',
                    boxShadow: lit ? '0 12px 40px rgba(124,42,235,0.14), inset 0 1px 0 rgba(255,255,255,0.10)' : 'none',
                    transition: 'all 0.6s ease',
                  }}
                >
                  {/* Step node */}
                  <div
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-5 transition-all duration-600"
                    style={{
                      background: lit ? 'rgba(124,42,235,0.15)' : 'rgba(255,255,255,0.04)',
                      border: lit ? '2px solid rgba(124,42,235,0.7)' : '2px solid rgba(181,141,255,0.15)',
                      boxShadow: lit ? '0 0 28px rgba(124,42,235,0.5)' : 'none',
                    }}
                  >
                    <step.icon
                      className="w-5 h-5 transition-colors duration-500"
                      style={{ color: lit ? '#B58DFF' : 'rgba(181,141,255,0.28)' }}
                    />
                  </div>

                  <span className="text-[10px] font-mono font-bold text-primary/60 mb-1">{step.num}</span>
                  <h3 className="text-white font-extrabold text-base sm:text-lg mb-1 sm:mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>{step.title}</h3>
                  <p className="text-white/45 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-2 text-xs text-white/30 font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary/50 animate-pulse" />
            <span>Powered by the <span className="text-white/60">GalaxaTech</span> intelligence layer</span>
          </motion.div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════════════╗ */}
      {/* ║  SELECTED WORK                                                      ║ */}
      {/* ╚══════════════════════════════════════════════════════════════════════╝ */}
      <section className="py-16 sm:py-24 lg:py-28 px-5 sm:px-6 bg-[#05030F]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/[0.04] text-[10px] font-mono tracking-[0.2em] text-primary/60 uppercase mb-4">
                <Sparkles className="w-3 h-3 text-primary/60" />
                Portfolio
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Selected <span className="gradient-word">Work</span>
              </h2>
              <p className="text-white/45 text-sm sm:text-base mt-3 max-w-sm sm:max-w-md">
                Projects, systems, and brands we've helped shape across 6 countries.
              </p>
            </div>
            <button
              onClick={() => navigate('/portfolio')}
              className="flex items-center gap-2 text-white/60 hover:text-white border border-white/[0.08] hover:border-white/20 py-3 px-6 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer flex-shrink-0"
            >
              View all work <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROJECTS.map((proj, i) => (
              <motion.div
                key={proj.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
                onClick={() => navigate('/portfolio')}
                className="group relative flex flex-col rounded-[20px] overflow-hidden cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.028)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid rgba(255,255,255,0.08)`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  transition: 'all 0.35s cubic-bezier(0.2,0.7,0.2,1)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${proj.accent}40`;
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${proj.accent}12`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
                }}
              >
                {/* Accent bar */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${proj.accent}60, ${proj.accent}20, transparent)` }} />

                {/* Mock visual area */}
                <div
                  className="h-40 w-full flex items-center justify-center relative overflow-hidden"
                  style={{ background: proj.accentBg }}
                >
                  {/* Abstract geometric mockup */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-24 h-24 rounded-2xl border-2 rotate-12" style={{ borderColor: proj.accent }} />
                    <div className="absolute w-16 h-16 rounded-xl border-2 -rotate-6" style={{ borderColor: proj.accent, opacity: 0.6 }} />
                  </div>
                  <div className="relative z-10 text-center">
                    <span className="text-3xl font-extrabold font-mono" style={{ color: proj.accent, opacity: 0.8 }}>{proj.num}</span>
                    <div className="text-[10px] font-mono mt-1" style={{ color: proj.accent, opacity: 0.5 }}>PROJECT</div>
                  </div>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                    style={{ background: `${proj.accent}08` }}
                  >
                    <div className="flex items-center gap-2 text-sm font-bold" style={{ color: proj.accent }}>
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold" style={{ color: proj.accent }}>{proj.num}</span>
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">{proj.clientType}</span>
                      </div>
                      <h3 className="text-white font-extrabold text-lg" style={{ fontFamily: 'Satoshi, sans-serif' }}>{proj.name}</h3>
                    </div>
                    <span className="text-base ml-2 mt-0.5">{proj.country.split(' ')[0]}</span>
                  </div>

                  <p className="text-white/45 text-sm leading-relaxed mb-5 flex-1">{proj.desc}</p>

                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                    {proj.services.map(s => (
                      <span
                        key={s}
                        className="text-[9px] font-mono px-2 py-0.5 rounded border"
                        style={{ color: proj.accent, borderColor: `${proj.accent}25`, background: `${proj.accent}08` }}
                      >
                        {s}
                      </span>
                    ))}
                    <span className="text-[9px] font-mono text-white/30 ml-auto">{proj.country}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════════════╗ */}
      {/* ║  IMPACT NUMBERS                                                     ║ */}
      {/* ╚══════════════════════════════════════════════════════════════════════╝ */}
      <section className="relative py-14 sm:py-20 px-5 sm:px-6 bg-[#0A0825] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(124,42,235,0.10)_0%,transparent_70%)]" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {IMPACT_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <span
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-2"
                  style={{
                    fontFamily: 'Satoshi, sans-serif',
                    background: 'linear-gradient(135deg, #fff 30%, rgba(181,141,255,0.9) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  <AnimatedStat value={stat.value} suffix={stat.suffix} />
                </span>
                <div className="w-8 h-px bg-primary/40 mb-2" />
                <span className="text-white/40 text-xs font-mono tracking-wider uppercase">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════════════╗ */}
      {/* ║  DAILY AI FEED                                                      ║ */}
      {/* ╚══════════════════════════════════════════════════════════════════════╝ */}
      <section className="relative py-16 sm:py-24 lg:py-28 px-5 sm:px-6 bg-[#05030F] overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {[0,1,2,3,4,5].map(pi => (
            <span key={pi} className="absolute rounded-full bg-violet-400"
              style={{ width:'2px', height:'2px', left:`${8+pi*16}%`, top:`${12+(pi%4)*22}%`, opacity:0, animation:`particle-drift ${2.2+pi*0.5}s ${pi*0.28}s ease-in-out infinite` }} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono tracking-[0.2em] font-semibold text-emerald-400 uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              Live
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Daily <span className="gradient-word">AI Feed</span>
            </h2>
            <p className="text-white/45 text-sm sm:text-base max-w-sm sm:max-w-lg">
              Signals on tools, trends, research, and market shifts — curated daily by our intelligence layer.
            </p>
          </motion.div>

          {/* Editorial layout: 1 wide + 2 narrow */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Featured card */}
            {feedItems[0] && (
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
                className="lg:col-span-3 flex flex-col p-8 rounded-[20px]"
                style={{
                  background: 'rgba(255,255,255,0.042)',
                  backdropFilter: 'blur(22px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                  border: '1px solid rgba(181,141,255,0.18)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-mono tracking-wider font-semibold text-[#B58DFF] border-[rgba(181,141,255,0.25)] bg-[rgba(181,141,255,0.08)]">
                    {getCategoryIcon(feedItems[0].category)}
                    <span>{feedItems[0].category}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/30 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />{feedItems[0].time}
                  </span>
                </div>
                <h3 className="text-white font-extrabold text-2xl mb-4 leading-snug flex-1" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  {feedItems[0].headline}
                </h3>
                <p className="text-white/55 text-base leading-relaxed mb-6">{feedItems[0].summary}</p>
                <div className="pt-5 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-white/35 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-primary/50" />
                  Generated by <span className="text-primary/70 ml-1">Galaxa agents</span>
                </div>
              </motion.div>
            )}

            {/* Two narrow cards */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {feedItems.slice(1, 3).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
                  className="flex flex-col p-6 rounded-[20px] flex-1"
                  style={{
                    background: 'rgba(255,255,255,0.032)',
                    backdropFilter: 'blur(22px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                    border: '1px solid rgba(181,141,255,0.14)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[9px] font-mono tracking-wider font-semibold text-[#B58DFF] border-[rgba(181,141,255,0.20)] bg-[rgba(181,141,255,0.06)] self-start mb-4">
                    {getCategoryIcon(item.category)}
                    <span>{item.category}</span>
                  </div>
                  <h3 className="text-white font-extrabold text-base mb-2 leading-snug flex-1" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    {item.headline}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed">{item.summary}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-white/30 font-mono">
                    <Clock className="w-3 h-3" />{item.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/20" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/15 bg-primary/[0.04] text-[10px] text-white/50 font-mono tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-primary/60" />
              Curated by <span className="text-white/70 ml-1">GalaxaTech</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/20" />
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════════════╗ */}
      {/* ║  FAQ                                                                ║ */}
      {/* ╚══════════════════════════════════════════════════════════════════════╝ */}
      <section className="relative py-16 sm:py-24 lg:py-28 px-5 sm:px-6 bg-[#0A0825] overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,42,235,0.06)_0%,transparent_65%)]" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Common <span className="gradient-word">Questions</span>
            </h2>
            <p className="text-white/40 text-sm">Everything you need to know before we get started.</p>
          </motion.div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="rounded-xl overflow-hidden border border-violet-500/12"
                style={{
                  background: activeFAQ === i ? 'rgba(255,255,255,0.048)' : 'rgba(255,255,255,0.022)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  transition: 'background 0.3s ease',
                }}
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="text-white font-semibold text-sm pr-4 leading-relaxed">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-300 ${activeFAQ === i ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFAQ === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-white/55 text-sm leading-relaxed border-t border-white/[0.05] pt-3">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════════════════════════╗ */}
      {/* ║  FINAL CTA                                                          ║ */}
      {/* ╚══════════════════════════════════════════════════════════════════════╝ */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-5 sm:px-6 bg-[#05030F] overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,42,235,0.14)_0%,transparent_60%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-[300px]"
            style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(124,42,235,0.22) 0%, rgba(94,41,232,0.08) 45%, transparent 68%)' }} />
          <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ width: '600px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(181,141,255,0.1) 20%, rgba(181,141,255,0.45) 50%, rgba(181,141,255,0.1) 80%, transparent)', filter: 'blur(0.5px)' }} />
          {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
            <span key={i} className="absolute rounded-full" style={{
              width: i % 4 === 0 ? '3px' : '2px', height: i % 4 === 0 ? '3px' : '2px',
              left: `${4 + i * 9}%`, top: `${10 + (i % 5) * 18}%`,
              background: i % 3 === 0 ? '#B58DFF' : 'rgba(255,255,255,0.5)',
              opacity: 0.2 + (i % 3) * 0.15,
              animation: `particle-drift ${3.0 + i * 0.38}s ${i * 0.22}s ease-in-out infinite`,
            }} />
          ))}
        </div>

        {/* Large background word */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            className="text-[20vw] font-extrabold tracking-tighter opacity-[0.018]"
            style={{ fontFamily: 'Satoshi, sans-serif', color: '#B58DFF', whiteSpace: 'nowrap' }}
          >
            GALAXA
          </span>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/[0.06] text-[11px] font-mono tracking-widest text-primary/75 uppercase mb-8">
              <Users className="w-3.5 h-3.5 text-primary/75" />
              Join the Galaxa Circle
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 sm:mb-5 tracking-tight leading-[1.08]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Ready to build something<br /><span className="gradient-word">remarkable?</span>
            </h2>
            <p className="text-white/45 text-sm sm:text-base mb-8 sm:mb-12 max-w-xs sm:max-w-md mx-auto leading-relaxed">
              Join the Galaxa newsletter for early access, opportunities, and builder-only updates.
            </p>

            {/* Inline form */}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-10"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center mb-2">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-white font-extrabold text-xl" style={{ fontFamily: 'Satoshi, sans-serif' }}>You're in the circle. ✦</p>
                  <p className="text-white/40 text-sm">We'll reach out with opportunities first.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleNewsletterSubmit}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={subEmail}
                    onChange={e => setSubEmail(e.target.value)}
                    required
                    className="flex-1 px-5 py-3.5 rounded-full text-sm text-white bg-white/[0.05] border border-white/10 placeholder-white/25 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-sm bg-gradient-to-r from-[#5E29E8] to-[#7C2AEB] shadow-[0_8px_32px_rgba(124,42,235,0.45)] hover:shadow-[0_12px_48px_rgba(124,42,235,0.65)] transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 flex-shrink-0"
                  >
                    {submitting ? 'Joining…' : 'Join now'}
                    {!submitting && <ArrowUpRight className="w-4 h-4" />}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {!submitted && (
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/25 font-mono">
                <Lock className="w-3 h-3" /> No spam. Unsubscribe anytime.
              </p>
            )}

            {/* Dual action row */}
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 border-t border-white/[0.05]">
              <button
                onClick={() => navigate('/audit')}
                className="group flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300 text-sm font-semibold cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full border border-white/10 group-hover:border-primary/40 group-hover:bg-primary/5 flex items-center justify-center transition-all duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                Book a free audit
              </button>
              <span className="hidden sm:block w-px h-6 bg-white/[0.08]" />
              <button
                onClick={() => navigate('/gbp')}
                className="group flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300 text-sm font-semibold cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full border border-emerald-500/20 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5 flex items-center justify-center transition-all duration-300">
                  <Users className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-400" />
                </div>
                Join the Builders Program
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

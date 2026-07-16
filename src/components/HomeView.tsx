import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion, useInView } from 'motion/react';
import {
  ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight,
  Laptop, Smartphone, TrendingUp, Cpu, Brush, Workflow,
  Globe, MessageCircle, Sparkles, Send,
  Search, Code2, Rocket, Shield, Package, FileText, Mail,
  Zap, Users, CheckCircle, X,
  HelpCircle, Clock, DollarSign, BookOpen, Monitor, PhoneCall,
  FolderOpen, Lock, RefreshCw,
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

const TYPEWRITER_WORDS = ['track visitors?', 'load fast?', 'make sales?', 'rank on search?'];

const SERVICES = [
  { num: '01', icon: Laptop,         label: 'Web Development',         desc: 'Fast, secure, and scalable websites built for performance and growth.',              anchor: 'web-development',    color: '#00C2FF' },
  { num: '02', icon: Smartphone,     label: 'App Development',         desc: 'High-performance mobile and web apps tailored to user needs and business goals.',    anchor: 'app-development',    color: '#F0F4FF' },
  { num: '03', icon: MessageCircle,  label: 'Social Media & Content',  desc: 'Engaging content and social strategies that build brand presence and loyalty.',      anchor: 'social-media',       color: '#00C2FF' },
  { num: '04', icon: Cpu,            label: 'AI & Automation',         desc: 'Intelligent automation that streamlines workflows and boosts productivity.',          anchor: 'ai-automation',      color: '#F0F4FF' },
  { num: '05', icon: Brush,          label: 'Brand Identity & Design', desc: 'Distinctive visuals and brand experiences that leave a lasting impression.',         anchor: 'brand-identity',     color: '#00C2FF' },
  { num: '06', icon: Workflow,       label: 'Systems Consulting',      desc: 'Strategic guidance and system architectures that drive sustainable growth.',         anchor: 'systems-consulting', color: '#F0F4FF' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Discover',   desc: 'Understand goals, users, and opportunities.',       Icon: Search   },
  { num: '02', title: 'Strategize', desc: 'Shape the roadmap, system, and execution plan.',    Icon: Workflow },
  { num: '03', title: 'Build',      desc: 'Design and develop the core solution.',             Icon: Code2    },
  { num: '04', title: 'Deploy',     desc: 'Launch, refine, and optimize for growth.',          Icon: Rocket   },
];

const PROJECTS = [
  { slug: 'harmans-trading',  num: '01', name: 'Harmans Trading',  type: 'Trading Platform',      color: '#fedd00', bg: 'linear-gradient(135deg,rgba(254,221,0,0.25) 0%,rgba(120,40,100,0.2) 60%,rgba(13,0,10,0.85) 100%)' },
  { slug: 'sunnah-grandeur',  num: '02', name: 'Sunnah Grandeur',  type: 'E-Commerce Platform',   color: '#782864', bg: 'linear-gradient(135deg,rgba(120,40,100,0.3) 0%,rgba(13,0,10,0.4) 60%,rgba(13,0,10,0.85) 100%)' },
  { slug: 'salfas-bazar',     num: '03', name: 'Salfas Bazar',     type: 'Organic Food Platform', color: '#fedd00', bg: 'linear-gradient(135deg,rgba(254,221,0,0.20) 0%,rgba(120,40,100,0.15) 60%,rgba(13,0,10,0.85) 100%)' },
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
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 28px rgba(0,194,255,0.05), 0 20px 60px rgba(0,0,0,0.50)',
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

  const [countdown, setCountdown] = useState({ hours: 5, minutes: 47, seconds: 12 });
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'git push origin main - adib-dev',
    'vercel build succeeded (32s)...',
    'design tokens applied from Stitch...',
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 47, seconds: 12 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const messages = [
      'git commit: updated home view layout',
      'vercel deploy: client-hub v1.4.2 succeeds',
      'figma: design token variables compiled',
      'audit request received from US Node',
      'production build cache optimized',
      'stitch: style variables synced to index.css',
      'client-hub dashboard database synced',
      'awaiting next development commit...',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setTerminalLogs(prev => {
        const next = [...prev.slice(1), messages[idx]];
        idx = (idx + 1) % messages.length;
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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
  const folderWrapperRef = useRef<HTMLDivElement>(null);
  const [folderTilt, setFolderTilt] = useState({ x: 0, y: 0 });

  const handleFolderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!folderWrapperRef.current || isMobile) return;
    const rect = folderWrapperRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    setFolderTilt({
      x: -(mouseY / height) * 12,
      y: (mouseX / width) * 12,
    });
  };

  const handleFolderMouseLeave = () => {
    setFolderTilt({ x: 0, y: 0 });
    setFolderHovered(false);
  };

  const [toggled, setToggled] = useState(false);
  const [circleModalOpen, setCircleModalOpen] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [carouselAutoScrollDir, setCarouselAutoScrollDir] = useState<'left' | 'right' | null>(null);
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Rebrand refs and motion values
  const heroRef = useRef<HTMLDivElement>(null);
  const globalPresenceRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();

  // Hero Parallax Scroll
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const blob1Range = isMobile ? [0, 45] : [0, 90];
  const blob2Range = isMobile ? [0, -30] : [0, -60];
  const yBlob1Transform = useTransform(heroScroll, [0, 1], blob1Range);
  const yBlob2Transform = useTransform(heroScroll, [0, 1], blob2Range);
  const yBlob1Spring = useSpring(yBlob1Transform, { stiffness: 100, damping: 30 });
  const yBlob2Spring = useSpring(yBlob2Transform, { stiffness: 100, damping: 30 });

  const contentOpacityTransform = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const contentYTransform = useTransform(heroScroll, [0, 0.7], [0, isMobile ? -25 : -50]);
  const contentOpacitySpring = useSpring(contentOpacityTransform, { stiffness: 100, damping: 30 });
  const contentYSpring = useSpring(contentYTransform, { stiffness: 100, damping: 30 });

  const yBlob1 = shouldReduceMotion ? 0 : yBlob1Spring;
  const yBlob2 = shouldReduceMotion ? 0 : yBlob2Spring;
  const contentY = shouldReduceMotion ? 0 : contentYSpring;
  const contentOpacity = shouldReduceMotion ? 1 : contentOpacitySpring;

  // Global Presence Parallax
  const { scrollYProgress: globalPresenceScroll } = useScroll({
    target: globalPresenceRef,
    offset: ["start end", "end start"]
  });
  const y6PlusTransform = useTransform(globalPresenceScroll, [0, 1], [isMobile ? 15 : 30, isMobile ? -15 : -30]);
  const y6PlusSpring = useSpring(y6PlusTransform, { stiffness: 100, damping: 30 });
  const y6Plus = shouldReduceMotion ? 0 : y6PlusSpring;

  // Process scaleX Transform
  const { scrollYProgress: processScroll } = useScroll({
    target: processRef,
    offset: ["start end", "end start"]
  });
  const processScaleX = useSpring(processScroll, { stiffness: 100, damping: 30 });

  // Portfolio In View auto-open for Mobile
  const isPortfolioInView = useInView(portfolioSectionRef, { amount: 0.55, once: false });
  const isFolderOpen = folderHovered || (isMobile && isPortfolioInView);

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
    <div className="relative bg-paper text-ink">
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
          0%,100% { box-shadow: 0 0 6px #fedd00, 0 0 14px rgba(254,221,0,0.4); opacity: 1; }
          50%      { box-shadow: 0 0 14px #fedd00, 0 0 28px rgba(254,221,0,0.65); opacity: 0.6; }
        }
        .dot-pulse-glow { animation: dot-pulse-glow 2s ease-in-out infinite; }
        .faq-item:hover { box-shadow: 0 0 30px rgba(254,221,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08); }
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

        .perspective-grid-light {
          background-image:
            linear-gradient(to right, rgba(13, 0, 10, 0.08) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(13, 0, 10, 0.08) 1.5px, transparent 1.5px) !important;
        }
      `}</style>
 
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[82vh] sm:min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-4 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0 select-none overflow-hidden" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 78%, rgba(254, 221, 0, 0.12) 0%, rgba(243, 242, 242, 0.5) 45%, var(--brand-paper) 100%)' }}>
          <div
            className="w-full h-full opacity-15 pointer-events-none dotted-grid-ink absolute inset-0"
          />
          {/* 3D scrolling perspective grid horizon floor */}
          <div className="perspective-container">
            <div className="perspective-grid perspective-grid-light" />
          </div>
          {/* Light vignette top, keeps the bright core low/center */}
          <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/40 to-transparent pointer-events-none" style={{ height: '55%' }} />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-paper to-transparent pointer-events-none" />
          {/* Vivid atmospheric brand blob glows */}
          <motion.div style={{ y: yBlob1 }} className="absolute top-1/3 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-brand/20 blur-[130px] rounded-full pointer-events-none" />
          <motion.div style={{ y: yBlob2 }} className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[420px] h-[420px] bg-brand/10 blur-[110px] rounded-full pointer-events-none" />
          {/* Bright core glow directly behind the countdown clock */}
          <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[640px] h-[340px] bg-white/50 blur-[90px] rounded-full pointer-events-none" />
          {/* Speck of reflection */}
          <motion.div style={{ y: yBlob2 }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
          {/* Diagonal specular beams */}
          <div className="absolute top-0 right-0 w-[45vw] h-full bg-gradient-to-bl from-white/40 via-transparent to-transparent pointer-events-none" style={{ clipPath: 'polygon(100% 0, 30% 0, 100% 100%)' }} />
          <div className="specular-beam absolute top-0 left-0 w-full h-full rotate-[-4deg] opacity-20" />
        </div>
 
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 pt-8 sm:pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>
            <div className="eyebrow-badge rounded-full px-4 sm:px-5 py-2 sm:py-2.5 mb-12 border border-ink/8 shadow-sm bg-white/70 max-w-[92vw] text-ink">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dot-pulse-glow flex-shrink-0" />
              <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-wide sm:tracking-widest text-ink uppercase leading-tight">
                <span className="hidden sm:inline">STUDIO AVAILABILITY • ACTIVE SPRINT • </span>
                <span className="sm:hidden">ACTIVE SPRINT • </span>
                LAST DEPLOY: {buildMins}M AGO
              </span>
            </div>
          </motion.div>
          <h1 className="display-poster text-depth-light text-[2.4rem] sm:text-[3.6rem] md:text-[5.8rem] mb-4" style={{ fontSize: 'clamp(2.6rem, 8vw, 6.5rem)' }}>
            {["Assure", "your", "brand's"].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
                <motion.span
                  initial={shouldReduceMotion ? { y: 0 } : { y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.65, delay: 0.1 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
            <br className="hidden md:block" />
            <span className="display-poster typewriter-container block min-h-[1.2em] mt-3 pb-1 overflow-hidden text-[1.4rem] sm:text-[2.8rem] md:text-[4.5rem] whitespace-nowrap" style={{ filter: 'drop-shadow(0 4px 15px rgba(13,0,10,0.06))' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { y: 35, opacity: 0, filter: 'blur(5px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { y: -35, opacity: 0, filter: 'blur(5px)' }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-ink"
                >
                  {TYPEWRITER_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16,1,0.3,1] }} className="text-base sm:text-lg text-ink/75 max-w-2xl mx-auto mb-6 leading-relaxed font-sans">
            Tell us about your business in 5 minutes — we'll map out exactly how to grow your digital presence.
          </motion.p>
 
          {/* Light Neumorphic Sprint Countdown Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col items-center gap-2 mb-8 relative z-20"
          >
            <span className="text-[10px] font-mono tracking-[0.25em] text-ink/70 uppercase font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> Next Development Sprint Kickoff
            </span>
            <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-white/90 border border-ink/8 shadow-[0_8px_30px_rgba(13,0,10,0.05),inset_0_1px_0_#fff]">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="relative w-11 h-14 sm:w-14 sm:h-18 bg-paper-lo rounded-lg border border-ink/5 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-ink/5 z-10" />
                  <span className="text-ink font-mono font-bold text-2xl sm:text-3xl tracking-tight">
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-ink/65 uppercase mt-1">hrs</span>
              </div>
              <span className="text-brand font-bold text-xl sm:text-2xl mt-[-8px] sm:mt-[-12px] animate-pulse">:</span>
              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="relative w-11 h-14 sm:w-14 sm:h-18 bg-paper-lo rounded-lg border border-ink/5 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-ink/5 z-10" />
                  <span className="text-ink font-mono font-bold text-2xl sm:text-3xl tracking-tight">
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-ink/65 uppercase mt-1">mins</span>
              </div>
              <span className="text-brand font-bold text-xl sm:text-2xl mt-[-8px] sm:mt-[-12px] animate-pulse">:</span>
              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="relative w-11 h-14 sm:w-14 sm:h-18 bg-paper-lo rounded-lg border border-ink/5 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-ink/5 z-10" />
                  <span className="text-ink font-mono font-bold text-2xl sm:text-3xl tracking-tight">
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-ink/65 uppercase mt-1">secs</span>
              </div>
            </div>
          </motion.div>
 
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.16,1,0.3,1] }} className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
            <button
              onClick={() => navigate('/audit')}
              className="group flex items-center gap-4 py-3.5 px-8 rounded-full transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto justify-center shadow-xl btn-brand"
            >
              <span className="w-9 h-9 bg-white/10 text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 flex-shrink-0">
                <ArrowUpRight className="w-4.5 h-4.5" />
              </span>
              <span className="text-sm font-semibold tracking-wider uppercase font-mono">Book an Audit</span>
            </button>
            <button
              onClick={() => navigate('/portfolio')}
              className="group flex items-center gap-3 text-ink/75 hover:text-ink font-semibold py-3.5 px-7 rounded-full transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center border border-ink/15 hover:border-ink/30 bg-white/40 backdrop-blur-sm"
            >
              <span className="text-sm tracking-wide">See Our Work</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
 
          {/* Premium Studio Operations Dashboard Widget */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto mt-10 rounded-2xl border border-ink/8 backdrop-blur-xl relative overflow-hidden bg-grid-dots shadow-[0_15px_45px_rgba(13,0,10,0.06),inset_0_1px_0_#fff]"
            style={{ background: 'rgba(255, 255, 255, 0.85)' }}
          >
            {/* Glow sweep backing */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand/5 blur-[80px] rounded-full pointer-events-none" />
 
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-ink/8">
              {/* Left Column: HQ Clock & Telemetry Connection */}
              <div className="md:col-span-4 p-5 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono tracking-widest text-ink/65 font-bold uppercase">Dhaka Studio</span>
                    <span className={`w-2 h-2 rounded-full dot-pulse-glow ${isDhakaOpen ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`} />
                  </div>
                  <span className="text-ink font-mono text-xl font-bold leading-tight tracking-tight block">
                    {dhakaTime.split(' ')[0]} <span className="text-xs text-ink/50">{dhakaTime.split(' ')[1] || 'BD'}</span>
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between font-mono text-[9px] text-ink/40">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-brand" /> Status: <span className="text-ink font-bold">Online</span>
                  </span>
                  <span>Zone: Asia/Dhaka</span>
                </div>
              </div>
 
              {/* Middle Column: Live Operations Logger */}
              <div className="md:col-span-5 p-4 text-left bg-[#13000a] rounded-xl flex flex-col justify-between min-h-[110px] m-3 shadow-inner border border-white/5">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
                  </div>
                  <span className="text-[8px] font-mono text-white/40 uppercase tracking-wider">Studio Operations Log</span>
                </div>
                <div className="flex-grow font-mono text-[9.5px] space-y-1 text-yellow-200/80">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-1.5 truncate">
                      <span className="text-white/20 select-none">&gt;</span>
                      <span className={index === terminalLogs.length - 1 ? 'text-white' : ''}>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Right Column: Key Metrics Counters */}
              <div className="md:col-span-3 p-5 grid grid-cols-3 md:grid-cols-1 md:gap-3.5 items-center justify-between">
                <div className="text-center md:text-left">
                  <span className="block text-lg md:text-2xl font-bold text-ink font-display tracking-tight leading-none">
                    <Counter value={50} suffix="+" />
                  </span>
                  <span className="block text-[8px] font-mono tracking-widest text-ink/50 uppercase mt-0.5">Projects</span>
                </div>
                <div className="text-center md:text-left border-x md:border-x-0 md:border-t border-ink/5 px-2 md:px-0 md:pt-2">
                  <span className="block text-lg md:text-2xl font-bold text-ink font-display tracking-tight leading-none">
                    <Counter value={15} suffix="+" />
                  </span>
                  <span className="block text-[8px] font-mono tracking-widest text-ink/50 uppercase mt-0.5">Global Clients</span>
                </div>
                <div className="text-center md:text-left md:border-t border-ink/5 md:pt-2">
                  <span className="block text-lg md:text-2xl font-bold text-ink font-display tracking-tight leading-none">
                    <Counter value={99.9} decimals={1} suffix="%" />
                  </span>
                  <span className="block text-[8px] font-mono tracking-widest text-ink/50 uppercase mt-0.5">Core Uptime</span>
                </div>
              </div>
            </div>
          </motion.div>
 
        </motion.div>
 
        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1.5 pointer-events-none">
          <span className="text-[9px] font-mono tracking-[0.22em] text-ink/30 uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-3.5 h-3.5 text-ink/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Global Presence ──────────────────────────────────────────────────── */}
      <section ref={globalPresenceRef} className="relative py-16 px-6 overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--brand-paper) 0%, #ffffff 100%)' }}>
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-paper to-transparent pointer-events-none z-10" />
        {/* Single restrained atmospheric glow + a diagonal specular beam for icy contrast */}
        <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-brand/5 blur-[130px] rounded-full pointer-events-none" />
        <div className="specular-beam absolute -top-1/4 left-0 w-full h-[160%] rotate-[-6deg] opacity-25" />
        <div className="max-w-5xl mx-auto relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
                <span className="text-[10px] font-mono text-ink/65 tracking-[0.3em] uppercase block mb-3">00 — Global Reach</span>
                <div className="flex items-end justify-between mb-8 gap-6">
                  <div>
                    <h2 className="display-poster text-4xl sm:text-5xl md:text-6xl mb-6">
                      <span className="block text-ink">Clients</span>
                      <span className="block text-ink my-2">Across</span>
                      <span className="pill-word-brand text-ink text-2xl sm:text-3xl md:text-4xl mt-2 inline-block">Nations.</span>
                    </h2>
                  </div>
                  <div className="flex items-end gap-5">
                    <motion.div
                      style={{ y: y6Plus, color: 'rgba(13, 0, 10, 0.08)', fontFamily: 'var(--font-condensed)' }}
                      className="text-[60px] sm:text-[80px] font-black leading-none select-none display-poster animate-pulse"
                    >
                      6+
                    </motion.div>
                    <p className="text-ink/65 text-xs max-w-[130px] leading-relaxed pb-1 border-l border-ink/15 pl-4">Delivering real digital systems across global markets.</p>
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
                      <div key={i} className="flex items-center gap-2.5 mx-2.5 select-none px-4 py-2 rounded-full shadow-sm" style={{ border: '1px solid rgba(13, 0, 10, 0.08)', background: '#ffffff', minWidth: 'max-content' }}>
                        <img src={`https://flagcdn.com/20x15/${c.code}.png`} alt={c.name} width="20" height="15" className="flex-shrink-0 rounded-[2px]" />
                        <span className="text-slate-800 font-semibold text-xs" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
 
                <div className="flex items-center gap-3 mt-4">
                  <Shield className="w-5 h-5 text-brand flex-shrink-0" />
                  <span className="text-ink/65 text-xs sm:text-sm">Trusted by businesses worldwide to drive growth and innovation.</span>
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
      <section className="py-16 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, var(--brand-paper) 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="specular-beam absolute top-0 right-0 w-full h-[140%] rotate-[8deg] opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }} className="relative">
              <span className="text-[10px] font-mono text-ink/70 tracking-[0.3em] uppercase block mb-3">01 — Why Choose Us</span>
              <h2 className="display-poster text-4xl sm:text-5xl md:text-6xl mb-6">
                <span className="block text-ink">Why</span>
                <span className="block my-2 text-ink">Choose</span>
                <span className="pill-word-brand text-ink text-2xl sm:text-3xl md:text-4xl mt-2 inline-block">Us.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-ink/65 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-ink/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-ink/10 sm:pl-6">
              Five reasons clients trust GalaxaTech to build their digital future.
            </motion.p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            {/* Card 1: Faster Delivery (Neumorphic Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="md:col-span-4 min-h-[220px]"
            >
              <SpotlightCard light className="w-full h-full flex flex-col justify-between p-7 rounded-3xl card-neu group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-brand text-ink border border-brand-deep/20 flex-shrink-0 font-bold font-mono text-[10px]">
                      01
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-brand [&>svg]:relative [&>svg]:z-10">
                      <Zap className="w-5.5 h-5.5" />
                    </div>
                  </div>
                  {/* Category Pill */}
                  <span className="text-[8px] font-mono font-bold text-brand-deep uppercase tracking-widest bg-brand/10 px-2.5 py-0.5 rounded-full border border-brand/20">
                    Feature Breakdown
                  </span>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-6 items-end justify-between">
                  <div className="max-w-md">
                    <h3 className="text-ink font-bold text-base mb-2 font-display">Faster Delivery</h3>
                    <p className="text-ink/65 text-xs leading-relaxed">Most projects go live in days, not weeks. Our AI-assisted workflows cut down turnaround times dramatically.</p>
                  </div>
                  {/* Timeline Infographic */}
                  <div className="flex items-center gap-3 bg-paper-lo border border-ink/8 px-4 py-2.5 relative overflow-hidden select-none text-[10px] font-mono text-ink/75 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-ink">DAY 1</span>
                        <span className="text-[8px] text-ink/50">Setup</span>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-brand-deep" />
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-ink">DAY 3</span>
                        <span className="text-[8px] text-ink/50">v1 Live</span>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-brand-deep" />
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-ink">DAY 5</span>
                        <span className="text-[8px] text-ink/50">Launch</span>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-ink/15 mx-2" />
                    <div className="flex flex-col text-[8px] leading-tight">
                      <span className="line-through text-ink/40">Agency: 4–6 wks</span>
                      <span className="text-brand-deep font-bold bg-brand/20 px-1 py-0.5 rounded mt-0.5">Galaxa: days</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
 
            {/* Card 2: More Affordable (Neumorphic Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.06 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="md:col-span-2 min-h-[220px]"
            >
              <SpotlightCard light className="w-full h-full flex flex-col justify-between p-7 rounded-3xl card-neu group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-brand text-ink border border-brand-deep/20 flex-shrink-0 font-bold font-mono text-[10px]">
                      02
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-brand [&>svg]:relative [&>svg]:z-10">
                      <DollarSign className="w-5.5 h-5.5" />
                    </div>
                  </div>
                  <span className="text-[8px] font-mono font-bold text-brand-deep uppercase tracking-widest bg-brand/10 px-2.5 py-0.5 rounded-full border border-brand/20">
                    Feature Grid
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-ink font-bold text-base mb-2 font-display">More Affordable</h3>
                  <p className="text-ink/65 text-xs leading-relaxed mb-4">AI cuts development hours, so you pay less for a high-performance system.</p>
                  
                  {/* Cost Compare Infographic */}
                  <div className="flex flex-col gap-2 w-full bg-paper-lo border border-ink/8 p-3 font-mono text-[9px] text-ink/65 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span>TRADITIONAL AGENCY</span>
                      <div className="w-[40%] bg-paper rounded-full h-1.5 overflow-hidden">
                        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} style={{ originX: 0 }} className="h-full bg-slate-400 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-deep font-bold">WITH GALAXATECH</span>
                      <div className="w-[40%] bg-paper rounded-full h-1.5 overflow-hidden">
                        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 0.4 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} style={{ originX: 0 }} className="h-full bg-brand rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
 
            {/* Card 3: Unlimited Revisions (Neumorphic Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="md:col-span-2 min-h-[220px]"
            >
              <SpotlightCard light className="w-full h-full flex flex-col justify-between p-7 rounded-3xl card-neu group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-brand text-ink border border-brand-deep/20 flex-shrink-0 font-bold font-mono text-[10px]">
                      03
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-brand [&>svg]:relative [&>svg]:z-10">
                      <RefreshCw className="w-5.5 h-5.5" />
                    </div>
                  </div>
                  <span className="text-[8px] font-mono font-bold text-brand-deep uppercase tracking-widest bg-brand/10 px-2.5 py-0.5 rounded-full border border-brand/20">
                    Use Case
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-ink font-bold text-base mb-2 font-display">Unlimited Revisions</h3>
                  <p className="text-ink/65 text-xs leading-relaxed mb-3">Request as many changes as you need during development. No hidden fees or limits.</p>
 
                  {/* Chat bubble infographic */}
                  <div className="flex flex-col gap-2 rounded-2xl p-2.5 bg-paper-lo border border-ink/8 select-none text-[9px] font-sans w-full">
                    <div className="flex flex-col items-start max-w-[85%]">
                      <div className="bg-white rounded-2xl rounded-tl-sm px-2.5 py-1 text-slate-700 border border-ink/8 leading-normal shadow-sm">
                        Can we adjust the header layout?
                      </div>
                    </div>
                    <div className="flex flex-col items-end w-full">
                      <div className="bg-brand rounded-2xl rounded-tr-sm px-2.5 py-1 text-ink leading-normal font-semibold shadow-sm">
                        Done — v14 is live.
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
 
            {/* Card 4: Built to Convert (Neumorphic Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="md:col-span-2 min-h-[220px]"
            >
              <SpotlightCard light className="w-full h-full flex flex-col justify-between p-7 rounded-3xl card-neu group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-brand text-ink border border-brand-deep/20 flex-shrink-0 font-bold font-mono text-[10px]">
                      04
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-brand [&>svg]:relative [&>svg]:z-10">
                      <TrendingUp className="w-5.5 h-5.5" />
                    </div>
                  </div>
                  <span className="text-[8px] font-mono font-bold text-brand-deep uppercase tracking-widest bg-brand/10 px-2.5 py-0.5 rounded-full border border-brand/20">
                    Stats Style
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-ink font-bold text-base mb-2 font-display">Built to Convert</h3>
                  <p className="text-ink/65 text-xs leading-relaxed mb-3">We design digital systems optimized to attract customers and generate results.</p>
                  
                  {/* Performance Monitor Infographic */}
                  <div className="flex flex-col gap-1.5 bg-paper-lo border border-ink/8 p-2.5 font-mono text-[9px] w-full text-ink/65 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <span>VISITS → LEADS</span>
                      <span className="text-brand-deep font-bold">+38%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>PAGESPEED</span>
                      <span className="text-brand-deep font-bold bg-brand/20 px-1.5 py-0.5 rounded">98/100</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
 
            {/* Card 5: Long-Term Support (Neumorphic Card) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="md:col-span-2 min-h-[220px]"
            >
              <SpotlightCard light className="w-full h-full flex flex-col justify-between p-7 rounded-3xl card-neu group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-brand text-ink border border-brand-deep/20 flex-shrink-0 font-bold font-mono text-[10px]">
                      05
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-brand [&>svg]:relative [&>svg]:z-10">
                      <Shield className="w-5.5 h-5.5" />
                    </div>
                  </div>
                  <span className="text-[8px] font-mono font-bold text-brand-deep uppercase tracking-widest bg-brand/10 px-2.5 py-0.5 rounded-full border border-brand/20">
                    Trust Builder
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-ink font-bold text-base mb-2 font-display">Long-Term Support</h3>
                  <p className="text-ink/65 text-xs leading-relaxed mb-3">We don't disappear after delivery. We offer continuous updates and maintenance.</p>
                  
                  {/* Support Monitor Infographic */}
                  <div className="flex flex-col gap-2 bg-paper-lo border border-ink/8 p-2.5 font-mono text-[9px] w-full text-ink/75 rounded-2xl">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-brand/20 text-brand-deep font-bold text-[8px]">MAINTAIN</span>
                      <span className="px-1.5 py-0.5 rounded bg-brand/20 text-brand-deep font-bold text-[8px]">SCALE</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[8px] text-ink/50 uppercase">Support status:</span>
                      <span className="flex items-center gap-1 text-[8px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── What We Build — 3D Service Carousel ──────────────────────────────── */}
      <section className="py-16 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--brand-paper) 0%, #ffffff 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-ink/70 tracking-[0.3em] uppercase block mb-3">02 — Services</span>
              <h2 className="text-4xl sm:text-5xl font-black text-ink leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                What<br />
                <span style={{ WebkitTextStroke: '1.5px var(--brand-ink)', color: 'transparent' }}>We</span><br />
                <span className="pill-word-brand">Build.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-ink/65 text-sm leading-relaxed max-w-[320px] sm:text-right border-t border-ink/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-ink/10 sm:pl-6">
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
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                    borderRadius: '24px',
                    border: '1px solid rgba(13, 0, 10, 0.08)',
                    borderTop: '1px solid rgba(13, 0, 10, 0.12)',
                    borderLeft: '1px solid rgba(13, 0, 10, 0.1)',
                    boxShadow: isActive
                      ? hoveredCarouselIndex === i
                        ? `0 0 50px rgba(254, 221, 0, 0.35), 0 10px 30px rgba(13, 0, 10, 0.06), inset 0 1px 0 #fff`
                        : `0 0 35px rgba(254, 221, 0, 0.22), 0 10px 30px rgba(13, 0, 10, 0.06), inset 0 1px 0 #fff`
                      : '0 8px 25px rgba(13, 0, 10, 0.04), inset 0 1px 0 #fff',
                    padding: '28px 24px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Neon backing glow inside card */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, var(--brand-yellow) 0%, transparent 70%)',
                      opacity: isActive ? 0.25 : 0.05,
                    }}
                  />
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-brand">
                      <svc.icon className="w-6 h-6 relative z-10 text-brand-deep" />
                    </div>
                    <span className="text-[11px] font-mono text-ink/30 font-semibold">{svc.num}</span>
                  </div>
                  <h3 className="text-ink font-bold text-base mb-2 font-display relative z-10">{svc.label}</h3>
                  <p className="text-ink/75 text-sm leading-relaxed relative z-10">{svc.desc}</p>
                  {isActive && (
                    <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold relative z-10 text-brand-deep">
                      Explore Service <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {!isActive && (
                    <div className="mt-5 relative z-10">
                      <ArrowUpRight className="w-4 h-4 text-ink/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How We Work ─────────────────────────────────────────────────────────── */}
      <section ref={processRef} className="py-16 px-6 relative overflow-hidden animate-reveal" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, var(--brand-paper) 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="specular-beam absolute top-0 left-0 w-full h-[140%] rotate-[-8deg] opacity-25" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-ink/70 tracking-[0.3em] uppercase block mb-3">03 — Process</span>
              <h2 className="display-poster text-4xl sm:text-5xl md:text-6xl mb-6">
                <span className="block text-ink">How</span>
                <span className="block my-2 text-ink">We</span>
                <span className="pill-word-brand text-ink text-2xl sm:text-3xl md:text-4xl mt-2 inline-block">Work.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-ink/65 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-ink/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-ink/10 sm:pl-6">
              A clear, collaborative journey from idea to deployed digital systems.
            </motion.p>
          </div>
 
          {/* SVG Circuit Timeline */}
          <div className="relative w-full h-14 mb-10 select-none overflow-hidden rounded-2xl border border-ink/8 bg-white px-4 flex items-center shadow-[inset_0_1px_0_#fff,0_10px_30px_rgba(13,0,10,0.04)]">
            <div className="absolute inset-0 bg-grid-dots opacity-15" />
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 800 32" preserveAspectRatio="none">
              {/* Background trace line */}
              <line x1="0" y1="16" x2="800" y2="16" stroke="rgba(13,0,10,0.08)" strokeWidth="2" />
              {/* Animated progress line */}
              <motion.line
                x1="0"
                y1="16"
                x2="800"
                y2="16"
                stroke="var(--brand-yellow-deep)"
                strokeWidth="2.5"
                style={{ scaleX: processScaleX, originX: 0 }}
              />
              {/* Laser pulse */}
              <line
                x1="0"
                y1="16"
                x2="800"
                y2="16"
                stroke="var(--brand-yellow)"
                strokeWidth="2.5"
                className="timeline-laser-beam-fast"
              />
            </svg>
            
            {/* Step nodes overlay */}
            <div className="absolute inset-x-0 top-0 bottom-0 flex justify-between items-center px-[8%]">
              {PROCESS_STEPS.map((step, idx) => {
                const isActive = illuminatedSteps.has(idx);
                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                      className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border transition-all duration-500 z-10 ${
                        isActive
                          ? 'bg-brand border-brand-yellow-deep text-ink shadow-[0_0_10px_var(--brand-yellow)]'
                          : 'bg-paper-lo border-ink/10 text-ink/40'
                      }`}
                    >
                      <span className="text-[9px] font-mono font-bold">{step.num}</span>
                    </motion.div>
                    <span className={`text-[8.5px] font-mono font-bold tracking-wider mt-1 absolute top-6.5 whitespace-nowrap transition-colors duration-500 ${isActive ? 'text-brand-deep' : 'text-ink/30'}`}>
                      {step.title.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
 
          {/* 2×2 Process card grid — unified neumorphic light cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PROCESS_STEPS.map((step, i) => {
              const StepIcon = step.Icon;
              const isIlluminated = illuminatedSteps.has(i);
              const isIcy = i % 2 === 1;
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
                  {isIcy ? (
                    <div className="w-full h-full p-7 rounded-3xl card-neu group relative overflow-hidden">
                      <div className="absolute right-5 bottom-4 font-black select-none pointer-events-none leading-none z-0" style={{ fontSize: '100px', color: 'rgba(13,0,10,0.015)', fontFamily: 'var(--font-display)' }}>{step.num}</div>
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-brand group-hover:scale-105 transition-transform duration-300 [&>svg]:relative [&>svg]:z-10">
                          <StepIcon className="w-5 h-5 text-brand-deep" />
                        </div>
                        <span className="text-[11px] font-mono text-brand-deep font-bold bg-brand/20 px-2.5 py-1 rounded-full">{step.num}</span>
                      </div>
                      <h3 className="text-ink font-bold text-lg mb-2 font-display relative z-10">{step.title}</h3>
                      <p className="text-ink/65 text-sm leading-relaxed relative z-10">{step.desc}</p>
                    </div>
                  ) : (
                    <SpotlightCard
                      light
                      className="w-full h-full p-7 rounded-3xl card-neu border transition-colors duration-500 group"
                      style={{ borderColor: isIlluminated ? 'var(--brand-yellow-deep)' : 'rgba(13,0,10,0.06)' }}
                    >
                      <div className="absolute right-5 bottom-4 font-black select-none pointer-events-none leading-none z-0" style={{ fontSize: '100px', color: 'rgba(13,0,10,0.015)', fontFamily: 'var(--font-display)' }}>{step.num}</div>
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-brand group-hover:scale-105 transition-transform duration-300 [&>svg]:relative [&>svg]:z-10">
                          <StepIcon className="w-5 h-5 text-brand-deep" />
                        </div>
                        <span className="text-[11px] font-mono text-brand-deep font-bold bg-brand/20 px-2.5 py-1 rounded-full">{step.num}</span>
                      </div>
                      <h3 className="text-ink font-bold text-lg mb-2 font-display relative z-10">{step.title}</h3>
                      <p className="text-ink/65 text-sm leading-relaxed relative z-10">{step.desc}</p>
                    </SpotlightCard>
                  )}
                </motion.div>
              );
            })}
          </div>
 
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="flex justify-center mt-10">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-deep" />
              <span className="text-ink/50 text-sm">Powered by the <span className="text-brand-deep font-bold">GalaxaTech</span> intelligence layer</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Selected Work — glassmorphic folder ───────────────────────────────── */}
      <section className="py-16 px-6 overflow-x-hidden relative" style={{ background: 'linear-gradient(to bottom, var(--brand-paper) 0%, #ffffff 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand/5 blur-[160px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-ink/75 tracking-[0.3em] uppercase block mb-3">04 — Portfolio</span>
              <h2 className="text-4xl sm:text-5xl font-black text-ink leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
                Selected<br />
                <span className="pill-word-brand text-ink text-2xl sm:text-3xl md:text-4xl mt-2 inline-block">Work.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-ink/65 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-ink/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-ink/10 sm:pl-6">
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
              background: 'linear-gradient(135deg, rgba(254, 221, 0, 0.12), rgba(255, 255, 255, 0.65))',
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
              background: 'linear-gradient(135deg, rgba(254, 221, 0, 0.06), rgba(13, 0, 10, 0.015))',
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
                  ref={folderWrapperRef}
                  className="relative cursor-pointer w-full max-w-[700px] flex items-center justify-center"
                  onMouseEnter={() => setFolderHovered(true)}
                  onMouseMove={handleFolderMouseMove}
                  onMouseLeave={handleFolderMouseLeave}
                  onClick={() => navigate('/portfolio')}
                  style={{
                    height: isMobile ? '380px' : '480px',
                    perspective: '1600px',
                    touchAction: isMobile ? 'auto' : 'none',
                  }}
                >
                  {/* Core 3D Scene Wrapper - Tilts dynamically with cursor follow */}
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                      transform: isFolderOpen
                        ? `rotateX(${6 + folderTilt.x}deg) rotateY(${-2 + folderTilt.y}deg) scale(1.03)`
                        : 'rotateX(0deg) rotateY(0deg) scale(1)',
                      transition: folderHovered ? 'transform 0.15s ease-out' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Soft ambient neon background glow behind folder */}
                    <div
                       className="absolute inset-0 rounded-3xl opacity-35 pointer-events-none transition-all duration-700"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, var(--brand-yellow) 0%, transparent 70%)',
                        transform: isFolderOpen ? 'translateZ(-90px) scale(1.3)' : 'translateZ(-90px) scale(0.9)',
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
                        transform: isFolderOpen ? 'translateZ(-40px)' : 'translateZ(-40px)',
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
                          stroke="rgba(13, 0, 10, 0.08)"
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
 
                      if (isFolderOpen) {
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
 
                      // Add additional parallax offsets
                      const parallaxX = isFolderOpen && folderHovered ? folderTilt.y * (i + 1) * 1.5 : 0;
                      const parallaxY = isFolderOpen && folderHovered ? -folderTilt.x * (i + 1) * 1.5 : 0;
                      const parallaxZ = isFolderOpen && folderHovered ? (i + 1) * 15 : 0;
 
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
                            transform: `translate3d(${x + parallaxX}px, ${y + parallaxY}px, ${z + parallaxZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
                            transformStyle: 'preserve-3d',
                            opacity,
                            filter: `blur(${cardBlur})`,
                            transition: folderHovered 
                              ? `transform 0.18s ease-out, opacity 0.6s ease, filter 0.6s ease`
                              : `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease, filter 0.6s ease`,
                            zIndex: 10 + i,
                            borderRadius: '20px',
                            overflow: 'hidden',
                            border: '1px solid rgba(13, 0, 10, 0.08)',
                            borderTop: `1px solid ${proj.color}40`,
                            boxShadow: isFolderOpen
                              ? `0 15px 35px ${proj.color}33, 0 0 15px rgba(0,0,0,0.1)`
                              : '0 6px 15px rgba(0,0,0,0.05)',
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
                              background: 'rgba(255,255,255,0.95)', 
                              backdropFilter: 'blur(5px)',
                              opacity: isFolderOpen ? 1 : 0,
                              transform: isFolderOpen ? 'translateY(0)' : 'translateY(12px)',
                            }}
                          >
                            <div>
                              <p className="text-ink font-bold text-xs sm:text-sm leading-tight font-display">{proj.name}</p>
                              <p className="text-ink/50 text-[9px] mt-0.5 font-sans">{proj.type}</p>
                            </div>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand-deep flex items-center gap-1">
                              Explore <ArrowUpRight className="w-3 h-3 text-brand-deep" />
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
                        transform: isFolderOpen
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
                            <stop offset="0%" stopColor="#fedd00" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#d9bd00" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#0d000a" stopOpacity="0.3" />
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
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center glass-icon-3d-light text-brand">
                            <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-brand-deep relative z-10" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            <p className="text-ink font-bold text-sm sm:text-base font-display leading-tight">Open Portfolio</p>
                            <span className="text-ink/45 text-[9px] sm:text-[10px] font-mono tracking-wider">GALAXATECH © 2026</span>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); navigate('/portfolio'); }}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-[1.1] btn-brand text-ink cursor-pointer"
                            style={{ boxShadow: '0 8px 24px rgba(254, 221, 0, 0.3)' }}
                          >
                            <ArrowUpRight className="w-4 h-4 text-ink" />
                          </button>
                        </div>
                      </div>
                    </div>
 
                  </div>
                </div>
                <p className="text-ink/45 text-[11px] font-mono mt-6">Hover or tap to reveal</p>
              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* ── Common Questions ─────────────────────────────────────────────────────── */}
      <section className="py-10 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, var(--brand-paper) 100%)' }}>
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
              <span className="text-[10px] font-mono text-ink/75 tracking-[0.3em] uppercase block mb-3">05 — FAQ</span>
              <h2 className="display-poster text-4xl sm:text-5xl md:text-6xl mb-6">
                <span className="block text-ink">Common</span>
                <span className="pill-word-brand text-ink text-2xl sm:text-3xl md:text-4xl mt-2 inline-block">Questions.</span>
              </h2>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-ink/65 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-ink/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-ink/10 sm:pl-6">
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
                  className="rounded-2xl overflow-hidden card-neu"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: `1px solid ${isActive ? 'var(--brand-yellow-deep)' : 'rgba(13,0,10,0.06)'}`,
                    transition: 'border-color 0.25s',
                  }}
                >
                  <button
                    onClick={() => setActiveFAQ(isActive ? null : i)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
                  >
                    <FaqIcon className="w-4 h-4 flex-shrink-0 transition-transform duration-200" style={{ color: 'var(--brand-ink)', transform: isActive ? 'scale(1.15)' : 'scale(1)' }} />
                    <span className="text-sm font-semibold flex-1 leading-snug" style={{ color: isActive ? 'var(--brand-ink)' : '#334155' }}>{faq.q}</span>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-200" style={{ transform: isActive ? 'rotate(90deg)' : 'none', color: isActive ? 'var(--brand-ink)' : 'rgba(13,0,10,0.35)' }} />
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
                        <p className="text-ink/75 text-sm leading-relaxed px-4 pb-4 pl-11">{faq.a}</p>
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
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--brand-paper) 0%, #ffffff 100%)' }}>
        {/* Single restrained atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand/5 blur-[160px] rounded-full pointer-events-none" />
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
            className="absolute rounded-full border border-ink/[0.06] pointer-events-none"
            style={{ width: s.size, height: s.size, left: s.left, top: s.top, background: 'radial-gradient(circle, rgba(254,221,0,0.04) 0%, transparent 70%)' }}
            animate={{ y: [0, -18, 0], rotate: [0, 180, 360] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        {/* Ghost "JOIN" text decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black select-none pointer-events-none leading-none whitespace-nowrap" style={{ fontSize: 'clamp(80px, 20vw, 180px)', color: 'rgba(13,0,10,0.02)', fontFamily: 'var(--font-condensed)', letterSpacing: '-0.05em' }}>JOIN</div>
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="bg-white rounded-[36px] p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-ink/8 text-center card-neu">
            {/* Inset top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/40 pointer-events-none" />
 
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-deep/20 bg-brand/10">
                <Sparkles className="w-3.5 h-3.5 text-brand-deep" />
                <span className="text-[10px] font-mono tracking-[0.25em] text-ink/80 uppercase font-bold">Builders Community</span>
              </div>
            </div>
 
            <h2 className="display-poster text-ink text-4xl sm:text-5xl md:text-7xl mb-6 leading-none">
              Wanna join the<br />
              <span style={{ WebkitTextStroke: '1.5px var(--brand-ink)', color: 'transparent' }}>Galaxa</span>{' '}
              <span className="pill-word-brand text-ink inline-block">team?</span>
            </h2>
            <p className="text-ink/65 text-sm sm:text-base mb-10 leading-relaxed max-w-md mx-auto">
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
                  width: '280px',
                  height: '52px',
                  background: 'rgba(13,0,10,0.03)',
                  border: '1px solid rgba(13, 0, 10, 0.1)',
                  boxShadow: 'inset 0 2px 6px rgba(13,0,10,0.08), 0 10px 30px rgba(0,0,0,0.02)',
                }}
                onClick={handleToggle}
              >
                {/* Tactile Raised Yellow Knob */}
                <div
                  style={{
                    position: 'absolute',
                    top: '5px',
                    left: '5px',
                    width: '132px',
                    height: '40px',
                    borderRadius: '999px',
                    background: 'var(--brand-yellow)',
                    transform: toggled ? 'translateX(138px)' : 'translateX(0px)',
                    transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 12px rgba(254, 221, 0, 0.45)',
                  }}
                />
                <span className="relative z-10 flex-1 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-300 font-display" style={{ color: toggled ? 'rgba(13,0,10,0.4)' : 'var(--brand-ink)' }}>Not yet</span>
                <span className="relative z-10 flex-1 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-300 font-display" style={{ color: toggled ? 'var(--brand-ink)' : 'rgba(13,0,10,0.4)' }}>Yes, I'm in</span>
              </div>
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
                style={{ background: 'rgba(255, 255, 255, 0.96)', borderRadius: '24px', padding: isMobile ? '20px' : '32px', borderColor: 'rgba(13,0,10,0.08)', boxShadow: '0 20px 80px rgba(13,0,10,0.12), inset 0 1px 0 #fff' }}
              >
                <button
                  onClick={() => setCircleModalOpen(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(13,0,10,0.03)', border: '1px solid rgba(13,0,10,0.08)' }}
                >
                  <X className="w-4 h-4 text-ink/60" />
                </button>
 
                {submitted ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <Sparkles className="w-8 h-8 text-brand-deep" />
                    <p className="text-ink font-bold text-lg font-display">You're in the circle.</p>
                    <p className="text-ink/65 text-sm">We'll reach out with opportunities first.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center mb-5 glass-icon-3d-light text-brand">
                      <Mail className="w-5 h-5 text-brand-deep relative z-10" />
                    </div>
                    <h3 className="text-ink font-bold text-xl mb-1 font-display">
                      Join the <span className="pill-word-brand text-ink inline-block px-1.5 py-0.5 rounded text-sm sm:text-base font-semibold">Galaxa</span> circle
                    </h3>
                    <p className="text-ink/65 text-sm mb-5 leading-relaxed">Get early access, opportunities, and builder-only updates.</p>
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
                        className="w-full px-4 py-3 rounded-xl text-sm text-ink placeholder-ink/40 bg-white border border-ink/10 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-ink font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] btn-brand cursor-pointer"
                        style={{ background: submitting ? 'rgba(254,221,0,0.5)' : '', color: 'var(--brand-ink)', boxShadow: '0 8px 30px rgba(254,221,0,0.3)' }}
                      >
                        {submitting ? 'Sending…' : <>Join the circle <ArrowUpRight className="w-4 h-4 text-ink" /></>}
                      </button>
                      <p className="text-ink/40 text-[11px] text-center flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3 text-ink/40" /> No spam. Unsubscribe anytime.
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

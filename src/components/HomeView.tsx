import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Smartphone,
  TrendingUp,
  Cpu,
  Brush,
  Workflow,
  Globe,
  MessageCircle,
  Sparkles,
  Send,
  Search,
  Code,
  Rocket,
  Package,
  BookOpen,
  Clock,
  MoreHorizontal,
  Users,
  Mail,
  Lock,
} from 'lucide-react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import heroLaptopDashboard from '../assets/images/hero_laptop_dashboard_1780081071809.png';

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

const TYPEWRITER_WORDS = ['Website Presence', 'Social Media Engagement', 'Client conversion'];

const SERVICES = [
  { icon: Laptop,     label: 'Web Development',               desc: 'Fast, secure, and scalable websites built for performance and growth.',          anchor: 'web-development',    color: '#78D5FF', num: '01' },
  { icon: Smartphone, label: 'App Development',               desc: 'High-performance mobile and web apps tailored to user needs and business goals.',                   anchor: 'app-development',    color: '#B58DFF', num: '02' },
  { icon: TrendingUp, label: 'Social Media & Content',        desc: 'Engaging content and social strategies that build brand presence and loyalty.',      anchor: 'social-media',       color: '#7C2AEB', num: '03' },
  { icon: Cpu,        label: 'AI & Automation',               desc: 'Intelligent automation that streamlines workflows and boosts productivity.',    anchor: 'ai-automation',      color: '#5E29E8', num: '04' },
  { icon: Brush,      label: 'Brand Identity & Design',       desc: 'Distinctive visuals and brand experiences that leave a lasting impression.',   anchor: 'brand-identity',     color: '#78D5FF', num: '05' },
  { icon: Workflow,   label: 'Systems Consulting',            desc: 'Strategic guidance and system architectures that drive sustainable growth.',        anchor: 'systems-consulting', color: '#B58DFF', num: '06' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Discover',    desc: 'Understand goals, users, and opportunities.', icon: Search },
  { num: '02', title: 'Strategize',  desc: 'Shape the roadmap, system, and execution plan.', icon: Workflow },
  { num: '03', title: 'Build',       desc: 'Design and develop the core solution.', icon: Code },
  { num: '04', title: 'Deploy',      desc: 'Launch, refine, and optimize for growth.', icon: Rocket },
];

const PROJECTS = [
  {
    num: '02',
    slug: 'sunnah-grandeur',
    name: 'Sunnah Grandeur',
    clientType: 'Islamic Lifestyle E-Commerce',
    country: '🇧🇩',
    services: ['Web Dev', 'App Dev', 'Systems'],
    desc: 'E-commerce web platform + Flutter app with unified Supabase backend and Stripe payments.',
  },
  {
    num: '01',
    slug: 'harmans-trading',
    name: 'Harmans Trading',
    clientType: 'Recruitment Firm',
    country: '🇸🇦',
    services: ['Web Development', 'Brand Identity'],
    desc: 'A multilingual corporate website (EN/BN/AR with RTL) serving international recruitment clients.',
  },
  {
    num: '03',
    slug: 'salfas-bazar',
    name: 'Salfas Bazar',
    clientType: 'Organic Food Business',
    country: '🇧🇩',
    services: ['Brand Identity', 'Web Development'],
    desc: 'Full brand kit and website for an organic food brand highlighting natural quality and trust.',
  },
];

const FAQS = [
  { q: 'What kind of businesses do you work with?', a: 'We work with startups, SMEs, and established businesses across 6 countries, primarily in tech, e-commerce, and service industries.' },
  { q: 'How long does a typical project take?', a: 'Timelines vary by scope. A website takes 2–4 weeks; a full app can take 6–10 weeks. We agree on timelines upfront.' },
  { q: 'How does pricing work?', a: 'Projects are quoted individually based on scope. We provide a detailed proposal before any agreement is signed.' },
  { q: 'What is the Galaxa Builders Program?', a: 'GBP is our execution ecosystem for students. Real projects, real tasks, real output. Not a course — an experience.' },
  { q: 'How do I track my project?', a: 'Every client gets access to a dedicated Client Hub — a private dashboard with live progress, updates, documents, and direct team contact.' },
  { q: 'Can I book a free consultation?', a: "Yes. Book an audit or reach out via WhatsApp. We'll respond within 24 hours." },
];

const COUNTRIES = [
  { flag: '🇺🇸', name: 'United States' },
  { flag: '🇬🇧', name: 'United Kingdom' },
  { flag: '🇵🇰', name: 'Pakistan' },
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇮🇳', name: 'India' },
  { flag: '🇧🇩', name: 'Bangladesh' },
];

const PLACEHOLDER_FEED: FeedItem[] = [
  {
    category: 'TOOLS',
    headline: 'Open-source agent stacks gain traction',
    summary: 'Teams are adopting lightweight agent frameworks to automate workflows across operations and support.',
    time: '2h ago',
  },
  {
    category: 'RESEARCH',
    headline: 'Multimodal models improve workflow accuracy',
    summary: 'New advances in multimodal reasoning boost accuracy in document and visual understanding.',
    time: '5h ago',
  },
  {
    category: 'MARKET',
    headline: 'SMBs accelerate AI adoption in operations',
    summary: 'Rising demand for automation and customer support tools drives strong momentum in SMEs.',
    time: 'Today',
  },
];

const GLASS_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.042)',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
  border: '1px solid rgba(181,141,255,0.20)',
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

  // Hero
  const [wordIndex, setWordIndex] = useState(0);
  const [buildMins, setBuildMins] = useState(42);

  // FAQ
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Daily AI Feed
  const [feedItems, setFeedItems] = useState<FeedItem[]>(PLACEHOLDER_FEED);

  // Carousel
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  // How We Work
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [illuminatedSteps, setIlluminatedSteps] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Portfolio Folder
  const [folderHovered, setFolderHovered] = useState(false);

  // CTA Toggle
  const [toggled, setToggled] = useState(false);
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const currentMins = new Date().getMinutes();
    setBuildMins(currentMins === 0 ? 60 : currentMins);
    const interval = setInterval(() => setBuildMins(prev => prev >= 59 ? 1 : prev + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setWordIndex(prev => (prev + 1) % TYPEWRITER_WORDS.length), 3200);
    return () => clearInterval(timer);
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
        ([entry]) => { if (entry.isIntersecting) setIlluminatedSteps(prev => new Set([...prev, i])); },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      const scrollStart = windowHeight - 150;
      const scrolledAmount = scrollStart - elementTop;
      const totalScrollable = elementHeight + scrollStart - 300;
      
      let progress = scrolledAmount / totalScrollable;
      progress = Math.min(Math.max(progress, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // ── Carousel helpers ───────────────────────────────────────────────────────
  const carouselPrev = () => setActiveIndex(prev => (prev - 1 + SERVICES.length) % SERVICES.length);
  const carouselNext = () => setActiveIndex(prev => (prev + 1) % SERVICES.length);

  const handlePointerDown = (e: React.PointerEvent) => setDragStartX(e.clientX);
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    if (delta < -50) carouselNext();
    else if (delta > 50) carouselPrev();
    setDragStartX(null);
  };

  // ── Newsletter submit ──────────────────────────────────────────────────────
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        name: subName.trim(),
        email: subEmail.trim(),
        joinedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setSubmitting(false);
    }
  };

  // ── Line progress ──────────────────────────────────────────────────────────
  const maxIlluminated = illuminatedSteps.size > 0 ? Math.max(...illuminatedSteps) : -1;
  const lineProgress = maxIlluminated >= 0 ? (maxIlluminated / (PROCESS_STEPS.length - 1)) * 100 : 0;

  return (
    <div className="relative">
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

      {/* ── Hero Section (unchanged) ───────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 select-none overflow-hidden bg-[#05030F]">
          <img
            alt="Hero MacBook Atmosphere"
            className="w-full h-full object-cover opacity-68 contrast-105 scale-100 pointer-events-none"
            style={{
              maskImage: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0) 100%)',
            }}
            src={heroLaptopDashboard}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#05030F] via-[#7C2AEB]/6 to-[#7C2AEB]/6 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#05030F] via-[#05030F]/90 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#7C2AEB]/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#05030F] to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#7C2AEB]/12 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[350px] h-[350px] bg-[#7C2AEB]/10 blur-[90px] rounded-full pointer-events-none" />
        </div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-12">
          <div className="inline-flex items-center gap-2.5 bg-black/50 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-white uppercase">
              AUTONOMOUS OPTIMIZATION • AGENTS ACTIVE • LAST BUILD: {buildMins}M AGO
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Assure your brand's <br className="hidden md:block" />
            <span className="font-serif italic font-bold typewriter-container block min-h-[1.15em] mt-2 pb-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: 35, opacity: 0, filter: 'blur(5px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -35, opacity: 0, filter: 'blur(5px)' }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-gradient"
                >
                  {TYPEWRITER_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            By investing only FIVE minutes, giving us some information about your business.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/audit')}
              className="bg-black/40 backdrop-blur-md border border-white/10 group flex items-center gap-4 text-white hover:text-primary hover:border-primary/50 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-2xl cursor-pointer"
            >
              <span className="w-10 h-10 primary-gradient text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight className="w-5 h-5" />
              </span>
              <span className="text-md font-bold text-white">Book an Audit</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Global Presence ────────────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-wrapper {
          position: relative;
          mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 22s linear infinite;
        }
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes line-draw-h {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @media (max-width: 640px) {
          .card-fan-0 {
            transform: translateX(-50%) translateY(-50%) rotate(-8deg) translate(-55px, -60px) scale(0.72) !important;
          }
          .card-fan-1 {
            transform: translateX(-50%) translateY(-50%) rotate(0deg) translate(0px, -110px) scale(0.72) !important;
          }
          .card-fan-2 {
            transform: translateX(-50%) translateY(-50%) rotate(8deg) translate(55px, -60px) scale(0.72) !important;
          }
          .card-stack-0 {
            transform: translateX(-50%) translateY(-50%) rotate(-3deg) translate(-4px, 4px) scale(0.72) !important;
          }
          .card-stack-1 {
            transform: translateX(-50%) translateY(-50%) rotate(0deg) translate(0px, 0px) scale(0.72) !important;
          }
          .card-stack-2 {
            transform: translateX(-50%) translateY(-50%) rotate(3deg) translate(4px, -3px) scale(0.72) !important;
          }
        }
      `}</style>
      <section className="py-16 md:py-24 px-6 border-y border-white/5 bg-[#05030F] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[10px] font-mono tracking-[0.25em] text-white/30 uppercase mb-8">
            Global Presence
          </p>
          <div className="marquee-wrapper overflow-hidden">
            <div className="marquee-track">
              {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 mx-8 select-none"
                  style={{ minWidth: 'max-content' }}
                >
                  <span className="text-3xl leading-none">{c.flag}</span>
                  <span
                    className="text-white/60 font-semibold text-sm"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    {c.name}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-primary/40 ml-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Daily AI Feed ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825] bg-[radial-gradient(ellipse_at_top,rgba(124,42,235,0.08)_0%,transparent_60%)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono tracking-[0.2em] font-semibold text-emerald-400 uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              Live
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight animate-fade-in" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Daily AI Feed
            </h2>
            <p className="text-white/50 text-base max-w-2xl">
              Signals on tools, trends, research, and market shifts — refreshed daily.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feedItems.map((item, i) => {
              const getCategoryIcon = (cat: string) => {
                const c = cat.toUpperCase();
                if (c.includes('TOOL')) return <Package className="w-3.5 h-3.5" />;
                if (c.includes('RESEARCH')) return <BookOpen className="w-3.5 h-3.5" />;
                if (c.includes('MARKET')) return <TrendingUp className="w-3.5 h-3.5" />;
                return <Sparkles className="w-3.5 h-3.5" />;
              };

              return (
                <div
                  key={i}
                  className="flex flex-col p-6 cursor-default transition-all duration-500 rounded-[20px] border border-violet-500/15 shadow-[0_0_30px_-10px_rgba(124,42,235,0.25)]"
                  style={{
                    background: 'rgba(255,255,255,0.042)',
                    backdropFilter: 'blur(22px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                    border: '1px solid rgba(181,141,255,0.18)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 28px rgba(124,42,235,0.05), 0 20px 60px rgba(0,0,0,0.5)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = 'translateY(-8px)';
                    el.style.borderColor = 'rgba(181,141,255,0.45)';
                    el.style.boxShadow = '0 15px 45px rgba(124,42,235,0.35), inset 0 1px 0 rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = 'translateY(0px)';
                    el.style.borderColor = 'rgba(181,141,255,0.18)';
                    el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 28px rgba(124,42,235,0.05), 0 20px 60px rgba(0,0,0,0.5)';
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-mono tracking-wider font-semibold"
                      style={{
                        color: '#B58DFF',
                        borderColor: 'rgba(181,141,255,0.25)',
                        background: 'rgba(181,141,255,0.08)',
                      }}
                    >
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-white/30" />
                  </div>
                  <h3 className="text-white font-extrabold text-lg mb-3 leading-snug" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    {item.headline}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6">{item.summary}</p>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-primary/50" />
                      <span>Generated by <span className="text-primary/70">Galaxa agents</span></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/25" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-[10px] text-white/60 font-mono tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Curated by <span className="text-white">GalaxaTech</span> intelligence layer
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/25" />
          </div>
        </div>
      </section>

      {/* ── What We Build — Service Carousel ──────────────────────────────── */}
      <section className="py-24 px-6 bg-[#05030F] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/5 text-[10px] font-mono tracking-widest text-primary/70 uppercase mb-4">
              <Sparkles className="w-3 h-3 text-primary" />
              Service Carousel
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              What We Build
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              Interactive digital systems and growth solutions crafted for modern businesses.
            </p>
          </div>

          {/* 3D Carousel */}
          <div
            className="relative select-none my-8"
            style={{ perspective: '1200px', height: '380px' }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => setDragStartX(null)}
          >
            {SERVICES.map((svc, i) => {
              const offset = getCarouselOffset(i, activeIndex, SERVICES.length);
              const absOff = Math.abs(offset);
              const visible = absOff <= 2;
              const x = offset * 240;
              const rotY = offset * -22; // tilt inward
              const z = -absOff * 130;
              const scale = 1 - absOff * 0.12;
              const opacity = visible ? 1 - absOff * 0.35 : 0;
              const isActive = offset === 0;

              return (
                <div
                  key={svc.anchor}
                  onClick={() => { if (!isActive) setActiveIndex(i); else navigate(`/services#${svc.anchor}`); }}
                  className="border border-violet-500/15 shadow-[0_0_30px_-10px_rgba(124,42,235,0.25)]"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: '280px',
                    transform: `translateX(calc(-50% + ${x}px)) translateY(-50%) rotateY(${rotY}deg) translateZ(${z}px) scale(${scale})`,
                    opacity,
                    transition: 'all 0.6s cubic-bezier(.2,.7,.2,1)',
                    pointerEvents: visible ? 'auto' : 'none',
                    cursor: 'pointer',
                    zIndex: 10 - absOff,
                    background: 'rgba(255,255,255,0.042)',
                    backdropFilter: 'blur(22px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                    border: isActive ? '1px solid rgba(181,141,255,0.45)' : '1px solid rgba(181,141,255,0.18)',
                    borderRadius: '20px',
                    boxShadow: isActive 
                      ? '0 0 60px rgba(124,42,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)' 
                      : 'inset 0 1px 0 rgba(255,255,255,0.09), inset 0 0 28px rgba(124,42,235,0.05), 0 20px 60px rgba(0,0,0,0.5)',
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${svc.color}18`, border: `1px solid ${svc.color}30` }}
                    >
                      <svc.icon className="w-6 h-6" style={{ color: svc.color }} />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-primary/70">{svc.num}</span>
                  </div>
                  <h3 className="text-white font-extrabold text-lg mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    {svc.label}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed flex-1">{svc.desc}</p>
                  
                  {isActive ? (
                    <div className="flex items-center gap-2 mt-6 text-xs font-bold transition-all text-[#B58DFF]">
                      <div className="w-6 h-6 rounded-full border border-[#B58DFF]/30 flex items-center justify-center bg-[#B58DFF]/5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                      <span>Explore Service</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center mt-6 text-white/35">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={carouselPrev}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 font-mono text-xs text-white/60 select-none">
              {String(activeIndex + 1).padStart(2, '0')} / 06
            </div>
            <div className="flex gap-2 items-center">
              {SERVICES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: i === activeIndex ? '16px' : '6px',
                    height: '6px',
                    background: i === activeIndex ? '#7C2AEB' : 'rgba(255,255,255,0.2)',
                    boxShadow: i === activeIndex ? '0 0 8px rgba(124,42,235,0.6)' : 'none',
                  }}
                />
              ))}
            </div>
            <button
              onClick={carouselNext}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-white/40 select-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.5 1.5 0 1 1 2.229-1.415V10.8a.6.6 0 0 0 1.2 0V8.683a1.5 1.5 0 1 1 3 0v2.206a.6.6 0 0 0 1.2 0v-1.21a1.5 1.5 0 1 1 3 0V16.2a7.5 7.5 0 0 1-15 0V6.784a1.5 1.5 0 1 1 3 0v4.016a.6.6 0 0 0 1.2 0V4.575Z" />
            </svg>
            <span>Drag or swipe to explore</span>
          </div>
        </div>
      </section>

      {/* ── How We Work ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825] bg-[radial-gradient(ellipse_at_top,rgba(124,42,235,0.08)_0%,transparent_60%)]" ref={sectionRef}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/5 text-[10px] font-mono tracking-widest text-primary/70 uppercase mb-4">
              <Sparkles className="w-3 h-3 text-primary" />
              Process
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              How We Work
            </h2>
            <p className="text-white/50 text-base max-w-xl">
              A clear, collaborative journey from idea to deployed digital systems.
            </p>
          </div>

          <div className="relative flex gap-8 md:gap-16 max-w-3xl mx-auto min-h-[560px]">
            {/* Left Column: Wavy line and node circles */}
            <div 
              className="absolute left-0 w-16 pointer-events-none z-0 flex flex-col justify-between items-center"
              style={{ top: '36px', bottom: '36px' }}
            >
              {/* SVG wavy line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 60 500" preserveAspectRatio="none">
                <path
                  d="M 30 0 C 60 80, 0 160, 30 240 C 60 320, 0 400, 30 480"
                  fill="none"
                  stroke="rgba(181,141,255,0.08)"
                  strokeWidth="3.5"
                />
                <path
                  d="M 30 0 C 60 80, 0 160, 30 240 C 60 320, 0 400, 30 480"
                  fill="none"
                  stroke="url(#process-line-grad)"
                  strokeWidth="3.5"
                  strokeDasharray="1000"
                  strokeDashoffset={1000 - (scrollProgress * 1000)}
                  style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
                />
                <defs>
                  <linearGradient id="process-line-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5E29E8" />
                    <stop offset="50%" stopColor="#7C2AEB" />
                    <stop offset="100%" stopColor="#B58DFF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Node Circles */}
              {PROCESS_STEPS.map((step, i) => {
                const lit = illuminatedSteps.has(i);
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="w-14 h-14 rounded-full flex items-center justify-center relative z-10 transition-all duration-700 bg-[#05030F]"
                    style={{
                      border: `2px solid ${lit ? '#7C2AEB' : 'rgba(124,42,235,0.2)'}`,
                      boxShadow: lit ? '0 0 24px rgba(124,42,235,0.7), inset 0 0 12px rgba(124,42,235,0.3)' : 'none',
                    }}
                  >
                    <StepIcon 
                      className="w-5 h-5 transition-colors duration-500" 
                      style={{ color: lit ? '#B58DFF' : 'rgba(181,141,255,0.3)' }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Right Column: Steps Cards */}
            <div className="flex-1 flex flex-col justify-between gap-12 pl-20 sm:pl-24">
              {PROCESS_STEPS.map((step, i) => {
                const lit = illuminatedSteps.has(i);
                return (
                  <div
                    key={step.num}
                    ref={el => { stepRefs.current[i] = el; }}
                    className="flex items-center justify-between p-6 rounded-[20px] transition-all duration-700 group cursor-default border border-violet-500/15 shadow-[0_0_30px_-10px_rgba(124,42,235,0.25)]"
                    style={{
                      background: lit ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                      backdropFilter: 'blur(22px) saturate(140%)',
                      WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                      border: lit ? '1px solid rgba(181,141,255,0.32)' : '1px solid rgba(181,141,255,0.12)',
                      boxShadow: lit 
                        ? '0 15px 35px rgba(124,42,235,0.15), inset 0 1px 0 rgba(255,255,255,0.1)' 
                        : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono font-bold text-primary/75">{step.num}</span>
                        <h3 className="text-white font-extrabold text-lg" style={{ fontFamily: 'Satoshi, sans-serif', margin: 0 }}>
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed max-w-xl">
                        {step.desc}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-primary/45 transition-all duration-300">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-16 flex items-center justify-center gap-2.5 text-xs text-white/40 font-mono">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>Powered by the <span className="text-white">GalaxaTech</span> intelligence layer</span>
          </div>
        </div>
      </section>

      {/* ── Selected Work — Portfolio Folder ──────────────────────────────── */}
      <section className="py-24 px-6 bg-[#05030F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/5 text-[10px] font-mono tracking-widest text-primary/70 uppercase mb-4">
              <Sparkles className="w-3 h-3 text-primary" />
              Portfolio
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Selected Work
            </h2>
            <p className="text-white/50 text-base max-w-xl">
              A few projects, systems, and brands we've helped shape.
            </p>
          </div>

          {/* Folder + fan */}
          <div className="flex flex-col items-center">
            <div
              className="relative flex flex-col justify-end w-full max-w-[480px] h-[340px] cursor-pointer group"
              onMouseEnter={() => setFolderHovered(true)}
              onMouseLeave={() => setFolderHovered(false)}
              onClick={() => navigate('/portfolio')}
            >
              {/* Cards stack/fan container - aligned absolutely */}
              <div className="absolute inset-0 z-10">
                {PROJECTS.map((proj, i) => {
                  const fanTransforms = [
                    'translateX(-50%) translateY(-50%) rotate(-13deg) translate(-140px, -85px) scale(0.95)',
                    'translateX(-50%) translateY(-50%) rotate(0deg) translate(0px, -135px) scale(0.95)',
                    'translateX(-50%) translateY(-50%) rotate(13deg) translate(140px, -85px) scale(0.95)',
                  ];
                  const stackTransforms = [
                    'translateX(-50%) translateY(-50%) rotate(-3deg) translate(-6px, 12px) scale(0.9)',
                    'translateX(-50%) translateY(-50%) rotate(0deg) translate(0px, 0px) scale(0.9)',
                    'translateX(-50%) translateY(-50%) rotate(3deg) translate(6px, -8px) scale(0.9)',
                  ];

                  const renderMockup = (slug: string) => {
                    if (slug === 'harmans-trading') {
                      return (
                        <div className="w-full h-full relative overflow-hidden bg-black/60 p-2.5 flex flex-col justify-between rounded-t-xl border-b border-white/5">
                          <div className="flex justify-between items-center text-[7px] font-mono text-white/40">
                            <span>DASHBOARD</span>
                            <span className="text-emerald-400">● LIVE</span>
                          </div>
                          <div className="flex-1 flex items-end gap-1.5 py-4 px-1">
                            <div className="bg-primary/20 w-full h-[30%] rounded-sm" />
                            <div className="bg-primary/30 w-full h-[50%] rounded-sm" />
                            <div className="bg-primary/45 w-full h-[40%] rounded-sm" />
                            <div className="bg-primary/60 w-full h-[70%] rounded-sm" />
                            <div className="bg-primary/80 w-full h-[60%] rounded-sm" />
                            <div className="bg-primary w-full h-[90%] rounded-sm shadow-[0_0_8px_rgba(124,42,235,0.6)]" />
                          </div>
                          <div className="text-[8px] font-mono text-white/55">
                            $ 42,918.00 (+14%)
                          </div>
                        </div>
                      );
                    }
                    if (slug === 'sunnah-grandeur') {
                      return (
                        <div className="w-full h-full relative overflow-hidden bg-black/60 p-2.5 flex flex-col justify-between rounded-t-xl border-b border-white/5">
                          <div className="flex justify-between items-center text-[7px] font-mono text-white/40">
                            <span>GRAND STORE</span>
                            <span className="text-primary/70">★ 4.9</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 my-2">
                            <div className="bg-white/5 border border-white/10 rounded p-1 flex flex-col gap-0.5">
                              <div className="w-full h-6 bg-primary/25 rounded-sm" />
                              <div className="h-0.5 bg-white/20 w-3/4 rounded-sm" />
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded p-1 flex flex-col gap-0.5">
                              <div className="w-full h-6 bg-purple-500/25 rounded-sm" />
                              <div className="h-0.5 bg-white/20 w-1/2 rounded-sm" />
                            </div>
                          </div>
                          <div className="text-[8px] font-mono text-[#B58DFF]">
                            Checkout Complete
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="w-full h-full relative overflow-hidden bg-black/60 p-2.5 flex flex-col justify-between rounded-t-xl border-b border-white/5">
                        <div className="flex justify-between items-center text-[7px] font-mono text-white/40">
                          <span>BAZAR HUB</span>
                          <span className="text-emerald-400">100% ORGANIC</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center gap-1">
                          <div className="w-8 h-8 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-[8px] text-white/50">Quality Verified</span>
                        </div>
                        <div className="text-[8px] font-mono text-emerald-400">
                          Active Orders: 124
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div
                      key={proj.slug}
                      className={`absolute left-1/2 top-1/2 w-[220px] h-[260px] flex flex-col rounded-[20px] transition-all duration-600 ${
                        folderHovered ? `card-fan-${i}` : `card-stack-${i}`
                      }`}
                      style={{
                        transform: folderHovered ? fanTransforms[i] : stackTransforms[i],
                        zIndex: folderHovered ? (i === 1 ? 3 : i === 0 ? 2 : 1) : (3 - i),
                        background: 'rgba(255,255,255,0.042)',
                        backdropFilter: 'blur(22px) saturate(140%)',
                        WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                        border: '1px solid rgba(181,141,255,0.18)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 28px rgba(124,42,235,0.05), 0 20px 60px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Card mockup */}
                      <div className="h-32 w-full flex-shrink-0 bg-[#05030F]">
                        {renderMockup(proj.slug)}
                      </div>
                      
                      {/* Card details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-[9px] font-mono font-bold text-primary/75">{proj.num}</span>
                            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">{proj.clientType}</span>
                          </div>
                          <h4 className="text-white font-extrabold text-sm" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                            {proj.name}
                          </h4>
                        </div>
                        
                        <div className="flex items-center justify-between text-[11px] text-white/40">
                          <span>{proj.services[0]}</span>
                          <span>{proj.country}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Glassmorphic Folder Body */}
              <div className="relative w-full h-[160px] flex flex-col justify-end z-20">
                {/* Folder Tab */}
                <div 
                  className="absolute top-[-24px] left-0 h-[25px] w-[140px] rounded-t-[14px] z-20"
                  style={{
                    clipPath: 'polygon(0% 100%, 10% 0%, 90% 0%, 100% 100%)',
                    background: 'rgba(10,8,37,0.85)',
                    backdropFilter: 'blur(20px)',
                    borderLeft: '1px solid rgba(181,141,255,0.18)',
                    borderRight: '1px solid rgba(181,141,255,0.18)',
                    borderTop: '1px solid rgba(181,141,255,0.18)',
                  }}
                />
                {/* Folder Content container */}
                <div 
                  className="w-full h-full rounded-r-[20px] rounded-b-[20px] border border-[#B58DFF]/25 bg-white/[0.02] backdrop-blur-xl px-6 py-5 flex flex-col justify-between relative shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.8)]"
                  style={{
                    background: 'rgba(10,8,37,0.7)',
                    borderTopLeftRadius: '0px',
                  }}
                >
                  <div className="flex items-center gap-4 mt-2 select-none">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h1.52c.314 0 .611-.124.829-.346l1.72-1.72c.218-.22.515-.346.829-.346h7.796c.314 0 .611.124.829.346l1.72 1.72c.218.22.515.346.829.346h1.52a2.25 2.25 0 0 1 2.25 2.25v.75m-18.91 0H21.75a2.25 2.25 0 0 1 2.25 2.25v5.25a2.25 2.25 0 0 1-2.25 2.25H2.25A2.25 2.25 0 0 1 0 18.75V15a2.25 2.25 0 0 1 2.25-2.25Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-extrabold text-sm" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        Open Portfolio
                      </h4>
                      <p className="text-white/40 text-xs mt-0.5">
                        Hover to reveal selected projects
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-2 select-none">
                      <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                      <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">GalaxaTech</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-primary/45 group-hover:bg-primary/10 transition-all duration-300">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center select-none">
              <p className="text-white/30 text-xs font-mono mb-5">Hover to reveal · Click to view all</p>
              <button
                onClick={() => navigate('/portfolio')}
                className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full border border-primary/30 text-white/70 hover:text-white hover:border-primary text-sm font-semibold transition-all duration-300 cursor-pointer"
              >
                View All Work <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ (unchanged) ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825] bg-[radial-gradient(ellipse_at_top,rgba(124,42,235,0.08)_0%,transparent_60%)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>Common Questions</h2>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden border border-violet-500/15 shadow-[0_0_30px_-10px_rgba(124,42,235,0.25)]">
                <button
                  onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/50 flex-shrink-0 transition-transform duration-300 ${activeFAQ === i ? 'rotate-180' : ''}`} />
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
                      <p className="px-5 pb-5 text-white/60 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA — Toggle ───────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden bg-[#05030F]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-[10px] font-mono tracking-widest text-primary/70 uppercase mb-5 select-none">
            <Users className="w-3.5 h-3.5 text-primary" />
            Builders Community
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Wanna join the<br />Galaxa team?
          </h2>
          <p className="text-white/50 text-base mb-12 max-w-md mx-auto leading-relaxed">
            Slide to join our builders/newsletter community and hear about opportunities first.
          </p>

          <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 max-w-4xl mx-auto min-h-[360px]">
            {/* Left side: Toggle */}
            <div className="flex flex-col items-center gap-4 z-10">
              <div
                className="relative flex items-center rounded-full p-1 cursor-pointer select-none bg-white/[0.04] border border-white/10 shadow-lg"
                style={{
                  width: '280px',
                  height: '52px',
                }}
                onClick={() => setToggled(t => !t)}
              >
                {/* Background Labels */}
                <span className="absolute left-10 text-xs font-bold text-white/35">Not yet</span>
                <span className="absolute right-8 text-xs font-bold text-white/35">Yes, I'm in</span>

                {/* Sliding Knob */}
                <div
                  className="relative flex items-center justify-center gap-2"
                  style={{
                    width: '136px',
                    height: '42px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #5E29E8, #7C2AEB)',
                    boxShadow: '0 4px 20px rgba(124,42,235,0.5)',
                    transform: toggled ? 'translateX(132px)' : 'translateX(0px)',
                    transition: '0.35s cubic-bezier(.2,.7,.2,1)',
                  }}
                >
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-xs font-extrabold text-white font-mono uppercase tracking-wider">
                    {toggled ? "Yes, I'm in" : "Not yet"}
                  </span>
                </div>
              </div>

              <span className="text-white/30 text-xs font-mono select-none animate-pulse">
                « Slide right to join
              </span>
            </div>

            {/* Dotted Line Connection (Desktop only) */}
            {toggled && (
              <div className="hidden md:block absolute left-[calc(50%-130px)] top-[28%] w-[180px] h-[100px] pointer-events-none z-0">
                <svg className="w-full h-full" viewBox="0 0 100 50">
                  <path
                    d="M 10 40 Q 50 10, 85 20"
                    fill="none"
                    stroke="#7C2AEB"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                    className="animate-pulse"
                  />
                  <path
                    d="M 85 20 L 78 16 M 85 20 L 80 26"
                    fill="none"
                    stroke="#7C2AEB"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            )}

            {/* Right side: Revealed Form */}
            <div className="w-full max-w-[340px] z-10 min-h-[300px] flex items-center justify-center">
              <AnimatePresence>
                {toggled && (
                  <motion.div
                    initial={{ opacity: 0, x: 50, rotate: 4 }}
                    animate={{ opacity: 1, x: 0, rotate: 2 }}
                    exit={{ opacity: 0, x: 50, rotate: 4 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    {submitted ? (
                      <div
                        className="flex flex-col items-center gap-3 py-10 px-8 text-center"
                        style={{
                          ...GLASS_STYLE,
                          borderRadius: '20px',
                          background: 'rgba(255,255,255,0.03)',
                          borderColor: 'rgba(181,141,255,0.25)',
                        }}
                      >
                        <Sparkles className="w-8 h-8 text-primary" />
                        <p className="text-white font-extrabold text-lg" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                          You're in the circle. ✦
                        </p>
                        <p className="text-white/40 text-sm">We'll reach out with opportunities first.</p>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleNewsletterSubmit}
                        className="flex flex-col p-6 gap-4 text-left"
                        style={{
                          ...GLASS_STYLE,
                          borderRadius: '20px',
                          background: 'rgba(255,255,255,0.03)',
                          borderColor: 'rgba(181,141,255,0.25)',
                          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(124,42,235,0.15)',
                        }}
                      >
                        <div className="flex items-center gap-3 mb-1 select-none">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-white font-extrabold text-sm" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                              Join the Galaxa circle
                            </h4>
                            <p className="text-white/40 text-[11px]">
                              Get early access, opportunities, and builder-only updates.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2.5">
                          <input
                            type="text"
                            placeholder="Your name"
                            value={subName}
                            onChange={e => setSubName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/[0.03] border border-white/10 placeholder-white/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                          />
                          <input
                            type="email"
                            placeholder="you@galaxa.tech"
                            value={subEmail}
                            onChange={e => setSubEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/[0.03] border border-white/10 placeholder-white/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                          />
                        </div>
                        
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full flex items-center justify-between px-5 py-3 rounded-xl text-white font-bold text-sm transition-all duration-300 bg-gradient-to-r from-[#5E29E8] to-[#7C2AEB] shadow-[0_8px_30px_rgba(124,42,235,0.35)] cursor-pointer hover:shadow-[0_8px_40px_rgba(124,42,235,0.5)] active:scale-[0.98] disabled:opacity-50"
                        >
                          <span>{submitting ? 'Sending…' : 'Join the circle'}</span>
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <ChevronRight className="w-3.5 h-3.5 text-white" />
                          </div>
                        </button>
                        
                        <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/35 font-mono select-none">
                          <Lock className="w-3 h-3" />
                          <span>No spam. Unsubscribe anytime.</span>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

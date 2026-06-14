import { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Send,
  Search,
  Layers,
  Code2,
  Rocket,
  Wrench,
  BookOpen,
  BarChart2,
  MoreHorizontal,
  Clock,
} from 'lucide-react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import heroLaptopDashboard from '../assets/images/hero_laptop_dashboard_1780081071809.png';
import brandLogo from '../assets/images/gt-logo-new.svg';

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
  { icon: Laptop,     label: 'Web Development',        desc: 'Fast, secure, and scalable websites built for performance and growth.',                anchor: 'web-development',    color: '#78D5FF' },
  { icon: Smartphone, label: 'App Development',         desc: 'Cross-platform mobile applications crafted for both iOS and Android.',                 anchor: 'app-development',    color: '#B58DFF' },
  { icon: TrendingUp, label: 'Social Media & Content',  desc: 'Engaging content and social strategies that build brand presence and loyalty.',        anchor: 'social-media',       color: '#7C2AEB' },
  { icon: Cpu,        label: 'AI & Automation',         desc: 'Eliminate manual work with intelligent, context-aware automations.',                   anchor: 'ai-automation',      color: '#5E29E8' },
  { icon: Brush,      label: 'Brand Identity & Design', desc: 'Visual systems and design language that sets your brand apart.',                       anchor: 'brand-identity',     color: '#78D5FF' },
  { icon: Workflow,   label: 'Systems Consulting',      desc: 'Notion, process, and operations architecture for modern teams.',                       anchor: 'systems-consulting', color: '#B58DFF' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Discover',   desc: 'Understand goals, users, and opportunities.',     icon: Search },
  { num: '02', title: 'Strategize', desc: 'Shape the roadmap, systems, and execution plan.', icon: Layers },
  { num: '03', title: 'Build',      desc: 'Design and develop the core solution.',            icon: Code2  },
  { num: '04', title: 'Deploy',     desc: 'Launch, refine, and optimize for growth.',         icon: Rocket },
];

const PROJECTS = [
  {
    slug: 'harmans-trading',
    name: 'Harmans Trading',
    clientType: 'Trading Platform',
    country: '🇸🇦',
    services: ['Web Development', 'Brand Identity'],
    accentColor: '#7C2AEB',
  },
  {
    slug: 'sunnah-grandeur',
    name: 'Sunnah Grandeur',
    clientType: 'E-Commerce Platform',
    country: '🇧🇩',
    services: ['Web Dev', 'App Dev', 'Systems'],
    accentColor: '#5E29E8',
  },
  {
    slug: 'salfas-bazar',
    name: 'Salfas Bazar',
    clientType: 'E-Commerce Platform',
    country: '🇧🇩',
    services: ['Brand Identity', 'Web Development'],
    accentColor: '#78D5FF',
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
  { flag: '🇺🇸', name: 'USA'          },
  { flag: '🇬🇧', name: 'UK'           },
  { flag: '🇵🇰', name: 'Pakistan'     },
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇮🇳', name: 'India'        },
  { flag: '🇧🇩', name: 'Bangladesh'   },
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
    summary: 'New advances in multimodal processing boost accuracy in document and visual understanding tasks.',
    time: '5h ago',
  },
  {
    category: 'MARKET',
    headline: 'SMBs accelerate AI adoption in operations',
    summary: 'Rising demand for low-code AI solutions among small and mid-sized businesses is driving strong momentum.',
    time: 'Today',
  },
];

const FEED_ICONS: Record<string, React.ElementType> = {
  TOOLS:       Wrench,
  RESEARCH:    BookOpen,
  MARKET:      BarChart2,
  'AI News':   Cpu,
  'Tech Insight': BookOpen,
  GalaxaTech:  Sparkles,
};

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

  const [wordIndex, setWordIndex]   = useState(0);
  const [buildMins, setBuildMins]   = useState(42);
  const [activeFAQ, setActiveFAQ]   = useState<number | null>(null);
  const [feedItems, setFeedItems]   = useState<FeedItem[]>(PLACEHOLDER_FEED);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [folderHovered, setFolderHovered] = useState(false);

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [illuminatedSteps, setIlluminatedSteps] = useState<Set<number>>(new Set());

  const [toggled, setToggled]     = useState(false);
  const [subEmail, setSubEmail]   = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const m = new Date().getMinutes();
    setBuildMins(m === 0 ? 60 : m);
    const id = setInterval(() => setBuildMins(p => p >= 59 ? 1 : p + 1), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setWordIndex(p => (p + 1) % TYPEWRITER_WORDS.length), 3200);
    return () => clearInterval(id);
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

  const carouselPrev = () => setActiveIndex(p => (p - 1 + SERVICES.length) % SERVICES.length);
  const carouselNext = () => setActiveIndex(p => (p + 1) % SERVICES.length);
  const handlePointerDown = (e: React.PointerEvent) => setDragStartX(e.clientX);
  const handlePointerUp   = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    if (delta < -50) carouselNext();
    else if (delta > 50) carouselPrev();
    setDragStartX(null);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toggled || !subEmail.trim()) return;
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

  return (
    <div className="relative">
      <Helmet>
        <title>GalaxaTech — Ecosystems, Optimized</title>
        <meta name="description" content="GalaxaTech is a systems-driven creative tech agency from Dhaka, building digital ecosystems for brands across 6 countries." />
        <meta property="og:title" content="GalaxaTech — Ecosystems, Optimized" />
        <meta property="og:description" content="Systems-driven creative tech agency. Web, App, Social, AI, Brand, and Consulting." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'GalaxaTech',
          url: 'https://gt-web-iota.vercel.app',
          description: 'Systems-driven creative tech agency',
          address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
        })}</script>
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
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

      {/* ── Shared marquee styles ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
        }
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── Global Presence ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#05030F] overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-mono text-primary/70 tracking-widest uppercase">Global Presence</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 leading-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Serving clients across{' '}
            <span className="text-gradient">6 countries</span>
          </h2>
          <p className="text-center text-white/40 text-base mb-10">
            Delivering digital solutions across markets.
          </p>

          {/* Marquee */}
          <div className="marquee-wrapper overflow-hidden">
            <div className="marquee-track">
              {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
                <div key={i} className="flex items-center gap-2 mx-3 select-none">
                  <div
                    className="flex items-center gap-2.5 px-4 py-2 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.045)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <span className="text-xl leading-none">{c.flag}</span>
                    <span className="text-white/70 font-medium text-sm">{c.name}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-primary/30 mx-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Trust badge */}
          <div className="flex justify-center mt-9">
            <div className="flex items-center gap-2">
              <span className="text-primary/40 text-sm">⊙</span>
              <span className="text-xs text-white/30 font-mono">
                Trusted by businesses worldwide to drive growth and innovation.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Daily AI Feed ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825]">
        <div className="max-w-7xl mx-auto">
          {/* Live badge */}
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-primary/80 tracking-widest uppercase">Live</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Daily AI Feed
          </h2>
          <p className="text-center text-white/40 text-base mb-14 max-w-lg mx-auto">
            Signals on tools, trends, research, and market shifts — refreshed daily.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {feedItems.map((item, i) => {
              const CategoryIcon = FEED_ICONS[item.category] ?? Sparkles;
              return (
                <div
                  key={i}
                  className="flex flex-col p-6 rounded-[20px] group cursor-default"
                  style={{
                    ...GLASS_STYLE,
                    transition: '0.35s cubic-bezier(.2,.7,.2,1)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = 'translateY(-6px)';
                    el.style.borderColor = 'rgba(181,141,255,0.40)';
                    el.style.boxShadow = '0 0 50px rgba(124,42,235,0.45), inset 0 1px 0 rgba(255,255,255,0.12)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = '';
                    el.style.borderColor = '';
                    el.style.boxShadow = '';
                  }}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(181,141,255,0.08)',
                        border: '1px solid rgba(181,141,255,0.22)',
                      }}
                    >
                      <CategoryIcon className="w-3 h-3" style={{ color: '#B58DFF' }} />
                      <span
                        className="text-[9px] tracking-[0.18em] uppercase font-semibold"
                        style={{ fontFamily: 'JetBrains Mono, monospace', color: '#B58DFF' }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <button className="w-6 h-6 flex items-center justify-center rounded-full text-white/20 hover:text-white/50 transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Headline */}
                  <h3
                    className="text-white font-bold text-lg mb-3 leading-snug flex-1"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    {item.headline}
                  </h3>

                  {/* Summary */}
                  <p className="text-white/45 text-sm leading-relaxed mb-5">{item.summary}</p>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center gap-1.5 text-white/30">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-mono">{item.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/25">
                      <Sparkles className="w-3 h-3" style={{ color: 'rgba(124,42,235,0.6)' }} />
                      <span className="text-[10px] font-mono">Generated by Galaxa agents</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section footer */}
          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-2">
              <span className="text-primary/40 text-sm">⊙</span>
              <span className="text-xs text-white/30 font-mono">
                Curated by GalaxaTech intelligence layer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Build — Service Carousel ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#05030F] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-mono text-primary/70 tracking-widest uppercase">Service Carousel</span>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              What We Build
            </h2>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Interactive digital systems and growth solutions crafted for modern businesses.
            </p>
          </div>

          {/* 3D Carousel */}
          <div
            className="relative select-none"
            style={{ perspective: '1200px', height: '320px' }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => setDragStartX(null)}
          >
            {SERVICES.map((svc, i) => {
              const offset  = getCarouselOffset(i, activeIndex, SERVICES.length);
              const absOff  = Math.abs(offset);
              const visible = absOff <= 2;
              const x       = offset * 220;
              const rotY    = offset * 30;
              const z       = -absOff * 140;
              const scale   = 1 - absOff * 0.14;
              const opacity = visible ? 1 - absOff * 0.28 : 0;
              const isActive = offset === 0;

              return (
                <div
                  key={svc.anchor}
                  onClick={() => { if (!isActive) setActiveIndex(i); else navigate(`/services#${svc.anchor}`); }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: '270px',
                    transform: `translateX(calc(-50% + ${x}px)) translateY(-50%) rotateY(${rotY}deg) translateZ(${z}px) scale(${scale})`,
                    opacity,
                    transition: 'all 0.55s cubic-bezier(.2,.7,.2,1)',
                    pointerEvents: visible ? 'auto' : 'none',
                    cursor: 'pointer',
                    zIndex: 10 - absOff,
                    ...GLASS_STYLE,
                    borderRadius: '20px',
                    padding: '28px 24px',
                    ...(isActive ? {
                      borderColor: 'rgba(181,141,255,0.50)',
                      boxShadow: '0 0 70px rgba(124,42,235,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
                    } : {}),
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${svc.color}18`, border: `1px solid ${svc.color}30` }}
                  >
                    <svc.icon className="w-6 h-6" style={{ color: svc.color }} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    {svc.label}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{svc.desc}</p>
                  {isActive && (
                    <div
                      className="flex items-center gap-1.5 mt-6 pt-4 text-xs font-semibold"
                      style={{ color: '#B58DFF', borderTop: '1px solid rgba(181,141,255,0.15)' }}
                    >
                      <span className="text-primary/50 text-sm">⊙</span>
                      Explore Service <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-6">
              <button
                onClick={carouselPrev}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-primary/40 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-mono text-white/40 min-w-[60px] text-center">
                {String(activeIndex + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
              </span>
              <button
                onClick={carouselNext}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-primary/40 transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] font-mono text-white/25 tracking-widest">
              Drag or swipe to explore
            </p>
          </div>
        </div>
      </section>

      {/* ── How We Work — Vertical Steps ──────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825]">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-mono text-primary/70 tracking-widest uppercase">Process</span>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              How <em>We Work</em>
            </h2>
            <p className="text-white/40 text-base max-w-md mx-auto">
              A clear, collaborative journey from idea to deployed digital systems.
            </p>
          </div>

          {/* Vertical step list */}
          <div className="max-w-2xl mx-auto relative">
            {/* Connecting line */}
            <div
              className="absolute left-6 top-6 bottom-6 w-px"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,42,235,0.35) 20%, rgba(124,42,235,0.35) 80%, transparent)' }}
            />

            {PROCESS_STEPS.map((step, i) => {
              const lit = illuminatedSteps.has(i);
              return (
                <div
                  key={step.num}
                  ref={el => { stepRefs.current[i] = el; }}
                  className="flex items-center gap-5 mb-4 relative"
                >
                  {/* Icon circle */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0"
                    style={{
                      background: lit ? 'rgba(124,42,235,0.25)' : 'rgba(124,42,235,0.07)',
                      border: `1.5px solid ${lit ? '#7C2AEB' : 'rgba(124,42,235,0.22)'}`,
                      boxShadow: lit ? '0 0 24px rgba(124,42,235,0.55)' : 'none',
                      transition: '0.6s cubic-bezier(.2,.7,.2,1)',
                    }}
                  >
                    <step.icon
                      className="w-5 h-5"
                      style={{
                        color: lit ? '#B58DFF' : 'rgba(181,141,255,0.30)',
                        transition: '0.6s cubic-bezier(.2,.7,.2,1)',
                      }}
                    />
                  </div>

                  {/* Step card */}
                  <div
                    className="flex-1 flex items-center justify-between p-5 rounded-2xl"
                    style={{
                      ...GLASS_STYLE,
                      borderColor: lit ? 'rgba(181,141,255,0.32)' : 'rgba(181,141,255,0.14)',
                      transition: '0.6s cubic-bezier(.2,.7,.2,1)',
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <span
                          className="text-[10px] font-mono"
                          style={{ color: lit ? 'rgba(181,141,255,0.7)' : 'rgba(181,141,255,0.25)', transition: '0.6s' }}
                        >
                          {step.num}
                        </span>
                        <h3
                          className="font-bold text-base"
                          style={{
                            fontFamily: 'Satoshi, sans-serif',
                            color: lit ? '#fff' : 'rgba(255,255,255,0.38)',
                            transition: '0.6s cubic-bezier(.2,.7,.2,1)',
                          }}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: lit ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.20)', transition: '0.6s' }}
                      >
                        {step.desc}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="w-4 h-4 flex-shrink-0 ml-4"
                      style={{ color: lit ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.08)', transition: '0.6s' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section footer */}
          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-2">
              <span className="text-primary/40 text-sm">⊙</span>
              <span className="text-xs text-white/30 font-mono">
                Powered by the GalaxaTech intelligence layer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Selected Work ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#05030F]">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-mono text-primary/70 tracking-widest uppercase">Portfolio</span>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Selected Work
            </h2>
            <p className="text-white/40 text-base">
              A few projects, systems, and brands we've helped shape.
            </p>
          </div>

          {/* Fan cards */}
          <div className="flex flex-col items-center">
            <div
              className="relative cursor-pointer"
              style={{ width: '340px', height: '280px' }}
              onMouseEnter={() => setFolderHovered(true)}
              onMouseLeave={() => setFolderHovered(false)}
              onClick={() => navigate('/portfolio')}
            >
              {PROJECTS.map((proj, i) => {
                const fanTransforms = [
                  'rotate(-16deg) translateX(-130px) translateY(18px)',
                  'rotate(0deg)   translateY(-18px)',
                  'rotate(16deg)  translateX(130px)  translateY(18px)',
                ];
                const stackTransforms = [
                  'rotate(-3deg) translateX(-6px) translateY(6px)',
                  'rotate(0deg)  translateY(0px)',
                  'rotate(3deg)  translateX(6px)  translateY(-4px)',
                ];

                return (
                  <div
                    key={proj.slug}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '220px',
                      transform: `translateX(-50%) translateY(-50%) ${folderHovered ? fanTransforms[i] : stackTransforms[i]}`,
                      transition: `0.45s cubic-bezier(.2,.7,.2,1) ${i * 0.05}s`,
                      zIndex: folderHovered ? (i === 1 ? 3 : i === 0 ? 2 : 1) : (2 - i),
                      ...GLASS_STYLE,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      padding: 0,
                      ...(folderHovered ? { borderColor: `${proj.accentColor}40`, boxShadow: `0 0 30px ${proj.accentColor}25, inset 0 1px 0 rgba(255,255,255,0.1)` } : {}),
                    }}
                  >
                    {/* Mockup area */}
                    <div
                      className="h-32 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${proj.accentColor}18 0%, #05030F 60%, rgba(120,213,255,0.06) 100%)` }}
                    >
                      {/* Stylised UI mockup shapes */}
                      <div className="absolute inset-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="absolute top-2 left-2 right-2 h-1.5 rounded-full" style={{ background: `${proj.accentColor}30` }} />
                        <div className="absolute top-5 left-2 w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
                        <div className="absolute top-5 left-14 w-6 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                        <div className="absolute top-8 left-2 right-2 h-10 rounded" style={{ background: `${proj.accentColor}12` }} />
                        <div className="absolute bottom-2 left-2 w-12 h-2 rounded-full" style={{ background: `${proj.accentColor}40` }} />
                      </div>
                      <div className="absolute top-2 right-3 text-base">{proj.country}</div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-wider mb-1">{proj.clientType}</p>
                      <h4 className="text-white font-bold text-sm" style={{ fontFamily: 'Satoshi, sans-serif' }}>{proj.name}</h4>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Open Portfolio CTA bar */}
            <div className="w-full max-w-lg mt-6">
              <div
                className="flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer group"
                style={{
                  ...GLASS_STYLE,
                  transition: '0.3s ease',
                }}
                onClick={() => navigate('/portfolio')}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = 'rgba(181,141,255,0.35)';
                  el.style.boxShadow = '0 0 40px rgba(124,42,235,0.3)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '';
                  el.style.boxShadow = '';
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ background: 'rgba(124,42,235,0.20)', border: '1px solid rgba(124,42,235,0.3)' }}
                  >
                    <img src={brandLogo} alt="GalaxaTech" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                      Open Portfolio
                    </p>
                    <p className="text-white/35 text-xs">Hover to reveal selected projects</p>
                  </div>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
                >
                  <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                </div>
              </div>
              <p className="text-center text-[10px] font-mono text-white/20 tracking-widest mt-4">
                Hover to reveal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Common Questions
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
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

      {/* ── Join CTA — Two Column ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden bg-[#05030F]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-mono text-primary/70 tracking-widest uppercase">Builders Community</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Heading + Toggle */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Wanna join the<br />
                <span className="text-gradient">Galaxa</span> team?
              </h2>
              <p className="text-white/45 text-base mb-10 leading-relaxed max-w-sm">
                Slide to join our builders/newsletter community and hear about opportunities first.
              </p>

              {/* Toggle */}
              <div
                className="relative flex items-center rounded-full p-1 cursor-pointer select-none"
                style={{
                  width: '248px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
                onClick={() => setToggled(t => !t)}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    width: '114px',
                    height: '40px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #5E29E8, #7C2AEB)',
                    boxShadow: '0 4px 20px rgba(124,42,235,0.5)',
                    transform: toggled ? 'translateX(120px)' : 'translateX(0px)',
                    transition: '0.35s cubic-bezier(.2,.7,.2,1)',
                  }}
                />
                <span
                  className="relative z-10 flex-1 text-center text-xs font-bold transition-colors duration-300"
                  style={{ color: toggled ? 'rgba(255,255,255,0.30)' : 'white' }}
                >
                  Not yet
                </span>
                <span
                  className="relative z-10 flex-1 text-center text-xs font-bold transition-colors duration-300"
                  style={{ color: toggled ? 'white' : 'rgba(255,255,255,0.30)' }}
                >
                  Yes, I'm in
                </span>
              </div>

              <p className="text-[10px] font-mono text-white/20 tracking-widest mt-4">
                ↓ Slide right to join
              </p>
            </div>

            {/* Right: Form card */}
            <div className="glass-card p-7 rounded-2xl">
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Sparkles className="w-8 h-8" style={{ color: '#B58DFF' }} />
                  <p className="text-white font-bold text-lg text-center" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    You're in the circle. ✦
                  </p>
                  <p className="text-white/40 text-sm text-center">We'll reach out with opportunities first.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-white font-bold text-base mb-1.5" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    Join the Galaxa circle
                  </h3>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">
                    Get early access, opportunities, and builder-only updates.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={subEmail}
                      onChange={e => setSubEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(181,141,255,0.18)',
                      }}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(124,42,235,0.5)'; }}
                      onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(181,141,255,0.18)'; }}
                    />
                    <button
                      type="submit"
                      disabled={!toggled || submitting}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                      style={{
                        background: toggled
                          ? (submitting ? 'rgba(94,41,232,0.5)' : 'linear-gradient(135deg, #5E29E8, #7C2AEB)')
                          : 'rgba(255,255,255,0.04)',
                        color: toggled ? 'white' : 'rgba(255,255,255,0.25)',
                        cursor: toggled ? 'pointer' : 'not-allowed',
                        boxShadow: toggled ? '0 8px 30px rgba(124,42,235,0.30)' : 'none',
                        border: toggled ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {submitting ? 'Joining…' : (
                        <>Join the circle <ArrowUpRight className="w-4 h-4" /></>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-white/20 font-mono mt-1">
                      {toggled ? 'No spam, unsubscribe at any time' : 'Toggle "Yes, I\'m in" to enable'}
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

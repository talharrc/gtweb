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
  Globe,
  MessageCircle,
  Sparkles,
  Send,
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
  { icon: Laptop,     label: 'Web Development',               desc: 'Performant, scalable websites and web apps.',          anchor: 'web-development',    color: '#78D5FF' },
  { icon: Smartphone, label: 'App Development',               desc: 'Cross-platform mobile applications.',                   anchor: 'app-development',    color: '#B58DFF' },
  { icon: TrendingUp, label: 'Social Media & Content',        desc: 'Strategy, content creation, and growth systems.',      anchor: 'social-media',       color: '#7C2AEB' },
  { icon: Cpu,        label: 'AI & Automation',               desc: 'Intelligent workflows that eliminate manual work.',    anchor: 'ai-automation',      color: '#5E29E8' },
  { icon: Brush,      label: 'Brand Identity & Design',       desc: 'Visual systems that make your brand unforgettable.',   anchor: 'brand-identity',     color: '#78D5FF' },
  { icon: Workflow,   label: 'Systems Consulting',            desc: 'Notion, process, and operations architecture.',        anchor: 'systems-consulting', color: '#B58DFF' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Discover',    desc: 'We understand your goals, audience, and gaps.' },
  { num: '02', title: 'Strategize',  desc: 'We architect the solution before touching code.' },
  { num: '03', title: 'Build',       desc: 'Our team executes with speed and precision.' },
  { num: '04', title: 'Deploy',      desc: 'Launch, monitor, and continuously improve.' },
];

const PROJECTS = [
  {
    slug: 'harmans-trading',
    name: 'Harmans Trading',
    clientType: 'Recruitment Firm',
    country: '🇸🇦',
    services: ['Web Development', 'Brand Identity'],
    desc: 'A multilingual corporate website (EN/BN/AR with RTL) serving international recruitment clients.',
  },
  {
    slug: 'sunnah-grandeur',
    name: 'Sunnah Grandeur',
    clientType: 'Islamic Lifestyle E-Commerce',
    country: '🇧🇩',
    services: ['Web Dev', 'App Dev', 'Systems'],
    desc: 'E-commerce web platform + Flutter app with unified Supabase backend and Stripe payments.',
  },
  {
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
    category: 'AI News',
    headline: 'Agents reshape enterprise workflows',
    summary: 'Leading firms are deploying autonomous agents to handle repetitive ops tasks — cutting cycle times by up to 60%.',
    time: '8 min ago',
  },
  {
    category: 'Tech Insight',
    headline: 'Edge computing meets AI inference',
    summary: 'On-device AI models are shrinking. What used to need a data center now runs on a $30 chip at the edge.',
    time: '22 min ago',
  },
  {
    category: 'GalaxaTech',
    headline: 'New automation deployed for client ops',
    summary: 'Our latest workflow agent went live this morning, processing 400+ daily records for a Saudi recruitment firm.',
    time: '1h ago',
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
  const [hoveredCarouselIndex, setHoveredCarouselIndex] = useState<number | null>(null);

  // How We Work
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [illuminatedSteps, setIlluminatedSteps] = useState<Set<number>>(new Set());

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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>
            <div className="inline-flex items-center gap-2.5 bg-black/50 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <span className="w-2 h-2 rounded-full bg-red-500 dot-pulse-glow" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-white uppercase">
                AUTONOMOUS OPTIMIZATION • AGENTS ACTIVE • LAST BUILD: {buildMins}M AGO
              </span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16,1,0.3,1] }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
          >
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
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16,1,0.3,1] }}
            className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            By investing only FIVE minutes, giving us some information about your business.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16,1,0.3,1] }}
            className="flex justify-center"
          >
            <button
              onClick={() => navigate('/audit')}
              className="bg-black/40 backdrop-blur-md border border-white/10 group flex items-center gap-4 text-white hover:text-primary hover:border-primary/50 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-2xl cursor-pointer hover:scale-[1.05] active:scale-[0.98]"
            >
              <span className="w-10 h-10 primary-gradient text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight className="w-5 h-5" />
              </span>
              <span className="text-md font-bold text-white">Book an Audit</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Global Presence ────────────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
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
        @keyframes dot-pulse-glow {
          0%, 100% { box-shadow: 0 0 6px #ef4444, 0 0 14px rgba(239,68,68,0.4); opacity: 1; }
          50%       { box-shadow: 0 0 14px #ef4444, 0 0 28px rgba(239,68,68,0.65); opacity: 0.6; }
        }
        .dot-pulse-glow { animation: dot-pulse-glow 2s ease-in-out infinite; }
      `}</style>
      <section className="py-16 px-6 border-y border-white/5 bg-[#05030F] overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
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
        </motion.div>
      </section>

      {/* ── Daily AI Feed ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <p className="text-[10px] font-mono tracking-[0.25em] text-primary/60 uppercase mb-2">Live Intelligence</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Daily AI Feed
              </h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20" style={{ background: 'rgba(94,41,232,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-primary/70 tracking-widest uppercase">Agents Active</span>
            </div>
          </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {feedItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
                className="flex flex-col p-6 cursor-default"
                style={{
                  ...GLASS_STYLE,
                  transition: '0.2s cubic-bezier(.2,.7,.2,1)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(181,141,255,0.35)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 40px rgba(124,42,235,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      color: '#B58DFF',
                      borderColor: 'rgba(181,141,255,0.25)',
                      background: 'rgba(181,141,255,0.08)',
                    }}
                  >
                    {item.category}
                  </span>
                  <span className="text-[10px] text-white/30 font-mono">{item.time}</span>
                </div>
                <h3 className="text-white font-bold text-base mb-3 leading-snug" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  {item.headline}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed flex-1">{item.summary}</p>
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary/50" />
                  <span className="text-[10px] font-mono text-white/25 tracking-wide">Generated by Galaxa agents</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Build — Service Carousel ──────────────────────────────── */}
      <section className="py-24 px-6 bg-[#05030F] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-[10px] font-mono tracking-[0.25em] text-primary/60 uppercase mb-3">Our Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              What We Build
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">End-to-end digital systems — from strategy to deployment.</p>
          </motion.div>

          {/* 3D Carousel */}
          <div
            className="relative select-none"
            style={{ perspective: '1200px', height: '320px' }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => setDragStartX(null)}
          >
            {SERVICES.map((svc, i) => {
              const offset = getCarouselOffset(i, activeIndex, SERVICES.length);
              const absOff = Math.abs(offset);
              const visible = absOff <= 2;
              const x = offset * 220;
              const rotY = offset * 30;
              const z = -absOff * 140;
              const scale = 1 - absOff * 0.14;
              const opacity = visible ? 1 - absOff * 0.28 : 0;
              const isActive = offset === 0;

              return (
                <div
                  key={svc.anchor}
                  onClick={() => { if (!isActive) setActiveIndex(i); else navigate(`/services#${svc.anchor}`); }}
                  onMouseEnter={() => setHoveredCarouselIndex(i)}
                  onMouseLeave={() => setHoveredCarouselIndex(null)}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: '260px',
                    transform: `translateX(calc(-50% + ${x}px)) translateY(-50%) rotateY(${rotY}deg) translateZ(${z}px) scale(${scale * (hoveredCarouselIndex === i ? 1.02 : 1)})`,
                    opacity,
                    transition: 'all 0.2s cubic-bezier(.2,.7,.2,1)',
                    pointerEvents: visible ? 'auto' : 'none',
                    cursor: isActive ? 'pointer' : 'pointer',
                    zIndex: 10 - absOff,
                    ...GLASS_STYLE,
                    borderRadius: '20px',
                    ...(isActive ? {
                      borderColor: 'rgba(181,141,255,0.45)',
                      boxShadow: hoveredCarouselIndex === i
                        ? '0 0 80px rgba(124,42,235,0.65), inset 0 1px 0 rgba(255,255,255,0.15)'
                        : '0 0 60px rgba(124,42,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                    } : {}),
                    padding: '28px 24px',
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
                    <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold" style={{ color: '#B58DFF' }}>
                      Explore <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nav */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={carouselPrev}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-all duration-200 hover:scale-[1.05] active:scale-[0.98]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {SERVICES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? '24px' : '8px',
                    height: '8px',
                    background: i === activeIndex ? '#7C2AEB' : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
            <button
              onClick={carouselNext}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-all duration-200 hover:scale-[1.05] active:scale-[0.98]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── How We Work ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-20">
            <p className="text-[10px] font-mono tracking-[0.25em] text-primary/60 uppercase mb-3">Our Process</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              How We Work
            </h2>
          </motion.div>

          {/* Desktop: horizontal */}
          <div className="hidden md:block relative">
            {/* Background line track */}
            <div
              className="absolute top-7 left-0 right-0 h-px"
              style={{ background: 'rgba(181,141,255,0.10)', transformOrigin: 'left' }}
            />
            {/* Animated fill line */}
            <div
              className="absolute top-7 left-0 h-px"
              style={{
                width: `${lineProgress}%`,
                background: 'linear-gradient(90deg, #5E29E8, #B58DFF)',
                boxShadow: '0 0 12px rgba(124,42,235,0.8)',
                transition: 'width 0.8s cubic-bezier(.2,.7,.2,1)',
              }}
            />
            <div className="grid grid-cols-4 gap-0 relative">
              {PROCESS_STEPS.map((step, i) => {
                const lit = illuminatedSteps.has(i);
                return (
                  <div
                    key={step.num}
                    ref={el => { stepRefs.current[i] = el; }}
                    className="flex flex-col items-center text-center px-4"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-6 relative z-10"
                      style={{
                        border: `2px solid ${lit ? '#7C2AEB' : 'rgba(124,42,235,0.25)'}`,
                        background: lit ? 'rgba(124,42,235,0.25)' : 'rgba(124,42,235,0.06)',
                        boxShadow: lit ? '0 0 24px rgba(124,42,235,0.6)' : 'none',
                        transition: '0.6s cubic-bezier(.2,.7,.2,1)',
                      }}
                    >
                      <span
                        className="text-sm font-bold"
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          color: lit ? '#B58DFF' : 'rgba(181,141,255,0.4)',
                          transition: '0.6s cubic-bezier(.2,.7,.2,1)',
                        }}
                      >
                        {step.num}
                      </span>
                    </div>
                    <h3
                      className="font-bold text-base mb-2"
                      style={{
                        fontFamily: 'Satoshi, sans-serif',
                        color: lit ? '#fff' : 'rgba(255,255,255,0.4)',
                        transition: '0.6s cubic-bezier(.2,.7,.2,1)',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: lit ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)', transition: '0.6s cubic-bezier(.2,.7,.2,1)' }}>
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden flex flex-col items-center gap-0 relative">
            <div
              className="absolute left-7 top-0 w-px"
              style={{ background: 'rgba(181,141,255,0.10)', height: '100%' }}
            />
            <div
              className="absolute left-7 top-0 w-px"
              style={{
                height: `${lineProgress}%`,
                background: 'linear-gradient(180deg, #5E29E8, #B58DFF)',
                boxShadow: '0 0 12px rgba(124,42,235,0.8)',
                transition: 'height 0.8s cubic-bezier(.2,.7,.2,1)',
              }}
            />
            {PROCESS_STEPS.map((step, i) => {
              const lit = illuminatedSteps.has(i);
              return (
                <div
                  key={step.num}
                  ref={el => { stepRefs.current[i] = el; }}
                  className="flex items-start gap-6 mb-10 relative z-10 w-full"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      border: `2px solid ${lit ? '#7C2AEB' : 'rgba(124,42,235,0.25)'}`,
                      background: lit ? 'rgba(124,42,235,0.25)' : 'rgba(124,42,235,0.06)',
                      boxShadow: lit ? '0 0 24px rgba(124,42,235,0.6)' : 'none',
                      transition: '0.6s cubic-bezier(.2,.7,.2,1)',
                    }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        color: lit ? '#B58DFF' : 'rgba(181,141,255,0.4)',
                        transition: '0.6s cubic-bezier(.2,.7,.2,1)',
                      }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <div className="pt-3">
                    <h3
                      className="font-bold text-base mb-1"
                      style={{
                        fontFamily: 'Satoshi, sans-serif',
                        color: lit ? '#fff' : 'rgba(255,255,255,0.4)',
                        transition: '0.6s cubic-bezier(.2,.7,.2,1)',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: lit ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)', transition: '0.6s cubic-bezier(.2,.7,.2,1)' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Selected Work — Portfolio Folder ──────────────────────────────── */}
      <section className="py-24 px-6 bg-[#05030F]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-[10px] font-mono tracking-[0.25em] text-primary/60 uppercase mb-3">Case Studies</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Selected Work
            </h2>
            <p className="text-white/50 text-lg">Real projects. Real clients. Real results.</p>
          </motion.div>

          {/* Folder + fan */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
            <div
              className="relative cursor-pointer"
              style={{ width: '320px', height: '260px' }}
              onMouseEnter={() => setFolderHovered(true)}
              onMouseLeave={() => setFolderHovered(false)}
              onClick={() => navigate('/portfolio')}
            >
              {PROJECTS.map((proj, i) => {
                const fanTransforms = [
                  'rotate(-13deg) translateX(-110px) translateY(16px)',
                  'rotate(0deg) translateY(-22px)',
                  'rotate(13deg) translateX(110px) translateY(16px)',
                ];
                const stackTransforms = [
                  'rotate(-3deg) translateX(-6px) translateY(6px)',
                  'rotate(0deg) translateY(0px)',
                  'rotate(3deg) translateX(6px) translateY(-4px)',
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
                      padding: '0',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="h-28 flex items-center justify-center relative"
                      style={{ background: 'linear-gradient(135deg, rgba(94,41,232,0.25) 0%, #05030F 60%, rgba(120,213,255,0.1) 100%)' }}
                    >
                      <Globe className="w-8 h-8" style={{ color: 'rgba(124,42,235,0.4)' }} />
                      <div className="absolute top-2.5 right-3 text-lg">{proj.country}</div>
                    </div>
                    <div className="p-4">
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-wider mb-1">{proj.clientType}</p>
                      <h4 className="text-white font-bold text-sm" style={{ fontFamily: 'Satoshi, sans-serif' }}>{proj.name}</h4>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <p className="text-white/30 text-xs font-mono mb-5">Hover to explore · Click to view all</p>
              <button
                onClick={() => navigate('/portfolio')}
                className="flex items-center gap-2 mx-auto px-6 py-3 rounded-full border border-primary/30 text-white/70 hover:text-white hover:border-primary text-sm font-semibold transition-all duration-300 hover:scale-[1.05] active:scale-[0.98]"
              >
                View All Work <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ (unchanged) ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>Common Questions</h2>
          </motion.div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
                className="glass-card rounded-xl overflow-hidden"
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA — Toggle ───────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden bg-[#05030F]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-[10px] font-mono tracking-[0.25em] text-primary/60 uppercase mb-5">Join Us</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Wanna join the<br />Galaxa team?
          </h2>
          <p className="text-white/50 text-base mb-12 max-w-md mx-auto leading-relaxed">
            Slide to join our builders/newsletter community and hear about opportunities first.
          </p>

          {/* Toggle */}
          <div className="flex flex-col items-center gap-8">
            <div
              className="relative flex items-center rounded-full p-1 cursor-pointer select-none hover:scale-[1.05] active:scale-[0.98]"
              style={{
                width: '260px',
                height: '48px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                transition: 'transform 0.2s ease',
              }}
              onClick={() => setToggled(t => !t)}
            >
              {/* Knob */}
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  width: '120px',
                  height: '38px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #5E29E8, #7C2AEB)',
                  boxShadow: '0 4px 20px rgba(124,42,235,0.5)',
                  transform: toggled ? 'translateX(128px)' : 'translateX(0px)',
                  transition: '0.35s cubic-bezier(.2,.7,.2,1)',
                }}
              />
              <span
                className="relative z-10 flex-1 text-center text-xs font-bold transition-colors duration-300"
                style={{ color: toggled ? 'rgba(255,255,255,0.35)' : 'white' }}
              >
                Not yet
              </span>
              <span
                className="relative z-10 flex-1 text-center text-xs font-bold transition-colors duration-300"
                style={{ color: toggled ? 'white' : 'rgba(255,255,255,0.35)' }}
              >
                Yes, I'm in
              </span>
            </div>

            {/* Reveal form */}
            <div
              style={{
                maxHeight: toggled ? '340px' : '0px',
                opacity: toggled ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.5s cubic-bezier(.2,.7,.2,1), opacity 0.4s cubic-bezier(.2,.7,.2,1)',
                width: '100%',
                maxWidth: '420px',
              }}
            >
              {submitted ? (
                <div
                  className="flex flex-col items-center gap-3 py-10 px-8"
                  style={{ ...GLASS_STYLE, borderRadius: '20px' }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: '#B58DFF' }} />
                  <p className="text-white font-bold text-lg" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    You're in the circle. ✦
                  </p>
                  <p className="text-white/40 text-sm">We'll reach out with opportunities first.</p>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col gap-3 p-6"
                  style={{ ...GLASS_STYLE, borderRadius: '20px' }}
                >
                  <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    Join the Galaxa circle
                  </p>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={subName}
                    onChange={e => setSubName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-1"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(181,141,255,0.15)',
                      focusRingColor: '#7C2AEB',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={subEmail}
                    onChange={e => setSubEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-1"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(181,141,255,0.15)',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all duration-300"
                    style={{
                      background: submitting ? 'rgba(94,41,232,0.5)' : 'linear-gradient(135deg, #5E29E8, #7C2AEB)',
                      boxShadow: '0 8px 30px rgba(124,42,235,0.35)',
                    }}
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending…' : 'Join the circle'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

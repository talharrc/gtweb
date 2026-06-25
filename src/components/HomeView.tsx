import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight,
  Laptop, Smartphone, TrendingUp, Cpu, Brush, Workflow,
  Globe, MessageCircle, Sparkles, Send,
  Search, Code2, Rocket, Shield, Package, FileText, Mail,
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
  { num: '01', icon: Laptop,         label: 'Web Development',         desc: 'Fast, secure, and scalable websites built for performance and growth.',              anchor: 'web-development',    color: '#78D5FF' },
  { num: '02', icon: Smartphone,     label: 'App Development',         desc: 'High-performance mobile and web apps tailored to user needs and business goals.',    anchor: 'app-development',    color: '#B58DFF' },
  { num: '03', icon: MessageCircle,  label: 'Social Media & Content',  desc: 'Engaging content and social strategies that build brand presence and loyalty.',      anchor: 'social-media',       color: '#7C2AEB' },
  { num: '04', icon: Cpu,            label: 'AI & Automation',         desc: 'Intelligent automation that streamlines workflows and boosts productivity.',          anchor: 'ai-automation',      color: '#5E29E8' },
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
  { slug: 'harmans-trading',  num: '01', name: 'Harmans Trading',  type: 'Trading Platform',      color: '#78D5FF', bg: 'linear-gradient(135deg,rgba(120,213,255,0.25) 0%,rgba(94,41,232,0.3) 60%,rgba(0,0,0,0.6) 100%)' },
  { slug: 'sunnah-grandeur',  num: '02', name: 'Sunnah Grandeur',  type: 'E-Commerce Platform',   color: '#B58DFF', bg: 'linear-gradient(135deg,rgba(94,41,232,0.3) 0%,rgba(181,141,255,0.2) 60%,rgba(0,0,0,0.6) 100%)' },
  { slug: 'salfas-bazar',     num: '03', name: 'Salfas Bazar',     type: 'Organic Food Platform', color: '#78FFB5', bg: 'linear-gradient(135deg,rgba(0,180,120,0.2) 0%,rgba(94,41,232,0.25) 60%,rgba(0,0,0,0.6) 100%)' },
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
  { flag: '🇺🇸', name: 'USA' },
  { flag: '🇬🇧', name: 'UK' },
  { flag: '🇵🇰', name: 'Pakistan' },
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇮🇳', name: 'India' },
  { flag: '🇧🇩', name: 'Bangladesh' },
];

const FEED_ICON: Record<string, React.ElementType> = {
  TOOLS: Package,
  RESEARCH: FileText,
  MARKET: TrendingUp,
  'AI News': Sparkles,
  'Tech Insight': Cpu,
  GalaxaTech: Globe,
};

const PLACEHOLDER_FEED: FeedItem[] = [
  { category: 'TOOLS',    headline: 'Open-source agent stacks gain traction',       summary: 'Teams are adopting lightweight agent frameworks to automate workflows across operations and support.',      time: '2h ago' },
  { category: 'RESEARCH', headline: 'Multimodal models improve workflow accuracy',  summary: 'New advances in multimodal reasoning boost accuracy in document and visual understanding.',               time: '5h ago' },
  { category: 'MARKET',   headline: 'SMBs accelerate AI adoption in operations',    summary: 'Rising demand for automation and customer support tools drives strong momentum in SMEs.',                  time: 'Today'  },
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

  const [wordIndex, setWordIndex] = useState(0);
  const [buildMins, setBuildMins] = useState(42);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(PLACEHOLDER_FEED);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [hoveredCarouselIndex, setHoveredCarouselIndex] = useState<number | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [illuminatedSteps, setIlluminatedSteps] = useState<Set<number>>(new Set());
  const [folderHovered, setFolderHovered] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [subEmail, setSubEmail] = useState('');
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
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const carouselPrev = () => setActiveIndex(p => (p - 1 + SERVICES.length) % SERVICES.length);
  const carouselNext = () => setActiveIndex(p => (p + 1) % SERVICES.length);
  const handlePointerDown = (e: React.PointerEvent) => setDragStartX(e.clientX);
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const d = e.clientX - dragStartX;
    if (d < -50) carouselNext();
    else if (d > 50) carouselPrev();
    setDragStartX(null);
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
    <div className="relative">
      <Helmet>
        <title>GalaxaTech — Ecosystems, Optimized</title>
        <meta name="description" content="GalaxaTech is a systems-driven creative tech agency from Dhaka, building digital ecosystems for brands across 6 countries." />
        <meta property="og:title" content="GalaxaTech — Ecosystems, Optimized" />
        <meta property="og:description" content="Systems-driven creative tech agency. Web, App, Social, AI, Brand, and Consulting." />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", "name": "GalaxaTech", "url": "https://gt-web-iota.vercel.app", "description": "Systems-driven creative tech agency", "address": { "@type": "PostalAddress", "addressLocality": "Dhaka", "addressCountry": "BD" } })}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 select-none overflow-hidden bg-[#05030F]">
          <img alt="Hero MacBook Atmosphere" className="w-full h-full object-cover opacity-68 contrast-105 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0) 100%)' }} src={heroLaptopDashboard} referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#05030F] via-[#7C2AEB]/6 to-[#7C2AEB]/6 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#05030F] via-[#05030F]/90 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#05030F] to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#7C2AEB]/12 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[350px] h-[350px] bg-[#7C2AEB]/10 blur-[90px] rounded-full pointer-events-none" />
        </div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>
            <div className="inline-flex items-center gap-2.5 bg-black/50 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <span className="w-2 h-2 rounded-full bg-red-500 dot-pulse-glow" />
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-white uppercase">AUTONOMOUS OPTIMIZATION • AGENTS ACTIVE • LAST BUILD: {buildMins}M AGO</span>
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16,1,0.3,1] }} className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Assure your brand's <br className="hidden md:block" />
            <span className="font-serif italic font-bold typewriter-container block min-h-[1.15em] mt-2 pb-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span key={wordIndex} initial={{ y: 35, opacity: 0, filter: 'blur(5px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -35, opacity: 0, filter: 'blur(5px)' }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className="inline-block text-gradient">
                  {TYPEWRITER_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16,1,0.3,1] }} className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            By investing only FIVE minutes, giving us some information about your business.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.16,1,0.3,1] }} className="flex justify-center">
            <button onClick={() => navigate('/audit')} className="bg-black/40 backdrop-blur-md border border-white/10 group flex items-center gap-4 text-white hover:text-primary hover:border-primary/50 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-2xl cursor-pointer hover:scale-[1.05] active:scale-[0.98]">
              <span className="w-10 h-10 primary-gradient text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight className="w-5 h-5" />
              </span>
              <span className="text-md font-bold text-white">Book an Audit</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── CSS ─────────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { display: flex; width: max-content; animation: marquee-scroll 28s linear infinite; }
        .marquee-wrapper:hover .marquee-track { animation-play-state: paused; }
        @keyframes dot-pulse-glow {
          0%,100% { box-shadow: 0 0 6px #ef4444, 0 0 14px rgba(239,68,68,0.4); opacity: 1; }
          50%      { box-shadow: 0 0 14px #ef4444, 0 0 28px rgba(239,68,68,0.65); opacity: 0.6; }
        }
        .dot-pulse-glow { animation: dot-pulse-glow 2s ease-in-out infinite; }
      `}</style>

      {/* ── Global Presence ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-y border-white/5 bg-[#05030F] overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25" style={{ background: 'rgba(124,42,235,0.08)' }}>
              <Globe className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary/70 uppercase">Global Presence</span>
            </div>
          </div>
          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Serving clients across
              <br />
              <span className="font-serif italic" style={{ color: '#B58DFF' }}>6 countries</span>
            </h2>
            <p className="text-white/50 text-lg">Delivering digital solutions across markets</p>
          </div>
          {/* Marquee pills */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="marquee-wrapper overflow-hidden">
              <div className="marquee-track">
                {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
                  <div key={i} className="flex items-center gap-2.5 mx-3 select-none px-5 py-2.5 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', minWidth: 'max-content' }}>
                    <span className="text-2xl leading-none">{c.flag}</span>
                    <span className="text-white/75 font-semibold text-sm" style={{ fontFamily: 'Satoshi, sans-serif' }}>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Trust line */}
          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary/50" />
              <span className="text-white/40 text-sm">Trusted by businesses worldwide to drive growth and innovation.</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Daily AI Feed — 3D stacked cards ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825]">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 mb-6" style={{ background: 'rgba(94,41,232,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-mono text-green-400/80 tracking-widest uppercase">Live</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Daily <span style={{ color: '#B58DFF' }}>AI Feed</span>
            </h2>
            <p className="text-white/50 text-lg">Signals on tools, trends, research, and market shifts — refreshed daily.</p>
          </motion.div>

          {/* 3D Cards — desktop */}
          <div className="hidden md:block">
            <div className="relative mx-auto" style={{ height: '370px', maxWidth: '960px', perspective: '1100px' }}>
              {feedItems.map((item, i) => {
                const CatIcon = FEED_ICON[item.category] ?? Sparkles;
                const positions = [
                  { left: '0%',   rotY: '-12deg', tZ: '50px',  zIndex: 3 },
                  { left: '29%',  rotY: '-3deg',  tZ: '10px',  zIndex: 2 },
                  { left: '56%',  rotY:  '5deg',  tZ: '-20px', zIndex: 1 },
                ];
                const p = positions[i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: i * 0.14 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: p.left,
                      width: '310px',
                      height: '340px',
                      transform: `rotateY(${p.rotY}) translateZ(${p.tZ})`,
                      zIndex: p.zIndex,
                      ...GLASS_STYLE,
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '24px',
                    }}
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(124,42,235,0.15)', border: '1px solid rgba(181,141,255,0.25)' }}>
                        <CatIcon className="w-3.5 h-3.5" style={{ color: '#B58DFF' }} />
                        <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: '#B58DFF' }}>{item.category}</span>
                      </div>
                      <span className="text-white/20 text-lg tracking-widest">···</span>
                    </div>
                    {/* Content */}
                    <h3 className="text-white font-bold text-[17px] leading-snug mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                      {item.headline}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed flex-1">{item.summary}</p>
                    {/* Footer */}
                    <div className="pt-4 border-t border-white/8 flex items-center gap-3 mt-4">
                      <span className="text-white/35 text-[11px] font-mono flex items-center gap-1.5">
                        <span className="text-base">🕐</span>{item.time}
                      </span>
                      <span className="text-white/15">|</span>
                      <span className="flex items-center gap-1.5 text-white/25 text-[10px] font-mono">
                        <Sparkles className="w-3 h-3" style={{ color: '#7C2AEB' }} />Generated by Galaxa agents
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile: stacked cards */}
          <div className="md:hidden flex flex-col gap-4">
            {feedItems.map((item, i) => {
              const CatIcon = FEED_ICON[item.category] ?? Sparkles;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: i * 0.1 }} style={{ ...GLASS_STYLE, padding: '20px' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(124,42,235,0.15)', border: '1px solid rgba(181,141,255,0.25)' }}>
                      <CatIcon className="w-3.5 h-3.5" style={{ color: '#B58DFF' }} />
                      <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: '#B58DFF' }}>{item.category}</span>
                    </div>
                    <span className="text-white/30 text-[11px] font-mono">{item.time}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>{item.headline}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.summary}</p>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-primary/50" />
                    <span className="text-[10px] font-mono text-white/25">Generated by Galaxa agents</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* "Curated by" footer */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="flex justify-center mt-16 md:mt-20">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-primary/50" />
              <span className="text-white/30 text-sm">Curated by <span className="text-primary/60">GalaxaTech</span> intelligence layer</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What We Build — 3D Service Carousel ──────────────────────────────── */}
      <section className="py-24 px-6 bg-[#05030F] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 mb-5" style={{ background: 'rgba(124,42,235,0.08)' }}>
              <Workflow className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary/70 uppercase">Service Carousel</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              What <span style={{ color: '#B58DFF' }}>We Build</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">Interactive digital systems and growth solutions crafted for modern businesses.</p>
          </motion.div>

          {/* 3D Carousel */}
          <div className="relative select-none" style={{ perspective: '1200px', height: '340px' }} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerLeave={() => setDragStartX(null)}>
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
                    position: 'absolute', left: '50%', top: '50%', width: '260px',
                    transform: `translateX(calc(-50% + ${x}px)) translateY(-50%) rotateY(${rotY}deg) translateZ(${z}px) scale(${scale * (hoveredCarouselIndex === i ? 1.02 : 1)})`,
                    opacity, transition: 'all 0.2s cubic-bezier(.2,.7,.2,1)',
                    pointerEvents: visible ? 'auto' : 'none', cursor: 'pointer',
                    zIndex: 10 - absOff, ...GLASS_STYLE, borderRadius: '20px',
                    ...(isActive ? {
                      borderColor: 'rgba(181,141,255,0.45)',
                      boxShadow: hoveredCarouselIndex === i ? '0 0 80px rgba(124,42,235,0.65),inset 0 1px 0 rgba(255,255,255,0.15)' : '0 0 60px rgba(124,42,235,0.5),inset 0 1px 0 rgba(255,255,255,0.15)',
                    } : {}),
                    padding: '28px 24px',
                  }}
                >
                  {/* Service number top-right */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${svc.color}18`, border: `1px solid ${svc.color}30` }}>
                      <svc.icon className="w-6 h-6" style={{ color: svc.color }} />
                    </div>
                    <span className="text-[11px] font-mono text-white/25">{svc.num}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>{svc.label}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{svc.desc}</p>
                  {isActive && (
                    <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold" style={{ color: '#B58DFF' }}>
                      Explore Service <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {!isActive && (
                    <div className="mt-5">
                      <ArrowUpRight className="w-4 h-4 text-white/25" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nav */}
          <div className="flex items-center justify-center gap-5 mt-8">
            <button onClick={carouselPrev} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-all duration-200 hover:scale-[1.05] active:scale-[0.98]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 rounded-full border border-white/10 text-[11px] font-mono text-white/40">
              {String(activeIndex + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
            </div>
            <div className="flex gap-2">
              {SERVICES.map((_, i) => (
                <button key={i} onClick={() => setActiveIndex(i)} className="rounded-full transition-all duration-300" style={{ width: i === activeIndex ? '24px' : '8px', height: '8px', background: i === activeIndex ? '#7C2AEB' : 'rgba(255,255,255,0.2)' }} />
              ))}
            </div>
            <button onClick={carouselNext} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/40 transition-all duration-200 hover:scale-[1.05] active:scale-[0.98]">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-[11px] font-mono text-white/25 flex items-center gap-2">
              <span className="text-base">👆</span> Drag or swipe to explore
            </span>
          </div>
        </div>
      </section>

      {/* ── How We Work — vertical timeline ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825]">
        <div className="max-w-2xl mx-auto">
          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 mb-5" style={{ background: 'rgba(124,42,235,0.08)' }}>
              <Sparkles className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary/70 uppercase">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              How <span style={{ color: '#B58DFF' }}>We Work</span>
            </h2>
            <p className="text-white/50">A clear, collaborative journey from idea to deployed digital systems.</p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Background connector line */}
            <div className="absolute left-[29px] top-8 w-px" style={{ height: 'calc(100% - 64px)', background: 'rgba(124,42,235,0.15)' }} />
            {/* Animated fill */}
            <div className="absolute left-[29px] top-8 w-px" style={{ height: `${lineProgress}%`, background: 'linear-gradient(180deg,#5E29E8,#B58DFF)', boxShadow: '0 0 12px rgba(124,42,235,0.8)', transition: 'height 0.8s cubic-bezier(.2,.7,.2,1)', maxHeight: 'calc(100% - 64px)' }} />

            <div className="flex flex-col gap-5">
              {PROCESS_STEPS.map((step, i) => {
                const lit = illuminatedSteps.has(i);
                const StepIcon = step.Icon;
                return (
                  <div key={step.num} ref={el => { stepRefs.current[i] = el; }} className="flex items-center gap-5 relative z-10">
                    {/* Icon circle */}
                    <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${lit ? '#7C2AEB' : 'rgba(124,42,235,0.25)'}`, background: lit ? 'rgba(124,42,235,0.22)' : 'rgba(10,8,37,1)', boxShadow: lit ? '0 0 30px rgba(124,42,235,0.6),0 0 60px rgba(124,42,235,0.2)' : 'none', transition: '0.6s cubic-bezier(.2,.7,.2,1)' }}>
                      <StepIcon className="w-5 h-5" style={{ color: lit ? '#B58DFF' : 'rgba(181,141,255,0.3)', transition: '0.6s' }} />
                    </div>
                    {/* Step card */}
                    <div className="flex-1 flex items-center justify-between p-5 rounded-2xl" style={{ ...GLASS_STYLE, borderColor: lit ? 'rgba(124,42,235,0.4)' : 'rgba(181,141,255,0.15)', transition: '0.6s cubic-bezier(.2,.7,.2,1)' }}>
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="text-[10px] font-mono" style={{ color: lit ? '#7C2AEB' : 'rgba(124,42,235,0.35)' }}>{step.num}</span>
                          <h3 className="font-bold text-base" style={{ fontFamily: 'Satoshi, sans-serif', color: lit ? '#fff' : 'rgba(255,255,255,0.35)' }}>{step.title}</h3>
                        </div>
                        <p className="text-sm" style={{ color: lit ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)' }}>{step.desc}</p>
                      </div>
                      <button className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ml-4" style={{ borderColor: lit ? 'rgba(124,42,235,0.5)' : 'rgba(255,255,255,0.08)', background: lit ? 'rgba(124,42,235,0.15)' : 'transparent' }}>
                        <ChevronRight className="w-4 h-4" style={{ color: lit ? '#B58DFF' : 'rgba(255,255,255,0.2)' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="flex justify-center mt-12">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-primary/40" />
              <span className="text-sm text-white/30">Powered by the <span className="text-primary/60">GalaxaTech</span> intelligence layer</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Selected Work — glassmorphic folder ───────────────────────────────── */}
      <section className="py-24 px-6 bg-[#05030F]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 mb-5" style={{ background: 'rgba(124,42,235,0.08)' }}>
              <Sparkles className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary/70 uppercase">Portfolio</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Selected <span style={{ color: '#B58DFF' }}>Work</span>
            </h2>
            <p className="text-white/50 text-lg">A few projects, systems, and brands we've helped shape.</p>
          </motion.div>

          {/* Folder widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
            <div
              className="relative cursor-pointer w-full max-w-[680px]"
              onMouseEnter={() => setFolderHovered(true)}
              onMouseLeave={() => setFolderHovered(false)}
              onClick={() => navigate('/portfolio')}
              style={{ height: '480px' }}
            >
              {/* Fan-out project cards */}
              {PROJECTS.map((proj, i) => {
                const fan = [
                  'translateX(-220px) translateY(-10px) rotate(-16deg)',
                  'translateX(0px) translateY(-30px) rotate(0deg)',
                  'translateX(220px) translateY(-10px) rotate(16deg)',
                ];
                const stack = [
                  'translateX(-10px) translateY(0px) rotate(-4deg)',
                  'translateX(0px) translateY(-8px) rotate(0deg)',
                  'translateX(10px) translateY(-4px) rotate(4deg)',
                ];
                return (
                  <div
                    key={proj.slug}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '20px',
                      width: '190px',
                      height: '240px',
                      marginLeft: '-95px',
                      transform: folderHovered ? fan[i] : stack[i],
                      transition: `0.5s cubic-bezier(.2,.7,.2,1) ${i * 0.04}s`,
                      zIndex: folderHovered ? (i === 1 ? 5 : 4 - i) : (2 - i + 3),
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid rgba(181,141,255,0.25)',
                    }}
                  >
                    {/* Card image area */}
                    <div className="h-3/5 relative flex items-center justify-center" style={{ background: proj.bg }}>
                      <Globe className="w-10 h-10 opacity-20" style={{ color: proj.color }} />
                      <span className="absolute top-3 left-3 text-[10px] font-mono text-white/50">{proj.num}</span>
                    </div>
                    {/* Card info */}
                    <div className="p-3 h-2/5" style={{ background: 'rgba(10,8,37,0.95)' }}>
                      <p className="text-white font-bold text-sm leading-tight mb-0.5" style={{ fontFamily: 'Satoshi, sans-serif' }}>{proj.name}</p>
                      <p className="text-white/40 text-[11px]">{proj.type}</p>
                    </div>
                  </div>
                );
              })}

              {/* Folder body */}
              <div
                className="absolute bottom-0 left-0 right-0 rounded-2xl"
                style={{
                  height: '260px',
                  ...GLASS_STYLE,
                  borderColor: folderHovered ? 'rgba(124,42,235,0.5)' : 'rgba(181,141,255,0.2)',
                  boxShadow: folderHovered ? '0 0 80px rgba(124,42,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' : GLASS_STYLE.boxShadow,
                  transition: '0.5s cubic-bezier(.2,.7,.2,1)',
                  borderRadius: '4px 24px 24px 24px',
                }}
              >
                {/* Folder tab */}
                <div className="absolute -top-[24px] left-0 h-6 w-28 rounded-t-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(181,141,255,0.2)', borderBottom: 'none' }} />
                <div className="flex flex-col justify-between h-full p-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl border border-primary/20 flex items-center justify-center" style={{ background: 'rgba(124,42,235,0.1)' }}>
                        <span className="text-xl">📁</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg" style={{ fontFamily: 'Satoshi, sans-serif' }}>Open <span style={{ color: '#B58DFF' }}>Portfolio</span></p>
                        <p className="text-white/35 text-xs">Hover to reveal selected projects</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary/50" />
                      <span className="text-white/35 text-sm font-semibold" style={{ fontFamily: 'Satoshi, sans-serif' }}>GalaxaTech</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); navigate('/portfolio'); }}
                      className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-[1.1]"
                      style={{ background: 'linear-gradient(135deg,#5E29E8,#7C2AEB)', boxShadow: '0 8px 30px rgba(124,42,235,0.4)' }}
                    >
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-white/25 text-[11px] font-mono mt-6">Hover to reveal</p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0A0825]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>Common Questions</h2>
          </motion.div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: i * 0.06 }} whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }} className="glass-card rounded-xl overflow-hidden">
                <button onClick={() => setActiveFAQ(activeFAQ === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/50 flex-shrink-0 transition-transform duration-300 ${activeFAQ === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFAQ === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-white/60 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA — toggle + side card ─────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden bg-[#05030F]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-5xl mx-auto relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25" style={{ background: 'rgba(124,42,235,0.08)' }}>
              <Sparkles className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary/70 uppercase">Builders Community</span>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-20">
            {/* Left: heading + toggle */}
            <div className="flex-1 text-center lg:text-left max-w-md">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Wanna join the<br /><span style={{ color: '#B58DFF' }}>Galaxa team?</span>
              </h2>
              <p className="text-white/50 text-base mb-10 leading-relaxed">
                Slide to join our builders/newsletter community and hear about opportunities first.
              </p>

              {/* Toggle pill */}
              <div className="flex flex-col items-center lg:items-start gap-3">
                <div
                  className="relative flex items-center rounded-full p-1 cursor-pointer select-none hover:scale-[1.03] active:scale-[0.98]"
                  style={{ width: '280px', height: '52px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', transition: 'transform 0.2s ease' }}
                  onClick={() => setToggled(t => !t)}
                >
                  {/* Knob */}
                  <div style={{ position: 'absolute', top: '4px', left: '4px', width: '130px', height: '42px', borderRadius: '999px', background: 'linear-gradient(135deg,#5E29E8,#7C2AEB)', boxShadow: '0 4px 24px rgba(124,42,235,0.55)', transform: toggled ? 'translateX(138px)' : 'translateX(0px)', transition: '0.35s cubic-bezier(.2,.7,.2,1)' }} />
                  <span className="relative z-10 flex-1 text-center text-xs font-bold" style={{ color: toggled ? 'rgba(255,255,255,0.3)' : 'white' }}>Not yet</span>
                  <span className="relative z-10 flex-1 text-center text-xs font-bold" style={{ color: toggled ? 'white' : 'rgba(255,255,255,0.3)' }}>Yes, I'm in</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/25 text-[11px] font-mono ml-1">
                  <ChevronLeft className="w-3 h-3" /><ChevronLeft className="w-3 h-3 -ml-1.5" />
                  Slide right to join
                </div>
              </div>
            </div>

            {/* Right: signup card */}
            <div style={{ ...GLASS_STYLE, borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '340px', borderColor: toggled ? 'rgba(124,42,235,0.45)' : 'rgba(181,141,255,0.2)', boxShadow: toggled ? '0 0 60px rgba(124,42,235,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' : GLASS_STYLE.boxShadow, transition: '0.5s cubic-bezier(.2,.7,.2,1)' }}>
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <Sparkles className="w-8 h-8" style={{ color: '#B58DFF' }} />
                  <p className="text-white font-bold text-lg" style={{ fontFamily: 'Satoshi, sans-serif' }}>You're in the circle. ✦</p>
                  <p className="text-white/40 text-sm">We'll reach out with opportunities first.</p>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-full border border-primary/20 flex items-center justify-center mb-5" style={{ background: 'rgba(124,42,235,0.1)' }}>
                    <Mail className="w-5 h-5 text-primary/70" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    Join the <span style={{ color: '#B58DFF' }}>Galaxa</span> circle
                  </h3>
                  <p className="text-white/45 text-sm mb-5 leading-relaxed">Get early access, opportunities, and builder-only updates.</p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="you@galaxa.tech"
                      value={subEmail}
                      onChange={e => setSubEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(181,141,255,0.15)' }}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: submitting ? 'rgba(94,41,232,0.5)' : 'linear-gradient(135deg,#5E29E8,#7C2AEB)', boxShadow: '0 8px 30px rgba(124,42,235,0.35)' }}
                    >
                      {submitting ? 'Sending…' : <>Join the circle <ArrowUpRight className="w-4 h-4" /></>}
                    </button>
                    <p className="text-white/25 text-[11px] text-center flex items-center justify-center gap-1">
                      <span>🔒</span> No spam. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

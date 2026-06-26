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
} from 'lucide-react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import heroLaptopDashboard from '../assets/images/hero_laptop_dashboard_1780081071809.png';

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
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [hoveredCarouselIndex, setHoveredCarouselIndex] = useState<number | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [illuminatedSteps, setIlluminatedSteps] = useState<Set<number>>(new Set());
  const [folderHovered, setFolderHovered] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [circleModalOpen, setCircleModalOpen] = useState(false);
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
    if (Math.abs(d) > 40) {
      if (d < 0) carouselNext();
      else carouselPrev();
    }
    setDragStartX(null);
  };
  const handleTouchStart = (e: React.TouchEvent) => setDragStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const d = e.changedTouches[0].clientX - dragStartX;
    if (Math.abs(d) > 40) {
      if (d < 0) carouselNext();
      else carouselPrev();
    }
    setDragStartX(null);
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
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-8 overflow-hidden">
        <div className="absolute inset-0 z-0 select-none overflow-hidden bg-[#05030F]">
          <img
            alt="Hero MacBook Dashboard"
            className="w-full h-full object-cover opacity-55 contrast-105 pointer-events-none"
            style={{
              maskImage: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0) 100%)',
              filter: 'drop-shadow(0 0 60px rgba(120,50,235,0.45))',
            }}
            src={heroLaptopDashboard}
            referrerPolicy="no-referrer"
          />
          {/* Purple/violet tint overlay */}
          <div className="absolute inset-0 bg-violet-950/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#05030F]/80 via-[#7C2AEB]/8 to-[#7C2AEB]/8 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#05030F]/50 via-[#05030F]/10 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05030F] to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#7C2AEB]/15 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[350px] h-[350px] bg-[#7C2AEB]/12 blur-[90px] rounded-full pointer-events-none" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>
            <div className="inline-flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
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
            <button
              onClick={() => navigate('/audit')}
              className="group flex items-center gap-4 text-white hover:text-primary font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-2xl cursor-pointer hover:scale-[1.05] active:scale-[0.98]"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span className="w-10 h-10 primary-gradient text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight className="w-5 h-5" />
              </span>
              <span className="text-md font-bold text-white">Book an Audit</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Global Presence ──────────────────────────────────────────────────── */}
      <section className="pt-10 pb-20 px-6 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #080620 60%, #05030F 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25" style={{ background: 'rgba(124,42,235,0.08)' }}>
              <Globe className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary/70 uppercase">Global Presence</span>
            </div>
          </div>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Serving clients
              <br />
              <span className="font-serif italic" style={{ color: '#B58DFF' }}>worldwide</span>
            </h2>
            <p className="text-white/50 text-lg">Delivering digital solutions across markets</p>
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
                  <span style={{ fontSize: '1.5rem', lineHeight: 1, fontFamily: '"Segoe UI Emoji","Noto Color Emoji",sans-serif' }}>{c.flag}</span>
                  <span className="text-white/75 font-semibold text-sm" style={{ fontFamily: 'Satoshi, sans-serif' }}>{c.name}</span>
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
      <section className="py-24 px-6" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #0A0825 50%, #05030F 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 mb-6" style={{ background: 'rgba(94,41,232,0.08)' }}>
              <CheckCircle className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono text-primary/70 tracking-widest uppercase">Why GalaxaTech</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Why <span style={{ color: '#B58DFF' }}>Choose Us</span>
            </h2>
            <p className="text-white/50 text-lg">Five reasons clients trust GalaxaTech to build their digital future.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300"
                  style={{ ...GLASS_STYLE }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 40px rgba(124,42,235,0.25), inset 0 1px 0 rgba(255,255,255,0.12)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(181,141,255,0.35)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = GLASS_STYLE.boxShadow as string; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,42,235,0.15)', border: '1px solid rgba(181,141,255,0.2)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#B58DFF' }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1.5 leading-snug" style={{ fontFamily: 'Satoshi, sans-serif' }}>{item.title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── What We Build — 3D Service Carousel ──────────────────────────────── */}
      <section className="py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #080620 50%, #05030F 100%)' }}>
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
          <div
            className="relative select-none"
            style={{ perspective: '1200px', height: '340px' }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => setDragStartX(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {SERVICES.map((svc, i) => {
              const offset = getCarouselOffset(i, activeIndex, SERVICES.length);
              const absOff = Math.abs(offset);
              const visible = absOff <= 2;
              const x = offset * 200;
              const rotY = offset * 28;
              const z = -absOff * 120;
              const scale = 1 - absOff * 0.12;
              const opacity = visible ? Math.max(0.45, 1 - absOff * 0.2) : 0;
              const isActive = offset === 0;
              return (
                <div
                  key={svc.anchor}
                  onClick={() => { if (!isActive) setActiveIndex(i); else navigate(`/services#${svc.anchor}`); }}
                  onMouseEnter={() => setHoveredCarouselIndex(i)}
                  onMouseLeave={() => setHoveredCarouselIndex(null)}
                  style={{
                    position: 'absolute', left: '50%', top: '50%', width: '240px',
                    transform: `translateX(calc(-50% + ${x}px)) translateY(-50%) rotateY(${rotY}deg) translateZ(${z}px) scale(${scale * (hoveredCarouselIndex === i ? 1.02 : 1)})`,
                    opacity, transition: 'all 0.35s cubic-bezier(.2,.7,.2,1)',
                    pointerEvents: visible ? 'auto' : 'none', cursor: 'pointer',
                    zIndex: 10 - absOff, ...GLASS_STYLE, borderRadius: '20px',
                    ...(isActive ? {
                      borderColor: 'rgba(167,139,250,0.5)',
                      boxShadow: hoveredCarouselIndex === i
                        ? '0 0 80px rgba(124,42,235,0.65), 0 0 25px -5px rgba(124,42,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)'
                        : '0 0 60px rgba(124,42,235,0.5), 0 0 25px -5px rgba(124,42,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                    } : {
                      borderColor: 'rgba(255,255,255,0.12)',
                      boxShadow: '0 0 25px -5px rgba(124,42,235,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }),
                    padding: '28px 24px',
                  }}
                >
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
        </div>
      </section>

      {/* ── How We Work — vertical timeline ──────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #0A0825 50%, #05030F 100%)' }}>
        <div className="max-w-2xl mx-auto">
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
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.2,.7,.2,1)', filter: 'drop-shadow(0 0 4px rgba(124,42,235,0.8))' }}
              />
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5E29E8" />
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
                    <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${lit ? '#7C2AEB' : 'rgba(124,42,235,0.25)'}`, background: lit ? 'rgba(124,42,235,0.22)' : 'rgba(10,8,37,1)', boxShadow: lit ? '0 0 30px rgba(124,42,235,0.6),0 0 60px rgba(124,42,235,0.2)' : 'none', transition: '0.6s cubic-bezier(.2,.7,.2,1)' }}>
                      <StepIcon className="w-5 h-5" style={{ color: lit ? '#B58DFF' : 'rgba(181,141,255,0.3)', transition: '0.6s' }} />
                    </div>
                    <div className="flex-1 flex items-center justify-between p-5 rounded-2xl" style={{ ...GLASS_STYLE, borderColor: lit ? 'rgba(124,42,235,0.4)' : 'rgba(255,255,255,0.1)', transition: '0.6s cubic-bezier(.2,.7,.2,1)' }}>
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

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="flex justify-center mt-12">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-primary/40" />
              <span className="text-sm text-white/30">Powered by the <span className="text-primary/60">GalaxaTech</span> intelligence layer</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Selected Work — glassmorphic folder ───────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #080618 50%, #05030F 100%)' }}>
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
              {/* Folder body — rendered FIRST so it's behind cards in DOM, then z-index controls visibility */}
              <div
                className="absolute bottom-0 left-0 right-0 rounded-2xl"
                style={{
                  height: '260px',
                  ...GLASS_STYLE,
                  borderColor: folderHovered ? 'rgba(124,42,235,0.5)' : 'rgba(255,255,255,0.15)',
                  boxShadow: folderHovered ? '0 0 80px rgba(124,42,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' : GLASS_STYLE.boxShadow,
                  transition: '0.5s cubic-bezier(.2,.7,.2,1)',
                  borderRadius: '4px 24px 24px 24px',
                  zIndex: folderHovered ? 2 : 8,
                }}
              >
                {/* Folder tab */}
                <div className="absolute -top-[24px] left-0 h-6 w-28 rounded-t-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderBottom: 'none' }} />
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

              {/* Fan-out project cards — layered above folder on hover */}
              {PROJECTS.map((proj, i) => {
                const fan = [
                  'translateX(-220px) translateY(0px) rotate(-16deg)',
                  'translateX(0px) translateY(-40px) rotate(0deg)',
                  'translateX(220px) translateY(0px) rotate(16deg)',
                ];
                const stack = [
                  'translateX(-60px) translateY(120px) rotate(-6deg)',
                  'translateX(0px) translateY(100px) rotate(0deg)',
                  'translateX(60px) translateY(120px) rotate(6deg)',
                ];
                const cardZ = folderHovered ? [10, 12, 11][i] : [3, 5, 4][i];
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
                      zIndex: cardZ,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid rgba(167,139,250,0.4)',
                      boxShadow: folderHovered ? '0 12px 40px rgba(124,42,235,0.6)' : '0 0 25px -5px rgba(124,42,235,0.5)',
                    }}
                  >
                    <div className="h-3/5 relative flex items-center justify-center" style={{ background: proj.bg }}>
                      <Globe className="w-10 h-10 opacity-20" style={{ color: proj.color }} />
                      <span className="absolute top-3 left-3 text-[10px] font-mono text-white/50">{proj.num}</span>
                    </div>
                    <div className="p-3 h-2/5" style={{ background: 'rgba(10,8,37,0.95)' }}>
                      <p className="text-white font-bold text-sm leading-tight mb-0.5" style={{ fontFamily: 'Satoshi, sans-serif' }}>{proj.name}</p>
                      <p className="text-white/40 text-[11px]">{proj.type}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-white/25 text-[11px] font-mono mt-6">Hover to reveal</p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ — two-column with icons ───────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #0A0825 60%, #05030F 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 mb-5" style={{ background: 'rgba(124,42,235,0.08)' }}>
              <HelpCircle className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary/70 uppercase">FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>Common <span style={{ color: '#B58DFF' }}>Questions</span></h2>
            <p className="text-white/40 text-base">Everything you need to know before working with us.</p>
          </motion.div>

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
                      <h3 className="text-white font-bold text-base leading-snug" style={{ fontFamily: 'Satoshi, sans-serif' }}>{FAQS[activeFAQ].q}</h3>
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
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #05030F 0%, #080620 50%, #05030F 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25" style={{ background: 'rgba(124,42,235,0.08)' }}>
              <Sparkles className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary/70 uppercase">Builders Community</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Wanna join the<br /><span style={{ color: '#B58DFF' }}>Galaxa team?</span>
          </h2>
          <p className="text-white/50 text-base mb-10 leading-relaxed max-w-md mx-auto">
            Toggle in to join our builders/newsletter community and hear about opportunities first.
          </p>

          {/* Toggle pill */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative flex items-center rounded-full p-1 cursor-pointer select-none hover:scale-[1.03] active:scale-[0.98]"
              style={{ width: '280px', height: '52px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', transition: 'transform 0.2s ease' }}
              onClick={handleToggle}
            >
              {/* Knob */}
              <div style={{ position: 'absolute', top: '4px', left: '4px', width: '130px', height: '42px', borderRadius: '999px', background: 'linear-gradient(135deg,#5E29E8,#7C2AEB)', boxShadow: '0 4px 24px rgba(124,42,235,0.55)', transform: toggled ? 'translateX(138px)' : 'translateX(0px)', transition: '0.35s cubic-bezier(.2,.7,.2,1)' }} />
              <span className="relative z-10 flex-1 text-center text-xs font-bold" style={{ color: toggled ? 'rgba(255,255,255,0.3)' : 'white' }}>Not yet</span>
              <span className="relative z-10 flex-1 text-center text-xs font-bold" style={{ color: toggled ? 'white' : 'rgba(255,255,255,0.3)' }}>Yes, I'm in</span>
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
                style={{ ...GLASS_STYLE, borderRadius: '24px', padding: '32px', borderColor: 'rgba(124,42,235,0.45)', boxShadow: '0 0 80px rgba(124,42,235,0.35), inset 0 1px 0 rgba(255,255,255,0.1)' }}
              >
                <button
                  onClick={() => setCircleModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>

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
                        placeholder="you@example.com"
                        value={subEmail}
                        onChange={e => setSubEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
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
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

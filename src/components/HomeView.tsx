import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  ChevronDown,
  Laptop,
  Smartphone,
  TrendingUp,
  Cpu,
  Brush,
  Workflow,
  Globe,
  MessageCircle,
  Phone
} from 'lucide-react';
import heroLaptopDashboard from '../assets/images/hero_laptop_dashboard_1780081071809.png';

interface HomeViewProps {
  isDhakaOpen: boolean;
  dhakaTime: string;
  currentUser: any | null;
}

const TYPEWRITER_WORDS = ['Website Presence', 'Social Media Engagement', 'Client conversion'];

const SERVICES = [
  { icon: Laptop,     label: 'Web Development',             desc: 'Performant, scalable websites and web apps.',         anchor: 'web-development',    color: 'orange' },
  { icon: Smartphone, label: 'App Development',             desc: 'Cross-platform mobile applications.',                  anchor: 'app-development',    color: 'blue' },
  { icon: TrendingUp, label: 'Social Media & Content',      desc: 'Strategy, content creation, and growth systems.',     anchor: 'social-media',       color: 'pink' },
  { icon: Cpu,        label: 'AI & Automation',             desc: 'Intelligent workflows that eliminate manual work.',   anchor: 'ai-automation',      color: 'purple' },
  { icon: Brush,      label: 'Brand Identity & Design',     desc: 'Visual systems that make your brand unforgettable.',  anchor: 'brand-identity',     color: 'yellow' },
  { icon: Workflow,   label: 'Systems & Workflow Consulting', desc: 'Notion, process, and operations architecture.',    anchor: 'systems-consulting', color: 'emerald' },
];

const CARD_COLORS: Record<string, string> = {
  orange:  'text-orange-400 bg-orange-500/10 border-orange-500/20',
  blue:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
  pink:    'text-pink-400 bg-pink-500/10 border-pink-500/20',
  purple:  'text-purple-400 bg-purple-500/10 border-purple-500/20',
  yellow:  'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const PROCESS_STEPS = [
  { num: '01', title: 'Discover',          desc: 'We understand your goals, audience, and gaps.' },
  { num: '02', title: 'Strategize',        desc: 'We architect the solution before touching code.' },
  { num: '03', title: 'Build',             desc: 'Our team executes with speed and precision.' },
  { num: '04', title: 'Deploy & Optimize', desc: 'Launch, monitor, and continuously improve.' },
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
    services: ['Web Development', 'App Development', 'Systems Integration'],
    desc: 'E-commerce web platform + Flutter app with unified Supabase backend and Stripe payments.',
  },
  {
    slug: 'salfas-bazar',
    name: 'Salfas Bazar',
    clientType: 'Organic Food Business',
    country: '🇧🇩',
    services: ['Brand Identity & Design', 'Web Development'],
    desc: 'Full brand kit and website for an organic food brand highlighting natural quality and trust.',
  },
];

const FAQS = [
  { q: 'What kind of businesses do you work with?', a: 'We work with startups, SMEs, and established businesses across 6 countries, primarily in tech, e-commerce, and service industries.' },
  { q: 'How long does a typical project take?', a: 'Timelines vary by scope. A website takes 2–4 weeks; a full app can take 6–10 weeks. We agree on timelines upfront.' },
  { q: 'How does pricing work?', a: 'Projects are quoted individually based on scope. We provide a detailed proposal before any agreement is signed.' },
  { q: 'What is the Galaxa Builders Program?', a: 'GBP is our execution ecosystem for students. Real projects, real tasks, real output. Not a course — an experience.' },
  { q: 'How do I track my project?', a: 'Every client gets access to a dedicated Client Hub — a private dashboard with live progress, updates, documents, and direct team contact.' },
  { q: 'Can I book a free consultation?', a: 'Yes. Book an audit or reach out via WhatsApp. We\'ll respond within 24 hours.' },
];

export default function HomeView({ isDhakaOpen, dhakaTime, currentUser }: HomeViewProps) {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);
  const [buildMins, setBuildMins] = useState(42);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

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

      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 select-none overflow-hidden bg-[#0b1326]">
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
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1326] via-[#8b2cff]/6 to-[#ff2c6d]/6 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#0b1326] via-[#0b1326]/90 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#8b2cff]/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0b1326] to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#8b2cff]/12 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[350px] h-[350px] bg-[#ff2c6d]/10 blur-[90px] rounded-full pointer-events-none" />
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

      {/* ── Stats Strip ────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-[#0b1326]">
        <div className="max-w-7xl mx-auto px-6 py-6 overflow-x-auto">
          <div className="flex items-center min-w-max gap-0 divide-x divide-white/10 mx-auto md:justify-center">
            {[
              { label: 'Founded', value: '2023' },
              { label: 'Countries Served', value: '6', sub: 'USA · UK · Pakistan · Saudi Arabia · India · Bangladesh' },
              { label: 'Projects Delivered', value: '3+' },
              { label: 'Builders in Program', value: 'Growing' },
            ].map((stat) => (
              <div key={stat.label} className="px-8 py-2 text-center min-w-[140px]">
                <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
                <p className="text-xs text-white/50 font-medium mt-0.5">{stat.label}</p>
                {stat.sub && <p className="text-[10px] text-white/30 mt-0.5 leading-tight">{stat.sub}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Build ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>What We Build</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">End-to-end digital systems — from strategy to deployment.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc) => (
              <button
                key={svc.anchor}
                onClick={() => navigate(`/services#${svc.anchor}`)}
                className="glass-card rounded-2xl p-6 text-left group hover:border-primary/30 hover:shadow-[0_0_30px_rgba(139,44,255,0.12)] transition-all duration-300 cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-4 ${CARD_COLORS[svc.color]}`}>
                  <svc.icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-primary transition-colors">{svc.label}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{svc.desc}</p>
                <div className="flex items-center gap-1.5 mt-4 text-xs text-primary/70 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── How We Work ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#070d1f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>How We Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center md:items-center">
                <div className="w-14 h-14 rounded-full border-2 border-primary/40 bg-primary/10 flex items-center justify-center mb-5 relative z-10">
                  <span className="text-lg font-bold text-primary" style={{ fontFamily: 'Syne, sans-serif' }}>{step.num}</span>
                </div>
                {/* Vertical connector — mobile only */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="md:hidden w-px h-8 bg-primary/20 mb-4" />
                )}
                <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Selected Work ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Selected Work</h2>
            <p className="text-white/60 text-lg">Real projects. Real clients. Real results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROJECTS.map((proj) => (
              <div key={proj.slug} className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300">
                {/* TODO: replace placeholder with actual screenshot */}
                <div className="h-44 bg-gradient-to-br from-primary/20 via-[#0b1326] to-secondary/20 flex items-center justify-center relative overflow-hidden">
                  <Globe className="w-12 h-12 text-primary/30" />
                  <div className="absolute top-3 right-3 text-xl">{proj.country}</div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1">{proj.clientType}</p>
                  <h3 className="text-white font-bold text-lg mb-3">{proj.name}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{proj.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.services.map(s => (
                      <span key={s} className="text-[10px] bg-primary/10 text-primary/80 border border-primary/20 rounded-full px-2.5 py-0.5 font-medium">{s}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/portfolio/${proj.slug}`)}
                    className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:gap-2.5 transition-all"
                  >
                    View Case Study <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#070d1f]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Common Questions</h2>
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

      {/* ── Closing CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/6 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>Ready to build something real?</h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed">Start with a free audit — we'll tell you exactly where your brand stands.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/audit')}
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(139,44,255,0.35)] hover:shadow-[0_8px_40px_rgba(139,44,255,0.5)]"
            >
              Book a Free Audit
            </button>
            <a
              href="https://wa.me/8801959209103"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-primary/40 hover:border-primary text-white font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
          <p className="text-white/30 text-sm mt-6">No commitment. No spam. Just clarity.</p>
        </div>
      </section>
    </div>
  );
}

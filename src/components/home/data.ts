import {
  Workflow, Rocket, Users, Globe, MessageCircle,
  Clock, DollarSign, BookOpen, Monitor, PhoneCall,
  Package, ShoppingBasket, Zap, FolderOpen, Lock,
} from 'lucide-react';

// ── Lifted near-verbatim from the dormant src/components/HomeView.tsx ──────────

export const WHY_CHOOSE_US = [
  { icon: Workflow,      title: 'Systems-First Approach',              desc: 'We architect before we build — strategy is never an afterthought.' },
  { icon: Rocket,        title: 'End-to-End Delivery',                 desc: 'From strategy through deployment, one team owns the entire journey.' },
  { icon: Users,         title: 'Builders Mindset',                    desc: 'We run our own builder program — execution is in our DNA.' },
  { icon: Globe,         title: 'Global Standards, Local Understanding', desc: 'Serving clients across continents with cultural context built in.' },
  { icon: MessageCircle, title: 'Fast, Transparent Communication',     desc: 'WhatsApp-first, real-time updates — you are never left guessing.' },
];

export const COUNTRIES = [
  { flag: '🇺🇸', name: 'USA',          code: 'us' },
  { flag: '🇬🇧', name: 'UK',           code: 'gb' },
  { flag: '🇵🇰', name: 'Pakistan',     code: 'pk' },
  { flag: '🇸🇦', name: 'Saudi Arabia', code: 'sa' },
  { flag: '🇮🇳', name: 'India',        code: 'in' },
  { flag: '🇧🇩', name: 'Bangladesh',   code: 'bd' },
];

export const FAQS = [
  { icon: Users,         q: 'What kind of businesses do you work with?', a: 'We work with startups, SMEs, and established businesses across multiple countries, primarily in tech, e-commerce, and service industries.' },
  { icon: Clock,         q: 'How long does a typical project take?',     a: 'Timelines vary by scope. A website takes 2–4 weeks; a full app can take 6–10 weeks. We agree on timelines upfront.' },
  { icon: DollarSign,    q: 'How does pricing work?',                    a: 'Projects are quoted individually based on scope. We provide a detailed proposal before any agreement is signed.' },
  { icon: BookOpen,      q: 'What is the Galaxa Builders Program?',      a: 'GBP is our execution ecosystem for students. Real projects, real tasks, real output. Not a course — an experience.' },
  { icon: Monitor,       q: 'How do I track my project?',                a: 'Every client gets access to a dedicated Client Hub — a private dashboard with live progress, updates, documents, and direct team contact.' },
  { icon: PhoneCall,     q: 'Can I book a free consultation?',           a: "Yes. Book an audit or reach out via WhatsApp. We'll respond within 24 hours." },
];

export const PROJECTS = [
  { slug: 'harmans-trading', num: '01', name: 'Harmans Trading', type: 'Trading Platform',      ground: '#FF4D06', ink: '#0B0B0B', icon: Monitor,        img: null as string | null },
  { slug: 'sunnah-grandeur',  num: '02', name: 'Sunnah Grandeur', type: 'E-Commerce Platform',   ground: '#0B0B0B', ink: '#F2ECE6', icon: Package,        img: null as string | null },
  { slug: 'salfas-bazar',     num: '03', name: 'Salfas Bazar',    type: 'Organic Food Platform', ground: '#F2ECE6', ink: '#0B0B0B', icon: ShoppingBasket, img: null as string | null },
];

// ── New content: no dormant equivalent, art-directed copy carried over as real DOM ──

export const SERVICES_STATS = [
  { value: 10, suffix: 'X', decimals: 0, label: 'Faster' },
  { value: 3, suffix: '', decimals: 0, label: 'The Cost', display: '1/3' },
  { value: 100, suffix: '%', decimals: 0, label: 'Focus On Ideas' },
];

export const PROCESS_FEATURES = [
  { icon: Zap,           title: 'Real-Time Tracking',   desc: 'Track progress. Stay ahead. Always in the loop.' },
  { icon: FolderOpen,    title: 'Asset Access',         desc: 'All files. All assets. One click away.' },
  { icon: MessageCircle, title: 'Direct Communication', desc: 'Talk to your team. Get answers. Fast.' },
  { icon: Lock,          title: 'Secure & Private',     desc: 'Your data. Protected. Always.' },
];

export const BILLBOARD_FRAMES = [
  { headline: "POSTING ISN'T", accent: 'MARKETING THEN?', tint: 'dusk' as const },
  { headline: 'WE CURATE', accent: 'BRANDS!', tint: 'night' as const },
];

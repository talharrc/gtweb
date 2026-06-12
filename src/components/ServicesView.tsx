import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Laptop, Smartphone, TrendingUp, Cpu, Brush, Workflow, ArrowUpRight, CheckCircle } from 'lucide-react';

const SERVICES = [
  {
    id: 'web-development',
    icon: Laptop,
    iconColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    title: 'Web Development',
    subtitle: 'Performant, scalable websites and web applications.',
    description: [
      'We build custom websites, landing pages, and full web applications that are fast, beautiful, and built to convert. Every pixel is intentional, every line of code is optimized for performance and maintainability.',
      'Our web projects use modern technologies — React, Next.js, TypeScript, and Tailwind CSS — and are always mobile-first, accessible, and production-ready.',
    ],
    included: [
      'Custom design and development',
      'Mobile-first responsive layout',
      'SEO foundation and performance optimization',
      'Deployment and hosting setup',
      'CMS integration (if needed)',
    ],
    forWho: 'Businesses needing a credible, fast, scalable digital presence',
  },
  {
    id: 'app-development',
    icon: Smartphone,
    iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    title: 'App Development',
    subtitle: 'Cross-platform mobile applications that reach every user.',
    description: [
      'We design and build cross-platform mobile applications using Flutter — a single codebase that runs natively on both iOS and Android. You get one team, one codebase, and two fully native apps.',
      'From UI/UX design through to Play Store and App Store deployment, we manage the entire product lifecycle.',
    ],
    included: [
      'UI/UX design for mobile',
      'Flutter cross-platform development',
      'Backend API integration',
      'Play Store & App Store submission',
      'Push notifications and analytics',
    ],
    forWho: 'Businesses needing a mobile product to reach their customers on the go',
  },
  {
    id: 'social-media',
    icon: TrendingUp,
    iconColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    title: 'Social Media & Content',
    subtitle: 'Strategy, content creation, and growth systems that compound.',
    description: [
      'Consistent, strategic social media presence is one of the highest-leverage things a modern business can invest in. We handle everything — from platform strategy and content calendars to post creation (graphic + copy) and growth management.',
      'You stay focused on running your business. We keep your brand visible, relevant, and growing.',
    ],
    included: [
      'Platform strategy and content calendar',
      'Graphic design and copywriting for posts',
      'Community engagement management',
      'Monthly reporting and growth analysis',
      'Paid campaign setup and management',
    ],
    forWho: 'Brands that want consistent, engaging social presence without managing it themselves',
  },
  {
    id: 'ai-automation',
    icon: Cpu,
    iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'AI & Automation',
    subtitle: 'Intelligent workflows that eliminate manual work at scale.',
    description: [
      'Manual, repetitive work is expensive — it costs your team time, energy, and focus. We design and implement workflow automation systems using modern AI APIs and platforms that handle the repetitive so your team can focus on what matters.',
      'From AI-powered lead capture and follow-up, to automated reporting and internal operations assistants, we build systems that genuinely work.',
    ],
    included: [
      'Workflow audit and automation mapping',
      'AI API integration (OpenAI, Gemini, etc.)',
      'Zapier / Make / n8n automation setup',
      'Custom AI agent development',
      'Documentation and team training',
    ],
    forWho: 'Teams wasting time on repetitive tasks that should be automated',
  },
  {
    id: 'brand-identity',
    icon: Brush,
    iconColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    title: 'Brand Identity & Design',
    subtitle: 'Visual systems that make your brand unforgettable.',
    description: [
      'Your brand is not just your logo. It is the complete visual language your business speaks — across every touchpoint, every screen, every moment of contact with your customer. We build that language from the ground up.',
      "From logo design through to a full brand guidelines document, we create systems that scale — so your brand looks professional whether it's on a business card or a billboard.",
    ],
    included: [
      'Logo design (primary + variants)',
      'Color system and typography selection',
      'Brand guidelines document',
      'Business card and letterhead design',
      'Social media brand kit',
    ],
    forWho: 'Businesses building or refreshing their brand from scratch',
  },
  {
    id: 'systems-consulting',
    icon: Workflow,
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'Systems & Workflow Consulting',
    subtitle: 'Notion, process, and operations architecture for teams that want clarity.',
    description: [
      'Growth without structure creates chaos. We work with teams to design and document their internal operating systems — from Notion workspace architecture and SOPs to full business process documentation.',
      "If your team is growing but your processes haven't caught up, this is where to start. Clear systems mean faster onboarding, fewer errors, and more consistent output.",
    ],
    included: [
      'Notion workspace design and build',
      'SOP documentation (Standard Operating Procedures)',
      'Team onboarding process design',
      'Project and task management system setup',
      'Operations audit and recommendations',
    ],
    forWho: 'Teams that need clarity and structure in how they work and operate',
  },
];

export default function ServicesView() {
  const navigate = useNavigate();

  return (
    <div className="relative pt-32 pb-24">
      <Helmet>
        <title>Services — GalaxaTech</title>
        <meta name="description" content="End-to-end digital services: Web Development, App Development, Social Media, AI & Automation, Brand Identity, and Systems Consulting." />
        <meta property="og:title" content="Services — GalaxaTech" />
      </Helmet>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: 'Satoshi, sans-serif' }}>Our Expertise</h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
          Everything your brand needs to grow — strategy, design, development, and automation — delivered as one integrated system.
        </p>
      </div>

      {/* Service Sections */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
        {SERVICES.map((svc, idx) => (
          <div
            key={svc.id}
            id={svc.id}
            className="glass-card rounded-3xl p-8 md:p-12 scroll-mt-32"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Left */}
              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 ${svc.iconColor}`}>
                  <svc.icon className="w-7 h-7" />
                </div>
                <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">0{idx + 1}</div>
                <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>{svc.title}</h2>
                <p className="text-white/60 text-base mb-6 leading-relaxed font-medium">{svc.subtitle}</p>
                {svc.description.map((para, i) => (
                  <p key={i} className="text-white/50 text-sm leading-relaxed mb-4">{para}</p>
                ))}
              </div>
              {/* Right */}
              <div className="lg:pl-8">
                <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">What's Included</h3>
                <ul className="flex flex-col gap-3 mb-8">
                  {svc.included.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-white/70 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Who It's For</p>
                  <p className="text-white/70 text-sm leading-relaxed">{svc.forWho}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-6 mt-20 text-center">
        <div className="glass-card rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>Not sure which service you need?</h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">Book a free audit. We'll look at your current digital presence and tell you exactly what will move the needle.</p>
          <button
            onClick={() => navigate('/audit')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(124,42,235,0.35)]"
          >
            Book a Free Audit <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

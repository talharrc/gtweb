import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight, ArrowLeft, Globe, Layers, Code, Target } from 'lucide-react';

interface CaseStudy {
  name: string;
  clientType: string;
  country: string;
  services: string[];
  challenge: string;
  solution: string;
  stack: string[];
  result: string;
}

const CASE_STUDIES: Record<string, CaseStudy> = {
  'harmans-trading': {
    name: 'Harmans Trading',
    clientType: 'Manpower Recruitment Firm — Saudi Arabia',
    country: '🇸🇦',
    services: ['Web Development', 'Brand Identity'],
    challenge: 'Harmans Trading needed a professional corporate website to serve clients across multiple regions — specifically Arabic-speaking, Bengali-speaking, and English-speaking markets. Their old presence was non-existent digitally, making it difficult to attract international clients or establish credibility with overseas partners.',
    solution: 'We built a fully multilingual website with three complete language versions: English, Bengali, and Arabic — including a full RTL (right-to-left) layout for Arabic audiences. The site showcases their services, credibility, and regional reach in a professional format that works across devices and languages.',
    stack: ['React', 'Multilingual Routing', 'RTL CSS Architecture', 'Tailwind CSS', 'Vercel'],
    result: 'A professional digital presence that enables Harmans Trading to credibly reach international clients across three language markets simultaneously, with a consistent brand experience in each.',
    // TODO: owner to provide live URL and screenshots
  },
  'sunnah-grandeur': {
    name: 'Sunnah Grandeur',
    clientType: 'Islamic Lifestyle E-Commerce — Bangladesh',
    country: '🇧🇩',
    services: ['Web Development', 'App Development', 'Systems Integration'],
    challenge: 'The client needed two products — a full e-commerce website and an Islamic utility mobile app — but managing two separate systems with two separate backends and two admin panels would have been operationally complex and expensive.',
    solution: 'We built both products — an e-commerce web platform and a Flutter mobile app — on a single shared Supabase backend. One database, one admin panel, two live products. We integrated Stripe for payments and designed the system so that a single admin action updates both the web and app simultaneously.',
    stack: ['Next.js 14', 'Flutter', 'Supabase', 'Stripe', 'TypeScript', 'Tailwind CSS'],
    result: 'Two live products — web and app — running on one integrated backend, cutting operational complexity in half and giving the client a single point of control for both products.',
    // TODO: owner to provide live URL and screenshots
  },
  'salfas-bazar': {
    name: 'Salfas Bazar',
    clientType: 'Organic Food Business — Bangladesh',
    country: '🇧🇩',
    services: ['Brand Identity & Design', 'Web Development'],
    challenge: 'An organic food brand needed a complete visual identity and a website that communicated natural quality and trust to local consumers. They were operating without any consistent branding, making it difficult to differentiate themselves in a competitive market.',
    solution: 'We started with a full brand identity system — logo, color palette, typography, and brand guidelines — that captured the organic, trustworthy, and natural essence of their products. We then applied this brand system consistently across a website that highlights their product range and makes it easy for customers to learn about and purchase their products.',
    stack: ['React', 'Tailwind CSS', 'Brand System Implementation', 'Figma'],
    result: 'A cohesive brand identity and website that communicates trust and natural quality consistently across all touchpoints — from packaging to digital.',
    // TODO: owner to provide screenshots and live URL
  },
};

export default function PortfolioCaseStudy() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? CASE_STUDIES[slug] : null;

  if (!study) return <Navigate to="/portfolio" replace />;

  return (
    <div className="relative pt-32 pb-24">
      <Helmet>
        <title>{study.name} — GalaxaTech Portfolio</title>
        <meta name="description" content={`Case study: ${study.name} — ${study.clientType}. ${study.result}`} />
        <meta property="og:title" content={`${study.name} — GalaxaTech`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-6">
        {/* Back link */}
        <button
          onClick={() => navigate('/portfolio')}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </button>

        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{study.country}</span>
            <p className="text-xs font-mono text-white/35 uppercase tracking-widest">{study.clientType}</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>{study.name}</h1>
          <div className="flex flex-wrap gap-2">
            {study.services.map((s) => (
              <span key={s} className="text-xs bg-primary/10 text-primary/80 border border-primary/20 rounded-full px-3 py-1 font-medium">{s}</span>
            ))}
          </div>
        </div>

        {/* Placeholder visual area */}
        {/* TODO: owner to provide real screenshots — replace the placeholder below */}
        <div className="h-64 md:h-80 glass-card rounded-3xl flex items-center justify-center mb-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15" />
          <div className="text-center relative z-10">
            <Globe className="w-16 h-16 text-primary/30 mx-auto mb-3" />
            <p className="text-white/30 text-sm font-mono">Project screenshots coming soon</p>
          </div>
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-10">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>The Challenge</h2>
            </div>
            <p className="text-white/60 leading-relaxed">{study.challenge}</p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>The Solution</h2>
            </div>
            <p className="text-white/60 leading-relaxed">{study.solution}</p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Code className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>Stack & Tools</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {study.stack.map((tech) => (
                <span key={tech} className="text-xs font-mono bg-white/5 text-white/60 border border-white/10 rounded-lg px-3 py-1.5">{tech}</span>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 border-primary/20">
            <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>The Result</h2>
            <p className="text-white/70 leading-relaxed text-base">{study.result}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center glass-card rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>Work with us</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">Ready to build your own case study? Start with a free audit.</p>
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

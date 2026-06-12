import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Globe, ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  {
    slug: 'harmans-trading',
    name: 'Harmans Trading',
    clientType: 'Manpower Recruitment Firm',
    country: '🇸🇦',
    countryName: 'Saudi Arabia',
    services: ['Web Development', 'Brand Identity'],
    desc: 'A professional multilingual corporate website serving clients in Arabic-speaking, Bengali-speaking, and English-speaking markets — with full RTL support.',
  },
  {
    slug: 'sunnah-grandeur',
    name: 'Sunnah Grandeur',
    clientType: 'Islamic Lifestyle E-Commerce',
    country: '🇧🇩',
    countryName: 'Bangladesh',
    services: ['Web Development', 'App Development', 'Systems Integration'],
    desc: 'E-commerce web platform + Flutter mobile app sharing a unified Supabase backend and single admin panel — two live products, one integrated system.',
  },
  {
    slug: 'salfas-bazar',
    name: 'Salfas Bazar',
    clientType: 'Organic Food Business',
    country: '🇧🇩',
    countryName: 'Bangladesh',
    services: ['Brand Identity & Design', 'Web Development'],
    desc: 'Full brand identity kit (logo, color system, typography) followed by a website that applied the brand system consistently to communicate natural quality.',
  },
];

export default function PortfolioView() {
  const navigate = useNavigate();

  return (
    <div className="relative pt-32 pb-24">
      <Helmet>
        <title>Portfolio — GalaxaTech</title>
        <meta name="description" content="Selected work from GalaxaTech — real projects, real clients, real results across web, app, brand, and systems." />
        <meta property="og:title" content="Portfolio — GalaxaTech" />
      </Helmet>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: 'Satoshi, sans-serif' }}>Selected Work</h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">Real projects. Real clients. Real results.</p>
      </div>

      {/* Project Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROJECTS.map((proj) => (
          <div key={proj.slug} className="glass-card rounded-2xl overflow-hidden flex flex-col hover:border-primary/30 hover:shadow-[0_0_30px_rgba(124,42,235,0.1)] transition-all duration-300 group">
            {/* Placeholder image — TODO: owner to provide real screenshots */}
            <div className="h-48 bg-gradient-to-br from-primary/20 via-[#05030F] to-secondary/20 flex items-center justify-center relative overflow-hidden">
              <Globe className="w-14 h-14 text-primary/25" />
              <div className="absolute top-4 left-4">
                <span className="text-2xl">{proj.country}</span>
              </div>
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">{proj.countryName}</div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <p className="text-[10px] font-mono text-white/35 uppercase tracking-widest mb-1">{proj.clientType}</p>
              <h2 className="text-white font-bold text-xl mb-3 group-hover:text-primary transition-colors">{proj.name}</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">{proj.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {proj.services.map((s) => (
                  <span key={s} className="text-[10px] bg-primary/10 text-primary/80 border border-primary/20 rounded-full px-2.5 py-0.5 font-medium">{s}</span>
                ))}
              </div>
              <button
                onClick={() => navigate(`/portfolio/${proj.slug}`)}
                className="flex items-center gap-2 text-sm text-primary font-semibold hover:gap-3 transition-all mt-auto"
              >
                View Case Study <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { collection, onSnapshot } from 'firebase/firestore';
import { ArrowUpRight, ArrowLeft, Globe, Layers, Code, Target, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { PortfolioItem } from '../types';

export default function PortfolioCaseStudy() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'portfolio'), s => {
      setItems(s.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioItem)));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  const study = items.find(i => i.slug === slug);
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
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>{study.name}</h1>
          <div className="flex flex-wrap gap-2">
            {study.services.map((s) => (
              <span key={s} className="text-xs bg-primary/10 text-primary/80 border border-primary/20 rounded-full px-3 py-1 font-medium">{s}</span>
            ))}
          </div>
        </div>

        {/* Visual area — real images if attached, placeholder otherwise */}
        {study.images?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            {study.images.map((url) => (
              <div key={url} className="rounded-2xl overflow-hidden glass-card">
                <img src={url} alt={study.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 md:h-80 glass-card rounded-3xl flex items-center justify-center mb-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15" />
            <div className="text-center relative z-10">
              <Globe className="w-16 h-16 text-primary/30 mx-auto mb-3" />
              <p className="text-white/30 text-sm font-mono">Project screenshots coming soon</p>
            </div>
          </div>
        )}

        {/* Content sections */}
        <div className="flex flex-col gap-10">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>The Challenge</h2>
            </div>
            <p className="text-white/60 leading-relaxed">{study.challenge}</p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>The Solution</h2>
            </div>
            <p className="text-white/60 leading-relaxed">{study.solution}</p>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Code className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Stack & Tools</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {study.stack.map((tech) => (
                <span key={tech} className="text-xs font-mono bg-white/5 text-white/60 border border-white/10 rounded-lg px-3 py-1.5">{tech}</span>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 border-primary/20">
            <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>The Result</h2>
            <p className="text-white/70 leading-relaxed text-base">{study.result}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center glass-card rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>Work with us</h2>
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

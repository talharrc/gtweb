import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight, MessageCircle, Cpu, Layers, Hammer } from 'lucide-react';

export default function AboutView() {
  const navigate = useNavigate();

  return (
    <div className="relative pt-24 sm:pt-32 pb-16 sm:pb-24">
      <Helmet>
        <title>About — GalaxaTech</title>
        <meta name="description" content="GalaxaTech is a systems-driven creative tech agency from Dhaka, building digital ecosystems for brands across 6 countries." />
        <meta property="og:title" content="About — GalaxaTech" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Hero heading */}
        <div className="text-center mb-12 sm:mb-20">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-5" style={{ fontFamily: 'var(--font-display)' }}>We are GalaxaTech.</h1>
          <p className="text-white/60 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
            A systems-driven creative tech agency from Dhaka, building digital ecosystems for brands across 6 countries.
          </p>
        </div>

        {/* Section 1 — The Mission */}
        <div className="glass-card rounded-3xl p-10 md:p-14 mb-10">
          <div className="text-xs font-mono text-primary/60 uppercase tracking-widest mb-4">Our Mission</div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6 sm:mb-8" style={{ fontFamily: 'var(--font-display)' }}>"Ecosystems, Optimized."</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <p className="text-white/60 leading-relaxed">
              GalaxaTech was built on the belief that most businesses don't need more tools — they need a smarter system. We design, build, and optimize digital ecosystems that work together: your website, your app, your brand, your social presence, your workflows — as one unified, high-performance machine.
            </p>
            <p className="text-white/60 leading-relaxed">
              Based in Dhaka, operating globally, we've delivered projects for clients in Saudi Arabia, India, the UK, the USA, Pakistan, and Bangladesh. Every project we take on is treated as a long-term system, not a short-term transaction.
            </p>
          </div>
        </div>

        {/* Section 2 — Why We're Different */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>Why We're Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu,
                iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                title: 'Systems First',
                desc: 'We architect before we build. Every decision is made within the context of how it fits into the whole — your full digital ecosystem, not just the single deliverable in front of us.',
              },
              {
                icon: Layers,
                iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                title: 'End-to-End',
                desc: 'Strategy through deployment, one team. From the first discovery call to the live product, you work with us — not a chain of freelancers or disconnected handoffs.',
              },
              {
                icon: Hammer,
                iconColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
                title: 'Builders Mindset',
                desc: 'We run our own internal builder program. We know what it takes to build — because we do it every day, on real client projects, with real accountability.',
              },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-7">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${item.iconColor}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 — GBP Teaser */}
        <div className="glass-card rounded-3xl p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="text-xs font-mono text-emerald-400/70 uppercase tracking-widest mb-4">The Galaxa Builders Program</div>
            <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>We built a program where students work on real projects.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
              <p className="text-white/60 leading-relaxed">
                Not practice exercises. Not case studies from a textbook. Real client projects, real task assignments, real accountability. The best builders join our core team. That's how we hire.
              </p>
              <p className="text-white/60 leading-relaxed">
                GBP is our structured exposure system — a way for students to build real skills through doing, and for us to build a talent pipeline we actually trust. Win-win by design, not charity.
              </p>
            </div>
            <button
              onClick={() => navigate('/gbp')}
              className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all"
            >
              Learn about GBP <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 4 — CTA */}
        <div className="text-center glass-card rounded-3xl p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-5" style={{ fontFamily: 'var(--font-display)' }}>Let's build something.</h2>
            <p className="text-white/60 mb-7 sm:mb-10 max-w-md mx-auto">Ready to talk? Start with a free audit or reach out directly on WhatsApp.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/audit')}
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(124,42,235,0.35)]"
              >
                Book an Audit
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
          </div>
        </div>
      </div>
    </div>
  );
}

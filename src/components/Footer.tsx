import { useNavigate } from 'react-router-dom';
import { PageType } from '../types';
import { Facebook, Twitter, Mail, Phone, ArrowUpRight, Sparkles } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: PageType) => void;
  dhakaTime: string;
}

const SERVICE_LINKS = [
  { label: 'Web Development', anchor: 'web-development' },
  { label: 'App Development', anchor: 'app-development' },
  { label: 'Social Media & Content', anchor: 'social-media' },
  { label: 'AI & Automation', anchor: 'ai-automation' },
  { label: 'Brand Identity & Design', anchor: 'brand-identity' },
  { label: 'Systems Consulting', anchor: 'systems-consulting' },
];

export default function Footer({ onPageChange }: FooterProps) {
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: '#070514' }}>
      {/* Glow accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(236,30,142,0.6) 30%, rgba(255,122,69,0.8) 50%, rgba(236,30,142,0.6) 70%, transparent)', boxShadow: '0 0 20px rgba(236,30,142,0.4)' }} />

      {/* Ambient glow blobs */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(236,30,142,0.06) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(236,30,142,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 relative z-10">

        {/* Top: brand hero row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 pb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {/* Logo + tagline */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-md" style={{ background: 'rgba(236,30,142,0.3)', transform: 'scale(1.2)' }} />
              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(236,30,142,0.2)', backdropFilter: 'blur(12px)' }}>
                <img alt="GalaxaTech" className="w-9 h-9 object-contain" src="/logo.png" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl font-bold tracking-tight text-white leading-none mb-1">GalaxaTech</p>
              <p className="text-sm font-mono" style={{ color: '#FF7A45' }}>Ecosystems, Optimized.</p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => go('/audit')}
            className="group flex items-center gap-3 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-[1.04] active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500" style={{ background: 'linear-gradient(135deg,#EC1E8E,#FF7A45)' }}>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </span>
            <span className="text-sm">Book a Free Audit</span>
          </button>
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">

          {/* Column 1 — About */}
          <div>
            <h5 className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#EC1E8E' }}>About</h5>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              A systems-driven creative tech agency from Dhaka, building digital ecosystems for brands worldwide.
            </p>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>Studio active · Dhaka, BD</span>
            </div>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59,130,246,0.15)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(59,130,246,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <Facebook className="w-4 h-4 text-blue-400" />
              </a>
              <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(14,165,233,0.15)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(14,165,233,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <Twitter className="w-4 h-4 text-sky-400" />
              </a>
            </div>
          </div>

          {/* Column 2 — Services */}
          <div>
            <h5 className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#FF7A45' }}>Services</h5>
            <ul className="space-y-3">
              {SERVICE_LINKS.map(({ label, anchor }) => (
                <li key={anchor}>
                  <button
                    onClick={() => go(`/services#${anchor}`)}
                    className="group text-sm text-left flex items-center gap-2 transition-all duration-200"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all group-hover:w-2.5" style={{ background: '#EC1E8E' }} />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h5 className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#B58DFF' }}>Company</h5>
            <ul className="space-y-3">
              {[
                { label: 'About', path: '/about' },
                { label: 'Portfolio', path: '/portfolio' },
                { label: 'Galaxa Builders Program', path: '/gbp' },
                { label: 'Contact', path: '/contact' },
                { label: 'Book an Audit', path: '/audit' },
              ].map(({ label, path }) => (
                <li key={path}>
                  <button
                    onClick={() => go(path)}
                    className="group text-sm text-left flex items-center gap-2 transition-all duration-200"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all group-hover:w-2.5" style={{ background: '#FF7A45' }} />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h5 className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>Contact</h5>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/8801959209103" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-200 group"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <Phone className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  +880 1959 209103
                </a>
              </li>
              <li>
                <a href="mailto:mail.galaxatech@gmail.com"
                  className="flex items-center gap-3 text-sm transition-colors duration-200 group"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(236,30,142,0.1)', border: '1px solid rgba(236,30,142,0.2)' }}>
                    <Mail className="w-3.5 h-3.5" style={{ color: '#EC1E8E' }} />
                  </div>
                  mail.galaxatech@gmail.com
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <Facebook className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
                    <Twitter className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  @galaxatech
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#EC1E8E' }} />
              <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2023–2026 GalaxaTech. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <button onClick={() => go('/privacy')} className="hover:text-white transition-colors cursor-pointer font-mono">Privacy Policy</button>
              <button onClick={() => go('/terms')} className="hover:text-white transition-colors cursor-pointer font-mono">Terms of Service</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.15)' }}>Built with systems-first thinking · Dhaka → World</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

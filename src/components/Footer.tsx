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
    <footer className="relative overflow-hidden bg-[#0B0B0B]">
      {/* Solid brand border at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF4D06]" />

      {/* Ghost Logo Watermark Background (8% opacity) */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] pointer-events-none select-none opacity-8 translate-x-1/4 translate-y-1/4">
        <img src="/logo-light.png" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6 relative z-10">

        {/* Top: brand hero row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 pb-8 border-b border-zinc-800">
          {/* Logo + tagline */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <img alt="GalaxaTech" className="w-9 h-9 object-contain" src="/logo-light.png" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl font-bold tracking-wider text-white uppercase leading-none mb-1.5">GalaxaTech</p>
              <p className="text-xs font-mono uppercase tracking-widest text-[#FF4D06]">Strategy That Drives Growth.</p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => go('/audit')}
            className="group flex items-center gap-3 text-[#0B0B0B] bg-[#FF4D06] hover:bg-[#FF4D06]/90 font-mono font-bold py-3 px-6 transition-all duration-300 btn-square hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="w-6 h-6 bg-[#0B0B0B] text-[#FF4D06] flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs uppercase tracking-widest">Book a Free Audit</span>
          </button>
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">

          {/* Column 1 — About */}
          <div>
            <h5 className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-5 text-[#FF4D06]">About</h5>
            <p className="text-sm leading-relaxed mb-4 text-white/50">
              A systems-driven creative tech agency from Dhaka, building digital ecosystems for brands worldwide.
            </p>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-none bg-green-500 animate-pulse" />
              <span className="text-[11px] font-mono text-white/40">Studio active · Dhaka, BD</span>
            </div>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 rounded-none flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255, 77, 6, 0.15)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#FF4D06'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <Facebook className="w-4 h-4 text-white/60 hover:text-white" />
              </a>
              <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 rounded-none flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255, 77, 6, 0.15)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#FF4D06'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <Twitter className="w-4 h-4 text-white/60 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Column 2 — Services */}
          <div>
            <h5 className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-5 text-[#FF4D06]">Services</h5>
            <ul className="space-y-3">
              {SERVICE_LINKS.map(({ label, anchor }) => (
                <li key={anchor}>
                  <button
                    onClick={() => go(`/services#${anchor}`)}
                    className="group text-sm text-left flex items-center gap-2 transition-all duration-200 text-white/50 hover:text-white"
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
                  >
                    <span className="w-1 h-1 bg-[#FF4D06] flex-shrink-0 transition-all group-hover:w-2" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h5 className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-5 text-[#FF4D06]">Company</h5>
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
                    className="group text-sm text-left flex items-center gap-2 transition-all duration-200 text-white/50 hover:text-white"
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
                  >
                    <span className="w-1 h-1 bg-[#FF4D06] flex-shrink-0 transition-all group-hover:w-2" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h5 className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-5 text-white/40">Contact</h5>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/8801959209103" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-200 group text-white/50 hover:text-white"
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                    <Phone className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  +880 1959 209103
                </a>
              </li>
              <li>
                <a href="mailto:mail.galaxatech@gmail.com"
                  className="flex items-center gap-3 text-sm transition-colors duration-200 group text-white/50 hover:text-white"
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255, 77, 6, 0.06)', border: '1px solid rgba(255, 77, 6, 0.15)' }}>
                    <Mail className="w-3.5 h-3.5 text-[#FF4D06]" />
                  </div>
                  mail.galaxatech@gmail.com
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-200 text-white/50 hover:text-white"
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255, 77, 6, 0.06)', border: '1px solid rgba(255, 77, 6, 0.15)' }}>
                    <Facebook className="w-3.5 h-3.5 text-[#FF4D06]" />
                  </div>
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-colors duration-200 text-white/50 hover:text-white"
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255, 77, 6, 0.06)', border: '1px solid rgba(255, 77, 6, 0.15)' }}>
                    <Twitter className="w-3.5 h-3.5 text-[#FF4D06]" />
                  </div>
                  @galaxatech
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#FF4D06]" />
              <span className="text-xs font-mono text-white/30">© 2023–2026 GalaxaTech. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-5 text-xs text-white/30">
              <button onClick={() => go('/privacy')} className="hover:text-white transition-colors cursor-pointer font-mono">Privacy Policy</button>
              <button onClick={() => go('/terms')} className="hover:text-white transition-colors cursor-pointer font-mono">Terms of Service</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-mono text-white/15">Built with systems-first thinking · Dhaka → World</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

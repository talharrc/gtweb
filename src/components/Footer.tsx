import { useNavigate } from 'react-router-dom';
import { PageType } from '../types';
import brandmarkLogo from '../assets/images/logo.png';
import { Facebook, Twitter, Mail, Phone } from 'lucide-react';

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
    <footer className="bg-[#070d1f] border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/4 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Column 1 — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img alt="GalaxaTech" className="w-9 h-9 rounded-xl object-contain" src={brandmarkLogo} referrerPolicy="no-referrer" />
              <span className="font-display text-xl font-bold tracking-tight text-white">GalaxaTech</span>
            </div>
            <p className="text-sm text-white/40 mb-3 leading-relaxed">Ecosystems, Optimized.</p>
            <p className="text-xs text-white/30 mb-6 leading-relaxed">Dhaka, Bangladesh — serving clients in 6 countries.</p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-blue-500/20 border border-white/10 flex items-center justify-center text-white/50 hover:text-blue-400 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-sky-500/20 border border-white/10 flex items-center justify-center text-white/50 hover:text-sky-400 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 — Services */}
          <div>
            <h5 className="text-xs font-mono font-semibold text-primary uppercase tracking-widest mb-6">Services</h5>
            <ul className="space-y-3">
              {SERVICE_LINKS.map(({ label, anchor }) => (
                <li key={anchor}>
                  <button
                    onClick={() => go(`/services#${anchor}`)}
                    className="text-sm text-white/50 hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h5 className="text-xs font-mono font-semibold text-secondary uppercase tracking-widest mb-6">Company</h5>
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
                    className="text-sm text-white/50 hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h5 className="text-xs font-mono font-semibold text-white/40 uppercase tracking-widest mb-6">Contact</h5>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/8801959209103" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                  +880 1959 209103
                </a>
              </li>
              <li>
                <a href="mailto:mail.galaxatech@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  mail.galaxatech@gmail.com
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  @galaxatech
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/35 tracking-wide mb-2">
            <span>© 2023–2026 GalaxaTech. All rights reserved.</span>
            <div className="flex items-center gap-5">
              <button onClick={() => go('/privacy')} className="hover:text-white/70 transition-colors cursor-pointer">Privacy Policy</button>
              <button onClick={() => go('/terms')} className="hover:text-white/70 transition-colors cursor-pointer">Terms of Service</button>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <button
              onClick={() => navigate('/admin')}
              className="text-white/15 hover:text-white/35 text-[10px] font-mono tracking-widest transition-colors cursor-pointer focus:outline-none"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

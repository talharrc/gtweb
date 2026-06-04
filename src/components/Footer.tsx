import { PageType } from '../types';
import brandmarkLogo from '../assets/images/galaxatech_revised_logo_1780005309031.png';
import { 
  ArrowUpRight, 
  Mail, 
  Linkedin, 
  Github, 
  Twitter, 
  Sparkles,
  Timer
} from 'lucide-react';

interface FooterProps {
  onPageChange: (page: PageType) => void;
  dhakaTime: string;
}

export default function Footer({ onPageChange, dhakaTime }: FooterProps) {
  const handleLinkClick = (page: PageType) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#060d20] border-t border-white/5 relative overflow-hidden">
      {/* Decorative radial blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-4">
              <img 
                alt="GalaxaTech Brandmark" 
                className="w-10 h-10 rounded-xl object-contain" 
                src={brandmarkLogo}
                referrerPolicy="no-referrer"
              />
              <span className="font-display text-xl font-bold tracking-tight text-white">
                GalaxaTech
              </span>
            </div>
            <p className="text-sm text-white/50 max-w-sm mb-6 leading-relaxed">
              Visceral innovation at the intersection of glassmorphism and cyber-minimalism. We engineer high-octane web ecosystems and luxury brand identities that scale.
            </p>
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-xs">
              <Timer className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>Dhaka Studio:</span>
              <span className="text-white font-semibold">{dhakaTime}</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="text-left">
            <h5 className="font-display text-sm font-semibold text-primary uppercase tracking-widest mb-6">Explore</h5>
            <ul className="space-y-3.5 text-sm font-medium">
              <li>
                <button 
                  onClick={() => handleLinkClick('home')}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer focus:outline-none"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('services')}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer focus:outline-none"
                >
                  Core Divisions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('portfolio')}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer focus:outline-none"
                >
                  Visceral Portfolio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('about')}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer focus:outline-none"
                >
                  Our DNA & Team
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Ecosystem Portals */}
          <div className="text-left">
            <h5 className="font-display text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-6">Portals</h5>
            <ul className="space-y-3.5 text-sm font-medium">
              <li>
                <button 
                  onClick={() => handleLinkClick('visitor-hub')}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer focus:outline-none text-left"
                >
                  Visitor Resource Hub
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('client-hub')}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer focus:outline-none text-left"
                >
                  Client Operations Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleLinkClick('builders-program')}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer focus:outline-none text-left"
                >
                  Builders Academy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="text-left font-sans">
            <h5 className="font-display text-sm font-semibold text-secondary uppercase tracking-widest mb-6">Connect</h5>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:hello@galaxatech.com" className="text-white/60 hover:text-white transition-colors">
                  hello@galaxatech.com
                </a>
              </li>
              <li className="flex gap-4.5 pt-3">
                <a href="#github" className="w-[36px] h-[36px] rounded-full bg-white/5 hover:bg-primary/20 hover:text-white flex items-center justify-center border border-white/10 transition-all text-white/50">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#linkedin" className="w-[36px] h-[36px] rounded-full bg-white/5 hover:bg-primary/20 hover:text-white flex items-center justify-center border border-white/10 transition-all text-white/50">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#twitter" className="w-[36px] h-[36px] rounded-full bg-white/5 hover:bg-primary/20 hover:text-white flex items-center justify-center border border-white/10 transition-all text-white/50">
                  <Twitter className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-wide text-white/40">
          <div>
            © {new Date().getFullYear()} GalaxaTech. Built in alignment with the Dhaka Studio Standard.
          </div>
          <div className="flex gap-6 font-medium">
            <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-primary transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

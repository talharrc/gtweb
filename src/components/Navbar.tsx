import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import brandmarkLogo from '../assets/images/gt-logo.jpeg';
import {
  ChevronDown,
  ArrowUpRight,
  Mail,
  Compass,
  Briefcase,
  Users,
  MoreHorizontal,
  Lock,
  BookOpen,
  LogOut,
  Laptop,
  TrendingUp,
  Cpu,
  Brush,
  Settings,
  Smartphone,
  Workflow,
  Facebook,
  Twitter,
  MessageCircle,
  User,
  Home,
  Phone
} from 'lucide-react';
import { PageType } from '../types';
import { clearLocalSession } from '../lib/localAuth';

interface NavbarProps {
  onPageChange: (page: PageType) => void;
  dhakaTime: string;
  isDhakaOpen: boolean;
  currentUser?: any | null;
}

const EXPERTISE_ITEMS = [
  { label: 'Web Development', desc: 'Performant, scalable websites and web apps.', icon: Laptop, color: 'orange', anchor: 'web-development' },
  { label: 'App Development', desc: 'Cross-platform mobile applications.', icon: Smartphone, color: 'blue', anchor: 'app-development' },
  { label: 'Social Media & Content', desc: 'Strategy, content creation, and growth.', icon: TrendingUp, color: 'pink', anchor: 'social-media' },
  { label: 'AI & Automation', desc: 'Intelligent workflows that eliminate manual work.', icon: Cpu, color: 'purple', anchor: 'ai-automation' },
  { label: 'Brand Identity & Design', desc: 'Visual systems that make your brand unforgettable.', icon: Brush, color: 'yellow', anchor: 'brand-identity' },
  { label: 'Systems Consulting', desc: 'Notion, process, and operations architecture.', icon: Workflow, color: 'emerald', anchor: 'systems-consulting' },
];

const COLOR_MAP: Record<string, string> = {
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  blue:   'bg-blue-500/15 text-blue-400 border-blue-500/20',
  pink:   'bg-pink-500/15 text-pink-400 border-pink-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  emerald:'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
};

export default function Navbar({ onPageChange, dhakaTime, isDhakaOpen, currentUser }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<'hubs' | 'expertise' | null>(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const currentPath = location.pathname;

  const goToHub = (path: string) => {
    navigate(path);
    setActiveDropdown(null);
    setMoreMenuOpen(false);
  };

  const navTo = (path: string) => {
    navigate(path);
    setActiveDropdown(null);
    setMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 10) { setVisible(true); setScrolled(false); return; }
      setScrolled(true);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false); setActiveDropdown(null);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <AnimatePresence>
        {(activeDropdown || moreMenuOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 pointer-events-auto"
            onClick={() => { setActiveDropdown(null); setMoreMenuOpen(false); }}
          />
        )}
      </AnimatePresence>

      <nav
        className={`fixed top-6 left-0 right-0 z-50 flex justify-center items-center px-4 transition-all duration-500 ease-in-out ${
          visible ? 'translate-y-0' : '-translate-y-32'
        }`}
      >
        <div className={`relative border rounded-full max-w-fit px-4 sm:px-6 py-2 sm:py-2.5 flex items-center gap-4 sm:gap-8 text-white transition-all duration-300 [backdrop-filter:blur(22px)_saturate(140%)] [-webkit-backdrop-filter:blur(22px)_saturate(140%)] ${
          scrolled
            ? 'bg-white/[0.07] border-[rgba(181,141,255,0.32)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_0_28px_rgba(124,42,235,0.08),0_20px_60px_rgba(0,0,0,0.60)]'
            : 'bg-white/[0.042] border-[rgba(181,141,255,0.20)] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),inset_0_0_28px_rgba(124,42,235,0.05),0_20px_60px_rgba(0,0,0,0.50)]'
        }`}>

          {/* Logo */}
          <button onClick={() => navTo('/')} className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer focus:outline-none">
            <div className="relative">
              <img alt="GalaxaTech" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover transition-transform duration-500 group-hover:scale-105" src={brandmarkLogo} referrerPolicy="no-referrer" />
              <span className="absolute -inset-1 rounded-xl bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display text-base sm:text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">GalaxaTech</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navTo('/')}
              className={`text-sm font-medium transition-colors hover:text-primary ${currentPath === '/' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : 'text-white/80'}`}
            >
              Home
            </button>

            {/* Hubs Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('hubs')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-3 focus:outline-none ${activeDropdown === 'hubs' ? 'text-primary animate-pulse' : 'text-white/80'}`}>
                Hubs
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'hubs' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'hubs' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[460px] bg-white/[0.042] [backdrop-filter:blur(22px)_saturate(140%)] [-webkit-backdrop-filter:blur(22px)_saturate(140%)] border border-[rgba(181,141,255,0.20)] rounded-[24px] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.09),inset_0_0_28px_rgba(124,42,235,0.05),0_24px_60px_rgba(0,0,0,0.70)] z-50 grid grid-cols-5"
                  >
                    <div className="col-span-3 p-5 flex flex-col gap-2.5">
                      <h4 className="text-[11px] uppercase tracking-wider text-primary font-bold mb-1 px-2.5">Galaxa Hubs</h4>
                      <button onClick={() => goToHub('/hub/visitor')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[rgba(124,42,235,0.08)] text-left transition-all group/item">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover/item:scale-110 transition-transform"><Compass className="w-4 h-4" /></div>
                        <div><p className="text-xs font-bold text-white mb-0.5">Visitor's Hub</p><p className="text-[10px] text-white/50">Zero-code AI guides & prompts</p></div>
                      </button>
                      <button onClick={() => goToHub('/hub/client')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[rgba(124,42,235,0.08)] text-left transition-all group/item">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover/item:scale-110 transition-transform"><Lock className="w-4 h-4" /></div>
                        <div><p className="text-xs font-bold text-white mb-0.5">Client's Hub</p><p className="text-[10px] text-white/50">Agreements, metrics & live logs</p></div>
                      </button>
                      <button onClick={() => goToHub('/hub/builder')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[rgba(124,42,235,0.08)] text-left transition-all group/item">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover/item:scale-110 transition-transform"><BookOpen className="w-4 h-4" /></div>
                        <div><p className="text-xs font-bold text-white mb-0.5">Builder's Hub</p><p className="text-[10px] text-white/50">Project management & payments</p></div>
                      </button>
                    </div>
                    <div className="col-span-2 bg-white/[0.04] p-5 flex flex-col justify-between border-l border-[rgba(181,141,255,0.15)] text-left">
                      <div>
                        <h4 className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2">Workspace HQ</h4>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className={`w-2 h-2 rounded-full ${isDhakaOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className="text-[11px] font-bold text-white/95">{isDhakaOpen ? 'Studio Active' : 'Studio Closed'}</span>
                        </div>
                        <p className="text-[10px] text-white/60 font-mono leading-relaxed">{dhakaTime}<br />10:00 AM - 6:00 PM<br />Sun - Thu (Holiday: Fri/Sat)</p>
                      </div>
                      <button onClick={() => navTo('/gbp')} className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 group/link mt-4 focus:outline-none">
                        Galaxa Builders Program
                        <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Expertise Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('expertise')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-3 focus:outline-none ${activeDropdown === 'expertise' ? 'text-primary' : 'text-white/80'}`}>
                Expertise
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'expertise' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'expertise' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[500px] bg-white/[0.042] [backdrop-filter:blur(22px)_saturate(140%)] [-webkit-backdrop-filter:blur(22px)_saturate(140%)] border border-[rgba(181,141,255,0.20)] rounded-[24px] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.09),inset_0_0_28px_rgba(124,42,235,0.05),0_24px_60px_rgba(0,0,0,0.70)] z-50 p-5 grid grid-cols-2 gap-3"
                  >
                    <div className="col-span-2 mb-1">
                      <h4 className="text-[11px] uppercase tracking-wider text-secondary font-bold mb-1 px-2">Galaxa Expertise</h4>
                    </div>
                    {EXPERTISE_ITEMS.map((item) => (
                      <button
                        key={item.anchor}
                        onClick={() => navTo(`/services#${item.anchor}`)}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[rgba(124,42,235,0.08)] text-left transition-all group/exp"
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border group-hover/exp:scale-110 transition-transform flex-shrink-0 ${COLOR_MAP[item.color]}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white mb-0.5">{item.label}</p>
                          <p className="text-[10px] text-white/50 leading-normal">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Book an Audit pill */}
            <button
              onClick={() => navTo('/audit')}
              className="relative flex items-center w-8 sm:w-10 hover:w-[140px] sm:hover:w-[160px] h-8 sm:h-10 bg-gradient-to-tr from-secondary to-primary text-white rounded-full transition-all duration-500 overflow-hidden group focus:outline-none cursor-pointer shadow-[0_8px_20px_-6px_rgba(124,42,235,0.4)]"
            >
              <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center flex-shrink-0 group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto ml-0 group-hover:ml-2.5 transition-all duration-500 whitespace-nowrap">
                book an audit
              </span>
            </button>

            {/* "..." More menu */}
            <div className="relative" onMouseEnter={() => setMoreMenuOpen(true)} onMouseLeave={() => setMoreMenuOpen(false)}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer focus:outline-none group/btn"
              >
                <MoreHorizontal className="w-4 sm:w-5 h-4 sm:h-5 text-white/70 group-hover/btn:text-white transition-colors" />
              </button>

              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 15 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-0 top-full mt-3 w-64 bg-white/[0.042] [backdrop-filter:blur(22px)_saturate(140%)] [-webkit-backdrop-filter:blur(22px)_saturate(140%)] border border-[rgba(181,141,255,0.20)] rounded-[18px] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.09),inset_0_0_28px_rgba(124,42,235,0.05),0_20px_60px_rgba(0,0,0,0.70)] z-50 text-left"
                  >
                    {/* User profile (if signed in) */}
                    {currentUser && (
                      <div className="px-5 py-4 border-b border-[rgba(181,141,255,0.15)] bg-white/[0.03]">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt={currentUser.displayName || 'Profile'} className="w-8 h-8 rounded-full border border-primary/40 object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-xs font-bold font-mono">
                              {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{currentUser.displayName || 'Galaxa User'}</p>
                            <p className="text-[10px] text-white/50 truncate">{currentUser.email}</p>
                          </div>
                        </div>
                        <button onClick={() => clearLocalSession()} className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer focus:outline-none">
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    )}

                    {/* Desktop-only: Profile, Settings, social links */}
                    <div className="hidden md:block">
                      <div className="px-5 py-3 border-b border-[rgba(181,141,255,0.15)]">
                        <button disabled className="w-full flex items-center gap-3 py-2 text-white/35 text-xs font-semibold cursor-not-allowed">
                          <User className="w-3.5 h-3.5" /> My Profile
                          <span className="ml-auto text-[9px] bg-white/10 rounded px-1.5 py-0.5 font-mono">Soon</span>
                        </button>
                        <button disabled className="w-full flex items-center gap-3 py-2 text-white/35 text-xs font-semibold cursor-not-allowed">
                          <Settings className="w-3.5 h-3.5" /> Settings
                          <span className="ml-auto text-[9px] bg-white/10 rounded px-1.5 py-0.5 font-mono">Soon</span>
                        </button>
                      </div>
                      <div className="px-5 py-3">
                        <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase font-mono block mb-2">Follow Us</span>
                        <div className="flex flex-col gap-1.5">
                          <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-1.5 text-white/70 hover:text-white transition-all text-xs font-semibold">
                            <Facebook className="w-3.5 h-3.5 text-blue-400" /> Facebook
                          </a>
                          <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-1.5 text-white/70 hover:text-white transition-all text-xs font-semibold">
                            <Twitter className="w-3.5 h-3.5 text-sky-400" /> X / Twitter
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Mobile-only: full navigation */}
                    <div className="md:hidden">
                      {/* Main nav links */}
                      <div className="flex flex-col border-b border-[rgba(181,141,255,0.15)] pb-2 pt-1">
                        {[
                          { label: 'Home', path: '/', icon: Home },
                          { label: 'Services', path: '/services', icon: Briefcase },
                          { label: 'Portfolio', path: '/portfolio', icon: Briefcase },
                          { label: 'About', path: '/about', icon: Users },
                          { label: 'Contact', path: '/contact', icon: Mail },
                        ].map(({ label, path, icon: Icon }) => (
                          <button key={path} onClick={() => navTo(path)} className={`px-5 py-3 hover:bg-[rgba(124,42,235,0.08)] text-sm font-semibold flex items-center gap-3 cursor-pointer text-left ${currentPath === path ? 'text-primary' : 'text-white/80'}`}>
                            <Icon className="w-4 h-4" /> {label}
                          </button>
                        ))}
                      </div>
                      {/* Hubs */}
                      <div className="px-5 py-3 border-b border-[rgba(181,141,255,0.15)]">
                        <span className="text-[9px] font-bold text-primary tracking-widest uppercase font-mono block mb-2">Hubs</span>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => goToHub('/hub/visitor')} className="py-2.5 text-white/75 hover:text-white text-sm font-semibold flex items-center gap-3"><Compass className="w-4 h-4 text-pink-400" /> Visitor Hub</button>
                          <button onClick={() => goToHub('/hub/client')} className="py-2.5 text-white/75 hover:text-white text-sm font-semibold flex items-center gap-3"><Lock className="w-4 h-4 text-cyan-400" /> Client Hub</button>
                          <button onClick={() => goToHub('/hub/builder')} className="py-2.5 text-white/75 hover:text-white text-sm font-semibold flex items-center gap-3"><BookOpen className="w-4 h-4 text-emerald-400" /> Builder Hub</button>
                        </div>
                      </div>
                      {/* Services */}
                      <div className="px-5 py-3 border-b border-[rgba(181,141,255,0.15)]">
                        <span className="text-[9px] font-bold text-secondary tracking-widest uppercase font-mono block mb-2">Expertise</span>
                        <div className="flex flex-col gap-0.5">
                          {EXPERTISE_ITEMS.map((item) => (
                            <button key={item.anchor} onClick={() => navTo(`/services#${item.anchor}`)} className="py-2 text-white/70 hover:text-white text-xs font-semibold text-left">{item.label}</button>
                          ))}
                        </div>
                      </div>
                      {/* Book Audit + WhatsApp + Social */}
                      <div className="px-5 py-3">
                        <button onClick={() => navTo('/audit')} className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-bold mb-3">Book a Free Audit</button>
                        <a href="https://wa.me/8801959209103" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl text-white/70 text-sm font-semibold mb-3">
                          <Phone className="w-4 h-4 text-green-400" /> WhatsApp Us
                        </a>
                        <div className="flex gap-3 justify-center">
                          <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold"><Facebook className="w-3.5 h-3.5 text-blue-400" /> Facebook</a>
                          <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold"><Twitter className="w-3.5 h-3.5 text-sky-400" /> X</a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

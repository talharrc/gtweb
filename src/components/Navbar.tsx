import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  Phone,
  Package
} from 'lucide-react';
import { PageType } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onPageChange: (page: PageType) => void;
  dhakaTime: string;
  isDhakaOpen: boolean;
  currentUser?: any | null;
}

const EXPERTISE_ITEMS = [
  { label: 'Web Development', desc: 'Performant, scalable websites and web apps.', icon: Laptop, anchor: 'web-development' },
  { label: 'App Development', desc: 'Cross-platform mobile applications.', icon: Smartphone, anchor: 'app-development' },
  { label: 'Social Media & Content', desc: 'Strategy, content creation, and growth.', icon: TrendingUp, anchor: 'social-media' },
  { label: 'AI & Automation', desc: 'Intelligent workflows that eliminate manual work.', icon: Cpu, anchor: 'ai-automation' },
  { label: 'Brand Identity & Design', desc: 'Visual systems that make your brand unforgettable.', icon: Brush, anchor: 'brand-identity' },
  { label: 'Systems Consulting', desc: 'Notion, process, and operations architecture.', icon: Workflow, anchor: 'systems-consulting' },
];

export default function Navbar({ onPageChange, dhakaTime, isDhakaOpen, currentUser }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, isSignedIn } = useAuth();
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
        aria-label="Main navigation"
        className={`fixed top-6 left-0 right-0 z-50 flex justify-center items-center px-4 transition-all duration-500 ease-in-out ${
          visible ? 'translate-y-0' : '-translate-y-32'
        }`}
      >
        <div className={`relative border max-w-fit px-5 sm:px-6 py-2.5 flex items-center gap-5 sm:gap-8 text-[#0B0B0B] transition-all duration-300 [backdrop-filter:blur(22px)_saturate(160%)] [-webkit-backdrop-filter:blur(22px)_saturate(160%)] rounded-2xl border-t-white/80 ${
          scrolled
            ? 'bg-[#F6EADF]/80 border-white/50 shadow-[0_20px_50px_rgba(11,11,11,0.18),inset_0_1px_0_rgba(255,255,255,0.7)]'
            : 'bg-[#F6EADF]/50 border-white/40 shadow-[0_20px_50px_rgba(11,11,11,0.14),inset_0_1px_0_rgba(255,255,255,0.55)]'
        }`}>

          {/* Logo */}
          <button onClick={() => navTo('/')} className="flex items-center gap-2.5 group cursor-pointer focus:outline-none">
            <div className="relative">
              <motion.img
                layoutId="app-logo-image"
                alt="GalaxaTech"
                className="w-10 h-10 object-contain transition-transform duration-500 group-hover:scale-105"
                src="/logo-dark.png"
              />
              <span className="absolute -inset-1 bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <motion.span
              layoutId="app-logo-text"
              className="font-display text-xl tracking-wide uppercase text-[#0B0B0B] transition-all group-hover:text-[#FF4D06]"
            >
              GalaxaTech
            </motion.span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navTo('/browse')}
              className={`text-sm font-medium transition-colors hover:text-primary ${currentPath === '/browse' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : 'text-[#0B0B0B]/70'}`}
            >
              Browse
            </button>

            {/* Hubs Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('hubs')} onMouseLeave={() => setActiveDropdown(null)}>
              <button aria-expanded={activeDropdown === 'hubs'} aria-haspopup="true" className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-3 focus:outline-none ${activeDropdown === 'hubs' ? 'text-primary' : 'text-[#0B0B0B]/70'}`}>
                Hubs
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'hubs' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'hubs' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[460px] bg-[#F6EADF]/90 border border-white/60 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(11,11,11,0.25),inset_0_1px_0_rgba(255,255,255,0.7)] z-50 grid grid-cols-5 backdrop-blur-lg"
                  >
                    <div className="col-span-3 p-5 flex flex-col gap-2.5">
                      <h4 className="text-[11px] uppercase tracking-wider text-[#FF4D06] font-bold mb-1 px-2.5">Galaxa Hubs</h4>
                      <button onClick={() => goToHub('/space')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 text-left transition-all group/item">
                        <div className="w-8 h-8 rounded-lg bg-[#FF4D06]/10 flex items-center justify-center text-[#FF4D06] group-hover/item:scale-110 transition-transform"><Compass className="w-4 h-4" /></div>
                        <div><p className="text-xs font-bold text-[#0B0B0B] mb-0.5">Galaxa Space</p><p className="text-[10px] text-[#0B0B0B]/55">Generative utilities & prompt packs</p></div>
                      </button>
                      <button onClick={() => goToHub('/hub/client')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 text-left transition-all group/item">
                        <div className="w-8 h-8 rounded-lg bg-[#FF4D06]/10 flex items-center justify-center text-[#FF4D06] group-hover/item:scale-110 transition-transform"><Lock className="w-4 h-4" /></div>
                        <div><p className="text-xs font-bold text-[#0B0B0B] mb-0.5">Client Hub</p><p className="text-[10px] text-[#0B0B0B]/55">Project roadmap & live systems metrics</p></div>
                      </button>
                      <button onClick={() => goToHub('/hub/builder')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 text-left transition-all group/item">
                        <div className="w-8 h-8 rounded-lg bg-[#FF4D06]/10 flex items-center justify-center text-[#FF4D06] group-hover/item:scale-110 transition-transform"><BookOpen className="w-4 h-4" /></div>
                        <div><p className="text-xs font-bold text-[#0B0B0B] mb-0.5">Builder Hub</p><p className="text-[10px] text-[#0B0B0B]/55">Sprint boards & performance logs</p></div>
                      </button>
                      <button onClick={() => goToHub('/hub/customer')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 text-left transition-all group/item">
                        <div className="w-8 h-8 rounded-lg bg-[#FF4D06]/10 flex items-center justify-center text-[#FF4D06] group-hover/item:scale-110 transition-transform"><Package className="w-4 h-4" /></div>
                        <div><p className="text-xs font-bold text-[#0B0B0B] mb-0.5">My Orders</p><p className="text-[10px] text-[#0B0B0B]/55">Track store purchases & deliveries</p></div>
                      </button>
                    </div>
                    <div className="col-span-2 bg-black/[0.03] p-5 flex flex-col justify-between border-l border-black/10 text-left">
                      <div>
                        <h4 className="text-[10px] uppercase tracking-wider text-[#0B0B0B]/45 font-bold mb-2">Workspace HQ</h4>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className={`w-2 h-2 rounded-full ${isDhakaOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className="text-[11px] font-bold text-[#0B0B0B]">{isDhakaOpen ? 'Studio Active' : 'Studio Closed'}</span>
                        </div>
                        <p className="text-[10px] text-[#0B0B0B]/60 font-mono leading-relaxed">{dhakaTime}<br />10:00 AM - 6:00 PM<br />Sun - Thu (Holiday: Fri/Sat)</p>
                      </div>
                      <button onClick={() => navTo('/gbp')} className="flex items-center gap-1.5 text-[11px] font-bold text-[#FF4D06] group/link mt-4 focus:outline-none cursor-pointer">
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
              <button aria-expanded={activeDropdown === 'expertise'} aria-haspopup="true" className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-3 focus:outline-none ${activeDropdown === 'expertise' ? 'text-primary' : 'text-[#0B0B0B]/70'}`}>
                Expertise
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'expertise' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'expertise' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[500px] bg-[#F6EADF]/90 border border-white/60 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(11,11,11,0.25),inset_0_1px_0_rgba(255,255,255,0.7)] z-50 p-5 grid grid-cols-2 gap-3 backdrop-blur-lg"
                  >
                    <div className="col-span-2 mb-1">
                      <h4 className="text-[11px] uppercase tracking-wider text-[#FF4D06] font-bold mb-1 px-2">Galaxa Expertise</h4>
                    </div>
                    {EXPERTISE_ITEMS.map((item) => (
                      <button
                        key={item.anchor}
                        onClick={() => navTo(`/services#${item.anchor}`)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-black/5 text-left transition-all group/exp cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border group-hover/exp:scale-110 transition-transform flex-shrink-0 bg-[#FF4D06]/10 border-[#FF4D06]/15 text-[#FF4D06]`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0B0B0B] mb-0.5">{item.label}</p>
                          <p className="text-[10px] text-[#0B0B0B]/55 leading-normal">{item.desc}</p>
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
              aria-label="Book a free audit"
              className="relative flex items-center w-10 hover:w-[160px] h-10 bg-[#FF4D06] text-[#0B0B0B] rounded-full transition-all duration-500 overflow-hidden group focus:outline-none cursor-pointer shadow-[0_8px_20px_-6px_rgba(255,77,6,0.4)]"
            >
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight className="w-4 h-4 text-[#0B0B0B]" />
              </div>
              <span className="text-[10px] font-bold text-[#0B0B0B] uppercase tracking-widest opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto ml-0 group-hover:ml-2.5 transition-all duration-500 whitespace-nowrap">
                book an audit
              </span>
            </button>

            {/* "..." More menu */}
            <div className="relative" onMouseEnter={() => setMoreMenuOpen(true)} onMouseLeave={() => setMoreMenuOpen(false)}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                aria-label="More navigation options"
                aria-expanded={moreMenuOpen}
                aria-haspopup="true"
                className="w-10 h-10 flex items-center justify-center bg-black/5 border border-black/10 hover:bg-black/10 rounded-full transition-all cursor-pointer focus:outline-none group/btn backdrop-blur-sm"
              >
                <MoreHorizontal className="w-5 h-5 text-[#0B0B0B]/60 group-hover/btn:text-[#0B0B0B] transition-colors" />
              </button>

              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 15 }}
                    transition={{ duration: 0.22 }}
                    className="absolute right-0 top-full mt-3 w-64 bg-[#F6EADF]/90 border border-white/60 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(11,11,11,0.25),inset_0_1px_0_rgba(255,255,255,0.7)] z-50 text-left backdrop-blur-lg"
                  >
                    {/* About and Contact listed here in three dots menu */}
                    <div className="px-5 py-3.5 border-b border-black/10 flex flex-col gap-1.5">
                      <button onClick={() => navTo('/about')} className="flex items-center gap-3 py-1.5 text-[#0B0B0B]/70 hover:text-[#0B0B0B] transition-all text-xs font-semibold text-left w-full focus:outline-none">
                        <Users className="w-3.5 h-3.5 text-primary" /> About Us
                      </button>
                      <button onClick={() => navTo('/contact')} className="flex items-center gap-3 py-1.5 text-[#0B0B0B]/70 hover:text-[#0B0B0B] transition-all text-xs font-semibold text-left w-full focus:outline-none">
                        <Mail className="w-3.5 h-3.5 text-secondary" /> Contact Agency
                      </button>
                    </div>

                    <div className="hidden md:block">
                      <div className="px-5 py-3 border-b border-black/10">
                        {isSignedIn && (
                          <button onClick={() => { signOut(); setMoreMenuOpen(false); }} className="w-full flex items-center gap-3 py-2 text-red-500 hover:text-red-600 text-xs font-semibold transition-colors focus:outline-none">
                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                          </button>
                        )}
                        <button disabled className="w-full flex items-center gap-3 py-2 text-[#0B0B0B]/35 text-xs font-semibold cursor-not-allowed">
                          <User className="w-3.5 h-3.5" /> My Profile
                          <span className="ml-auto text-[9px] bg-black/10 rounded px-1.5 py-0.5 font-mono">Soon</span>
                        </button>
                        <button disabled className="w-full flex items-center gap-3 py-2 text-[#0B0B0B]/35 text-xs font-semibold cursor-not-allowed">
                          <Settings className="w-3.5 h-3.5" /> Settings
                          <span className="ml-auto text-[9px] bg-black/10 rounded px-1.5 py-0.5 font-mono">Soon</span>
                        </button>
                      </div>
                      <div className="px-5 py-3">
                        <span className="text-[9px] font-bold text-[#0B0B0B]/40 tracking-widest uppercase font-mono block mb-2">Follow Us</span>
                        <div className="flex flex-col gap-1.5">
                          <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-1.5 text-[#0B0B0B]/70 hover:text-[#0B0B0B] transition-all text-xs font-semibold">
                            <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook
                          </a>
                          <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-1.5 text-[#0B0B0B]/70 hover:text-[#0B0B0B] transition-all text-xs font-semibold">
                            <Twitter className="w-3.5 h-3.5 text-sky-600" /> X / Twitter
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Mobile-only: full navigation */}
                    <div className="md:hidden">
                      {/* Main nav links */}
                      <div className="flex flex-col border-b border-black/10 pb-2 pt-1">
                        {[
                          { label: 'Home', path: '/', icon: Home },
                          { label: 'Browse Store', path: '/browse', icon: Compass },
                          { label: 'Services', path: '/services', icon: Briefcase },
                          { label: 'Portfolio', path: '/portfolio', icon: Briefcase },
                          { label: 'About', path: '/about', icon: Users },
                          { label: 'Contact', path: '/contact', icon: Mail },
                        ].map(({ label, path, icon: Icon }) => (
                          <button key={path} onClick={() => navTo(path)} className={`px-5 py-3 hover:bg-black/5 text-sm font-semibold flex items-center gap-3 cursor-pointer text-left ${currentPath === path ? 'text-primary' : 'text-[#0B0B0B]/75'}`}>
                            <Icon className="w-4 h-4" /> {label}
                          </button>
                        ))}
                      </div>
                      {/* Hubs */}
                      <div className="px-5 py-3 border-b border-black/10">
                        <span className="text-[9px] font-bold text-primary tracking-widest uppercase font-mono block mb-2">Hubs</span>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => goToHub('/space')} className="py-2.5 text-[#0B0B0B]/75 hover:text-[#0B0B0B] text-sm font-semibold flex items-center gap-3"><Compass className="w-4 h-4 text-pink-600" /> Galaxa Space</button>
                          <button onClick={() => goToHub('/hub/client')} className="py-2.5 text-[#0B0B0B]/75 hover:text-[#0B0B0B] text-sm font-semibold flex items-center gap-3"><Lock className="w-4 h-4 text-cyan-600" /> Client Hub</button>
                          <button onClick={() => goToHub('/hub/builder')} className="py-2.5 text-[#0B0B0B]/75 hover:text-[#0B0B0B] text-sm font-semibold flex items-center gap-3"><BookOpen className="w-4 h-4 text-emerald-600" /> Builder Hub</button>
                          <button onClick={() => goToHub('/hub/customer')} className="py-2.5 text-[#0B0B0B]/75 hover:text-[#0B0B0B] text-sm font-semibold flex items-center gap-3"><Package className="w-4 h-4 text-primary" /> My Orders</button>
                        </div>
                      </div>
                      {/* Services */}
                      <div className="px-5 py-3 border-b border-black/10">
                        <span className="text-[9px] font-bold text-secondary tracking-widest uppercase font-mono block mb-2">Expertise</span>
                        <div className="flex flex-col gap-0.5">
                          {EXPERTISE_ITEMS.map((item) => (
                            <button key={item.anchor} onClick={() => navTo(`/services#${item.anchor}`)} className="py-2 text-[#0B0B0B]/70 hover:text-[#0B0B0B] text-xs font-semibold text-left">{item.label}</button>
                          ))}
                        </div>
                      </div>
                      {/* Login/Sign Up + Book Audit + WhatsApp + Social */}
                      <div className="px-5 py-3">
                        {isSignedIn && (
                          <button
                            onClick={() => { signOut(); setMoreMenuOpen(false); }}
                            className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold mb-3 flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        )}
                        <button onClick={() => navTo('/audit')} className="w-full py-3 bg-[#FF4D06] text-[#0B0B0B] rounded-xl text-sm font-bold mb-3">Book a Free Audit</button>
                        <a href="https://wa.me/8801959209103" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-2.5 border border-black/10 rounded-xl text-[#0B0B0B]/70 text-sm font-semibold mb-3">
                          <Phone className="w-4 h-4 text-green-600" /> WhatsApp Us
                        </a>
                        <div className="flex gap-3 justify-center">
                          <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#0B0B0B]/60 hover:text-[#0B0B0B] text-xs font-semibold"><Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook</a>
                          <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#0B0B0B]/60 hover:text-[#0B0B0B] text-xs font-semibold"><Twitter className="w-3.5 h-3.5 text-sky-600" /> X</a>
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

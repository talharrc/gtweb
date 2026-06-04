import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import brandmarkLogo from '../assets/images/galaxatech_revised_logo_1780005309031.png';
import { 
  ChevronDown, 
  ArrowUpRight, 
  Brush, 
  Terminal, 
  Megaphone, 
  Mail, 
  Menu, 
  X,
  Compass,
  Briefcase,
  Users,
  Activity,
  Heart,
  MoreHorizontal,
  Brain,
  Lock,
  BookOpen,
  LogIn,
  LogOut,
  Laptop,
  TrendingUp,
  Cpu,
  Coins
} from 'lucide-react';
import { PageType } from '../types';
import { googleSignIn, logout } from '../lib/firebase';

interface NavbarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onBookAudit: () => void;
  dhakaTime: string;
  isDhakaOpen: boolean;
  currentUser?: any | null;
}

export default function Navbar({ 
  currentPage, 
  onPageChange, 
  onBookAudit,
  dhakaTime,
  isDhakaOpen,
  currentUser
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<'hubs' | 'expertise' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Manage visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 10) {
        setVisible(true);
        setScrolled(false);
        return;
      }

      setScrolled(true);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setVisible(false);
        setActiveDropdown(null);
      } else {
        // Scrolling up - show navbar
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handlePageSelect = (page: PageType) => {
    onPageChange(page);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mega Overlay when dropdown is active */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 pointer-events-auto"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>

      <nav
        className={`fixed top-6 left-0 right-0 z-50 flex justify-center items-center px-4 transition-all duration-500 ease-in-out ${
          visible ? 'translate-y-0' : '-translate-y-32'
        }`}
        id="main-nav"
      >
        <div 
          className={`relative border border-white/10 rounded-full max-w-fit px-6 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center gap-8 text-white transition-all duration-300 ${
            scrolled ? 'bg-black/90 backdrop-blur-3xl border-white/15' : 'bg-black/75 backdrop-blur-2xl'
          }`}
        >
          {/* Logo Brandmark */}
          <button 
            onClick={() => handlePageSelect('home')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="relative">
              <img 
                alt="GalaxaTech Brandmark" 
                className="w-10 h-10 rounded-xl object-contain transition-transform duration-500 group-hover:scale-105" 
                src={brandmarkLogo}
                referrerPolicy="no-referrer"
              />
              <span className="absolute -inset-1 rounded-xl bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
              GalaxaTech
            </span>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handlePageSelect('home')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'home' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : 'text-white/80'
              }`}
            >
              Home
            </button>

            {/* Hubs Dropdown Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('hubs')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-3 focus:outline-none ${
                  activeDropdown === 'hubs' ? 'text-primary animate-pulse' : 'text-white/80'
                }`}
              >
                Hubs 
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'hubs' ? 'rotate-180' : ''}`} />
              </button>

              {/* Dynamic Hubs Dropdown */}
              <AnimatePresence>
                {activeDropdown === 'hubs' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[460px] bg-black/85 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.9)] z-50 grid grid-cols-5"
                  >
                    <div className="col-span-3 p-5 flex flex-col gap-2.5">
                      <h4 className="text-[11px] uppercase tracking-wider text-primary font-bold mb-1 px-2.5">Galaxa Hubs</h4>
                      
                      <button 
                        onClick={() => handlePageSelect('visitor-hub')}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-all duration-200 group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover/item:scale-110 transition-transform">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white mb-0.5">Visitor's Hub</p>
                          <p className="text-[10px] text-white/50">Zero-code AI guides & prompts</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => handlePageSelect('client-hub')}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-all duration-200 group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover/item:scale-110 transition-transform">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white mb-0.5">Client's Hub</p>
                          <p className="text-[10px] text-white/50">Agreements, metrics & live logs</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => handlePageSelect('builders-program')}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-all duration-200 group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover/item:scale-110 transition-transform">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white mb-0.5">Builder's Hub</p>
                          <p className="text-[10px] text-white/50">Live student operational tasks</p>
                        </div>
                      </button>
                    </div>

                    <div className="col-span-2 bg-white/5 p-5 flex flex-col justify-between border-l border-white/10 text-left">
                      <div>
                        <h4 className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2">Workspace HQ</h4>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className={`w-2 h-2 rounded-full ${isDhakaOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className="text-[11px] font-bold text-white/95">
                            {isDhakaOpen ? 'Studio Active' : 'Studio Closed'}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/60 font-mono leading-relaxed">
                          {dhakaTime}<br />
                          10:00 AM - 6:00 PM<br />
                          Sun - Thu (Holiday: Fri/Sat)
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => handlePageSelect('builders-program')}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 group/link mt-4 focus:outline-none"
                      >
                        Galaxa Builders Program
                        <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Expertise Dropdown Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('expertise')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-3 focus:outline-none ${
                  activeDropdown === 'expertise' ? 'text-primary' : 'text-white/80'
                }`}
              >
                Expertise 
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'expertise' ? 'rotate-180' : ''}`} />
              </button>

              {/* Dynamic Expertise Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === 'expertise' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[460px] bg-black/85 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.9)] z-50 p-5 grid grid-cols-2 gap-3"
                  >
                    <div className="col-span-2 mb-1">
                      <h4 className="text-[11px] uppercase tracking-wider text-secondary font-bold mb-1 px-2">Galaxa Expertise</h4>
                    </div>

                    <button 
                      onClick={() => handlePageSelect('services')}
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 text-left transition-all duration-200 group/exp"
                    >
                      <div className="w-8.5 h-8.5 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400 border border-orange-500/20 group-hover/exp:scale-115 transition-transform flex-shrink-0">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white mb-0.5">Web/App Development</p>
                        <p className="text-[10px] text-white/50 leading-normal">Premium high-performance software systems.</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => handlePageSelect('services')}
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 text-left transition-all duration-200 group/exp"
                    >
                      <div className="w-8.5 h-8.5 rounded-xl bg-pink-500/15 flex items-center justify-center text-pink-400 border border-pink-500/20 group-hover/exp:scale-115 transition-transform flex-shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white mb-0.5">Digital Marketing</p>
                        <p className="text-[10px] text-white/50 leading-normal">Growth hacking and predictive acquisition.</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => handlePageSelect('services')}
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 text-left transition-all duration-200 group/exp"
                    >
                      <div className="w-8.5 h-8.5 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover/exp:scale-115 transition-transform flex-shrink-0">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white mb-0.5">AI Automation</p>
                        <p className="text-[10px] text-white/50 leading-normal">Workflow optimization and LLM agents.</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => handlePageSelect('services')}
                      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 text-left transition-all duration-200 group/exp"
                    >
                      <div className="w-8.5 h-8.5 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover/exp:scale-115 transition-transform flex-shrink-0">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white mb-0.5">Digital Finance</p>
                        <p className="text-[10px] text-white/50 leading-normal">Embedded fintech APIs and ledger sync.</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Audit & Side hamburger */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onBookAudit}
              className="relative flex items-center w-10 hover:w-[160px] h-10 bg-gradient-to-tr from-secondary to-primary text-white rounded-full transition-all duration-500 overflow-hidden group focus:outline-none cursor-pointer shadow-[0_8px_20px_-6px_rgba(139,44,255,0.4)]"
            >
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto ml-0 group-hover:ml-2.5 transition-all duration-500 whitespace-nowrap">
                book an audit
              </span>
            </button>

            {/* Menu options pop-up key (Hoverable & glassmorphic) */}
            <div 
              className="relative"
              onMouseEnter={() => setMobileMenuOpen(true)}
              onMouseLeave={() => setMobileMenuOpen(false)}
            >
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer focus:outline-none group/btn"
              >
                <MoreHorizontal className="w-5 h-5 text-white/70 group-hover/btn:text-white transition-colors" />
              </button>

              {/* Black tinted glassmorphism dropdown popup menu */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 15 }}
                    transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-3 w-64 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.8)] z-50 text-left"
                  >
                    {/* User Profile / Auth State Block */}
                    <div className="px-5 py-4 border-b border-white/10 bg-white/[0.02]">
                      {currentUser ? (
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center gap-2.5">
                            {currentUser.photoURL ? (
                              <img 
                                src={currentUser.photoURL} 
                                alt={currentUser.displayName || 'Profile'} 
                                className="w-8 h-8 rounded-full border border-primary/40 object-cover"
                                referrerPolicy="no-referrer"
                              />
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
                          <button
                            onClick={async () => {
                              try {
                                await logout();
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer focus:outline-none"
                          >
                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] text-white/40 font-mono tracking-wider">YOUR ACCOUNT</p>
                          <button
                            onClick={async () => {
                              try {
                                await googleSignIn();
                              } catch (err) {
                                console.error("Google Sign-In failed", err);
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer focus:outline-none"
                          >
                            <LogIn className="w-3.5 h-3.5" /> Sign In with Google
                          </button>
                          <p className="text-[9px] text-white/45 text-center mt-1">Get immediate secure access to portals</p>
                        </div>
                      )}
                    </div>

                    {/* Page links for mobile */}
                    <div className="flex flex-col border-b border-white/10 pb-2 md:hidden">
                      <button 
                        onClick={() => handlePageSelect('home')}
                        className={`px-5 py-2.5 hover:bg-white/5 text-sm font-semibold flex items-center gap-3 cursor-pointer text-left ${
                          currentPage === 'home' ? 'text-primary' : 'text-white/80'
                        }`}
                      >
                        <Compass className="w-4 h-4" /> Home
                      </button>
                      <button 
                        onClick={() => handlePageSelect('services')}
                        className={`px-5 py-2.5 hover:bg-white/5 text-sm font-semibold flex items-center gap-3 cursor-pointer text-left ${
                          currentPage === 'services' ? 'text-primary' : 'text-white/80'
                        }`}
                      >
                        <Terminal className="w-4 h-4" /> Services
                      </button>
                      <button 
                        onClick={() => handlePageSelect('portfolio')}
                        className={`px-5 py-2.5 hover:bg-white/5 text-sm font-semibold flex items-center gap-3 cursor-pointer text-left ${
                          currentPage === 'portfolio' ? 'text-primary' : 'text-white/80'
                        }`}
                      >
                        <Briefcase className="w-4 h-4" /> Portfolio
                      </button>
                      <button 
                        onClick={() => handlePageSelect('about')}
                        className={`px-5 py-2.5 hover:bg-white/5 text-sm font-semibold flex items-center gap-3 cursor-pointer text-left ${
                          currentPage === 'about' ? 'text-primary' : 'text-white/80'
                        }`}
                      >
                        <Users className="w-4 h-4" /> About Us
                      </button>
                    </div>

                    {/* Portal Section */}
                    <div className="px-5 py-2.5 border-b border-white/10">
                      <span className="text-[9px] font-bold text-primary tracking-widest uppercase font-mono block mb-2">Ecosystem Portals</span>
                      <div className="flex flex-col gap-1.5">
                        <button 
                          onClick={() => handlePageSelect('visitor-hub')}
                          className="w-full flex items-center gap-3 py-1 text-white/75 hover:text-white transition-all cursor-pointer text-left focus:outline-none"
                        >
                          <Compass className="w-3.5 h-3.5 text-pink-400" />
                          <span className="text-xs font-semibold">Visitor Resource Hub</span>
                        </button>
                        <button 
                          onClick={() => handlePageSelect('client-hub')}
                          className="w-full flex items-center gap-3 py-1 text-white/75 hover:text-white transition-all cursor-pointer text-left focus:outline-none"
                        >
                          <Lock className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-semibold">Client Operations Hub</span>
                        </button>
                        <button 
                          onClick={() => handlePageSelect('builders-program')}
                          className="w-full flex items-center gap-3 py-1 text-white/75 hover:text-white transition-all cursor-pointer text-left focus:outline-none"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-semibold">Builders Academy</span>
                        </button>
                      </div>
                    </div>

                    {/* Corporate Channels */}
                    <div className="px-5 py-2.5">
                      <span className="text-[9px] font-bold text-secondary tracking-widest uppercase font-mono block mb-2">Corporate Channels</span>
                      <div className="flex flex-col gap-1.5">
                        <button 
                          onClick={() => handlePageSelect('about')}
                          className="w-full flex items-center gap-3 py-1 text-white/75 hover:text-white transition-all cursor-pointer text-left focus:outline-none"
                        >
                          <Users className="w-3.5 h-3.5 text-primary-light" />
                          <span className="text-xs font-semibold">Our Culture</span>
                        </button>
                        <button 
                          onClick={() => handlePageSelect('services')}
                          className="w-full flex items-center gap-3 py-1 text-white/75 hover:text-white transition-all cursor-pointer text-left focus:outline-none"
                        >
                          <Activity className="w-3.5 h-3.5 text-tertiary" />
                          <span className="text-xs font-semibold">Pricing Plans</span>
                        </button>
                        <button 
                          onClick={() => handlePageSelect('about')}
                          className="w-full flex items-center gap-3 py-1 text-white/75 hover:text-white transition-all cursor-pointer text-left focus:outline-none"
                        >
                          <Heart className="w-3.5 h-3.5 text-secondary" />
                          <span className="text-xs font-semibold">Leadership Core</span>
                        </button>
                        <button 
                          onClick={() => handlePageSelect('contact')}
                          className="w-full flex items-center gap-3 py-1 text-white/75 hover:text-white transition-all cursor-pointer text-left focus:outline-none"
                        >
                          <Mail className="w-3.5 h-3.5 text-pink-400" />
                          <span className="text-xs font-semibold">Inquiries & Contact</span>
                        </button>
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

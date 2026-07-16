import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ChevronDown, ChevronRight } from 'lucide-react';
import GalaxyBackground from '../shared/GalaxyBackground';

const TYPEWRITER_WORDS = ['Website Presence', 'Social Media Engagement', 'Client conversion'];

interface HeroProps {
  isMobile: boolean;
}

export default function Hero({ isMobile }: HeroProps) {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const blob1Range = isMobile ? [0, 45] : [0, 90];
  const blob2Range = isMobile ? [0, -30] : [0, -60];
  const yBlob1Transform = useTransform(heroScroll, [0, 1], blob1Range);
  const yBlob2Transform = useTransform(heroScroll, [0, 1], blob2Range);
  const yBlob1Spring = useSpring(yBlob1Transform, { stiffness: 100, damping: 30 });
  const yBlob2Spring = useSpring(yBlob2Transform, { stiffness: 100, damping: 30 });

  const contentOpacityTransform = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const contentYTransform = useTransform(heroScroll, [0, 0.7], [0, isMobile ? -25 : -50]);
  const contentOpacitySpring = useSpring(contentOpacityTransform, { stiffness: 100, damping: 30 });
  const contentYSpring = useSpring(contentYTransform, { stiffness: 100, damping: 30 });

  const yBlob1 = shouldReduceMotion ? 0 : yBlob1Spring;
  const yBlob2 = shouldReduceMotion ? 0 : yBlob2Spring;
  const contentY = shouldReduceMotion ? 0 : contentYSpring;
  const contentOpacity = shouldReduceMotion ? 1 : contentOpacitySpring;

  useEffect(() => {
    const t = setInterval(() => setWordIndex(p => (p + 1) % TYPEWRITER_WORDS.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[78vh] sm:min-h-[88vh] flex flex-col items-center justify-center pt-28 pb-10 sm:pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0 select-none overflow-hidden" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 78%, #0A3AD6 0%, #062585 32%, #050B24 62%, #030923 100%)' }}>
        <div
          className="w-full h-full opacity-90 pointer-events-none"
          style={{
            maskImage: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 100%)',
          }}
        >
          <GalaxyBackground />
        </div>
        {/* 3D scrolling perspective grid horizon floor */}
        <div className="perspective-container">
          <div className="perspective-grid" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030923] via-[#030923]/40 to-transparent pointer-events-none" style={{ height: '55%' }} />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#030923] to-transparent pointer-events-none" />
        {/* Vivid atmospheric brand blob glows */}
        <motion.div style={{ y: yBlob1 }} className="absolute top-1/3 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-[#0059FF]/25 blur-[130px] rounded-full pointer-events-none" />
        <motion.div style={{ y: yBlob2 }} className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[420px] h-[420px] bg-[#00C2FF]/22 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[640px] h-[340px] bg-[#2B7BFF]/35 blur-[90px] rounded-full pointer-events-none" />
        <motion.div style={{ y: yBlob2 }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.05] blur-[100px] rounded-full pointer-events-none" />
        {/* Diagonal specular beams */}
        <div className="absolute top-0 right-0 w-[45vw] h-full bg-gradient-to-bl from-white/[0.05] via-transparent to-transparent pointer-events-none" style={{ clipPath: 'polygon(100% 0, 30% 0, 100% 100%)' }} />
        <div className="specular-beam absolute top-0 left-0 w-full h-full rotate-[-4deg]" />
      </div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 pt-8 sm:pt-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <div className="eyebrow-badge rounded-full px-4 sm:px-5 py-2 sm:py-2.5 mb-12 max-w-[92vw]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] flex-shrink-0" />
            <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-wide sm:tracking-widest text-white uppercase leading-tight">
              Systems-Driven Creative Tech Agency · Dhaka
            </span>
          </div>
        </motion.div>
        <h1 className="display-poster text-depth-dark text-[2.4rem] sm:text-[3.6rem] md:text-[5.8rem] mb-4" style={{ fontSize: 'clamp(2.6rem, 8vw, 6.5rem)' }}>
          {["Assure", "your", "brand's"].map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
              <motion.span
                initial={shouldReduceMotion ? { y: 0 } : { y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
          <br className="hidden md:block" />
          <span className="display-poster typewriter-container block min-h-[1.2em] mt-3 pb-1 overflow-hidden text-[1.4rem] sm:text-[2.8rem] md:text-[4.5rem] whitespace-nowrap" style={{ filter: 'drop-shadow(0 8px 30px rgba(0,89,255,0.25))' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { y: 35, opacity: 0, filter: 'blur(5px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { y: -35, opacity: 0, filter: 'blur(5px)' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-gradient"
              >
                {TYPEWRITER_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
          Tell us about your business in 5 minutes — we'll map out exactly how to grow your digital presence.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
          <button
            onClick={() => navigate('/audit')}
            className="btn-shine group flex items-center gap-4 py-3.5 px-8 rounded-full transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto justify-center shadow-xl bg-gradient-to-r from-primary to-secondary text-white"
          >
            <span className="w-9 h-9 bg-white/10 text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 flex-shrink-0">
              <ArrowUpRight className="w-4.5 h-4.5" />
            </span>
            <span className="text-sm font-semibold tracking-wider uppercase font-mono">Book an Audit</span>
          </button>
          <button
            onClick={() => navigate('/portfolio')}
            className="group flex items-center gap-3 text-white/70 hover:text-white font-semibold py-3.5 px-7 rounded-full transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center border border-white/15 hover:border-white/30 backdrop-blur-sm"
          >
            <span className="text-sm tracking-wide">See Our Work</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1.5 pointer-events-none">
        <span className="text-[9px] font-mono tracking-[0.22em] text-white/20 uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown className="w-3.5 h-3.5 text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}

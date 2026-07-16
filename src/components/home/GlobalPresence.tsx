import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { Shield } from 'lucide-react';
import InteractiveGlobe from '../shared/InteractiveGlobe';

const COUNTRIES = [
  { flag: '🇺🇸', name: 'USA', code: 'us' },
  { flag: '🇬🇧', name: 'UK', code: 'gb' },
  { flag: '🇵🇰', name: 'Pakistan', code: 'pk' },
  { flag: '🇸🇦', name: 'Saudi Arabia', code: 'sa' },
  { flag: '🇮🇳', name: 'India', code: 'in' },
  { flag: '🇧🇩', name: 'Bangladesh', code: 'bd' },
];

interface GlobalPresenceProps {
  isMobile: boolean;
}

export default function GlobalPresence({ isMobile }: GlobalPresenceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const y6PlusTransform = useTransform(scrollYProgress, [0, 1], [isMobile ? 15 : 30, isMobile ? -15 : -30]);
  const y6PlusSpring = useSpring(y6PlusTransform, { stiffness: 100, damping: 30 });
  const y6Plus = shouldReduceMotion ? 0 : y6PlusSpring;

  return (
    <section ref={sectionRef} className="relative py-16 px-6 overflow-hidden" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(11,36,112,0.30) 45%, transparent 100%)' }}>
      <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-[#0059FF]/6 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-0 -translate-x-1/3 w-[380px] h-[380px] bg-[#7C5CFF]/[0.05] blur-[120px] rounded-full pointer-events-none" />
      <div className="specular-beam absolute -top-1/4 left-0 w-full h-[160%] rotate-[-6deg]" />
      <div className="max-w-5xl mx-auto relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Content Column */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
              <span className="text-[10px] font-mono text-primary/75 tracking-[0.3em] uppercase block mb-3">00 — Global Reach</span>
              <div className="flex items-end justify-between mb-8 gap-6">
                <div>
                  <h2 className="display-sora text-4xl sm:text-5xl md:text-6xl mb-6">
                    <span className="block text-white">Clients Across</span>
                    <span className="pill-word-accent text-white text-2xl sm:text-3xl md:text-4xl mt-2 inline-block" style={{ background: 'linear-gradient(135deg, #0059FF, #00C2FF)' }}>Nations.</span>
                  </h2>
                </div>
                <div className="flex items-end gap-5">
                  <motion.div
                    style={{ y: y6Plus, color: 'rgba(0, 89, 255, 0.14)', fontFamily: 'var(--font-display)' }}
                    className="text-[60px] sm:text-[80px] font-extrabold leading-none select-none"
                  >
                    6+
                  </motion.div>
                  <p className="text-white/55 text-xs max-w-[130px] leading-relaxed pb-1 border-l border-white/15 pl-4">Delivering real digital systems across global markets.</p>
                </div>
              </div>

              {/* Marquee pills — reuses the global .animate-marquee utility (hover-pause + reduced-motion built in) */}
              <div
                className="w-full mb-8 overflow-hidden"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                }}
              >
                <div
                  className="animate-marquee"
                  style={{ display: 'flex', width: 'max-content', willChange: 'transform' }}
                >
                  {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
                    <div key={i} className="flex items-center gap-2.5 mx-2.5 select-none px-4 py-2 rounded-full" style={{ border: '1px solid rgba(0,89,255,0.20)', background: 'rgba(240,244,255,0.95)', minWidth: 'max-content' }}>
                      <img src={`https://flagcdn.com/20x15/${c.code}.png`} alt={c.name} width="20" height="15" className="flex-shrink-0 rounded-[2px]" />
                      <span className="text-slate-800 font-semibold text-xs" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Shield className="w-5 h-5 text-primary/55 flex-shrink-0" />
                <span className="text-white/40 text-xs sm:text-sm">Trusted by businesses worldwide to drive growth and innovation.</span>
              </div>
            </motion.div>
          </div>

          {/* Right Globe Column */}
          <div className="md:col-span-5 flex justify-center items-center w-full h-[360px] sm:h-[420px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <InteractiveGlobe />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

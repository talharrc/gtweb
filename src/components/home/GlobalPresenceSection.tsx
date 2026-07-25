import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { Shield } from 'lucide-react';
import Counter from '../shared/Counter';
import InteractiveGlobe from '../shared/InteractiveGlobe';
import { COUNTRIES } from './data';
import { VIEWPORT_DEFAULT } from './motion-tokens';

export default function GlobalPresenceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const yTransform = useTransform(scrollYProgress, [0, 1], [isMobile ? 15 : 30, isMobile ? -15 : -30]);
  const ySpring = useSpring(yTransform, { stiffness: 100, damping: 30 });
  const y6Plus = shouldReduceMotion ? 0 : ySpring;

  return (
    <section ref={sectionRef} className="relative py-20 px-6 overflow-hidden bg-[#0B0B0B] border-b border-zinc-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,77,6,0.05),transparent_50%)] pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}>
              <span className="text-[10px] font-mono text-[#FF4D06] tracking-[0.3em] uppercase block mb-3">01 — Global Reach</span>
              <div className="flex items-end justify-between mb-8 gap-6">
                <div>
                  <h2 className="display-poster text-4xl sm:text-5xl md:text-6xl mb-6">
                    <span className="block text-[#F2ECE6]">Clients</span>
                    <span className="block text-outline-brand my-2" style={{ WebkitTextStroke: '1.5px rgba(255,77,6,0.7)' }}>Across</span>
                    <span className="pill-word-brand text-white text-2xl sm:text-3xl md:text-4xl mt-2 inline-block" style={{ background: '#FF4D06' }}>Nations.</span>
                  </h2>
                </div>
                <div className="flex items-end gap-5">
                  <motion.div
                    style={{ y: y6Plus, color: 'rgba(255, 77, 6, 0.15)', fontFamily: 'var(--font-condensed)' }}
                    className="text-[60px] sm:text-[80px] font-black leading-none select-none display-poster animate-pulse"
                  >
                    <Counter value={6} suffix="+" />
                  </motion.div>
                  <p className="text-zinc-400 text-xs max-w-[130px] leading-relaxed pb-1 border-l border-zinc-850 pl-4">Delivering real digital systems across global markets.</p>
                </div>
              </div>

              <div
                className="w-full mb-8 overflow-hidden"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                }}
                onMouseEnter={e => { const t = e.currentTarget.querySelector('.mq-track') as HTMLDivElement | null; if (t) t.style.animationPlayState = 'paused'; }}
                onMouseLeave={e => { const t = e.currentTarget.querySelector('.mq-track') as HTMLDivElement | null; if (t) t.style.animationPlayState = 'running'; }}
              >
                <div
                  className="mq-track"
                  style={{ display: 'flex', width: 'max-content', animation: 'marquee-scroll 28s linear infinite', willChange: 'transform' }}
                >
                  {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
                    <div key={i} className="flex items-center gap-2.5 mx-2.5 select-none px-4 py-2 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', minWidth: 'max-content' }}>
                      <img src={`https://flagcdn.com/20x15/${c.code}.png`} alt={c.name} width="20" height="15" className="flex-shrink-0 rounded-[2px]" />
                      <span className="text-[#F2ECE6]/90 font-semibold text-xs" style={{ fontFamily: 'var(--font-display)' }}>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Shield className="w-5 h-5 text-[#FF4D06]/75 flex-shrink-0" />
                <span className="text-zinc-500 text-xs sm:text-sm font-sans">Trusted by businesses worldwide to drive growth and innovation.</span>
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-5 flex justify-center items-center w-full h-[360px] sm:h-[420px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT_DEFAULT}
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

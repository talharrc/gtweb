import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import Counter from '../shared/Counter';
import InteractiveGlobe from '../shared/InteractiveGlobe';
import { COUNTRIES } from './data';
import { VIEWPORT_DEFAULT } from './motion-tokens';

export default function GlobalPresenceSection() {
  return (
    <section className="relative py-20 px-6 overflow-hidden bg-[#0B0B0B]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.6 }}>
              <span className="text-[10px] font-mono text-[#FF4D06] tracking-[0.3em] uppercase block mb-3">01 — Global Reach</span>
              <div className="flex items-end gap-4 mb-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Clients across <Counter value={6} suffix="+" /> nations.
                </h2>
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
                      <span className="text-white/90 font-medium text-xs">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-4.5 h-4.5 text-[#FF4D06]/75 flex-shrink-0" />
                <span className="text-zinc-400 text-sm">Trusted by businesses worldwide to drive growth and innovation.</span>
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-5 flex justify-center items-center w-full h-[320px] sm:h-[380px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT_DEFAULT}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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

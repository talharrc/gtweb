import { useRef } from 'react';
import { motion } from 'motion/react';
import { useContainBox, BlurredBackdrop } from './useContainBox';

const FOOTER_BG = '#0B0B0B';
const FRAME_ASPECT = 1600 / 900;

export default function HomeFooterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const box = useContainBox(containerRef, FRAME_ASPECT);

  const fs = (fraction: number) => Math.max(9, box.width * fraction);

  // Marquee text items
  const marqueeItems = Array(6).fill(
    'GALAXATECH // SYSTEMS ENGINEERING // AI OPTIMIZATIONS // DYNAMIC CODE DEPLOYMENT // FigMAPPINGS //'
  );

  return (
    <section className="relative w-full h-screen" style={{ backgroundColor: FOOTER_BG }}>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        <BlurredBackdrop src="/home-scenes/home-7-footer.jpeg" tint={FOOTER_BG} />
        <img
          src="/home-scenes/home-7-footer.jpeg"
          alt="Thank you. Ecosystems, Optimized."
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Marquee Ticker (Top Area of Footer) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: box.top + box.height * 0.02,
            width: '100%',
            height: box.height * 0.06,
            background: '#FF4D06',
          }}
          className="flex items-center overflow-hidden z-20 border-y border-white/10 select-none pointer-events-none"
        >
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 22,
                ease: 'linear',
              },
            }}
            className="flex whitespace-nowrap gap-8 text-[#0B0B0B] font-mono font-black uppercase text-xs sm:text-sm tracking-widest pl-8"
          >
            {marqueeItems.map((text, i) => (
              <span key={i} className="flex-shrink-0">
                {text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Email Hotspot */}
        <a
          href="mailto:mail.galaxatech@gmail.com"
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.29,
            top: box.top + box.height * 0.555,
            width: box.width * 0.16,
            height: box.height * 0.035,
          }}
          className="cursor-pointer hover:bg-white/5 rounded transition-colors z-20"
          title="Email us"
        />

        {/* Website Hotspot */}
        <a
          href="/"
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.29,
            top: box.top + box.height * 0.59,
            width: box.width * 0.16,
            height: box.height * 0.035,
          }}
          className="cursor-pointer hover:bg-white/5 rounded transition-colors z-20"
          title="Visit homepage"
        />

        {/* LinkedIn (Facebook Page) */}
        <a
          href="https://www.facebook.com/share/1GJq598Yfm/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.612,
            top: box.top + box.height * 0.57,
            width: box.width * 0.024,
            height: box.height * 0.04,
          }}
          className="cursor-pointer hover:bg-white/10 rounded-full transition-colors z-20"
          title="LinkedIn (Facebook Page)"
        />

        {/* Instagram (Facebook Page) */}
        <a
          href="https://www.facebook.com/share/1GJq598Yfm/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.636,
            top: box.top + box.height * 0.57,
            width: box.width * 0.024,
            height: box.height * 0.04,
          }}
          className="cursor-pointer hover:bg-white/10 rounded-full transition-colors z-20"
          title="Instagram (Facebook Page)"
        />

        {/* Twitter */}
        <a
          href="https://x.com/galaxatech"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.66,
            top: box.top + box.height * 0.57,
            width: box.width * 0.024,
            height: box.height * 0.04,
          }}
          className="cursor-pointer hover:bg-white/10 rounded-full transition-colors z-20"
          title="Twitter"
        />

        {/* Behance (Facebook Page) */}
        <a
          href="https://www.facebook.com/share/1GJq598Yfm/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.683,
            top: box.top + box.height * 0.57,
            width: box.width * 0.024,
            height: box.height * 0.04,
          }}
          className="cursor-pointer hover:bg-white/10 rounded-full transition-colors z-20"
          title="Behance (Facebook Page)"
        />

        {/* Patch the bottom area and add giant wordmark reveal */}
        <div
          style={{
            position: 'absolute',
            left: box.left,
            top: box.top + box.height * 0.72,
            width: box.width,
            height: box.height * 0.28,
            background: FOOTER_BG,
          }}
          className="flex flex-col justify-center items-center z-20 border-t border-white/5"
        >
          <motion.h2
            style={{ fontSize: fs(0.08), fontFamily: 'var(--font-display)' }}
            className="font-black uppercase tracking-tighter text-zinc-800 text-center select-none leading-none"
            initial={{ opacity: 0, y: 40, letterSpacing: '0.08em' }}
            whileInView={{ opacity: 1, y: 0, letterSpacing: '-0.02em' }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            GalaxaTech Systems
          </motion.h2>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-3">
            Ecosystems, Optimized.
          </span>
        </div>
      </div>
    </section>
  );
}

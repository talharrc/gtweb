import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Mic } from 'lucide-react';
import { BILLBOARD_FRAMES } from './data';

const TINT_BG = {
  dusk: 'linear-gradient(180deg, #2A160B 0%, #0B0B0B 70%)',
  night: '#0B0B0B',
} as const;

export default function BillboardSection() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % BILLBOARD_FRAMES.length), 5500);
    return () => clearInterval(id);
  }, []);

  const frame = BILLBOARD_FRAMES[index];

  return (
    <section
      className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden px-6 py-20 transition-[background] duration-[1800ms]"
      style={{ background: TINT_BG[frame.tint] }}
    >
      <Mic className="absolute w-8 h-8 text-white/10 pointer-events-none" style={{ left: '12%', top: '20%', transform: 'rotate(-18deg)' }} />
      <Mic className="absolute w-6 h-6 text-white/10 pointer-events-none" style={{ right: '14%', top: '28%', transform: 'rotate(15deg)' }} />
      <Mic className="absolute w-7 h-7 text-white/10 pointer-events-none" style={{ left: '20%', bottom: '18%', transform: 'rotate(10deg)' }} />
      <Mic className="absolute w-6 h-6 text-white/10 pointer-events-none" style={{ right: '22%', bottom: '22%', transform: 'rotate(-12deg)' }} />

      <div className="relative z-10 text-center max-w-3xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.h2
            key={index}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -24, filter: 'blur(6px)' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="display-poster text-4xl sm:text-6xl md:text-7xl leading-[0.95]"
          >
            <span className="block text-white">{frame.headline}</span>
            <span className="block text-[#FF4D06]">{frame.accent}</span>
          </motion.h2>
        </AnimatePresence>
      </div>
    </section>
  );
}

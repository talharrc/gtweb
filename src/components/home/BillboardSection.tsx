import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlurredBackdrop } from './useContainBox';

const HERO_BG = '#F2ECE6';
const DARK_BG = '#0B0B0B';

const BILLBOARD_FRAMES = [
  { src: '/home-scenes/home-3a-billboard.jpeg', alt: "Billboard at dusk: Posting isn't marketing then?", tint: HERO_BG },
  { src: '/home-scenes/home-3b-billboard.jpeg', alt: 'Billboard at night: We curate brands!', tint: DARK_BG },
];

/** Auto-cycling crossfade between the two billboard frames — a long hold on each frame
 * with a slow, deliberate crossfade between them. */
export default function BillboardSection() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % BILLBOARD_FRAMES.length), 5500);
    return () => clearInterval(id);
  }, []);
  const frame = BILLBOARD_FRAMES[index];

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: frame.tint }}>
      <BlurredBackdrop src={frame.src} tint={frame.tint} />
      <AnimatePresence mode="sync">
        <motion.img
          key={frame.src}
          src={frame.src}
          alt={frame.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </AnimatePresence>
    </div>
  );
}

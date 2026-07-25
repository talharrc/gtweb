import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { useContainBox, BlurredBackdrop, ImagePatch } from './useContainBox';

const HERO_BG = '#F2ECE6';
const CARD_BG = '#151515';
const FRAME_ASPECT = 1600 / 900;

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const box = useContainBox(containerRef, FRAME_ASPECT);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const progressTransform = useTransform(scrollYProgress, [0.15, 0.6], [0, 0.72]);
  const progressSpring = useSpring(progressTransform, { stiffness: 100, damping: 30 });
  const progressScaleX = shouldReduceMotion ? 0.72 : progressSpring;

  return (
    <section ref={sectionRef} className="relative w-full h-screen" style={{ backgroundColor: HERO_BG }}>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        <BlurredBackdrop src="/home-scenes/home-4-process.jpeg" tint={HERO_BG} />
        <img
          src="/home-scenes/home-4-process.jpeg"
          alt="The most luxurious client service — a dedicated client portal"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Patch the flat baked-in progress bar inside the phone mockup's "Website Redesign" card. */}
        <ImagePatch box={box} left={0.495} top={0.385} width={0.175} height={0.028} color={CARD_BG} feather="none" />

        {/* Real, scroll-driven animated progress bar in its place */}
        <div
          style={{ position: 'absolute', left: box.left + box.width * 0.5, top: box.top + box.height * 0.393, width: box.width * 0.165 }}
        >
          <div className="w-full h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <motion.div style={{ scaleX: progressScaleX, originX: 0 }} className="h-full bg-[#FF4D06] rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

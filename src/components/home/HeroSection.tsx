import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Info } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import Counter from '../shared/Counter';
import { useContainBox, BlurredBackdrop } from './useContainBox';

const HERO_BG = '#F2ECE6';
const FRAME_ASPECT = 1600 / 900;

interface Props {
  isDhakaOpen: boolean;
  dhakaTime: string;
  isPreloading?: boolean;
}

interface Leaf {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
  color: string;
}

function FallingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const list: Leaf[] = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 8,
      size: 12 + Math.random() * 12,
      rotate: Math.random() * 360,
      // Rich gradient color references
      color: i % 2 === 0 ? 'url(#leaf-orange-gold)' : 'url(#leaf-green-emerald)',
    }));
    setLeaves(list);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="leaf-orange-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8A50" />
            <stop offset="100%" stopColor="#FF4D06" />
          </linearGradient>
          <linearGradient id="leaf-green-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      {leaves.map((leaf) => (
        <motion.svg
          key={leaf.id}
          width={leaf.size}
          height={leaf.size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="none"
          style={{
            position: 'absolute',
            left: `${leaf.x}%`,
            top: '-5%',
          }}
          initial={{ y: '-5%', x: 0, rotate: leaf.rotate, opacity: 0 }}
          animate={{
            y: '105vh',
            x: [0, 40, -20, 20],
            rotate: leaf.rotate + 720,
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Detailed organic leaf path */}
          <path
            d="M17 8C15.5 4.5 12 2 12 2C12 2 8.5 4.5 7 8C5.5 11.5 6 15 10 18C12 19.5 12 21 12 21C12 21 12 19.5 14 18C18 15 18.5 11.5 17 8Z"
            fill={leaf.color}
          />
        </motion.svg>
      ))}
    </div>
  );
}

function BandPatch({ box, top, height, feather = 'bottom' }: { box: { left: number; top: number; width: number; height: number }; top: number; height: number; feather?: 'top' | 'bottom' }) {
  if (!box.width) return null;
  const gradientDir = feather === 'bottom' ? 'to bottom' : 'to top';
  return (
    <div
      style={{
        position: 'absolute',
        left: box.left,
        top: box.top + box.height * top,
        width: box.width,
        height: box.height * height,
        background: HERO_BG,
        WebkitMaskImage: `linear-gradient(${gradientDir}, black 90%, transparent 100%)`,
        maskImage: `linear-gradient(${gradientDir}, black 90%, transparent 100%)`,
      }}
    />
  );
}

export default function HeroSection({ isDhakaOpen, dhakaTime, isPreloading = false }: Props) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const box = useContainBox(containerRef, FRAME_ASPECT);

  // Scroll-linked transformations targeting the containerRef
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1.05]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.4], ["24px", "0px"]);
  
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: 'auto' }); };
  const fs = (fraction: number) => Math.max(9, box.width * fraction);

  // Parallax mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientWidth, clientHeight } = document.documentElement;
      const x = (e.clientX / clientWidth) - 0.5;
      const y = (e.clientY / clientHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Frosted, transparent glassmorphic CTA style
  const glassPill: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.1) 100%)',
    backdropFilter: 'blur(20px) saturate(160%)',
    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
    border: '1px solid rgba(255, 255, 255, 0.45)',
    boxShadow: '0 8px 32px 0 rgba(255, 77, 6, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
  };

  const orangeBadge: React.CSSProperties = {
    background: 'radial-gradient(circle at 35% 30%, #FF8A50 0%, #FF4D06 55%, #D93F00 100%)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -3px 6px rgba(0,0,0,0.15), 0 4px 10px rgba(255,77,6,0.4)',
  };

  const clipRevealVariants = {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)', y: '50%' },
    visible: {
      clipPath: 'inset(0% 0% 0% 0%)',
      y: '0%',
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: HERO_BG }}>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        {/* Scroll-linked Scaling Card Container */}
        <motion.div
          style={{
            scale,
            borderRadius,
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            overflow: 'hidden',
          }}
        >
          {/* Background base image */}
          <BlurredBackdrop src="/home-scenes/home-1-hero.jpeg" tint={HERO_BG} />
          <img
            src="/home-scenes/home-1-hero.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* Patch the top navbar location */}
          <BandPatch box={box} top={0} height={0.13} feather="bottom" />

          {/* Patch the baked-in title and description on the left */}
          <div
            style={{
              position: 'absolute',
              left: box.left + box.width * 0.02,
              top: box.top + box.height * 0.18,
              width: box.width * 0.46,
              height: box.height * 0.50,
              background: HERO_BG,
            }}
          />

          {/* Patch the baked-in robot and scaling widgets on the right */}
          <div
            style={{
              position: 'absolute',
              left: box.left + box.width * 0.48,
              top: box.top + box.height * 0.13,
              width: box.width * 0.50,
              height: box.height * 0.80,
              background: HERO_BG,
            }}
          />

          {/* Patch the CTA buttons area */}
          <div
            style={{
              position: 'absolute',
              left: box.left + box.width * 0.02,
              top: box.top + box.height * 0.775,
              width: box.width * 0.47,
              height: box.height * 0.13,
              background: HERO_BG,
            }}
          />

          {/* Patch the bottom stats bar */}
          <BandPatch box={box} top={0.925} height={0.075} feather="top" />
        </motion.div>

        {/* Falling Leaves Particle System */}
        <FallingLeaves />

        {/* Layer 1: Real Title & Typography (Left side, Parallax) */}
        <motion.div
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.05,
            top: box.top + box.height * 0.22,
            width: box.width * 0.45,
          }}
          animate={{
            x: -mousePos.x * 15,
            y: -mousePos.y * 15,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="flex flex-col items-start select-none z-20"
        >
          {/* Deep 3D text styling matching the mockup */}
          <h1
            style={{
              fontSize: fs(0.046),
              lineHeight: 1.05,
              fontFamily: 'var(--font-display)',
              // Layered text-shadow for rich three-dimensional typography
              textShadow: `
                1px 1px 0px #D93F00,
                2px 2px 0px #D93F00,
                3px 3px 0px #D93F00,
                4px 4px 0px #D93F00,
                5px 5px 12px rgba(11,11,11,0.15)
              `,
            }}
            className="font-extrabold uppercase tracking-tight text-[#FF4D06]"
          >
            <div className="overflow-hidden block py-1">
              <motion.span
                variants={clipRevealVariants}
                initial="hidden"
                animate={!isPreloading ? "visible" : "hidden"}
                className="block"
              >
                We're Not
              </motion.span>
            </div>
            <div className="overflow-hidden block py-1">
              <motion.span
                variants={clipRevealVariants}
                initial="hidden"
                animate={!isPreloading ? "visible" : "hidden"}
                transition={{ delay: 0.1 }}
                className="block"
              >
                Your Typical
              </motion.span>
            </div>
            <div className="overflow-hidden block py-1">
              <motion.span
                variants={clipRevealVariants}
                initial="hidden"
                animate={!isPreloading ? "visible" : "hidden"}
                transition={{ delay: 0.2 }}
                className="text-[#FF4D06] saturate-[1.2] block"
              >
                Agency.
              </motion.span>
            </div>
          </h1>
          <motion.p
            variants={fadeInUpVariants}
            initial="hidden"
            animate={!isPreloading ? "visible" : "hidden"}
            transition={{ delay: 0.35 }}
            style={{
              fontSize: fs(0.011),
              marginTop: fs(0.022),
            }}
            className="font-mono uppercase tracking-[0.15em] text-[#0B0B0B]/60 font-bold"
          >
            Strategy that drives growth. <br />
            Built different. Delivered loud.
          </motion.p>
        </motion.div>

        {/* Layer 2: Isolated Robot Mascot (Right side, Breathing + Parallax + Gentle Sway) */}
        <motion.div
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.48,
            top: box.top + box.height * 0.13,
            width: box.width * 0.48,
            height: box.height * 0.80,
          }}
          animate={{
            x: mousePos.x * 18,
            y: [box.top - 5, box.top + 5], // Breathing float loop
            rotate: [-0.6, 0.6],          // Gentle air flow sway loop
          }}
          transition={{
            y: {
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 5.5,
              ease: 'easeInOut',
            },
            rotate: {
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 9,
              ease: 'easeInOut',
            },
            x: { type: 'spring', damping: 20, stiffness: 100 },
          }}
          className="z-20 pointer-events-none"
        >
          <img
            src="/home-scenes/cleaned_hero.png"
            alt="GalaxaTech Robot Mascot"
            className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.06)]"
            style={{
              WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 50%, transparent 88%)',
              maskImage: 'radial-gradient(circle at 50% 50%, black 50%, transparent 88%)',
            }}
          />
        </motion.div>

        {/* Layer 3: Studio/Agent Status (Top Right) */}
        <div
          style={{
            position: 'absolute',
            right: box.left + box.width * 0.05,
            top: box.top + box.height * 0.22,
            textShadow: `0 1px 3px ${HERO_BG}, 0 0 8px ${HERO_BG}`,
          }}
          className="flex flex-col items-end gap-1 font-mono uppercase tracking-wider text-right whitespace-nowrap z-20"
        >
          <div className="flex items-center gap-2" style={{ fontSize: fs(0.0105) }}>
            <span className={`rounded-full flex-shrink-0 dot-pulse-glow ${isDhakaOpen ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: fs(0.0065), height: fs(0.0065) }} />
            <span className="font-bold text-black">{isDhakaOpen ? 'Agents Active' : 'Agents Offline'}</span>
          </div>
          <div style={{ fontSize: fs(0.0085) }} className="text-black/55">
            Studio time: <span className="text-[#ff4d06] font-bold">{dhakaTime}</span>
          </div>
        </div>

        {/* Layer 4: Real Frosted Glassmorphic CTAs (Left Side) */}
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          animate={!isPreloading ? "visible" : "hidden"}
          transition={{ delay: 0.5 }}
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.05,
            top: box.top + box.height * 0.79,
            width: box.width * 0.46,
          }}
          className="flex flex-col items-start z-30"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <button
              onClick={() => go('/audit')}
              style={{ ...glassPill, padding: `${fs(0.007)}px ${fs(0.008)}px ${fs(0.007)}px ${fs(0.018)}px`, gap: fs(0.012) }}
              className="group inline-flex items-center rounded-full cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,77,6,0.12)] hover:bg-white/15 whitespace-nowrap"
            >
              <span className="flex flex-col items-start leading-tight">
                <span style={{ fontSize: fs(0.0113) }} className="font-extrabold uppercase tracking-wide text-[#0B0B0B]">Are you typical?</span>
                <span style={{ fontSize: fs(0.0088) }} className="font-bold uppercase tracking-wide text-[#ff4d06]">Claim a free audit!</span>
              </span>
              <span style={{ ...orangeBadge, width: fs(0.03), height: fs(0.03) }} className="rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight style={{ width: fs(0.014), height: fs(0.014) }} className="text-white" />
              </span>
            </button>
            <button
              onClick={() => go('/audit')}
              style={{ ...glassPill, padding: `${fs(0.007)}px ${fs(0.008)}px ${fs(0.007)}px ${fs(0.02)}px`, gap: fs(0.012) }}
              className="group inline-flex items-center rounded-full font-bold uppercase tracking-wide text-[#0B0B0B] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,11,11,0.06)] hover:bg-white/15 whitespace-nowrap"
            >
              <span style={{ fontSize: fs(0.0105) }}>Book an audit</span>
              <span style={{ ...orangeBadge, width: fs(0.03), height: fs(0.03) }} className="rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight style={{ width: fs(0.014), height: fs(0.014) }} className="text-white" />
              </span>
            </button>
          </div>
          <button
            onClick={() => go('/audit')}
            style={{ fontSize: fs(0.0095), gap: fs(0.006), marginTop: fs(0.012) }}
            className="inline-flex items-center font-bold uppercase tracking-wide text-black/60 hover:text-black cursor-pointer whitespace-nowrap transition-colors"
          >
            Why audit? <Info style={{ width: fs(0.011), height: fs(0.011) }} />
          </button>
        </motion.div>

        {/* Layer 5: Statsproof Bar (Bottom Center) */}
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          animate={!isPreloading ? "visible" : "hidden"}
          transition={{ delay: 0.65 }}
          style={{ position: 'absolute', left: box.left, top: box.top + box.height * 0.94, width: box.width }}
          className="flex items-center justify-center gap-6 sm:gap-12 z-20"
        >
          <div className="text-center">
            <span style={{ fontSize: fs(0.019) }} className="block font-bold text-[#FF4D06] font-display tracking-tight">
              <Counter value={50} suffix="+" />
            </span>
            <span style={{ fontSize: fs(0.0075) }} className="block font-mono tracking-[0.15em] text-zinc-500 uppercase">Projects Delivered</span>
          </div>
          <div className="w-px bg-zinc-300 flex-shrink-0" style={{ height: fs(0.02) }} />
          <div className="text-center">
            <span style={{ fontSize: fs(0.019) }} className="block font-bold text-[#FF4D06] font-display tracking-tight">
              <Counter value={12} suffix="M+" />
            </span>
            <span style={{ fontSize: fs(0.0075) }} className="block font-mono tracking-[0.15em] text-zinc-500 uppercase">Client Revenue</span>
          </div>
          <div className="w-px bg-zinc-300 flex-shrink-0" style={{ height: fs(0.02) }} />
          <div className="text-center">
            <span style={{ fontSize: fs(0.019) }} className="block font-bold text-[#FF4D06] font-display tracking-tight">
              <Counter value={99.9} decimals={1} suffix="%" />
            </span>
            <span style={{ fontSize: fs(0.0075) }} className="block font-mono tracking-[0.15em] text-zinc-500 uppercase">System Uptime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

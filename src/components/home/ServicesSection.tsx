import { useRef, useState } from 'react';
import { Zap, Target, PieChart, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import Counter from '../shared/Counter';
import { useContainBox, BlurredBackdrop, ImagePatch } from './useContainBox';
import { SERVICES_STATS } from './data';

const DARK_BG = '#0B0B0B';
const FRAME_ASPECT = 1600 / 900;
const STAT_ICONS = [Zap, PieChart, Target];

const SERVICES = [
  { id: '01', title: 'Web & App Engineering', desc: 'React, Next.js, iOS, Android, and clean Tailwind systems.' },
  { id: '02', title: 'AI & Workflow Automation', desc: 'LLM agents, cloud webhooks, and automated deployment grids.' },
  { id: '03', title: 'Brand Identity & Design', desc: 'Interactive Spline 3D embeds, premium Figma tokens, and UI assets.' },
  { id: '04', title: 'Systems Consulting & Notion', desc: 'Operations scaling, databases, and optimized workspaces.' },
];

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const box = useContainBox(containerRef, FRAME_ASPECT);
  const fs = (fraction: number) => Math.max(9, box.width * fraction);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full h-screen" style={{ backgroundColor: DARK_BG }}>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        <BlurredBackdrop src="/home-scenes/home-2-services.jpeg" tint={DARK_BG} />
        <img
          src="/home-scenes/home-2-services.jpeg"
          alt="Reimagining web development — AI takes over, you focus on what matters"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Patch the static baked-in text on the left side of the artwork */}
        <div
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.04,
            top: box.top + box.height * 0.12,
            width: box.width * 0.44,
            height: box.height * 0.68,
            background: DARK_BG,
          }}
        />

        {/* Real Interactive Services List (Left Side) */}
        <div
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.05,
            top: box.top + box.height * 0.16,
            width: box.width * 0.42,
          }}
          className="flex flex-col select-none z-20 text-white font-mono"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 text-[#FF4D06]" style={{ fontSize: fs(0.0085) }}>
            <span className="w-1.5 h-1.5 bg-[#FF4D06] rounded-full" />
            <span className="uppercase tracking-widest font-bold">Services Provided</span>
          </div>
          
          <h2 style={{ fontSize: fs(0.024), fontFamily: 'var(--font-display)' }} className="uppercase font-black tracking-tight mb-8 leading-none">
            Digital Ecosystems, <br />Built to Scale
          </h2>

          {/* List Table */}
          <div className="flex flex-col border-t border-white/10">
            {SERVICES.map((service, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <motion.div
                  key={service.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    padding: `${fs(0.012)}px 0`,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
                  }}
                  className="relative cursor-pointer transition-all duration-300 flex items-center justify-between group overflow-hidden px-4"
                >
                  {/* Hover background slide */}
                  <motion.div
                    className="absolute inset-0 bg-[#F2ECE6] z-0"
                    initial={{ y: '100%' }}
                    animate={{ y: isHovered ? '0%' : '100%' }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Left content block */}
                  <div className="relative z-10 flex items-start gap-4 flex-1 pr-6">
                    <span
                      style={{ fontSize: fs(0.009) }}
                      className={`font-bold transition-colors duration-300 ${isHovered ? 'text-[#FF4D06]' : 'text-zinc-500'}`}
                    >
                      {service.id}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h4
                        style={{ fontSize: fs(0.0125) }}
                        className={`font-extrabold uppercase transition-colors duration-300 ${isHovered ? 'text-black font-display' : 'text-white'}`}
                      >
                        {service.title}
                      </h4>
                      <p
                        style={{ fontSize: fs(0.0085) }}
                        className={`transition-colors duration-300 leading-snug font-mono ${isHovered ? 'text-black/60' : 'text-zinc-400'}`}
                      >
                        {service.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <motion.div
                    className="relative z-10 flex-shrink-0"
                    animate={{
                      x: isHovered ? 4 : 0,
                      y: isHovered ? -4 : 0,
                      color: isHovered ? '#FF4D06' : '#FFFFFF',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowUpRight style={{ width: fs(0.016), height: fs(0.016) }} />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Patch the flat baked-in "10X FASTER / 1/3 THE COST / 100% FOCUS ON IDEAS" stat row at the bottom of the artwork. */}
        <ImagePatch box={box} top={0.83} height={0.17} color={DARK_BG} feather="top" />

        {/* Real, animated stat row in its place */}
        <div
          style={{ position: 'absolute', left: box.left, top: box.top + box.height * 0.86, width: box.width }}
          className="flex items-center justify-center gap-8 sm:gap-16 z-20"
        >
          {SERVICES_STATS.map((stat, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <div key={stat.label} className="flex items-center gap-2 sm:gap-3">
                <Icon style={{ width: fs(0.016), height: fs(0.016) }} className="text-[#FF4D06] flex-shrink-0" />
                <div>
                  <span style={{ fontSize: fs(0.02) }} className="block font-bold text-[#FF4D06] font-display tracking-tight leading-none">
                    {stat.display ?? <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />}
                  </span>
                  <span style={{ fontSize: fs(0.0075) }} className="block font-mono tracking-[0.1em] text-zinc-400 uppercase mt-1">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

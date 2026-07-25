import { useRef } from 'react';
import { Zap, Target, PieChart } from 'lucide-react';
import Counter from '../shared/Counter';
import { useContainBox, BlurredBackdrop, ImagePatch } from './useContainBox';
import { SERVICES_STATS } from './data';

const DARK_BG = '#0B0B0B';
const FRAME_ASPECT = 1600 / 900;
const STAT_ICONS = [Zap, PieChart, Target];

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const box = useContainBox(containerRef, FRAME_ASPECT);
  const fs = (fraction: number) => Math.max(9, box.width * fraction);

  return (
    <section className="relative w-full h-screen" style={{ backgroundColor: DARK_BG }}>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        <BlurredBackdrop src="/home-scenes/home-2-services.jpeg" tint={DARK_BG} />
        <img
          src="/home-scenes/home-2-services.jpeg"
          alt="Reimagining web development — AI takes over, you focus on what matters"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Patch the flat baked-in "10X FASTER / 1/3 THE COST / 100% FOCUS ON IDEAS" stat row at the bottom of the artwork. */}
        <ImagePatch box={box} top={0.83} height={0.17} color={DARK_BG} feather="top" />

        {/* Real, animated stat row in its place */}
        <div
          style={{ position: 'absolute', left: box.left, top: box.top + box.height * 0.86, width: box.width }}
          className="flex items-center justify-center gap-8 sm:gap-16"
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

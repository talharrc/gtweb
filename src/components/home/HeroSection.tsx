import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Info } from 'lucide-react';
import Counter from '../shared/Counter';
import { useContainBox, BlurredBackdrop } from './useContainBox';

const HERO_BG = '#F2ECE6';

// The hero artwork is a true 1600x900 (16:9) generation — matches the most common desktop
// viewport aspect ratio almost exactly, so object-contain renders with little to no
// letterboxing on typical screens.
const FRAME_ASPECT = 1600 / 900;

interface Props {
  isDhakaOpen: boolean;
  dhakaTime: string;
}

/** Only the hero keeps a fake nav bar / CTAs / chat bubble / stats bar baked into the
 * artwork. This patches a band out with a fill matching the background tone, feathered
 * at the edge, so the real overlaid DOM (Navbar, CTAs, stats) is the only thing actually
 * on screen. Sized against the actual contain-box, not the viewport, so it stays
 * pixel-aligned with the artwork at any window size. */
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

export default function HeroSection({ isDhakaOpen, dhakaTime }: Props) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const box = useContainBox(containerRef, FRAME_ASPECT);
  const go = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: 'auto' }); };
  const fs = (fraction: number) => Math.max(9, box.width * fraction);

  const glassPill: React.CSSProperties = {
    background: 'linear-gradient(160deg, rgba(255,255,255,0.7), rgba(255,255,255,0.32))',
    backdropFilter: 'blur(16px) saturate(160%)',
    WebkitBackdropFilter: 'blur(16px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.55)',
    borderTop: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 14px 30px rgba(11,11,11,0.14), inset 0 1px 0 rgba(255,255,255,0.6)',
  };
  const orangeBadge: React.CSSProperties = {
    background: 'radial-gradient(circle at 35% 30%, #FF8A50 0%, #FF4D06 55%, #D93F00 100%)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -3px 6px rgba(0,0,0,0.15), 0 4px 10px rgba(255,77,6,0.4)',
  };

  return (
    <section className="relative w-full h-screen" style={{ backgroundColor: HERO_BG }}>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        <BlurredBackdrop src="/home-scenes/home-1-hero.jpeg" tint={HERO_BG} />
        <img
          src="/home-scenes/home-1-hero.jpeg"
          alt="GalaxaTech — We're not your typical agency"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Patch the fake drawn nav bar baked into the top of the artwork. */}
        <BandPatch box={box} top={0} height={0.13} feather="bottom" />
        {/* Patch the fake drawn CTA buttons + "why audit" link. */}
        <div
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.02,
            top: box.top + box.height * 0.775,
            width: box.width * 0.47,
            height: box.height * 0.13,
            background: HERO_BG,
            WebkitMaskImage: 'linear-gradient(to right, black 97%, transparent 100%)',
            maskImage: 'linear-gradient(to right, black 97%, transparent 100%)',
          }}
        />
        {/* Patch the fake drawn chat bubble icon — the real, site-wide fixed chat button floats over this same corner. */}
        <div
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.90,
            top: box.top + box.height * 0.865,
            width: box.width * 0.10,
            height: box.height * 0.135,
            background: `radial-gradient(circle at 55% 45%, ${HERO_BG} 50%, transparent 72%)`,
          }}
        />
        {/* Patch the fake drawn stats bar at the very bottom edge — replaced below with real, animated counters. */}
        <BandPatch box={box} top={0.925} height={0.075} feather="top" />

        {/* Real, live agent/studio status */}
        <div
          style={{
            position: 'absolute', right: box.left + box.width * 0.025, top: box.top + box.height * 0.2256,
            textShadow: `0 1px 3px ${HERO_BG}, 0 0 8px ${HERO_BG}`,
          }}
          className="flex flex-col items-end gap-1 font-mono uppercase tracking-wider text-right whitespace-nowrap"
        >
          <div className="flex items-center gap-2" style={{ fontSize: fs(0.0105) }}>
            <span className={`rounded-full flex-shrink-0 dot-pulse-glow ${isDhakaOpen ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: fs(0.0065), height: fs(0.0065) }} />
            <span className="font-bold text-black">{isDhakaOpen ? 'Agents Active' : 'Agents Offline'}</span>
          </div>
          <div style={{ fontSize: fs(0.0085) }} className="text-black/55">
            Studio time: <span className="text-[#ff4d06] font-bold">{dhakaTime}</span>
          </div>
        </div>

        {/* Real CTAs */}
        <div
          style={{ position: 'absolute', left: box.left + box.width * 0.02, top: box.top + box.height * 0.79, width: box.width * 0.46 }}
          className="flex flex-col items-start"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <button
              onClick={() => go('/audit')}
              style={{ ...glassPill, padding: `${fs(0.007)}px ${fs(0.008)}px ${fs(0.007)}px ${fs(0.018)}px`, gap: fs(0.012) }}
              className="group inline-flex items-center rounded-full cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
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
              className="group inline-flex items-center rounded-full font-bold uppercase tracking-wide text-[#0B0B0B] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
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
            className="inline-flex items-center font-bold uppercase tracking-wide text-black/60 hover:text-black cursor-pointer whitespace-nowrap"
          >
            Why audit? <Info style={{ width: fs(0.011), height: fs(0.011) }} />
          </button>
        </div>

        {/* Real, animated stat proof bar — replaces the flat baked-in "50+ / 12M+ / 99.9%" text */}
        <div
          style={{ position: 'absolute', left: box.left, top: box.top + box.height * 0.94, width: box.width }}
          className="flex items-center justify-center gap-6 sm:gap-12"
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
        </div>
      </div>
    </section>
  );
}

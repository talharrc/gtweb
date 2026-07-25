import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { Bell, Clock, FolderOpen as FolderIcon, BarChart3, Sparkles } from 'lucide-react';
import { PROCESS_FEATURES } from './data';
import { VIEWPORT_DEFAULT } from './motion-tokens';

function handleCardTiltMove(e: React.MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const tiltX = (rect.height / 2 - y) / 16;
  const tiltY = (x - rect.width / 2) / 16;
  card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
}
function handleCardTiltLeave(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

const OVERVIEW_ICONS = [Clock, BarChart3, FolderIcon, Sparkles];
const OVERVIEW_LABELS = ['Timeline', 'Tasks', 'Assets', 'Reports'];
const TEAM_INITIALS = ['YOU', 'PM', 'UX', 'DEV'];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const progressTransform = useTransform(scrollYProgress, [0.15, 0.6], [0, 0.72]);
  const progressSpring = useSpring(progressTransform, { stiffness: 100, damping: 30 });
  const progressScaleX = shouldReduceMotion ? 0.72 : progressSpring;

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 px-6 relative overflow-hidden bg-[#F2ECE6]">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-white/25 blur-[140px] rounded-full pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: copy + feature bullets */}
        <div className="lg:col-span-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.7 }}>
            <span className="text-[10px] font-mono text-[#FF4D06] tracking-[0.3em] uppercase block mb-3">04 — Client Experience</span>
            <p className="text-[#FF4D06] font-bold text-xs uppercase tracking-[0.2em] mb-3">Dedicated. Personal. Exceptional.</p>
            <h2 className="display-poster text-4xl sm:text-5xl md:text-6xl mb-6 text-[#0B0B0B]">
              The Most<br />
              <span className="pill-word-brand text-white text-2xl sm:text-3xl md:text-4xl mt-2 inline-block" style={{ background: '#FF4D06' }}>Luxurious Client Service.</span>
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-md mb-2">
              From the moment your project starts, you get access to your <span className="text-[#FF4D06] font-semibold">dedicated client portal.</span>
            </p>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-md mb-8">
              Everything. In one place. Just for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROCESS_FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_DEFAULT}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="tilt-card-container"
              >
                <div
                  onMouseMove={handleCardTiltMove}
                  onMouseLeave={handleCardTiltLeave}
                  className="tilt-card cursor-pointer p-4 rounded-xl border border-zinc-200/60 bg-white/50 backdrop-blur-md"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#FF4D06]/10 border border-[#FF4D06]/20 text-[#FF4D06] mb-3">
                    <f.icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-[#0B0B0B] font-bold text-sm mb-1 font-display">{f.title}</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: phone mockup with live progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={VIEWPORT_DEFAULT}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="w-[280px] rounded-[2.5rem] border-[8px] border-[#0B0B0B] bg-[#0B0B0B] shadow-2xl overflow-hidden">
            <div className="bg-white rounded-[2rem] overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[10px] font-semibold text-[#0B0B0B]">
                <span>9:41</span>
                <div className="w-20 h-4 bg-[#0B0B0B] rounded-full" />
                <Bell className="w-3 h-3" />
              </div>

              <div className="px-5 pb-6">
                <p className="text-[11px] text-zinc-500 mt-2">Welcome back,</p>
                <p className="text-sm font-bold text-[#0B0B0B] mb-4">John Smith</p>

                <div className="rounded-xl bg-[#0B0B0B] text-white p-3.5 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold">Website Redesign</span>
                    <span className="text-[9px] font-bold uppercase bg-[#FF4D06] text-[#0B0B0B] px-1.5 py-0.5 rounded">In Progress</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden mb-2">
                    <motion.div style={{ scaleX: progressScaleX, originX: 0 }} className="h-full bg-[#FF4D06] rounded-full" />
                  </div>
                  <div className="flex justify-between text-[9px] text-white/50">
                    <span>Progress: 72%</span>
                    <span>8 Days Left</span>
                  </div>
                </div>

                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-2">Project Overview</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {OVERVIEW_ICONS.map((Icon, i) => (
                    <div key={OVERVIEW_LABELS[i]} className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] text-zinc-500">{OVERVIEW_LABELS[i]}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-2">Team</p>
                <div className="flex -space-x-2">
                  {TEAM_INITIALS.map(t => (
                    <div key={t} className="w-7 h-7 rounded-full border-2 border-white bg-[#FF4D06]/15 text-[#FF4D06] text-[8px] font-bold flex items-center justify-center">
                      {t}
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-[#FF4D06] text-white flex items-center justify-center text-xs font-bold">+</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

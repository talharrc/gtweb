import { motion } from 'motion/react';
import { X, Check, Hourglass, Rocket, Zap, Target, ArrowRight } from 'lucide-react';
import Counter from '../shared/Counter';
import { SERVICES_STATS } from './data';
import { VIEWPORT_DEFAULT } from './motion-tokens';

const STAT_ICONS = [Zap, Target, Target];

export default function ServicesSection() {
  return (
    <section className="py-20 sm:py-28 px-6 relative overflow-hidden bg-[#0B0B0B] border-b border-zinc-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,77,6,0.06),transparent_50%)] pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.7 }} className="text-center mb-14">
          <span className="text-[10px] font-mono text-[#FF4D06] tracking-[0.3em] uppercase block mb-3">03 — AI Web Development</span>
          <h2 className="display-poster text-4xl sm:text-5xl md:text-6xl mb-4">
            <span className="block text-white">Reimagining</span>
            <span className="pill-word-brand text-white text-2xl sm:text-3xl md:text-4xl mt-2 inline-block" style={{ background: '#FF4D06' }}>Web Development.</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto mt-4">
            AI takes over. <span className="text-[#FF4D06] font-semibold">You focus on what matters.</span>
          </p>
        </motion.div>

        {/* Old Way vs AI Way comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_DEFAULT}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-zinc-800 bg-white/[0.02] p-7 text-center"
          >
            <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center mx-auto mb-4">
              <X className="w-5 h-5 text-zinc-500" />
            </div>
            <p className="text-[#FF4D06]/70 font-mono text-xs uppercase tracking-[0.2em] mb-2">The Old Way</p>
            <div className="flex items-center justify-center gap-2 text-zinc-500">
              <Hourglass className="w-5 h-5" />
              <span className="display-poster text-2xl sm:text-3xl text-zinc-400">Weeks to Months</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT_DEFAULT}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden sm:flex items-center justify-center"
          >
            <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
              <ArrowRight className="w-8 h-8 text-[#FF4D06]" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_DEFAULT}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-[#FF4D06]/40 bg-[#FF4D06]/[0.06] p-7 text-center relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-[#FF4D06]" />
            <div className="w-10 h-10 rounded-full border border-[#FF4D06]/40 bg-[#FF4D06]/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-5 h-5 text-[#FF4D06]" />
            </div>
            <p className="text-[#FF4D06] font-mono text-xs uppercase tracking-[0.2em] mb-2">The AI Way</p>
            <div className="flex items-center justify-center gap-2 text-white">
              <Rocket className="w-5 h-5 text-[#FF4D06]" />
              <span className="display-poster text-2xl sm:text-3xl">Days</span>
            </div>
          </motion.div>
        </div>

        {/* Traditional vs GalaxaTech timeline bar — same before/after motif used in Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_DEFAULT}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto mb-16 flex flex-col gap-3 bg-white/[0.03] border border-zinc-800 p-4 font-mono text-[10px] text-zinc-400 rounded-xl"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="uppercase tracking-wider">Traditional Agency</span>
            <div className="w-1/2 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 1 }} style={{ originX: 0 }} className="h-full bg-zinc-500 rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="uppercase tracking-wider text-white">With GalaxaTech</span>
            <div className="w-1/2 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 0.15 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 1, delay: 0.2 }} style={{ originX: 0 }} className="h-full bg-[#FF4D06] rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Stat proof row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
          {SERVICES_STATS.map((stat, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_DEFAULT}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <Icon className="w-5 h-5 text-[#FF4D06]/70" />
                <span className="display-poster text-3xl sm:text-4xl text-[#FF4D06]">
                  {stat.display ?? <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />}
                </span>
                <span className="text-[10px] font-mono tracking-[0.15em] text-zinc-500 uppercase">{stat.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

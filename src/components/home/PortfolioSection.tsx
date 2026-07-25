import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from './data';
import { VIEWPORT_DEFAULT } from './motion-tokens';

export default function PortfolioSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 px-6 relative overflow-hidden bg-[#0B0B0B] border-b border-zinc-900">
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[9px] font-mono tracking-[0.3em] text-white/35 select-none pointer-events-none uppercase">
        SELECTED_WORK // 03_PROJECTS
      </div>
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[9px] font-mono tracking-[0.3em] text-white/35 select-none pointer-events-none uppercase">
        CLIENT_SYSTEMS // 2024–2026
      </div>

      <div className="absolute bottom-0 left-0 w-[38%] h-[3px] bg-[#FF4D06]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.7 }}>
            <span className="text-[10px] font-mono text-[#FF4D06]/75 tracking-[0.3em] uppercase block mb-3">06 — Portfolio</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
              Brands We<br />
              <span className="pill-word-brand text-white inline-block text-2xl sm:text-3xl mt-2" style={{ background: '#FF4D06' }}>Built.</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[220px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
            A few projects, systems, and brands we've helped shape.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_DEFAULT}
          transition={{ duration: 0.5 }}
          className="hairline-grid grid-cols-3 mb-10"
        >
          <div className="hairline-grid-cell font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">03 Projects</div>
          <div className="hairline-grid-cell font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">Global Delivery</div>
          <div className="hairline-grid-cell font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">2024 – 2026</div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PROJECTS.map((proj, i) => (
            <motion.button
              key={proj.slug}
              onClick={() => navigate(`/portfolio/${proj.slug}`)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_DEFAULT}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group text-left rounded-2xl overflow-hidden border border-zinc-800 bg-white/[0.03] hover:border-[#FF4D06]/40 transition-colors duration-200 cursor-pointer flex flex-col"
            >
              <div className="relative h-[190px] flex items-center justify-center overflow-hidden" style={{ background: proj.ground }}>
                <span className="absolute top-3 left-3 text-[9px] font-mono z-10" style={{ color: proj.ink, opacity: 0.5 }}>{proj.num}</span>
                {proj.img ? (
                  <img src={proj.img} alt={proj.name} className="w-full h-full object-cover" />
                ) : (
                  <proj.icon className="w-12 h-12 transition-transform duration-200 group-hover:scale-110" style={{ color: proj.ink, opacity: 0.2 }} />
                )}
              </div>
              <div className="p-4 flex items-center justify-between bg-[#0B0B0B]">
                <div>
                  <p className="text-white font-bold text-sm font-display leading-tight">{proj.name}</p>
                  <p className="text-white/40 text-[10px] mt-0.5 font-mono uppercase tracking-wide">{proj.type}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#FF4D06] flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button onClick={() => navigate('/portfolio')} className="group btn-square inline-flex items-center gap-2 bg-[#FF4D06] text-[#0B0B0B] px-8 py-3.5 text-xs hover:brightness-95 transition-all cursor-pointer">
            View Full Portfolio <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

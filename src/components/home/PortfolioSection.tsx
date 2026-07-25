import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from './data';
import { VIEWPORT_DEFAULT } from './motion-tokens';

export default function PortfolioSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 bg-[#0B0B0B]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.6 }} className="mb-10">
          <span className="text-[10px] font-mono text-[#FF4D06]/75 tracking-[0.3em] uppercase block mb-3">06 — Portfolio</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Brands we <span className="text-[#FF4D06]">built.</span>
          </h2>
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
              className="group text-left rounded-xl overflow-hidden border border-zinc-800 bg-white/[0.03] hover:border-[#FF4D06]/40 transition-colors duration-200 cursor-pointer flex flex-col"
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
                  <p className="text-white font-bold text-sm leading-tight">{proj.name}</p>
                  <p className="text-white/40 text-[10px] mt-0.5 font-mono uppercase tracking-wide">{proj.type}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#FF4D06] flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button onClick={() => navigate('/portfolio')} className="group inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#FF4D06] transition-colors">
            View full portfolio
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

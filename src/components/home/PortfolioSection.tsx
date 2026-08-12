import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Folder, Eye } from 'lucide-react';

const DARK_BG = '#0B0B0B';

const FEATURED_PROJECTS = [
  {
    id: 'lumen',
    title: 'Lumen Workspace',
    category: 'AI Operational SaaS',
    desc: 'Systems-first automated documentation hub for distributed technical teams.',
    color: 'from-[#1E3A8A]/35 to-[#0F172A]',
    accent: '#3B82F6',
    year: '2026',
  },
  {
    id: 'nexora',
    title: 'Nexora Platform',
    category: 'Aesthetic Commerce',
    desc: 'High-fidelity head-less store engine with real-time inventory nodes.',
    color: 'from-[#5B21B6]/35 to-[#0F172A]',
    accent: '#8B5CF6',
    year: '2025',
  },
  {
    id: 'veridian',
    title: 'Veridian Systems',
    category: 'Quantitative Finance',
    desc: 'High-throughput trading pipeline and real-time dashboard layout.',
    color: 'from-[#065F46]/35 to-[#0F172A]',
    accent: '#10B981',
    year: '2025',
  },
  {
    id: 'elane',
    title: 'Elane Studio',
    category: 'Creative Production',
    desc: 'Audio-visual agency interface integrated with custom WebGL player modules.',
    color: 'from-[#991B1B]/35 to-[#0F172A]',
    accent: '#EF4444',
    year: '2024',
  },
];

const ARCHIVE_PROJECTS = [
  { title: 'Solaric Systems', category: 'Energy Grid SaaS', year: '2025', preview: 'bg-[#FF4D06]/10 border-[#FF4D06]' },
  { title: 'Apex Commerce', category: 'E-commerce Core', year: '2024', preview: 'bg-blue-500/10 border-blue-500' },
  { title: 'Zen Workspace', category: 'Notion Architecture', year: '2024', preview: 'bg-purple-500/10 border-purple-500' },
  { title: 'Vertex AI Labs', category: 'Custom Models Integration', year: '2023', preview: 'bg-green-500/10 border-green-500' },
];

export default function PortfolioSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLDivElement>(null);

  // Parallax Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const yCard1 = useTransform(scrollYProgress, [0, 1], [120, -180]);
  const yCard2 = useTransform(scrollYProgress, [0, 1], [40, -80]);
  const yCard3 = useTransform(scrollYProgress, [0, 1], [220, -220]);
  const yCard4 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const goPortfolio = () => {
    navigate('/portfolio');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Follow-Cursor Tooltip States
  const [hoveredArchive, setHoveredArchive] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const springX = useSpring(0, { damping: 30, stiffness: 350 });
  const springY = useSpring(0, { damping: 30, stiffness: 350 });

  useEffect(() => {
    springX.set(mousePos.x);
    springY.set(mousePos.y);
  }, [mousePos, springX, springY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (archiveRef.current) {
      const rect = archiveRef.current.getBoundingClientRect();
      // Tooltip position relative to the archive section
      setMousePos({
        x: e.clientX - rect.left + 25,
        y: e.clientY - rect.top - 70,
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden text-white flex flex-col py-24 px-6 md:px-16"
      style={{ backgroundColor: DARK_BG }}
    >
      {/* 1. Header Typography */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-16">
        <div className="flex flex-col gap-3 font-mono">
          <div className="flex items-center gap-2 text-[#FF4D06] text-xs">
            <Folder className="w-4 h-4" />
            <span className="uppercase tracking-widest font-bold">Selected Work</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Brands We Built
          </h2>
        </div>
        <button
          onClick={goPortfolio}
          className="group flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-[#FF4D06] hover:border-[#FF4D06] hover:text-black font-mono font-bold py-3 px-6 rounded-full transition-all duration-300 cursor-pointer"
        >
          <span>Explore Case Studies</span>
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* 2. Parallax Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative min-h-screen mb-32">
        {/* Left Sticky Column */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6 select-none font-mono">
          <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Featured Outputs</span>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-black uppercase text-[#FF4D06]">
            System Integration
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
            We bridge high-fidelity interface layouts with strict database schemas. Below are selected live deployments engineered for international client projects.
          </p>
          <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-zinc-500">
            <p>· Responsive React + Tailwind compiles</p>
            <p>· Sub-second serverless execution speed</p>
            <p>· Dynamic content node injection</p>
          </div>
        </div>

        {/* Right Floating Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:pt-16">
          {/* Card 1: Lumen */}
          <motion.div
            style={{ y: yCard1 }}
            onClick={goPortfolio}
            className={`cursor-pointer border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-[360px] md:h-[420px] bg-gradient-to-br ${FEATURED_PROJECTS[0].color} hover:border-[#FF4D06]/40 transition-colors duration-300 shadow-xl group`}
          >
            <div className="flex justify-between items-start font-mono text-xs text-zinc-500">
              <span>{FEATURED_PROJECTS[0].category}</span>
              <span className="text-[#FF4D06] font-bold">{FEATURED_PROJECTS[0].year}</span>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)' }} className="font-extrabold text-2xl md:text-3xl tracking-tight text-white mb-2 uppercase">
                {FEATURED_PROJECTS[0].title}
              </h4>
              <p className="text-zinc-400 text-xs font-mono leading-relaxed pr-4">
                {FEATURED_PROJECTS[0].desc}
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 group-hover:text-white transition-colors">
              <span>Access Node</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: Nexora */}
          <motion.div
            style={{ y: yCard2 }}
            onClick={goPortfolio}
            className={`cursor-pointer border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-[360px] md:h-[420px] bg-gradient-to-br ${FEATURED_PROJECTS[1].color} hover:border-[#FF4D06]/40 transition-colors duration-300 shadow-xl group`}
          >
            <div className="flex justify-between items-start font-mono text-xs text-zinc-500">
              <span>{FEATURED_PROJECTS[1].category}</span>
              <span className="text-[#FF4D06] font-bold">{FEATURED_PROJECTS[1].year}</span>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)' }} className="font-extrabold text-2xl md:text-3xl tracking-tight text-white mb-2 uppercase">
                {FEATURED_PROJECTS[1].title}
              </h4>
              <p className="text-zinc-400 text-xs font-mono leading-relaxed pr-4">
                {FEATURED_PROJECTS[1].desc}
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 group-hover:text-white transition-colors">
              <span>Access Node</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.div>

          {/* Card 3: Veridian */}
          <motion.div
            style={{ y: yCard3 }}
            onClick={goPortfolio}
            className={`cursor-pointer border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-[360px] md:h-[420px] bg-gradient-to-br ${FEATURED_PROJECTS[2].color} hover:border-[#FF4D06]/40 transition-colors duration-300 shadow-xl group md:mt-8`}
          >
            <div className="flex justify-between items-start font-mono text-xs text-zinc-500">
              <span>{FEATURED_PROJECTS[2].category}</span>
              <span className="text-[#FF4D06] font-bold">{FEATURED_PROJECTS[2].year}</span>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)' }} className="font-extrabold text-2xl md:text-3xl tracking-tight text-white mb-2 uppercase">
                {FEATURED_PROJECTS[2].title}
              </h4>
              <p className="text-zinc-400 text-xs font-mono leading-relaxed pr-4">
                {FEATURED_PROJECTS[2].desc}
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 group-hover:text-white transition-colors">
              <span>Access Node</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.div>

          {/* Card 4: Elane */}
          <motion.div
            style={{ y: yCard4 }}
            onClick={goPortfolio}
            className={`cursor-pointer border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-[360px] md:h-[420px] bg-gradient-to-br ${FEATURED_PROJECTS[3].color} hover:border-[#FF4D06]/40 transition-colors duration-300 shadow-xl group`}
          >
            <div className="flex justify-between items-start font-mono text-xs text-zinc-500">
              <span>{FEATURED_PROJECTS[3].category}</span>
              <span className="text-[#FF4D06] font-bold">{FEATURED_PROJECTS[3].year}</span>
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)' }} className="font-extrabold text-2xl md:text-3xl tracking-tight text-white mb-2 uppercase">
                {FEATURED_PROJECTS[3].title}
              </h4>
              <p className="text-zinc-400 text-xs font-mono leading-relaxed pr-4">
                {FEATURED_PROJECTS[3].desc}
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 group-hover:text-white transition-colors">
              <span>Access Node</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. Compact Project Archive List (Follow-Cursor Tooltip) */}
      <div
        ref={archiveRef}
        onMouseMove={handleMouseMove}
        className="relative border-t border-white/10 pt-16 select-none cursor-crosshair"
      >
        <div className="flex flex-col gap-2 mb-6 font-mono">
          <span className="text-xs text-[#FF4D06] uppercase tracking-widest font-bold">Project Archive</span>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold uppercase">Historic Deployments</h3>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col border-b border-white/5 relative z-10">
          {ARCHIVE_PROJECTS.map((proj, idx) => (
            <div
              key={proj.title}
              onMouseEnter={() => setHoveredArchive(idx)}
              onMouseLeave={() => setHoveredArchive(null)}
              onClick={goPortfolio}
              className="group flex items-center justify-between py-5 border-t border-white/5 hover:border-white/20 transition-colors font-mono text-xs md:text-sm px-4 hover:bg-white/[0.01]"
            >
              <div className="flex items-center gap-6">
                <span className="text-zinc-600 group-hover:text-[#FF4D06] font-bold">0{idx + 1}</span>
                <span className="font-extrabold uppercase text-white group-hover:text-[#FF4D06] transition-colors">{proj.title}</span>
              </div>
              <div className="flex items-center gap-12">
                <span className="hidden sm:inline text-zinc-500 uppercase">{proj.category}</span>
                <span className="text-zinc-600 group-hover:text-white transition-colors">{proj.year}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-[#FF4D06] transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Hover Cursor-Following Tooltip Preview */}
        <AnimatePresence>
          {hoveredArchive !== null && (
            <motion.div
              style={{
                x: springX,
                y: springY,
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 40,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="w-48 h-32 rounded-2xl overflow-hidden border border-white/15 shadow-2xl backdrop-blur-md flex flex-col justify-between p-4"
            >
              {/* Background gradient indicator */}
              <div className={`absolute inset-0 z-0 opacity-20 bg-gradient-to-br ${ARCHIVE_PROJECTS[hoveredArchive].preview}`} />

              <div className="relative z-10 flex justify-between items-start font-mono text-[9px] text-zinc-500 uppercase">
                <span>0{hoveredArchive + 1} // Archive</span>
                <span>{ARCHIVE_PROJECTS[hoveredArchive].year}</span>
              </div>

              <div className="relative z-10 mt-auto">
                <h5 className="font-display font-black text-sm uppercase text-white tracking-tight leading-tight">
                  {ARCHIVE_PROJECTS[hoveredArchive].title}
                </h5>
                <p className="font-mono text-[8px] text-zinc-400 uppercase tracking-wider mt-0.5">
                  {ARCHIVE_PROJECTS[hoveredArchive].category}
                </p>
              </div>

              {/* Glowing cursor ring helper */}
              <div className="absolute right-3 bottom-3 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5 text-[#FF4D06] animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Search, Workflow, Code2, Rocket } from 'lucide-react';
import SpotlightCard from '../shared/SpotlightCard';

const PROCESS_STEPS = [
  { num: '01', title: 'Discover', desc: 'Understand goals, users, and opportunities.', Icon: Search },
  { num: '02', title: 'Strategize', desc: 'Shape the roadmap, system, and execution plan.', Icon: Workflow },
  { num: '03', title: 'Build', desc: 'Design and develop the core solution.', Icon: Code2 },
  { num: '04', title: 'Deploy', desc: 'Launch, refine, and optimize for growth.', Icon: Rocket },
];

export default function HowWeWork() {
  const processRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [illuminatedSteps, setIlluminatedSteps] = useState<Set<number>>(new Set());

  const { scrollYProgress: processScroll } = useScroll({
    target: processRef,
    offset: ["start end", "end start"]
  });
  const processScaleX = useSpring(processScroll, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setIlluminatedSteps(prev => new Set([...prev, i])); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section ref={processRef} className="py-16 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(11,36,112,0.24) 50%, transparent 100%)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#0041CC]/7 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-[#FFB020]/[0.045] blur-[130px] rounded-full pointer-events-none" />
      <div className="specular-beam absolute top-0 left-0 w-full h-[140%] rotate-[-8deg]" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
            <span className="text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase block mb-3">03 — Process</span>
            <h2 className="display-sora text-4xl sm:text-5xl md:text-6xl mb-6">
              <span className="block text-white">How We</span>
              <span className="pill-word-accent text-white text-2xl sm:text-3xl md:text-4xl mt-2 inline-block" style={{ background: 'linear-gradient(135deg, #0059FF, #00C2FF)' }}>Work.</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
            A clear, collaborative journey from idea to deployed digital systems.
          </motion.p>
        </div>

        {/* Illuminated progress rail — fills as steps scroll into view */}
        <div className="relative h-1.5 rounded-full bg-white/10 mb-8 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
            style={{ scaleX: processScaleX, originX: 0 }}
          />
        </div>

        {/* 2×2 Process card grid — alternating dark/icy surfaces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PROCESS_STEPS.map((step, i) => {
            const StepIcon = step.Icon;
            const isIlluminated = illuminatedSteps.has(i);
            const isIcy = i % 2 === 1;
            return (
              <motion.div
                key={step.num}
                ref={el => { stepRefs.current[i] = el; }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative flex flex-col"
              >
                {isIcy ? (
                  <div className="w-full h-full p-7 rounded-3xl icy-card group">
                    <div className="absolute right-5 bottom-4 font-black select-none pointer-events-none leading-none z-0" style={{ fontSize: '100px', color: 'rgba(0,89,255,0.05)', fontFamily: 'var(--font-display)' }}>{step.num}</div>
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light float-idle text-[#0059FF] group-hover:scale-105 transition-transform duration-300 [&>svg]:relative [&>svg]:z-10" style={{ animationDelay: `${i * 0.4}s` }}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono text-blue-700 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full">{step.num}</span>
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg mb-2 font-display relative z-10">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed relative z-10">{step.desc}</p>
                  </div>
                ) : (
                  <SpotlightCard
                    className="w-full h-full p-7 rounded-3xl glass-card-premium border transition-colors duration-500 group"
                    style={{ borderColor: isIlluminated ? '#00C2FF' : 'rgba(255,255,255,0.08)' }}
                  >
                    <div className="absolute right-5 bottom-4 font-black select-none pointer-events-none leading-none z-0" style={{ fontSize: '100px', color: 'rgba(255,255,255,0.02)', fontFamily: 'var(--font-display)' }}>{step.num}</div>
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d float-idle text-[#E8F4FF] group-hover:scale-105 transition-transform duration-300 [&>svg]:relative [&>svg]:z-10" style={{ animationDelay: `${i * 0.4}s` }}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono text-white font-bold bg-primary/20 px-2.5 py-1 rounded-full">{step.num}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2 font-display relative z-10">{step.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed relative z-10">{step.desc}</p>
                  </SpotlightCard>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

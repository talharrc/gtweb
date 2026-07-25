import { motion } from 'motion/react';
import { ArrowUpRight, DollarSign, RefreshCw, TrendingUp, Shield, Zap } from 'lucide-react';
import { VIEWPORT_DEFAULT } from './motion-tokens';

const CARDS = [
  {
    icon: Zap, num: '01', title: 'Faster Delivery',
    desc: 'Most projects go live in days, not weeks. Our AI-assisted workflows cut down turnaround times dramatically.',
    span: 'md:col-span-4',
  },
  {
    icon: DollarSign, num: '02', title: 'More Affordable',
    desc: 'AI cuts development hours, so you pay less for a high-performance system.',
    span: 'md:col-span-2',
  },
  {
    icon: RefreshCw, num: '03', title: 'Unlimited Revisions',
    desc: 'Request as many changes as you need during development. No limits.',
    span: 'md:col-span-2',
  },
  {
    icon: TrendingUp, num: '04', title: 'Built to Convert',
    desc: 'We design digital systems optimized to attract customers and generate results, not just look pretty.',
    span: 'md:col-span-2',
  },
  {
    icon: Shield, num: '05', title: 'Long-Term Support',
    desc: "We don't disappear after delivery. We offer continuous updates and maintenance.",
    span: 'md:col-span-2',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 px-6 bg-[#F2ECE6]">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.6 }} className="mb-10">
          <span className="text-[10px] font-mono text-[#FF4D06] tracking-[0.3em] uppercase block mb-3">02 — Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B0B0B] tracking-tight">
            Five reasons clients trust <span className="text-[#FF4D06]">GalaxaTech.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_DEFAULT}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              className={`${card.span} rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md`}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-[10px] font-mono text-zinc-400">{card.num}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#FF4D06]/10 text-[#FF4D06]">
                  <card.icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-[#0B0B0B] font-bold text-base mb-2">{card.title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.5, delay: 0.3 }} className="flex justify-center mt-10">
          <a href="/about" className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0B0B0B] hover:text-[#FF4D06] transition-colors">
            More about how we work
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

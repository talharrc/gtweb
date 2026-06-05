import { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowUpRight, CheckCircle, ChevronDown, Star, FileText, Compass, Users } from 'lucide-react';

const HOW_IT_WORKS = [
  'GalaxaTech takes on a real client project.',
  'The project is broken into execution tasks.',
  'Selected builders are assigned specific tasks.',
  'Work happens under our Project Lead\'s guidance.',
  'Output is evaluated. Performance is tracked. Certificate issued for real contribution.',
];

const WHAT_YOU_GET = [
  { icon: Star, title: 'Real Portfolio Work', desc: 'Not practice projects — actual client deliverables you can show.' },
  { icon: FileText, title: 'Performance Certificate', desc: 'Proof of real contribution, not just participation.' },
  { icon: Compass, title: 'Career Direction Clarity', desc: "You'll know what you're good at after doing it, not just studying it." },
  { icon: Users, title: 'Pathway to the Team', desc: 'Top performers have joined our core team. This is how we hire.' },
];

const TRACKS = ['Web Development', 'Social Media & Content', 'Graphic Design', 'AI & Automation'];

const FAQS = [
  { q: 'Is this paid?', a: 'Currently voluntary. Top performers may receive project-based compensation or referrals as the program grows.' },
  { q: 'How long is the program?', a: 'Each batch is tied to a specific project. Duration varies — typically 3 to 8 weeks.' },
  { q: 'What if I drop out?', a: 'No penalties. But since contribution is the basis of everything, dropping out simply means no certificate and no portfolio work from the program.' },
  { q: 'Who selects applicants?', a: 'Rihad Hamid, our Creative & Project Lead, reviews every application based on current project requirements.' },
  { q: 'What kind of work is involved?', a: 'Varies per batch — design, development, content, social media strategy, research, and documentation.' },
  { q: 'Is it open to all students?', a: 'Yes, but selective. We take only those aligned with active project needs.' },
];

export default function GBPView() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', institution: '',
    track: TRACKS[0], why: '', portfolioLink: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const updateForm = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.why) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'gbp_applications'), { ...form, submittedAt: serverTimestamp() });
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors';
  const labelClass = 'text-xs font-mono text-white/40 uppercase tracking-widest block mb-1.5';

  return (
    <div className="relative pt-32 pb-24">
      <Helmet>
        <title>Galaxa Builders Program — GalaxaTech</title>
        <meta name="description" content="GBP is GalaxaTech's execution ecosystem for students — real projects, real output, real proof. Apply now." />
        <meta property="og:title" content="Galaxa Builders Program — GalaxaTech" />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Applications Open</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>Real Work. Real Proof.</h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          GalaxaTech's execution ecosystem for students ready to stop practicing and start doing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#apply" className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(139,44,255,0.35)]">Apply Now</a>
          <a href="#how-it-works" className="px-8 py-4 border border-white/15 hover:border-white/30 text-white font-bold rounded-full transition-all duration-300">How It Works ↓</a>
        </div>
      </section>

      {/* ── Honest Introduction ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <div className="glass-card rounded-3xl p-10 md:p-14 border-secondary/20">
          <div className="space-y-4 mb-8">
            {['This is not an internship.', 'This is not a course.', 'This is not a training program.'].map(line => (
              <p key={line} className="text-3xl md:text-4xl font-bold text-white/80 line-through decoration-secondary/50">{line}</p>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8">
            <p className="text-white/70 text-lg leading-relaxed mb-4">
              GBP is a project participation system. You join a live project. You take on real tasks. You're evaluated on real output. What you learn — you learn because the work demanded it.
            </p>
            <p className="text-2xl font-bold text-secondary" style={{ fontFamily: 'Syne, sans-serif' }}>"We don't teach. We expose."</p>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 mb-20 scroll-mt-32">
        <h2 className="text-4xl font-bold text-white mb-10 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>How It Works</h2>
        <div className="flex flex-col gap-4">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 flex items-start gap-5">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>0{i + 1}</span>
              </div>
              <p className="text-white/75 text-base leading-relaxed pt-2">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
          <p className="text-yellow-400/80 text-sm leading-relaxed">
            <span className="font-bold">Note:</span> At no point does any builder own 100% of a project. Everyone is part of a larger execution system.
          </p>
        </div>
      </section>

      {/* ── What You Get ─────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="text-4xl font-bold text-white mb-10 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>What You Get</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {WHAT_YOU_GET.map((item) => (
            <div key={item.title} className="glass-card rounded-2xl p-7">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Certificate Philosophy ───────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <div className="glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-secondary/6 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>We don't promise jobs. We create proof.</h2>
            <div className="max-w-2xl mx-auto mb-6 text-left space-y-3">
              <p className="text-white/60 leading-relaxed">GBP is not a professional certification body. Our certificate represents: real project participation, assigned task completion, contribution tracked and verified by our team.</p>
              <p className="text-white/60 leading-relaxed">It won't guarantee you a job. It will give you portfolio credibility, real experience proof, and the confidence that comes from having actually built something.</p>
            </div>
            <blockquote className="text-2xl font-bold text-primary" style={{ fontFamily: 'Syne, sans-serif' }}>"Real contribution. Real proof."</blockquote>
          </div>
        </div>
      </section>

      {/* ── Why We Built This ────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-white mb-2 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>This is a win-win by design, not charity.</h2>
        <p className="text-white/50 text-center mb-10 text-sm">Why we built GBP — from both sides of the table.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-8">
            <div className="text-xs font-mono text-emerald-400/70 uppercase tracking-widest mb-3">For You</div>
            <h3 className="text-white font-bold text-xl mb-4">The Student</h3>
            <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
              <li>→ Structured exposure to real work environments</li>
              <li>→ Technology and professional execution at real stakes</li>
              <li>→ A place where skill builds through doing, not watching</li>
              <li>→ Portfolio proof that's genuinely earned</li>
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-8">
            <div className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-3">For Us</div>
            <h3 className="text-white font-bold text-xl mb-4">GalaxaTech</h3>
            <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
              <li>→ A performance-filtered execution team</li>
              <li>→ Project delivery support at scale</li>
              <li>→ A talent pipeline we actually trust</li>
              <li>→ Builders who've already proven themselves on real work</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Program Status ───────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <div className="glass-card rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <div>
              <p className="text-white font-bold text-lg">Applications: Open</p>
              <p className="text-white/45 text-sm">Batch selection is based on current project needs. Rihad reviews all applications directly.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRACKS.map(t => (
              <span key={t} className="text-[11px] font-mono bg-primary/10 text-primary/80 border border-primary/20 rounded-full px-3 py-1">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="text-4xl font-bold text-white mb-10 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>Frequently Asked</h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden">
              <button onClick={() => setActiveFAQ(activeFAQ === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-white/50 flex-shrink-0 transition-transform duration-300 ${activeFAQ === i ? 'rotate-180' : ''}`} />
              </button>
              {activeFAQ === i && (
                <p className="px-5 pb-5 text-white/60 text-sm leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Application Form ─────────────────────────────────────────────────── */}
      <section id="apply" className="max-w-4xl mx-auto px-6 scroll-mt-32">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Apply to GBP</h2>
          <p className="text-white/55 max-w-xl mx-auto">Rihad reviews every application personally. Be honest — that's what gets you in.</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {done ? (
            <div className="flex flex-col items-center text-center py-10">
              <CheckCircle className="w-14 h-14 text-green-400 mb-5" />
              <h3 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Application received!</h3>
              <p className="text-white/60 max-w-md leading-relaxed">
                Your application has been received. Rihad will review it and reach out if you're a fit for the current batch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Your full name" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="you@example.com" className={inputClass} required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Phone / WhatsApp *</label>
                  <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="+880..." className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Educational Institution</label>
                  <input type="text" value={form.institution} onChange={e => updateForm('institution', e.target.value)} placeholder="Current university or college" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>What track are you interested in?</label>
                <select value={form.track} onChange={e => updateForm('track', e.target.value)} className="w-full bg-[#0e1930] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer">
                  {[...TRACKS, 'Open to anything'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Why do you want to join GBP? * (150 words max)</label>
                <textarea
                  value={form.why}
                  onChange={e => updateForm('why', e.target.value)}
                  maxLength={900}
                  rows={5}
                  placeholder="Be honest. What's driving you toward this?"
                  className={inputClass + ' resize-none'}
                  required
                />
                <p className="text-white/25 text-xs mt-1 text-right">{form.why.split(/\s+/).filter(Boolean).length} / 150 words</p>
              </div>
              <div>
                <label className={labelClass}>Portfolio or work sample link (optional)</label>
                <input type="url" value={form.portfolioLink} onChange={e => updateForm('portfolioLink', e.target.value)} placeholder="Behance, GitHub, Dribbble, etc." className={inputClass} />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(139,44,255,0.25)] min-h-[52px]"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

import { useState, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Mail, Phone, MapPin, Facebook, Twitter, CheckCircle, MessageCircle } from 'lucide-react';

const SUBJECTS = ['General Inquiry', 'Partnership', 'Careers', 'Other'];

export default function ContactView() {
  const location = useLocation();
  const presetMessage = (location.state as any)?.preset || '';

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: presetMessage });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    setError('');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_submissions'), { ...form, submittedAt: serverTimestamp() });
      setDone(true);
    } catch {
      setError('Something went wrong. Please try WhatsApp or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative pt-32 pb-24">
      <Helmet>
        <title>Contact — GalaxaTech</title>
        <meta name="description" content="Get in touch with GalaxaTech — WhatsApp, email, or fill out the contact form. Based in Dhaka, serving clients globally." />
        <meta property="og:title" content="Contact — GalaxaTech" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>Let's Talk.</h1>
          <p className="text-white/60 text-lg">We're based in Dhaka and available via WhatsApp, email, or the form below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Contact info */}
          <div className="flex flex-col gap-4">
            <a
              href="https://wa.me/8801959209103"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-green-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-mono text-white/35 uppercase tracking-widest mb-0.5">WhatsApp</p>
                <p className="text-white font-semibold">+880 1959 209103</p>
                <p className="text-white/40 text-xs">Tap to open WhatsApp</p>
              </div>
            </a>

            <a
              href="mailto:mail.galaxatech@gmail.com"
              className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-mono text-white/35 uppercase tracking-widest mb-0.5">Email</p>
                <p className="text-white font-semibold">mail.galaxatech@gmail.com</p>
              </div>
            </a>

            <a
              href="https://www.facebook.com/share/1GJq598Yfm/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-blue-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-mono text-white/35 uppercase tracking-widest mb-0.5">Facebook</p>
                <p className="text-white font-semibold">GalaxaTech</p>
              </div>
            </a>

            <a
              href="https://x.com/galaxatech"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-sky-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Twitter className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="text-xs font-mono text-white/35 uppercase tracking-widest mb-0.5">X / Twitter</p>
                <p className="text-white font-semibold">@galaxatech</p>
              </div>
            </a>

            <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white/50" />
              </div>
              <div>
                <p className="text-xs font-mono text-white/35 uppercase tracking-widest mb-0.5">Location</p>
                <p className="text-white font-semibold">Dhaka, Bangladesh</p>
                <p className="text-white/40 text-xs">Serving clients in 6 countries</p>
              </div>
            </div>
          </div>

          {/* Right — Contact form */}
          <div className="glass-card rounded-2xl p-8">
            {done ? (
              <div className="flex flex-col items-center justify-center text-center h-full py-12">
                <CheckCircle className="w-14 h-14 text-green-400 mb-5" />
                <h3 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>Message received!</h3>
                <p className="text-white/60 leading-relaxed max-w-sm">
                  We've received your message. We'll get back to you within 24 hours on WhatsApp or email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Satoshi, sans-serif' }}>Send us a message</h2>

                <div>
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1.5">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+880..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1.5">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s} className="bg-[#05030F]">{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1.5">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us what you're working on..."
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    required
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(124,42,235,0.25)] min-h-[52px]"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

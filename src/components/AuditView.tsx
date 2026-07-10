import { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Globe, TrendingUp, Search, ArrowLeft, CheckCircle, Sparkles, Check, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AuditTier = 'free' | 'paid';
type AuditFocus = 'website' | 'social' | 'funnel';

interface CommonFields {
  name: string;
  businessName: string;
  industry: string;
  email: string;
  phone: string;
  city: string;
}

const defaultCommon: CommonFields = {
  name: '', businessName: '', industry: '', email: '', phone: '', city: '',
};

function inputClass() {
  return 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors';
}

function labelClass() {
  return 'text-xs font-mono text-white/40 uppercase tracking-widest block mb-1.5';
}

export default function AuditView() {
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1 | 2>(0); // 0: Tier select, 1: Form, 2: Success
  const [tier, setTier] = useState<AuditTier>('free');
  const [focus, setFocus] = useState<AuditFocus>('website');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [common, setCommon] = useState<CommonFields>(defaultCommon);
  const updateCommon = (k: keyof CommonFields, v: string) => setCommon(c => ({ ...c, [k]: v }));

  // Website details
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteIssues, setWebsiteIssues] = useState('');

  // Social details
  const [socialUrls, setSocialUrls] = useState('');
  const [socialPlatforms, setSocialPlatforms] = useState('');

  // Funnel details
  const [funnelDescription, setFunnelDescription] = useState('');
  const [conversionRate, setConversionRate] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!common.name || !common.businessName || !common.email || !common.phone || !common.city) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    const formData: Record<string, any> = {
      ...common,
      tier,
      focus: tier === 'free' ? focus : 'all',
    };

    if (tier === 'free') {
      if (focus === 'website') {
        formData.websiteUrl = websiteUrl;
        formData.websiteIssues = websiteIssues;
      } else if (focus === 'social') {
        formData.socialUrls = socialUrls;
        formData.socialPlatforms = socialPlatforms;
      } else {
        formData.funnelDescription = funnelDescription;
        formData.conversionRate = conversionRate;
      }
    } else {
      // Paid audit collects everything
      formData.websiteUrl = websiteUrl;
      formData.socialUrls = socialUrls;
      formData.funnelDescription = funnelDescription;
      formData.conversionRate = conversionRate;
      formData.websiteIssues = websiteIssues;
    }

    try {
      await addDoc(collection(db, 'audit_submissions'), {
        type: tier,
        formData,
        submittedAt: serverTimestamp(),
        status: 'new',
      });
      setStep(2);
    } catch {
      setError('Something went wrong. Please try again or contact us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative pt-24 sm:pt-32 pb-16 sm:pb-24">
      <Helmet>
        <title>Get an Audit — GalaxaTech</title>
        <meta name="description" content="Get your website, social assets, or sales funnel audited by GalaxaTech. Choose between a free baseline audit or a paid deep-dive system blueprint." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-6">
        {/* Step 0 - Tier Selection */}
        {step === 0 && (
          <>
            <div className="text-center mb-14">
              <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 font-display">
                Digital Ecosystem <span className="text-gradient">Audit</span>
              </h1>
              <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed">
                Choose a baseline check or secure a full-funnel consulting blueprint to scale your operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-10">
              {/* Free Tier */}
              <div className="glass-card-premium p-8 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      Standard Check
                    </span>
                    <span className="text-2xl font-black text-white">$0</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3 font-display">Free Audit</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-6">
                    A laser-focused review of a single digital channel. Perfect for identifying immediate friction points.
                  </p>
                  
                  <ul className="flex flex-col gap-3.5 mb-8 border-t border-white/5 pt-6">
                    <li className="flex items-start gap-2.5 text-xs text-white/70">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Audit of 1 focus area (Web, Social, or Funnel)</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-white/70">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Standard PDF delivery by email</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-white/70">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Completed within 24-48 business hours</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => { setTier('free'); setStep(1); }}
                  className="w-full py-3 bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                >
                  Configure Free Audit
                </button>
              </div>

              {/* Paid Tier */}
              <div className="glass-card-premium p-8 rounded-3xl border border-primary/30 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 relative overflow-hidden bg-gradient-to-b from-[#070B1F]/90 to-[#030510]/95">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-xl rounded-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono text-secondary font-bold uppercase tracking-wider bg-secondary/15 px-3 py-1 rounded-full border border-secondary/30">
                      Deep-Dive Ecosystem
                    </span>
                    <span className="text-2xl font-black text-white">$499</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3 font-display flex items-center gap-2">
                    Paid Audit <Sparkles className="w-4.5 h-4.5 text-secondary" />
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-6">
                    An exhaustive, multi-faceted analysis mapping out your entire digital footprint and technical architecture.
                  </p>

                  <ul className="flex flex-col gap-3.5 mb-8 border-t border-white/5 pt-6">
                    <li className="flex items-start gap-2.5 text-xs text-white/70">
                      <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Full audit of Website, Social, & Funnels combined</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-white/70">
                      <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Personalized 20-minute video screen-share walkthrough</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-white/70">
                      <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Complete technical systems architecture blueprint</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-white/70">
                      <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>1-on-1 strategy call with a Lead Consultant</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => { setTier('paid'); setStep(1); }}
                  className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-[0_8px_30px_rgba(0,82,255,0.25)] hover:scale-[1.02]"
                >
                  Book Paid Deep-Dive
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 1 - Form Configuration */}
        {step === 1 && (
          <>
            <div className="mb-8">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to choices
              </button>
              <h2 className="text-3xl font-bold text-white font-display">
                {tier === 'free' ? 'Configure Free Audit' : 'Book Deep-Dive Audit'}
              </h2>
              <p className="text-white/50 text-xs mt-1">Provide your business coordinates to initialize the audit pipeline.</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card-premium rounded-3xl p-8 flex flex-col gap-6 border border-white/10">
              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass()}>Full Name *</label>
                  <input type="text" value={common.name} onChange={e => updateCommon('name', e.target.value)} placeholder="Full name" className={inputClass()} required />
                </div>
                <div>
                  <label className={labelClass()}>Business Name *</label>
                  <input type="text" value={common.businessName} onChange={e => updateCommon('businessName', e.target.value)} placeholder="Business name" className={inputClass()} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass()}>Email Address *</label>
                  <input type="email" value={common.email} onChange={e => updateCommon('email', e.target.value)} placeholder="you@domain.com" className={inputClass()} required />
                </div>
                <div>
                  <label className={labelClass()}>WhatsApp / Phone *</label>
                  <input type="tel" value={common.phone} onChange={e => updateCommon('phone', e.target.value)} placeholder="+880..." className={inputClass()} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass()}>Niche / Industry *</label>
                  <input type="text" value={common.industry} onChange={e => updateCommon('industry', e.target.value)} placeholder="e.g. E-Commerce, Real Estate" className={inputClass()} required />
                </div>
                <div>
                  <label className={labelClass()}>City / Location *</label>
                  <input type="text" value={common.city} onChange={e => updateCommon('city', e.target.value)} placeholder="e.g. Dhaka, London" className={inputClass()} required />
                </div>
              </div>

              {/* Free Audit Choice Picker */}
              {tier === 'free' && (
                <div className="border-t border-white/5 pt-6">
                  <label className={labelClass()}>Select Your Audit Focus Area</label>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {([
                      { id: 'website', label: 'Website', icon: Globe },
                      { id: 'social', label: 'Social Assets', icon: TrendingUp },
                      { id: 'funnel', label: 'Sales Funnel', icon: Search },
                    ] as const).map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFocus(f.id)}
                        className={`py-3 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                          focus === f.id
                            ? 'bg-primary/20 border-primary/50 text-white'
                            : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                        }`}
                      >
                        <f.icon className="w-5 h-5" />
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditional Fields based on choice */}
              {(tier === 'paid' || (tier === 'free' && focus === 'website')) && (
                <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                  <h4 className="text-[11px] font-mono text-primary uppercase font-bold tracking-wider">Website Audit Details</h4>
                  <div>
                    <label className={labelClass()}>Website URL *</label>
                    <input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://mybusiness.com" className={inputClass()} required={tier === 'free' || focus === 'website'} />
                  </div>
                  <div>
                    <label className={labelClass()}>Biggest website headaches or goals?</label>
                    <textarea value={websiteIssues} onChange={e => setWebsiteIssues(e.target.value)} rows={3} placeholder="Slow loading speeds, poor conversion rates, outdated designs..." className={inputClass() + ' resize-none'} />
                  </div>
                </div>
              )}

              {(tier === 'paid' || (tier === 'free' && focus === 'social')) && (
                <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                  <h4 className="text-[11px] font-mono text-secondary uppercase font-bold tracking-wider">Social Assets Audit Details</h4>
                  <div>
                    <label className={labelClass()}>Social Page Links (Facebook, Instagram, LinkedIn) *</label>
                    <textarea value={socialUrls} onChange={e => setSocialUrls(e.target.value)} rows={2} placeholder="https://facebook.com/yourbrand, https://instagram.com/yourbrand" className={inputClass() + ' resize-none'} required={tier === 'free' || focus === 'social'} />
                  </div>
                  <div>
                    <label className={labelClass()}>Which platforms do you want us to focus on?</label>
                    <input type="text" value={socialPlatforms} onChange={e => setSocialPlatforms(e.target.value)} placeholder="e.g. Facebook & Instagram profiles" className={inputClass()} />
                  </div>
                </div>
              )}

              {(tier === 'paid' || (tier === 'free' && focus === 'funnel')) && (
                <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                  <h4 className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Sales Funnel Audit Details</h4>
                  <div>
                    <label className={labelClass()}>Briefly describe your client acquisition funnel *</label>
                    <textarea value={funnelDescription} onChange={e => setFunnelDescription(e.target.value)} rows={3} placeholder="How do clients find you and buy? (e.g. Facebook Ads to Landing Page to WhatsApp chat)" className={inputClass() + ' resize-none'} required={tier === 'free' || focus === 'funnel'} />
                  </div>
                  <div>
                    <label className={labelClass()}>Current estimated conversion rate (if known)</label>
                    <input type="text" value={conversionRate} onChange={e => setConversionRate(e.target.value)} placeholder="e.g. 2% of page visitors contact us" className={inputClass()} />
                  </div>
                </div>
              )}

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(0,82,255,0.25)] min-h-[52px] text-sm uppercase tracking-wider cursor-pointer"
              >
                {submitting ? 'Submitting Coordinate Logs...' : 'Launch Audit Request'}
              </button>
            </form>
          </>
        )}

        {/* Step 2 - Success Screen */}
        {step === 2 && (
          <div className="text-center">
            <div className="glass-card-premium rounded-3xl p-14 border border-white/10">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-white mb-4 font-display">Audit Configured!</h1>
              <p className="text-white/65 leading-relaxed mb-4 max-w-lg mx-auto">
                Thank you, {common.name}. Your {tier === 'free' ? 'free baseline' : 'deep-dive'} audit request has been logged successfully. 
              </p>
              <p className="text-white/45 text-sm mb-10">
                Our lead architect will coordinate the teardown report and send it to <span className="text-white font-bold">{common.email}</span> within 24 hours.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:border-primary/40 text-white text-xs font-bold rounded-full uppercase tracking-wider transition-all"
                >
                  Return to Home
                </button>
                <a
                  href="https://wa.me/8801959209103"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-full uppercase tracking-wider transition-all flex items-center gap-1.5 justify-center"
                >
                  Chat on WhatsApp <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

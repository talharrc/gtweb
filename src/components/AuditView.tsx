import { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Globe, TrendingUp, Search, ArrowLeft, CheckCircle, ChevronDown } from 'lucide-react';

type AuditType = 'website' | 'social' | 'brand';

const AUDIT_TYPES = [
  {
    id: 'website' as AuditType,
    icon: Globe,
    emoji: '🌐',
    title: 'Website Audit',
    desc: 'Performance, SEO, UX, and conversion readiness.',
    color: 'border-blue-500/30 hover:border-blue-500/60',
    iconColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    id: 'social' as AuditType,
    icon: TrendingUp,
    emoji: '📱',
    title: 'Social Media Audit',
    desc: 'Content quality, consistency, engagement, and profile optimization.',
    color: 'border-pink-500/30 hover:border-pink-500/60',
    iconColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
  {
    id: 'brand' as AuditType,
    icon: Search,
    emoji: '🔍',
    title: 'Brand & Digital Presence Audit',
    desc: 'Your full digital footprint — visibility, consistency, and reputation.',
    color: 'border-purple-500/30 hover:border-purple-500/60',
    iconColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
];

const SOCIAL_PLATFORMS = ['Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'X / Twitter', 'Pinterest'];

const WEBSITE_ISSUES = ['Slow loading', 'Poor mobile experience', 'Low traffic', 'No inquiries from the site', 'Looks unprofessional', 'Not sure'];

const CUSTOMER_SOURCES = ['Referrals', 'Social media', 'Google search', 'Paid ads', 'Not sure'];

const BIZ_AGE_OPTIONS = ['Under 1 year', '1–3 years', '3+ years'];
const MARKETING_SPEND_OPTIONS = ['0–5,000 BDT', '5,000–20,000 BDT', '20,000–50,000 BDT', '50,000+ BDT'];
const TEAM_SIZE_OPTIONS = ['Just me', '2–5 people', '6–20 people', '20+'];

function inputClass() {
  return 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors';
}

function labelClass() {
  return 'text-xs font-mono text-white/40 uppercase tracking-widest block mb-1.5';
}

function selectClass() {
  return 'w-full bg-[#0A0825] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer';
}

interface CommonFields {
  name: string;
  businessName: string;
  industry: string;
  email: string;
  phone: string;
  city: string;
  bizAge: string;
  marketingSpend: string;
}

const defaultCommon: CommonFields = {
  name: '', businessName: '', industry: '', email: '', phone: '', city: '',
  bizAge: BIZ_AGE_OPTIONS[0], marketingSpend: MARKETING_SPEND_OPTIONS[0],
};

function CommonFields({ data, onChange }: { data: CommonFields; onChange: (k: keyof CommonFields, v: string) => void }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass()}>Full Name *</label>
          <input type="text" value={data.name} onChange={e => onChange('name', e.target.value)} placeholder="Your full name" className={inputClass()} required />
        </div>
        <div>
          <label className={labelClass()}>Business Name *</label>
          <input type="text" value={data.businessName} onChange={e => onChange('businessName', e.target.value)} placeholder="Your business name" className={inputClass()} required />
        </div>
      </div>
      <div>
        <label className={labelClass()}>Industry / Niche *</label>
        <input type="text" value={data.industry} onChange={e => onChange('industry', e.target.value)} placeholder="e.g. E-commerce, Healthcare, Education..." className={inputClass()} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass()}>Business Email *</label>
          <input type="email" value={data.email} onChange={e => onChange('email', e.target.value)} placeholder="you@example.com" className={inputClass()} required />
        </div>
        <div>
          <label className={labelClass()}>WhatsApp / Phone *</label>
          <input type="tel" value={data.phone} onChange={e => onChange('phone', e.target.value)} placeholder="+880..." className={inputClass()} required />
        </div>
      </div>
      <div>
        <label className={labelClass()}>City *</label>
        <input type="text" value={data.city} onChange={e => onChange('city', e.target.value)} placeholder="Your city" className={inputClass()} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass()}>Business Age</label>
          <select value={data.bizAge} onChange={e => onChange('bizAge', e.target.value)} className={selectClass()}>
            {BIZ_AGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass()}>Monthly Marketing Spend</label>
          <select value={data.marketingSpend} onChange={e => onChange('marketingSpend', e.target.value)} className={selectClass()}>
            {MARKETING_SPEND_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
    </>
  );
}

function CheckboxGroup({ label, options, selected, onToggle }: { label: string; options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <label className={labelClass()}>{label}</label>
      <div className="flex flex-wrap gap-2.5 mt-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              selected.includes(opt)
                ? 'bg-primary/20 border-primary/50 text-primary'
                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AuditView() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [auditType, setAuditType] = useState<AuditType>('website');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Common fields
  const [common, setCommon] = useState<CommonFields>(defaultCommon);
  const updateCommon = (k: keyof CommonFields, v: string) => setCommon(c => ({ ...c, [k]: v }));

  // Website-specific
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websitePurpose, setWebsitePurpose] = useState('Generate leads');
  const [websiteManager, setWebsiteManager] = useState('I manage it myself');
  const [websiteIssues, setWebsiteIssues] = useState<string[]>([]);
  const [websiteGoal, setWebsiteGoal] = useState('');
  const toggleIssue = (v: string) => setWebsiteIssues(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  // Social-specific
  const [socialPlatforms, setSocialPlatforms] = useState<string[]>([]);
  const [platformUrls, setPlatformUrls] = useState<Record<string, string>>({});
  const [postFreq, setPostFreq] = useState('3–5 times/week');
  const [contentCreator, setContentCreator] = useState('We do it internally');
  const [socialFrustration, setSocialFrustration] = useState('');
  const [socialGoal, setSocialGoal] = useState('Brand awareness');
  const togglePlatform = (p: string) => setSocialPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const updatePlatformUrl = (p: string, url: string) => setPlatformUrls(prev => ({ ...prev, [p]: url }));

  // Brand-specific
  const [brandWebsite, setBrandWebsite] = useState('');
  const [hasGBP, setHasGBP] = useState('Not sure');
  const [directories, setDirectories] = useState('Not sure');
  const [directoriesDetail, setDirectoriesDetail] = useState('');
  const [customerSources, setCustomerSources] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState('');
  const [bizChallenge, setBizChallenge] = useState('');
  const [teamSize, setTeamSize] = useState(TEAM_SIZE_OPTIONS[0]);
  const toggleCustomerSource = (v: string) => setCustomerSources(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!common.name || !common.businessName || !common.email || !common.phone || !common.city || !common.industry) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    const formData: Record<string, unknown> = { ...common };
    if (auditType === 'website') {
      Object.assign(formData, { websiteUrl, websitePurpose, websiteManager, websiteIssues, websiteGoal });
    } else if (auditType === 'social') {
      Object.assign(formData, { socialPlatforms, platformUrls, postFreq, contentCreator, socialFrustration, socialGoal });
    } else {
      Object.assign(formData, { brandWebsite, hasGBP, directories, directoriesDetail, customerSources, competitors, bizChallenge, teamSize });
    }

    try {
      await addDoc(collection(db, 'audit_submissions'), {
        type: auditType,
        formData,
        submittedAt: serverTimestamp(),
        status: 'new',
      });
      setStep(2);
    } catch {
      setError('Something went wrong. Please try again or reach out via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const auditLabel = auditType === 'website' ? 'Website' : auditType === 'social' ? 'Social Media' : 'Brand & Digital Presence';

  return (
    <div className="relative pt-32 pb-24">
      <Helmet>
        <title>Free Brand Audit — GalaxaTech</title>
        <meta name="description" content="Book a free audit with GalaxaTech. We'll audit your website, social media, or full digital presence and send you a personalized report within 24 hours." />
        <meta property="og:title" content="Free Brand Audit — GalaxaTech" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-6">

        {/* Step 0 — Type picker */}
        {step === 0 && (
          <>
            <div className="text-center mb-14">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: 'Satoshi, sans-serif' }}>Free Brand Audit</h1>
              <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
                Choose what you'd like us to audit. We'll prepare a personalized report within 24 hours.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {AUDIT_TYPES.map(at => (
                <button
                  key={at.id}
                  onClick={() => { setAuditType(at.id); setStep(1); }}
                  className={`glass-card rounded-2xl p-7 text-left border transition-all duration-300 group ${at.color}`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border flex-shrink-0 text-2xl ${at.iconColor}`}>
                      {at.emoji}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-white font-bold text-xl mb-2 group-hover:text-primary transition-colors">{at.title}</h2>
                      <p className="text-white/55 leading-relaxed">{at.desc}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:border-primary/50 group-hover:text-primary transition-all flex-shrink-0 mt-1">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 1 — Form */}
        {step === 1 && (
          <>
            <div className="mb-10">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Change audit type
              </button>
              <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>{auditLabel} Audit</h1>
              <p className="text-white/50">Fill in the details below. We'll prepare your personalized audit report within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 flex flex-col gap-6">
              <CommonFields data={common} onChange={updateCommon} />

              {/* Website-specific fields */}
              {auditType === 'website' && (
                <>
                  <div>
                    <label className={labelClass()}>Website URL *</label>
                    <input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://yourbusiness.com" className={inputClass()} required />
                  </div>
                  <div>
                    <label className={labelClass()}>Primary website purpose</label>
                    <select value={websitePurpose} onChange={e => setWebsitePurpose(e.target.value)} className={selectClass()}>
                      {['Sell products', 'Generate leads', 'Showcase work', 'Inform customers'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass()}>Who manages your website?</label>
                    <select value={websiteManager} onChange={e => setWebsiteManager(e.target.value)} className={selectClass()}>
                      {['I manage it myself', 'A developer or agency', "Nobody — it's outdated"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <CheckboxGroup label="Current issues (select all that apply)" options={WEBSITE_ISSUES} selected={websiteIssues} onToggle={toggleIssue} />
                  <div>
                    <label className={labelClass()}>What do you want your website to achieve in the next 6 months?</label>
                    <textarea value={websiteGoal} onChange={e => setWebsiteGoal(e.target.value)} rows={3} placeholder="Tell us your goals..." className={inputClass() + ' resize-none'} />
                  </div>
                </>
              )}

              {/* Social-specific fields */}
              {auditType === 'social' && (
                <>
                  <CheckboxGroup label="Which platforms are you active on?" options={SOCIAL_PLATFORMS} selected={socialPlatforms} onToggle={togglePlatform} />
                  {socialPlatforms.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {socialPlatforms.map(p => (
                        <div key={p}>
                          <label className={labelClass()}>{p} profile / page URL</label>
                          <input type="url" value={platformUrls[p] || ''} onChange={e => updatePlatformUrl(p, e.target.value)} placeholder={`https://...`} className={inputClass()} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    <label className={labelClass()}>Posting frequency</label>
                    <select value={postFreq} onChange={e => setPostFreq(e.target.value)} className={selectClass()}>
                      {['Daily', '3–5 times/week', '1–2 times/week', 'Rarely', 'Never'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass()}>Who creates your content?</label>
                    <select value={contentCreator} onChange={e => setContentCreator(e.target.value)} className={selectClass()}>
                      {['We do it internally', 'A freelancer', 'An agency', "Nobody — we don't post consistently"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass()}>Biggest social media frustration right now?</label>
                    <textarea value={socialFrustration} onChange={e => setSocialFrustration(e.target.value)} rows={3} placeholder="Be honest — we've heard it all." className={inputClass() + ' resize-none'} />
                  </div>
                  <div>
                    <label className={labelClass()}>Primary goal from social media</label>
                    <select value={socialGoal} onChange={e => setSocialGoal(e.target.value)} className={selectClass()}>
                      {['Brand awareness', 'Generate leads & inquiries', 'Drive website traffic', 'Build community', 'All of the above'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Brand-specific fields */}
              {auditType === 'brand' && (
                <>
                  <div>
                    <label className={labelClass()}>Website URL (optional)</label>
                    <input type="url" value={brandWebsite} onChange={e => setBrandWebsite(e.target.value)} placeholder="https://yourbusiness.com" className={inputClass()} />
                  </div>
                  <div>
                    <label className={labelClass()}>Do you have a Google Business Profile?</label>
                    <select value={hasGBP} onChange={e => setHasGBP(e.target.value)} className={selectClass()}>
                      {['Yes', 'No', 'Not sure'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass()}>Are you listed on any online directories?</label>
                    <select value={directories} onChange={e => setDirectories(e.target.value)} className={selectClass()}>
                      {['Yes', 'No', 'Not sure'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {directories === 'Yes' && (
                      <input type="text" value={directoriesDetail} onChange={e => setDirectoriesDetail(e.target.value)} placeholder="Which ones?" className={inputClass() + ' mt-2'} />
                    )}
                  </div>
                  <CheckboxGroup label="Where do most of your current customers come from?" options={CUSTOMER_SOURCES} selected={customerSources} onToggle={toggleCustomerSource} />
                  <div>
                    <label className={labelClass()}>Name 1–2 competitors you're aware of (optional)</label>
                    <input type="text" value={competitors} onChange={e => setCompetitors(e.target.value)} placeholder="Competitor names or websites" className={inputClass()} />
                  </div>
                  <div>
                    <label className={labelClass()}>Biggest business challenge right now?</label>
                    <textarea value={bizChallenge} onChange={e => setBizChallenge(e.target.value)} rows={3} placeholder="What's the main thing holding you back?" className={inputClass() + ' resize-none'} />
                  </div>
                  <div>
                    <label className={labelClass()}>Team size</label>
                    <select value={teamSize} onChange={e => setTeamSize(e.target.value)} className={selectClass()}>
                      {TEAM_SIZE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </>
              )}

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgba(124,42,235,0.25)] min-h-[52px] text-base"
              >
                {submitting ? 'Submitting...' : 'Submit Audit Request'}
              </button>
              <p className="text-center text-xs text-white/30">No commitment. We'll email your audit report within 24 hours.</p>
            </form>
          </>
        )}

        {/* Step 2 — Thank you */}
        {step === 2 && (
          <div className="text-center">
            <div className="glass-card rounded-3xl p-14">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>Thank you, {common.name}!</h1>
              <p className="text-white/65 leading-relaxed mb-3 max-w-lg mx-auto">
                Your {auditLabel.toLowerCase()} audit request has been received. Our team will prepare your personalized audit report and send it to <span className="text-white font-medium">{common.email}</span> within 24 hours.
              </p>
              <p className="text-white/45 text-sm mb-10">We look forward to sharing what we find.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="https://www.facebook.com/share/1GJq598Yfm/" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/10 hover:border-blue-500/40 text-white/70 hover:text-white text-sm font-semibold rounded-full transition-all">
                  Follow on Facebook
                </a>
                <a href="https://x.com/galaxatech" target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/10 hover:border-sky-500/40 text-white/70 hover:text-white text-sm font-semibold rounded-full transition-all">
                  Follow on X
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

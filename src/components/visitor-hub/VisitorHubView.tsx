import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Globe, Lock, LogOut, Copy, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../hooks/useContent';
import EmptyState from '../shared/EmptyState';
import brandmarkLogo from '../../assets/images/galaxatech_revised_logo_1780005309031.png';

type Tab = 'insights' | 'prompts' | 'members';

const STATIC_INSIGHTS = [
  {
    id: '1',
    title: 'How to Set Up a No-Code AI Assistant in 15 Minutes',
    excerpt: 'A step-by-step guide to deploying your first automation with zero code.',
    readTime: '5 min read',
    tag: 'Automation',
    content: 'Modern no-code tools like Zapier, Make, and native AI assistants make automation accessible to anyone. Start by identifying one repetitive task—email sorting, meeting summaries, or lead follow-ups. Connect your email to an AI-powered workflow, define triggers (e.g., "new email from client"), and set actions (e.g., "summarize and label"). Most platforms have visual drag-and-drop builders. Within 15 minutes you can have your first automation running.',
  },
  {
    id: '2',
    title: 'The Best AI Image Generators of 2025 Compared',
    excerpt: "Midjourney, DALL·E, Ideogram, and Flux — we tested them so you don't have to.",
    readTime: '8 min read',
    tag: 'AI Tools',
    content: 'Midjourney v6 leads for artistic quality and photorealism. DALL·E 3 (via ChatGPT) wins on prompt adherence and ease of use. Ideogram excels at text-in-image tasks—logos, posters, social banners. Flux (by Black Forest Labs) is the best open-source option with exceptional detail. For business use: Ideogram for branding, Midjourney for creative campaigns, DALL·E for day-to-day content.',
  },
  {
    id: '3',
    title: '3 Easy Ways to Automate Your Busywork Today',
    excerpt: 'Calendar scheduling, email triage, and lead follow-ups — all running on autopilot.',
    readTime: '4 min read',
    tag: 'Productivity',
    content: '1. Calendly + AI: Let clients book meetings without back-and-forth. Add an AI confirmation email that auto-prepares a brief before each call. 2. Email Triage: Use Gmail filters + AI labels to auto-sort newsletters, client emails, and invoices. 3. Lead Follow-Ups: Connect your contact form to a CRM (Notion, Airtable) and trigger a personalized follow-up sequence via Make or Zapier. Each takes under 30 minutes to set up.',
  },
];

const STATIC_PROMPTS = [
  { id: 'p1', title: 'Ultimate Teach-Me-Anything Tutor', body: 'You are an expert tutor. When I give you a topic, break it into digestible steps, explain each using real-world analogies, give me a mini quiz at the end, and suggest the best next steps for deeper learning. Topic: [YOUR TOPIC]' },
  { id: 'p2', title: 'Professional Email Polisher', body: 'Rewrite the following email to be professional, concise, and action-oriented. Keep the core message, remove filler phrases, and end with a clear call to action. Email: [PASTE EMAIL HERE]' },
  { id: 'p3', title: 'Ideas Creator & Brainstormer', body: 'I need creative ideas for [TOPIC/PROJECT]. Generate 10 diverse ideas ranging from conventional to bold. For each, give a one-line pitch and the biggest risk. Then pick the top 3 and explain why.' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function MembersVault() {
  const { items: prompts, loading: l1 } = useContent('prompt', true);
  const { items: resources, loading: l2 } = useContent('resource', true);
  const { items: newsletters, loading: l3 } = useContent('newsletter', true);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (l1 || l2 || l3) return <div className="text-white/40 text-sm text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>;

  const all = [...prompts, ...resources, ...newsletters];

  if (all.length === 0) {
    return (
      <EmptyState
        title="Members content coming soon"
        description="Premium prompts, templates, and newsletter archives will appear here."
        icon={<Lock className="w-5 h-5" />}
      />
    );
  }

  return (
    <div>
      {prompts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Premium Prompts
          </h3>
          <div className="flex flex-col gap-2">
            {prompts.map(item => (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] text-left">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <span className="text-white/30 text-xs">{expanded === item.id ? 'Hide' : 'View →'}</span>
                </button>
                {expanded === item.id && (
                  <div className="px-5 pb-4 border-t border-white/5">
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap pt-3 mb-3">{item.body}</p>
                    <CopyButton text={item.body} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {resources.length > 0 && (
        <div className="mb-6">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" /> Resource Templates
          </h3>
          <div className="flex flex-col gap-2">
            {resources.map(item => (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] text-left">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <span className="text-white/30 text-xs">{expanded === item.id ? 'Hide' : 'View →'}</span>
                </button>
                {expanded === item.id && (
                  <div className="px-5 pb-4 border-t border-white/5">
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap pt-3">{item.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {newsletters.length > 0 && (
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Newsletter Archive</h3>
          <div className="flex flex-col gap-2">
            {newsletters.map(item => (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] text-left">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <span className="text-white/30 text-xs">
                    {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : ''} {expanded === item.id ? '↑' : '→'}
                  </span>
                </button>
                {expanded === item.id && (
                  <div className="px-5 pb-4 border-t border-white/5">
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap pt-3">{item.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VisitorHubView() {
  const navigate = useNavigate();
  const { firebaseUser, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('insights');
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

  const tabs = [
    { id: 'insights' as Tab, label: 'Insights & Guides', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'prompts' as Tab, label: 'Prompt Vault', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'members' as Tab, label: 'Members Vault', icon: <Lock className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <img src={brandmarkLogo} alt="GalaxaTech" className="w-8 h-8 rounded-lg object-contain" />
            <div>
              <p className="text-white font-bold text-sm leading-none">Visitor Hub</p>
              <p className="text-white/30 text-xs">GalaxaTech Resource Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {firebaseUser?.photoURL && (
              <img src={firebaseUser.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
            )}
            <button onClick={signOut} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="flex flex-col gap-3">
            {STATIC_INSIGHTS.map(item => (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setExpandedInsight(expandedInsight === item.id ? null : item.id)} className="w-full text-left px-5 py-4 hover:bg-white/[0.02]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.tag}</span>
                        <span className="text-white/30 text-xs">{item.readTime}</span>
                      </div>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-white/50 text-xs mt-1">{item.excerpt}</p>
                    </div>
                  </div>
                </button>
                {expandedInsight === item.id && (
                  <div className="px-5 pb-4 border-t border-white/5 pt-3">
                    <p className="text-white/60 text-sm leading-relaxed">{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Prompts Tab */}
        {activeTab === 'prompts' && (
          <div className="flex flex-col gap-3">
            {STATIC_PROMPTS.map(p => (
              <div key={p.id} className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setExpandedPrompt(expandedPrompt === p.id ? null : p.id)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] text-left">
                  <p className="text-white font-semibold text-sm">{p.title}</p>
                  <span className="text-white/30 text-xs">{expandedPrompt === p.id ? 'Hide' : 'View →'}</span>
                </button>
                {expandedPrompt === p.id && (
                  <div className="px-5 pb-4 border-t border-white/5">
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap pt-3 mb-3">{p.body}</p>
                    <CopyButton text={p.body} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Members Vault */}
        {activeTab === 'members' && <MembersVault />}
      </div>
    </div>
  );
}

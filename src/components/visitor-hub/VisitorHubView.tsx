import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Globe, Copy, Check, ArrowLeft, Loader2, Cpu, Download, Heart, MessageSquare } from 'lucide-react';

type Tab = 'utilities' | 'resources' | 'community' | 'guides';

const MOCK_WALLPAPERS: Record<string, string> = {
  cosmic: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80',
  cyber: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  minimal: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
};

export default function VisitorHubView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('utilities');

  // Prompt Architect State
  const [promptRole, setPromptRole] = useState('Senior Copywriter');
  const [promptTask, setPromptTask] = useState('Write an email sequences for a SaaS launch');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const generatedPrompt = `[Role]: You are an elite, highly systems-driven ${promptRole}.
[Context]: We are launching a new digital ecosystem prioritizing micro-animations and frosted glass aesthetics.
[Task]: Carefully execute: "${promptTask}".
[Constraint]: Keep the output clean, structured, and split into clear sections. Avoid fluff.`;

  // Wallpaper Generator State
  const [wallpaperTheme, setWallpaperTheme] = useState('cosmic');
  const [wallpaperRatio, setWallpaperRatio] = useState('16:9');
  const [generating, setGenerating] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);

  // Region Utility State
  const [region, setRegion] = useState<'BD' | 'US' | 'EU'>('BD');

  // Community State
  const [posts, setPosts] = useState([
    { id: 1, author: 'Siam Rahman', text: 'The 3D folder hover on the landing page is absolute fire!', likes: 12 },
    { id: 2, author: 'Taskin Ahmed', text: 'Used the Prompt Architect for my client pitch today. Saves so much framing time.', likes: 8 },
  ]);
  const [newPostAuthor, setNewPostAuthor] = useState('');
  const [newPostText, setNewPostText] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostAuthor.trim() || !newPostText.trim()) return;
    setPosts([
      { id: Date.now(), author: newPostAuthor, text: newPostText, likes: 0 },
      ...posts
    ]);
    setNewPostAuthor('');
    setNewPostText('');
  };

  const handleGenerateWallpaper = () => {
    setGenerating(true);
    setGeneratedImg(null);
    setTimeout(() => {
      setGeneratedImg(MOCK_WALLPAPERS[wallpaperTheme] || MOCK_WALLPAPERS.cosmic);
      setGenerating(false);
    }, 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="min-h-screen relative pt-24 pb-16 sm:pb-24">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white font-display">Galaxa Space</h1>
              <p className="text-white/40 text-xs">Public AI generation space and Bangladesh developer utilities</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1.5 self-start sm:self-auto">
            Open Sandbox
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2.5 mb-10 overflow-x-auto no-scrollbar pb-1">
          {([
            { id: 'utilities', label: 'AI Utilities', icon: Cpu },
            { id: 'resources', label: 'Resource Vault', icon: BookOpen },
            { id: 'community', label: 'Community Board', icon: MessageSquare },
            { id: 'guides', label: 'Agency Insights', icon: Globe },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary/20 border-primary/50 text-white shadow-[0_4px_20px_rgba(0,82,255,0.15)]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Blocks */}

        {/* Tab 1: AI Utilities */}
        {activeTab === 'utilities' && (
          <div className="flex flex-col gap-8">
            {/* Prompt Architect */}
            <div className="glass-card-premium border border-white/10 p-7 rounded-3xl">
              <h3 className="text-white font-bold text-lg mb-2 font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" /> AI Prompt Architect
              </h3>
              <p className="text-white/50 text-xs mb-6">Enter details below to compile an optimized prompt based on our system template.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block mb-1.5">AI Persona / Role</label>
                  <input
                    type="text"
                    value={promptRole}
                    onChange={e => setPromptRole(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block mb-1.5">Specific Task</label>
                  <input
                    type="text"
                    value={promptTask}
                    onChange={e => setPromptTask(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="relative bg-black/40 rounded-2xl border border-white/5 p-5 mb-4">
                <pre className="text-white/80 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                  {generatedPrompt}
                </pre>
              </div>

              <button
                onClick={handleCopyPrompt}
                className="py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedPrompt ? 'Copied Prompt!' : 'Copy to Clipboard'}
              </button>
            </div>

            {/* AI Wallpaper Generator Mock */}
            <div className="glass-card-premium border border-white/10 p-7 rounded-3xl">
              <h3 className="text-white font-bold text-lg mb-2 font-display flex items-center gap-2">
                <Cpu className="w-5 h-5 text-secondary" /> AI Wallpaper Generator
              </h3>
              <p className="text-white/50 text-xs mb-6">Select parameters to synthesize custom, ultra-premium galactic wallpaper mockups.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block mb-1.5">Aesthetic Theme</label>
                  <select
                    value={wallpaperTheme}
                    onChange={e => setWallpaperTheme(e.target.value)}
                    className="w-full bg-[#030510] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-primary/50 cursor-pointer"
                  >
                    <option value="cosmic">Cosmic Nebulae</option>
                    <option value="cyber">Cyberpunk Dhaka Grid</option>
                    <option value="minimal">Obsidian Minimal</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block mb-1.5">Aspect Ratio</label>
                  <select
                    value={wallpaperRatio}
                    onChange={e => setWallpaperRatio(e.target.value)}
                    className="w-full bg-[#030510] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-primary/50 cursor-pointer"
                  >
                    <option value="16:9">Landscape (16:9)</option>
                    <option value="9:16">Portrait mobile (9:16)</option>
                    <option value="1:1">Square (1:1)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleGenerateWallpaper}
                    disabled={generating}
                    className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_15px_rgba(0,82,255,0.2)] hover:scale-[1.02] cursor-pointer min-h-[42px]"
                  >
                    {generating ? 'Synthesizing...' : 'Synthesize Wallpaper'}
                  </button>
                </div>
              </div>

              {generating && (
                <div className="h-60 rounded-2xl border border-white/5 bg-black/30 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-white/40 text-xs font-mono">Synthesizing image layers...</p>
                </div>
              )}

              {generatedImg && (
                <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-80 group">
                  <img src={generatedImg} alt="Generated Space Wallpaper" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a
                      href={generatedImg}
                      download="galaxa_wallpaper.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg uppercase flex items-center gap-1.5 shadow-lg"
                    >
                      <Download className="w-4 h-4" /> Download Asset
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Regional Bangladesh & International utilities */}
            <div className="glass-card-premium border border-white/10 p-7 rounded-3xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg font-display flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" /> Regional Utilities
                </h3>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-[10px] font-mono">
                  {(['BD', 'US', 'EU'] as const).map(reg => (
                    <button
                      key={reg}
                      onClick={() => setRegion(reg)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${region === reg ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/40'}`}
                    >
                      {reg === 'BD' ? 'Bangladesh' : reg === 'US' ? 'US East' : 'EU Central'}
                    </button>
                  ))}
                </div>
              </div>

              {region === 'BD' && (
                <div className="flex flex-col gap-4 border-t border-white/5 pt-5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4.5">
                      <p className="text-white/30 text-[9px] font-mono uppercase tracking-wider mb-1">HQ Office Hours (Dhaka)</p>
                      <p className="text-white font-bold text-sm">10:00 AM - 6:00 PM</p>
                      <span className="text-[10px] text-green-400 mt-2 inline-block font-mono">Status: Sunday to Thursday</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4.5">
                      <p className="text-white/30 text-[9px] font-mono uppercase tracking-wider mb-1">Freelance Tax VAT Guidelines</p>
                      <p className="text-white font-bold text-sm">BD Freelancer Tax Guide 2026</p>
                      <a href="https://nbr.gov.bd/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-400 mt-2 inline-block underline font-mono">Open NBR Portal →</a>
                    </div>
                  </div>
                </div>
              )}

              {(region === 'US' || region === 'EU') && (
                <div className="flex flex-col gap-4 border-t border-white/5 pt-5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4.5">
                      <p className="text-white/30 text-[9px] font-mono uppercase tracking-wider mb-1">HQ Latency Sync</p>
                      <p className="text-white font-bold text-sm">Dhaka node: <span className="text-emerald-400">42ms</span></p>
                      <span className="text-[10px] text-white/40 mt-2 inline-block font-mono">Uptime consistency: 99.98%</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4.5">
                      <p className="text-white/30 text-[9px] font-mono uppercase tracking-wider mb-1">Time Sync difference</p>
                      <p className="text-white font-bold text-sm">{region === 'US' ? 'Dhaka is 10h ahead' : 'Dhaka is 4h ahead'}</p>
                      <span className="text-[10px] text-white/40 mt-2 inline-block font-mono">HQ timezone: GMT+6</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Resource Vault */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Free Figma Device Mockups', desc: 'Premium Figma files containing responsive device containers.', category: 'Design', size: '12 MB' },
              { title: 'AI Automation Playbook', desc: 'A step-by-step operational setup guide for no-code tools.', category: 'Playbook', size: '4.5 MB' },
              { title: 'Dhaka Tech Latency Sheet', desc: 'Dhaka broadband/mobile internet latency logs.', category: 'Systems', size: '1.2 MB' },
              { title: 'Premium Notion SOP templates', desc: 'Structure your internal operating workflow templates.', category: 'Notion', size: '800 KB' },
            ].map((res, i) => (
              <div key={i} className="glass-card-premium border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-primary/20 transition-all group">
                <div>
                  <span className="text-[9px] font-mono tracking-wider bg-white/5 px-2.5 py-1 border border-white/5 rounded-full text-white/50">{res.category}</span>
                  <h4 className="text-white font-bold text-base mt-4 mb-2 font-display">{res.title}</h4>
                  <p className="text-white/45 text-xs leading-relaxed mb-6">{res.desc}</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[10px] font-mono text-white/30">{res.size}</span>
                  <button className="flex items-center gap-1 text-[11px] font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                    Simulate Download <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Community Board */}
        {activeTab === 'community' && (
          <div className="flex flex-col gap-6">
            {/* New Post Form */}
            <form onSubmit={handleCreatePost} className="glass-card-premium border border-white/10 p-6 rounded-3xl flex flex-col gap-4">
              <h4 className="text-white font-bold text-sm font-display">Add to bulletin board</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={newPostAuthor}
                  onChange={e => setNewPostAuthor(e.target.value)}
                  placeholder="Your Name"
                  className="sm:col-span-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs placeholder-white/20 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={newPostText}
                  onChange={e => setNewPostText(e.target.value)}
                  placeholder="Feedback, thoughts, or ideas..."
                  className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs placeholder-white/20 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="py-2.5 px-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] self-start transition-all cursor-pointer"
              >
                Post Comment
              </button>
            </form>

            {/* Posts Feed */}
            <div className="flex flex-col gap-3">
              {posts.map(p => (
                <div key={p.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold text-xs leading-none mb-1.5">{p.author}</p>
                    <p className="text-white/60 text-xs leading-relaxed">{p.text}</p>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-mono text-white/30 hover:text-pink-400 transition-colors">
                    <Heart className="w-3.5 h-3.5" /> {p.likes}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Insights & Guides */}
        {activeTab === 'guides' && (
          <div className="flex flex-col gap-4">
            {[
              { title: 'How to deploy a frosted-glass web platform in 15 minutes', desc: 'Discover layout tokens, backdrop filter calculations, and responsive configurations used across our projects.', tag: 'Development', read: '5 min read' },
              { title: 'The state of AI Image Generators in 2026', desc: 'Comparing Flux, Midjourney v6, DALL-E 3, and Stable Diffusion workflows for agency campaigns.', tag: 'AI Tools', read: '8 min read' },
              { title: 'SOPs optimization guide for high-growth tech teams', desc: 'How to structure Notion databases, sync operations checklists, and reduce task management overhead.', tag: 'Systems', read: '6 min read' },
            ].map((guide, i) => (
              <div key={i} className="glass-card-premium border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-mono text-primary uppercase font-bold tracking-wider">{guide.tag}</span>
                  <span className="text-white/30 text-xs">{guide.read}</span>
                </div>
                <h3 className="text-white font-bold text-base mb-2 font-display">{guide.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed mb-4">{guide.desc}</p>
                <button className="text-left text-xs font-semibold text-secondary hover:underline self-start">
                  Read teardown guide →
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

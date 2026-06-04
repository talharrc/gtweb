import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, Award, Send, ThumbsUp, Copy, Check, MessageSquare, Search, ArrowRight, Lock, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { googleSignIn } from '../lib/firebase';

const ACCESSIBLE_AI_INSIGHTS = [
  {
    id: "ins-1",
    title: "How to Build Your Own Personal AI Assistant in 5 Minutes (No Code)",
    summary: "A simple step-by-step framework to configure custom GPTs or Gemini Gems to handle your daily task lists, calendar reminders, and draft professional emails.",
    readTime: "3 min read",
    category: "AI Life Hacks",
    tags: ["Personal Productivity", "No-Code"],
    content: "Building your own assistant doesn't require knowing Python or JavaScript anymore. Using custom Gems or GPTs, you can define exactly who you are, what files you frequently use, and how you want the assistant to write. Simply give it a prompt like: 'You are my custom Email filter agent. Look at these draft rules...' Upload your typical draft formats as a file, and let it handle the heavy lifting! It's that simple.",
    likes: 245,
    date: "TODAY"
  },
  {
    id: "ins-2",
    title: "The Magic of AI Image Generators: Visualizing Anything Instantly",
    summary: "From interior design ideas to stunning cartoon avatars, see how simple descriptive commands turn text into hyper-realistic photos in seconds.",
    readTime: "4 min read",
    category: "Creative AI",
    tags: ["Generative Art", "Design"],
    content: "Modern tools like Gemini 3.5 or Midjourney let anyone become a digital artist. If you're remodeling your kitchen, you can describe it: 'A minimalist kitchen with emerald green cabinets, gold handles, warm wood accents, and bright morning sunshine shining through the window.' In seconds, you have 4 photographic representations showing exactly how it looks! You can use this for social posters, presentation slides, or fun gifts.",
    likes: 189,
    date: "YESTERDAY"
  },
  {
    id: "ins-3",
    title: "3 Easy Ways AI Can Automate Your Busywork",
    summary: "Stop wastefully spending hours manual-typing receipts, organizing large spreadsheet text piles, or listening to massive voice recordings.",
    readTime: "3 min read",
    category: "Everyday Automation",
    tags: ["Time Savers", "Automations"],
    content: "1. Voice Summarizers: Use AI audio recorders to transcribe and synthesize a 2-hour spoken meeting into 5 direct bullet points. 2. PDF extractors: Paste any massive 50-page vendor document and ask it: 'What is our exact escape clause and annual cost increase percentage?' 3. Dynamic formatting: Turn unformatted text blocks into perfect spreadsheets instantly.",
    likes: 312,
    date: "3 DAYS AGO"
  }
];

const POWERFUL_PROMPTS = [
  {
    id: "pr-1",
    title: "The Ultimate 'Teach Me Anything' Tutor",
    description: "Forces AI to explain extremely complex scientific, financial, or engineering concepts using clear analogies suitable for complete newcomers.",
    prompt: "Explain the concept of [INSERT TOPIC] to me. Use highly visual, approachable real-world analogies. Avoid academic jargon entirely. At the end, ask me 3 simple interactive questions to test if I truly understood the logic, and rate my answers constructively.",
    badge: "Learning Skill"
  },
  {
    id: "pr-2",
    title: "Perfect Professional Conversation Polisher",
    description: "Takes raw, angry, or poorly structured draft emails and refines them into diplomatic, high-agency templates.",
    prompt: "Revise this draft email to sound highly professional, polite, and authoritative. Maintain a constructive partnership tone while protecting my boundary that [INSERT SPECIFIC BOUNDARY]. Ensure there are no passive-aggressive remarks. Here is the draft: '[INSERT DRAFT]'.",
    badge: "Communication"
  },
  {
    id: "pr-3",
    title: "Infinite Ideas Creator & Brainstormer",
    description: "Generates high-interest hooks, titles, and structural formulas for side hustles or business initiatives.",
    prompt: "I am launching a [INSERT PROJECT/PRODUCT TYPE]. Generate 10 highly engaging, original, and non-generic angles for my landing page copy and social media headings. Focus on solving the user's primary frustration of [INSERT CUSTOMER FRUSTRATION]. Avoid boring marketing clichés.",
    badge: "Creative Brain"
  }
];

const SOCIAL_POSTS = [
  {
    id: "post-1",
    author: "GalaxaTech Intelligence Team",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    time: "2 hours ago",
    text: "Think you need a computer science degree to start automating your daily workflows? 🤯 Think again! We just published our Zero-Code Personal Guide on the Galaxa Hub. Anyone with a browser can connect Gemini or standard GPTs to automate 4-5 hours of document-reading every single week. Get into the future without writing a single line of code! 👇",
    shares: 42,
    likes: 128,
    comments: 18
  },
  {
    id: "post-2",
    author: "GalaxaTech Lab Insights",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    time: "1 day ago",
    text: "Speed is the sweetest element of design. In our latest workspace test, we compared local rendering engines to typical server-side page downloads. By prioritizing pristine client code architecture, our active build passes achieved loading times below 80 milliseconds. To our team, velocity isn’t just a tech specification—it's a sign of profound respect for our users' time. 🚀⏱️",
    shares: 29,
    likes: 95,
    comments: 12
  }
];

export default function VisitorHubView() {
  const { currentUser, userProfile, registerAsVisitor, loading } = useApp();
  const [activeTab, setActiveTab] = useState<'insights' | 'prompts' | 'social'>('insights');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promptSearch, setPromptSearch] = useState('');
  const [readArticle, setReadArticle] = useState<any | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await googleSignIn();
    } catch (err) {
      console.error(err);
    } finally {
      setSigningIn(false);
    }
  };

  const filteredPrompts = POWERFUL_PROMPTS.filter(p => 
    p.title.toLowerCase().includes(promptSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(promptSearch.toLowerCase()) ||
    p.prompt.toLowerCase().includes(promptSearch.toLowerCase())
  );

  // If loading, display loading telemetry layout
  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/40 font-mono text-xs">SYNCHRONIZING SECURE NODE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-32 pb-24 text-white text-left min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4 shadow-[0_0_15px_rgba(139,44,255,0.15)]">
            <Brain className="w-4 h-4 text-primary-light" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#fff] uppercase">
              VISITOR'S RESOURCE HUB
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            AI Knowledge, <br className="hidden sm:block" />
            <span className="text-gradient">Demystified for Everyone.</span>
          </h1>
          <p className="text-white/60 text-xs sm:text-base max-w-2xl font-sans">
            Welcome, <span className="text-primary-light font-bold">{userProfile?.displayName || currentUser?.displayName || "Galaxy Guest"}</span>. This is our public vault where we compile approachable research, powerful copy-paste prompts, and active social updates designed to help you leverage artificial agency in daily life.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-white/10 mb-10 gap-2 relative z-10 sm:max-w-md overflow-x-auto">
          <button 
            onClick={() => { setActiveTab('insights'); setReadArticle(null); }}
            className={`flex-1 pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider relative transition-colors focus:outline-none cursor-pointer whitespace-nowrap min-w-[100px] ${activeTab === 'insights' ? 'text-primary-light' : 'text-white/40 hover:text-white'}`}
          >
            Insights & Guides
            {activeTab === 'insights' && <motion.span layoutId="hub-active-line" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />}
          </button>
          <button 
            onClick={() => { setActiveTab('prompts'); setReadArticle(null); }}
            className={`flex-1 pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider relative transition-colors focus:outline-none cursor-pointer whitespace-nowrap min-w-[100px] ${activeTab === 'prompts' ? 'text-primary-light' : 'text-white/40 hover:text-white'}`}
          >
            Prompt Vault
            {activeTab === 'prompts' && <motion.span layoutId="hub-active-line" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />}
          </button>
          <button 
            onClick={() => { setActiveTab('social'); setReadArticle(null); }}
            className={`flex-1 pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider relative transition-colors focus:outline-none cursor-pointer whitespace-nowrap min-w-[100px] ${activeTab === 'social' ? 'text-primary-light' : 'text-white/40 hover:text-white'}`}
          >
            Social Posts
            {activeTab === 'social' && <motion.span layoutId="hub-active-line" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary" />}
          </button>
        </div>

        {/* Main Resource Displays */}
        <div className="relative z-10">
          
          {/* 1. INSIGHTS TAB */}
          {activeTab === 'insights' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                {ACCESSIBLE_AI_INSIGHTS.map((article) => {
                  const isReadingThis = readArticle?.id === article.id;
                  return (
                    <div 
                      key={article.id}
                      className={`glass-card p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden text-left ${isReadingThis ? 'border-primary/40 bg-white/[0.04]' : 'border-white/5 bg-black/25 hover:border-white/10'}`}
                    >
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary-light border border-primary/20 rounded-full">
                          {article.category}
                        </span>
                        <div className="text-[10px] font-mono text-white/40 flex items-center gap-2">
                          <span>{article.readTime}</span>
                          <span>•</span>
                          <span>{article.date}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-display text-lg sm:text-xl font-bold mb-2 text-white">
                        {article.title}
                      </h3>
                      <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4 font-sans">
                        {article.summary}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <button 
                          onClick={() => setReadArticle(isReadingThis ? null : article)}
                          className="text-primary-light hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
                        >
                          {isReadingThis ? 'Close Guide' : 'Read Full Guide'}
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isReadingThis ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                        </button>
                        
                        <div className="flex items-center gap-1.5 text-white/40 text-xs font-mono">
                          <ThumbsUp className="w-3.5 h-3.5 text-secondary" />
                          <span>{article.likes} helpful reactions</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reader panel or custom details */}
              <div className="lg:col-span-5">
                {readArticle ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-[2rem] border border-primary/20 bg-black/40 p-6 sm:p-8 text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                    
                    <span className="font-mono text-[9px] font-bold text-primary tracking-widest block uppercase mb-1">active reader</span>
                    <h4 className="font-display text-xl font-extrabold text-white mb-4">{readArticle.title}</h4>
                    <div className="h-[1px] w-full bg-white/5 mb-6" />
                    
                    <p className="font-sans text-xs sm:text-sm leading-relaxed text-white/80 whitespace-pre-line">
                      {readArticle.content}
                    </p>

                    <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/40">Shared by GalaxaTech Experts</span>
                      <button 
                        onClick={() => handleCopy(readArticle.id, readArticle.content)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] tracking-wider uppercase font-bold flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
                      >
                        {copiedId === readArticle.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/50" />}
                        <span>{copiedId === readArticle.id ? 'Copied' : 'Copy Text'}</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="border border-dashed border-white/10 rounded-[2rem] p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 text-white/45">
                      <Brain className="w-6 h-6 animate-pulse" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-white mb-1">Select a Resource Guide</h4>
                    <p className="text-white/40 text-xs max-w-xs leading-relaxed font-sans">
                      Click 'Read Full Guide' on any left panel card to spin up our step-by-step visual training walk-throughs in this panel.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. PROMPT VAULT TAB */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              
              {/* Filter input */}
              <div className="max-w-md relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                <input 
                  type="text"
                  value={promptSearch}
                  onChange={(e) => setPromptSearch(e.target.value)}
                  placeholder="Search prompts (e.g. learning, communication...)"
                  className="bg-white/5 focus:bg-white/10 text-sm placeholder-white/40 text-white pl-11 pr-5 py-3 w-full rounded-2xl border border-white/10 focus:border-primary/45 focus:outline-none transition-all duration-300"
                />
              </div>

              {/* Prompts list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.length > 0 ? (
                  filteredPrompts.map((p) => {
                    const isCopied = copiedId === p.id;
                    return (
                      <div 
                        key={p.id}
                        className="glass-card p-6 sm:p-7 rounded-3xl border border-white/5 bg-black/25 flex flex-col justify-between text-left hover:border-primary/10 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-mono tracking-wider font-bold text-secondary uppercase bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-md">
                              {p.badge}
                            </span>
                            <span className="text-[9px] font-mono text-white/40 uppercase">verified prompt</span>
                          </div>
                          
                          <h4 className="font-display text-md sm:text-lg font-bold text-white mb-2">{p.title}</h4>
                          <p className="text-white/50 text-xs leading-relaxed mb-6 font-sans">{p.description}</p>
                          
                          {/* Prompt code board */}
                          <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-white/80 select-all mb-4 relative max-h-[140px] overflow-y-auto">
                            {p.prompt}
                          </div>
                        </div>

                        <button 
                          onClick={() => handleCopy(p.id, p.prompt)}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border cursor-pointer select-none transition-all duration-300 ${
                            isCopied 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/95'
                          }`}
                        >
                          {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/50" />}
                          <span>{isCopied ? 'Prompt Anchored' : 'Copy Command'}</span>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full border border-dashed border-white/5 rounded-3xl p-12 text-center text-white/45">
                    No prompts fit your search parameters. Try searching "life", "learning" or "creative".
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. SOCIAL POSTS TAB */}
          {activeTab === 'social' && (
            <div className="max-w-xl mx-auto space-y-6">
              {SOCIAL_POSTS.map((post) => (
                <div 
                  key={post.id}
                  className="glass-card p-6 rounded-3xl border border-white/5 bg-black/25 text-left"
                >
                  {/* Author line */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <img 
                      alt={post.author} 
                      className="w-10 h-10 rounded-full object-cover border border-white/10 grayscale" 
                      src={post.avatar}
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-display text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        {post.author}
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      </h4>
                      <p className="text-[10px] font-mono text-white/40">{post.time}</p>
                    </div>
                  </div>

                  {/* Body Text */}
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-sans mb-5 whitespace-pre-wrap">
                    {post.text}
                  </p>

                  {/* Social actions bar */}
                  <div className="flex items-center gap-6 pt-4 border-t border-white/5 font-mono text-xs text-white/40">
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs focus:outline-none">
                      <ThumbsUp className="w-4 h-4 text-[#ff2c6d]" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs focus:outline-none">
                      <MessageSquare className="w-4 h-4 text-primary-light" />
                      <span>{post.comments} comments</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs focus:outline-none">
                      <Send className="w-4 h-4 text-cyan-400" />
                      <span>{post.shares} reshares</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

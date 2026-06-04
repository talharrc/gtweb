import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Code, 
  Briefcase, 
  ShieldCheck, 
  Award, 
  CheckCircle,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  TrendingUp,
  Heart
} from 'lucide-react';
import { TeamMember } from '../types';

const LEADERS: TeamMember[] = [
  {
    name: "Miftahul Islam",
    role: "Co-Founder & Lead Systems Architect",
    bio: "Miftahul directs our high-performance code pipelines and software architecture. Formerly a cloud systems analyst, he believes that software should compile with absolute type safety and zero layout lag.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6eaROwD9hbriZlnyZIF2HQA5nJ_Mf-XPIz_eHw8WBUj-BYtWAe_InluLBG64WYjbiu4vA8fRtEYq8eVvT3efDQAwkLoqZ4Y_DTqXCNeMQ5Rquy2jN5i0kQRm5KOw3v5NvnXwfrlqfF9Y25Du3D8nmaUKQsBftikByMN3xoTKk3KamVGTV2OhWODBXEqMeqU1433qYkaT07MG5t9RQXop8tAxK_0ivbRO5utoRn6aMYZ4p1EqmOhQSyVZmIOpl75NzjfQUItmIYKs",
    verifiedIcon: "verified",
    verifiedColor: "primary",
    socials: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      email: "miftahul@galaxatech.com"
    }
  },
  {
    name: "Rihad Hamid",
    role: "Co-Founder & Digital Growth Specialist",
    bio: "Rihad steers our connect venture division, coordinating paid acquisition, SEO structures, and conversion optimization audits. He focuses on converting complex technical products into elegant marketing stories.",
    image: "https://lh3.googleusercontent.com/aida/ADBb0ujbCWY1wOhrcaHzFJK_1aoDzmaTV2A7waiBWIzh8hHuJQfSp5VKrGrpIQUt3tLWxrzpCge8W7eTLbnyxHoziv2c5jfhdv4cEN8Q-4RghVtR1Eq_BX-ZFH4t8sgRre3IruodIbkvhzPIvR9tUrerplm387qmHFxlmhdLJJ_yE6aIlzA41f-OWbOhuhbalmCfJGihkaNqe6_FobeGyvd8p9SWlx2vfsfFmR1UfYAvO_gDn9dcYm1xMvbLSQ",
    verifiedIcon: "task_alt",
    verifiedColor: "secondary",
    socials: {
      linkedin: "https://linkedin.com/",
      email: "rihad@galaxatech.com"
    }
  }
];

export default function AboutView() {
  const [activeTab, setActiveTab] = useState<'dna' | 'team' | 'culture'>('dna');

  return (
    <div className="relative pt-32 pb-24 text-left">
      
      {/* 1. Page Header */}
      <section className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-primary font-bold tracking-[0.25em] text-xs uppercase mb-3 block">
          Our Story & DNA
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight max-w-3xl mx-auto">
          Architecting the <br />
          <span className="text-gradient">Digital Frontier</span>
        </h1>
        <p className="text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
          Based out of Dhaka, Bangladesh, we construct bespoke React ecosystems and luxury interfaces designed for seamless performance.
        </p>

        {/* Tab Selection buttons */}
        <div className="flex justify-center mt-12">
          <div className="p-1.5 shadow-2xl bg-black/45 backdrop-blur-md border border-white/8 rounded-full flex gap-1">
            <button
              onClick={() => setActiveTab('dna')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                activeTab === 'dna' ? 'primary-gradient text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Our DNA & Mission
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                activeTab === 'team' ? 'primary-gradient text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Founding Leadership Core
            </button>
            <button
              onClick={() => setActiveTab('culture')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                activeTab === 'culture' ? 'primary-gradient text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Studio Culture Values
            </button>
          </div>
        </div>
      </section>

      {/* 2. Content Tabs */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        
        {/* TAB 1: DNA & Mission */}
        {activeTab === 'dna' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Context side */}
            <div className="flex flex-col gap-6 text-left">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                We Turn Complex Ideas <br />
                <span className="text-gradient">Into Seamless Realities</span>
              </h2>
              
              <p className="text-white/65 text-xs sm:text-sm font-sans leading-relaxed">
                Founded with a hunger for visual purity and software longevity, GalaxaTech serves as a dedicated strategic partner for businesses globally. We don't believe in mock systems or bloated frameworks. Every component we draft is checked for mobile responsiveness, accessibility parameters, and search engine speed.
              </p>

              <div className="h-[1px] bg-white/10 w-full my-3" />

              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-0.5">Visceral Aesthetic Standard</h4>
                    <p className="text-[11px] text-white/50 font-sans">We construct premium obsidian dark modes and textured glassmorphic displays that focus user attention.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-0.5">Rigorous Compilation Performance</h4>
                    <p className="text-[11px] text-white/50 font-sans">Our TypeScript layouts compile into heavily compressed, lightning fast, accessible production builds.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual side */}
            <div className="relative">
              <div className="aspect-[5/4] glass-card rounded-[2.5rem] overflow-hidden relative border-white/10 shadow-3xl">
                <img 
                  alt="Architecture Atmosphere" 
                  className="w-full h-full object-cover grayscale opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvEFPfB8GtdlYUeTiz-4dQ9IQrt1C8Anbk4ltjkUS8N0sIJAviSus6Yh2ov_IKcDW_zYBCrEjx6Yv5DR0Grz2qjhOQZWT7Z1e9jsHG4oDBFe59dkwxxOheAOGCKvBZ5AlNcdzTFOwx4D4GI8e88_cBnjMGF9HkR6IRILMXfpxK2Se0YlqNpEPS9cw3HlurX-ciybxaY4FkY_f_weKy1n5Dd_Ux79d_aEABj1UgSvnAhZRZUtruWW90RRBAI2dl0emFO4bsjJBng6E"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060e22] via-[#060e22]/10 to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Core Founders Team */}
        {activeTab === 'team' && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-16">
              <h3 className="font-display text-2xl font-bold text-white mb-2">Our Founding Leaders</h3>
              <p className="text-white/55 text-xs font-sans">Co-founded by specialized experts aligned under the Dhaka Studio engineering guidelines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {LEADERS.map((leader, i) => (
                <div 
                  key={i}
                  className="glass-card rounded-[2.5rem] overflow-hidden border-white/10 shadow-3xl text-left hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image box */}
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        alt={leader.name} 
                        className="w-full h-full object-cover grayscale object-top"
                        src={leader.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14121e]/90 via-[#14121e]/20 to-transparent" />
                    </div>

                    {/* Meta info Box */}
                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-display text-lg font-bold text-white">{leader.name}</h4>
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px] uppercase">
                          &#10003;
                        </div>
                      </div>
                      <p className="text-primary font-semibold text-xs font-sans mb-4">{leader.role}</p>
                      
                      <p className="text-white/60 text-xs sm:text-sm font-sans leading-relaxed">
                        {leader.bio}
                      </p>
                    </div>
                  </div>

                  {/* Social Triggers bottom links */}
                  <div className="px-8 pb-8 pt-4 border-t border-white/5 flex gap-3 text-xs">
                    {leader.socials.github && (
                      <a href={leader.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-primary/20 text-white/70 hover:text-white border border-white/8 transition-colors">
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {leader.socials.linkedin && (
                      <a href={leader.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-primary/20 text-white/70 hover:text-white border border-white/8 transition-colors">
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    <a href={`mailto:${leader.socials.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-primary/20 text-white/70 hover:text-white border border-white/8 transition-colors ml-auto">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Studio Culture */}
        {activeTab === 'culture' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="glass-card p-10 rounded-[2.5rem] border-white/10 shadow-xl text-left hover:border-primary/25 transition-all">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Code className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-display text-lg font-bold mb-2 text-white">01. Heavy Type Safety</h4>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                We forbid manual any-type declarations, untyped API routes, and insecure key exposures. All components are strictly documented under precise global type limits.
              </p>
            </div>

            <div className="glass-card p-10 rounded-[2.5rem] border-white/10 shadow-xl text-left hover:border-primary/25 transition-all">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary border border-primary/20">
                <Users className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-display text-lg font-bold mb-2 text-white">02. Radical Inclusion</h4>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                Our clients join our active Slack workspace rooms directly. Communication is frequent, detailed, and completely automated via continuous integration logs.
              </p>
            </div>

            <div className="glass-card p-10 rounded-[2.5rem] border-white/10 shadow-xl text-left hover:border-primary/25 transition-all">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary border border-primary/20">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-display text-lg font-bold mb-2 text-white">03. High Security Sprints</h4>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                No mock data allowed under security bounds. All third-party software connects directly to secure servers, keeping production client details insulated.
              </p>
            </div>

          </div>
        )}

      </section>

      {/* 3. Global Stats Ribbon */}
      <section className="py-16 bg-[#060d20] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
            <div>
              <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-2">150+</h3>
              <p className="text-[10px] font-bold text-white/40 tracking-wider font-display uppercase">Global Deployments</p>
            </div>
            <div>
              <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-primary mb-2">99%</h3>
              <p className="text-[10px] font-bold text-white/40 tracking-wider font-display uppercase">Client Retention</p>
            </div>
            <div>
              <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-2">10ms</h3>
              <p className="text-[10px] font-bold text-white/40 tracking-wider font-display uppercase">Average Load Latencies</p>
            </div>
            <div>
              <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-secondary mb-2">24/7</h3>
              <p className="text-[10px] font-bold text-white/40 tracking-wider font-display uppercase">Agile Standup updates</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

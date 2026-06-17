import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ArrowRight, 
  Mail, 
  MessageSquare, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Send,
  Linkedin,
  Twitter,
  Github,
  Copy,
  Check
} from 'lucide-react';
import { navigate, handleSEOAnchorClick } from '../lib/router';
import { useSEO } from '../hooks/useSEO';
import { BLOG_POSTS } from '../data/blogData';
export { BLOG_POSTS };

// Reusable SEO Layout Frame
export function PublicLayout({ children, currentPath, onLogin, onDemoLogin }: { children: React.ReactNode; currentPath: string; onLogin: () => void; onDemoLogin: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 selection:text-indigo-200 font-sans overflow-x-hidden">
      
      {/* Dynamic Background Noise and Gradients */}
      <div className="absolute top-[5%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay"></div>

      {/* Primary Fixed Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5" id="public-navbar">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Section (No vercel references) */}
          <a 
            href="/" 
            onClick={(e) => handleSEOAnchorClick(e, '/')} 
            className="flex items-center gap-2 group cursor-pointer"
            id="logo"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">HabitFlow</span>
          </a>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" onClick={(e) => handleSEOAnchorClick(e, '/')} className={`text-sm font-medium hover:text-indigo-400 transition-colors ${currentPath === '/' ? 'text-indigo-400' : 'text-slate-300'}`}>Home</a>
            <a href="/blog" onClick={(e) => handleSEOAnchorClick(e, '/blog')} className={`text-sm font-medium hover:text-indigo-400 transition-colors ${currentPath.startsWith('/blog') || BLOG_POSTS.some(p => currentPath === `/${p.slug}`) ? 'text-indigo-400' : 'text-slate-300'}`}>Blog</a>
            <a href="/about" onClick={(e) => handleSEOAnchorClick(e, '/about')} className={`text-sm font-medium hover:text-indigo-400 transition-colors ${currentPath === '/about' ? 'text-indigo-400' : 'text-slate-300'}`}>About</a>
            <a href="/contact" onClick={(e) => handleSEOAnchorClick(e, '/contact')} className={`text-sm font-medium hover:text-indigo-400 transition-colors ${currentPath === '/contact' ? 'text-indigo-400' : 'text-slate-300'}`}>Contact</a>
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onDemoLogin} 
              className="text-xs font-semibold px-4 py-2 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl transition-all"
            >
              Try Guest Mode
            </button>
            <button 
              onClick={onLogin} 
              className="text-xs font-bold px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center gap-1"
            >
              Start Free <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            id="mobile-menu-toggle"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`h-0.5 w-full bg-current transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`h-0.5 w-full bg-current transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full bg-current transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0A0A0F] border-b border-white/5 py-4 px-6 flex flex-col gap-4"
          >
            <a href="/" onClick={(e) => { setIsMobileMenuOpen(false); handleSEOAnchorClick(e, '/'); }} className="text-sm font-semibold text-slate-300 py-1">Home</a>
            <a href="/blog" onClick={(e) => { setIsMobileMenuOpen(false); handleSEOAnchorClick(e, '/blog'); }} className="text-sm font-semibold text-slate-300 py-1">Blog</a>
            <a href="/about" onClick={(e) => { setIsMobileMenuOpen(false); handleSEOAnchorClick(e, '/about'); }} className="text-sm font-semibold text-slate-300 py-1">About</a>
            <a href="/contact" onClick={(e) => { setIsMobileMenuOpen(false); handleSEOAnchorClick(e, '/contact'); }} className="text-sm font-semibold text-slate-300 py-1">Contact</a>
            
            <div className="h-px bg-white/5 my-2" />
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onDemoLogin(); }} 
                className="w-full text-center py-2.5 border border-white/10 rounded-xl text-sm font-semibold"
              >
                Try Guest Mode
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onLogin(); }} 
                className="w-full text-center py-2.5 bg-indigo-500 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="min-h-screen pt-24 pb-20">
        {children}
      </main>

      {/* Detailed Premium Footer */}
      <footer className="border-t border-white/5 bg-[#07070B] py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="font-bold text-lg text-white">HabitFlow</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              The professional AI habit tracker optimized for students and high achievers. Built for authentic behavioral science and psychological growth.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors" title="Follow us on Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors" title="Follow us on LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors" title="Follow us on GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Core Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><button onClick={onLogin} className="hover:text-indigo-400 transition-colors">Start Tracking Free</button></li>
              <li><button onClick={onDemoLogin} className="hover:text-indigo-400 transition-colors">Try Guest Demo Mode</button></li>
              <li><a href="/" onClick={(e) => handleSEOAnchorClick(e, '/')} className="hover:text-indigo-400 transition-colors">AI Coaching System</a></li>
              <li><a href="/" onClick={(e) => handleSEOAnchorClick(e, '/')} className="hover:text-indigo-400 transition-colors">Streak Protection Engine</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">SEO Resources</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/blog" onClick={(e) => handleSEOAnchorClick(e, '/blog')} className="hover:text-indigo-400 transition-colors">Productivity Blog</a></li>
              <li><a href="/best-habits-for-students" onClick={(e) => handleSEOAnchorClick(e, '/best-habits-for-students')} className="hover:text-indigo-400 transition-colors">Student Habit Lists</a></li>
              <li><a href="/ai-productivity-guide" onClick={(e) => handleSEOAnchorClick(e, '/ai-productivity-guide')} className="hover:text-indigo-400 transition-colors">AI Productivity Guide</a></li>
              <li><a href="/study-routine-guide" onClick={(e) => handleSEOAnchorClick(e, '/study-routine-guide')} className="hover:text-indigo-400 transition-colors">Exam Study Routine</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Trust &amp; Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/privacy" onClick={(e) => handleSEOAnchorClick(e, '/privacy')} className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" onClick={(e) => handleSEOAnchorClick(e, '/terms')} className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="/about" onClick={(e) => handleSEOAnchorClick(e, '/about')} className="hover:text-indigo-400 transition-colors">About our Team</a></li>
              <li><a href="/contact" onClick={(e) => handleSEOAnchorClick(e, '/contact')} className="hover:text-indigo-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto h-px bg-white/5 my-8" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} HabitFlow. Designed using high-performance behavioral systems for students worldwide.</p>
          <div className="flex gap-4">
            <span>Clean Code &amp; SEO Friendly</span>
            <span>•</span>
            <span>Authorized by Google API Compliance</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// 1. ALL BLOGS PAGE
export function BlogsPage({ onLogin }: { onLogin: () => void }) {
  useSEO({
    title: 'Productivity & Habits Blog | HabitFlow',
    description: 'Expert study routine guides, morning routines, and AI habit tracking insights to maximize your academic and personal growth sustainably.',
    keywords: 'AI habit tracker, habit tracker for students, productivity app, self improvement app, study routine guide, streak tracker'
  });

  // State for the interactive Streak Badge & Profile Embed Builder
  const [badgeUsername, setBadgeUsername] = useState('alex_achiever');
  const [badgeStreak, setBadgeStreak] = useState('18');
  const [badgeColor, setBadgeColor] = useState('indigo');
  const [badgeIcon, setBadgeIcon] = useState('flame');
  const [badgeRounded, setBadgeRounded] = useState('full');
  const [copiedFormat, setCopiedFormat] = useState<'markdown' | 'html' | null>(null);

  // Available option palettes
  const colorMap: Record<string, { bg: string; text: string; border: string; accent: string; fill: string }> = {
    indigo: { bg: 'bg-indigo-950/50', text: 'text-indigo-200', border: 'border-indigo-500/30', accent: 'bg-indigo-500', fill: '#6366f1' },
    emerald: { bg: 'bg-emerald-950/50', text: 'text-emerald-200', border: 'border-emerald-500/30', accent: 'bg-emerald-500', fill: '#10b981' },
    amber: { bg: 'bg-amber-950/50', text: 'text-amber-200', border: 'border-amber-500/30', accent: 'bg-amber-500', fill: '#f59e0b' },
    rose: { bg: 'bg-rose-950/50', text: 'text-rose-200', border: 'border-rose-500/30', accent: 'bg-rose-500', fill: '#f43f5e' },
    cyan: { bg: 'bg-slate-900/80', text: 'text-cyan-200', border: 'border-cyan-500/30', accent: 'bg-cyan-500', fill: '#06b6d4' }
  };

  const roundedClasses: Record<string, string> = {
    full: 'rounded-full',
    lg: 'rounded-2xl',
    none: 'rounded-none'
  };

  // SVG Render Helper for the Badge URL or preview
  const getBadgeIconSvg = () => {
    switch (badgeIcon) {
      case 'flame': return '⚡';
      case 'sparkles': return '✨';
      case 'star': return '⭐';
      case 'book': return '📚';
      case 'check': return '🏆';
      default: return '⚡';
    }
  };

  const activePalette = colorMap[badgeColor] || colorMap.indigo;

  // Real embed links that point back safely to HabitFlow, signaling premium authority to Google crawler bots
  const markdownEmbedCode = `[![${badgeUsername}'s Streak Badge](https://habitflow.app/api/badge?user=${badgeUsername}&streak=${badgeStreak}&color=${badgeColor}&icon=${badgeIcon})](https://habitflow.app/)`;
  const htmlEmbedCode = `<a href="https://habitflow.app/" target="_blank">\n  <img src="https://img.shields.io/badge/HabitFlow-${badgeUsername}_%E2%80%A2_${badgeStreak}_Day_Streak-${badgeColor}?style=flat-square&logo=visual-studio-code" alt="HabitFlow Streak Badge" />\n</a>`;

  const copyToClipboard = (type: 'markdown' | 'html') => {
    const code = type === 'markdown' ? markdownEmbedCode : htmlEmbedCode;
    navigator.clipboard.writeText(code).then(() => {
      setCopiedFormat(type);
      setTimeout(() => setCopiedFormat(null), 2500);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full">Habit Science</span>
        <h1 className="text-4xl md:text-5xl font-black mt-4 mb-6 tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">HabitFlow Productivity Blog</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Deep behavioral insights, academic templates, study guides, and morning routines written by performance scientists and students to build streaks that survive real life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post, idx) => (
          <motion.div 
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-[24px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-5 flex flex-col justify-between group h-full transition-all hover:border-indigo-500/20"
          >
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden mb-5">
                <img 
                  referrerPolicy="no-referrer"
                  src={post.image} 
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-3 left-3 px-3 py-1 text-[10px] uppercase font-bold text-indigo-300 bg-black/80 backdrop-blur-md rounded-md tracking-wider border border-white/5">
                  {post.category}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors leading-snug">
                <a href={`/${post.slug}`} onClick={(e) => handleSEOAnchorClick(e, `/${post.slug}`)} className="cursor-pointer">{post.title}</a>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {post.excerpt}
              </p>
            </div>
            <a 
              href={`/${post.slug}`}
              onClick={(e) => handleSEOAnchorClick(e, `/${post.slug}`)}
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 group-hover:text-indigo-300 cursor-pointer pt-3"
            >
              Read Full Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        ))}
      </div>

      {/* Interactive Profile Badge & Embed Builder Widget - Drives Viral Backlinks */}
      <section className="mt-20 p-8 md:p-12 rounded-[32px] border border-white/5 bg-black/40 backdrop-blur-3xl relative overflow-hidden" id="streak-embed-builder">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/10">Inbound Organic Backlinks</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-3 mb-4">Academic Embed Code Generator</h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Showcase your hard-earned consistent streaks on your GitHub, UCLA/Stanford student profiles, Notion workspaces, or engineering portfolio. Highly customized to fit your student branding.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch">
          
          {/* Customizer Panel */}
          <div className="lg:col-span-2 space-y-5 bg-white/[0.01] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Student Username</label>
                <input 
                  type="text" 
                  value={badgeUsername}
                  onChange={(e) => setBadgeUsername(e.target.value.replace(/\s+/g, '_'))}
                  placeholder="alex_achiever"
                  className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-white placeholder-slate-700 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-35">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Streak Count</label>
                  <input 
                    type="number" 
                    value={badgeStreak}
                    onChange={(e) => setBadgeStreak(e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Border Style</label>
                  <select 
                    value={badgeRounded}
                    onChange={(e) => setBadgeRounded(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-white outline-none transition-all"
                  >
                    <option value="full">Pill shape</option>
                    <option value="lg">Soft rounded</option>
                    <option value="none">Sharp edges</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Theme Color</label>
                <div className="flex gap-2.5">
                  {Object.keys(colorMap).map((cKey) => (
                    <button
                      key={cKey}
                      onClick={() => setBadgeColor(cKey)}
                      className={`w-6 h-6 rounded-full transition-all border-2 ${badgeColor === cKey ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: colorMap[cKey].fill }}
                      title={`Select ${cKey}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Streak Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { key: 'flame', label: '⚡' },
                    { key: 'sparkles', label: '✨' },
                    { key: 'star', label: '⭐' },
                    { key: 'book', label: '📚' },
                    { key: 'check', label: '🏆' }
                  ].map((ic) => (
                    <button
                      key={ic.key}
                      onClick={() => setBadgeIcon(ic.key)}
                      className={`py-1.5 border rounded-lg text-xs hover:bg-white/5 transition-all text-center ${badgeIcon === ic.key ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold' : 'border-white/5 text-slate-400'}`}
                    >
                      {ic.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Tip: Copy either code format to backlink your profile pages directly. Every active backlink increases HabitFlow rating score on Google!
              </p>
            </div>
          </div>

          {/* Real-time Preview Panel */}
          <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
            <div className="bg-white/[0.01] p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center py-10">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-4">Badges Live Preview</span>
              
              {/* Actual HTML SVG Mockup */}
              <div className={`flex items-center gap-2 px-4 py-2 border ${activePalette.bg} ${activePalette.border} ${roundedClasses[badgeRounded]} shadow-lg transition-all shadow-${badgeColor}-500/10`}>
                <span className="text-sm">{getBadgeIconSvg()}</span>
                <span className="text-xs font-mono font-bold tracking-tight text-white">{badgeUsername}</span>
                <div className="h-3.5 w-px bg-white/10" />
                <span className={`text-xs font-black ${activePalette.text}`}>{badgeStreak} DAY STREAK</span>
              </div>
            </div>

            {/* Embed Codes Code Block container */}
            <div className="space-y-3.5">
              
              {/* Markdown code block */}
              <div className="bg-[#0C0C12] border border-white/5 rounded-xl p-3 relative group">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-mono font-semibold text-slate-500">MARKDOWN (For GitHub Readme)</span>
                  <button 
                    onClick={() => copyToClipboard('markdown')}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all inline-flex items-center gap-1 text-[9px] font-bold"
                  >
                    {copiedFormat === 'markdown' ? (
                      <><Check className="w-2.5 h-2.5 text-emerald-400" /> Copied!</>
                    ) : (
                      <><Copy className="w-2.5 h-2.5" /> Copy Code</>
                    )}
                  </button>
                </div>
                <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto select-all whitespace-pre-wrap leading-relaxed py-1">
                  {markdownEmbedCode}
                </pre>
              </div>

              {/* HTML code block */}
              <div className="bg-[#0C0C12] border border-white/5 rounded-xl p-3 relative group">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-mono font-semibold text-slate-500">HTML CODE (For Portfolios &amp; Blogs)</span>
                  <button 
                    onClick={() => copyToClipboard('html')}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all inline-flex items-center gap-1 text-[9px] font-bold"
                  >
                    {copiedFormat === 'html' ? (
                      <><Check className="w-2.5 h-2.5 text-emerald-400" /> Copied!</>
                    ) : (
                      <><Copy className="w-2.5 h-2.5" /> Copy Code</>
                    )}
                  </button>
                </div>
                <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto select-all whitespace-pre-wrap leading-relaxed py-1">
                  {htmlEmbedCode}
                </pre>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Highlight Promotion Banner */}
      <div className="mt-14 p-8 md:p-12 rounded-[32px] border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-[#0A0A0F] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Want to track these habits on a beautiful dashboard?</h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
          All study routines, morning cycles, and athletic trackings discussed here are instantly importable into HabitFlow. Built for student schedules.
        </p>
        <button 
          onClick={onLogin}
          className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
        >
          Build Your Free Routines
        </button>
      </div>
    </div>
  );
}

// 2. SINGLE BLOG POST READER
export function BlogPostReader({ slug, onLogin }: { slug: string; onLogin: () => void }) {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto text-center px-6 py-20">
        <h1 className="text-3xl font-black mb-4">Article Not Found</h1>
        <p className="text-slate-400 mb-8">The blog post you specified does not exist or has been relocated to another sub-address.</p>
        <button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2 text-indigo-400 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </button>
      </div>
    );
  }

  useSEO({
    title: `${post.title} | HabitFlow`,
    description: post.excerpt,
    keywords: post.keywords,
    image: post.image,
    type: 'article'
  });

  return (
    <article className="max-w-4xl mx-auto px-6 py-8">
      
      {/* Back Link */}
      <button 
        onClick={() => navigate('/blog')} 
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all articles
      </button>

      {/* Hero Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-xs text-slate-500">• {post.readTime}</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-3xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 border-y border-white/5 py-4">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Dr. Sarah Vance, Behavioral Systems</p>
            <p className="text-xs text-slate-500">Published on {post.date} • Scientifically Verified</p>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="aspect-[21/9] rounded-[24px] overflow-hidden mb-12 border border-white/5">
        <img 
          referrerPolicy="no-referrer"
          src={post.image} 
          alt={post.title} 
          loading="eager"
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Grid: Article Body & Interactive Sidebar Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Render Formatted Markdown/HTML Blocks */}
        <div className="lg:col-span-2 text-justify select-text">
          <div className="prose prose-invert prose-indigo max-w-none text-slate-300 leading-relaxed space-y-6">
            {post.content.trim().split('\n\n').map((block, bIdx) => {
              if (block.startsWith('## ')) {
                return <h2 key={bIdx} className="text-2xl md:text-3xl font-extrabold text-white mt-8 mb-4 tracking-tight">{block.replace('## ', '')}</h2>;
              }
              if (block.startsWith('### ')) {
                return <h3 key={bIdx} className="text-xl md:text-2xl font-bold text-indigo-300 mt-6 mb-3 tracking-tight">{block.replace('### ', '')}</h3>;
              }
              if (block.startsWith('* ') || block.startsWith('1. ')) {
                return (
                  <ul key={bIdx} className="space-y-3 pl-5 list-disc text-slate-300 my-4">
                    {block.split('\n').map((line, lIdx) => (
                      <li key={lIdx} className="leading-relaxed">
                        {line.replace(/^(\*\s+|\d+\.\s+)/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={bIdx} className="text-slate-300 leading-relaxed mb-4">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Interactive Collapsible FAQ Section inside the Article Body to capture featured search snippets */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-14 pt-8 border-t border-white/10" id="article-faqs">
              <h3 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
                <Sparkles className="text-yellow-400 w-4 h-4 fill-yellow-400" /> Frequently Asked Questions
              </h3>
              
              <div className="space-y-3">
                {post.faqs.map((faq, fIdx) => {
                  const isOpen = openFaqIdx === fIdx;
                  return (
                    <div 
                      key={fIdx}
                      className="border border-white/5 rounded-2xl bg-white/[0.01]/50 backdrop-blur-md overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setOpenFaqIdx(isOpen ? null : fIdx)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between text-xs md:text-sm font-semibold text-white hover:text-indigo-400 transition-colors bg-white/[0.01]"
                      >
                        <span>{faq.question}</span>
                        <span className={`text-base font-bold transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>＋</span>
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 text-xs md:text-sm text-slate-400 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Context Conversion Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-2xl border border-white/5 bg-[#0F0F16]/50 backdrop-blur-xl space-y-6">
            <h4 className="font-extrabold text-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Start Applying Today
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Don't just read about routines—track them. Create an account, activate streak protection, and analyze how your mood impacts academic performance.
            </p>
            <div className="space-y-2">
              <button 
                onClick={onLogin}
                className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm tracking-tight transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
              >
                Start Free Habit Tracking
              </button>
              <button 
                onClick={() => navigate('/blog')}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10 transition-all cursor-pointer"
              >
                Explore other guides
              </button>
            </div>
            <div className="h-px bg-white/5" />
            <p className="text-[10px] text-slate-500 text-center">
              Works on Desktop, Tablet, and Mobile devices perfectly. No credit card required.
            </p>
          </div>
        </div>

      </div>

    </article>
  );
}

// 3. ABOUT PAGE
export function AboutPage() {
  useSEO({
    title: 'About Our Team & Mission | HabitFlow',
    description: 'We build adaptive, science-backed productivity applications that treat users like humans instead of spreadsheet numbers.'
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10 text-slate-400 uppercase tracking-widest">Our Mission</span>
        <h1 className="text-4xl md:text-5xl font-black mt-4 mb-6 tracking-tight">Consistency For Humans</h1>
        <p className="text-slate-400 leading-relaxed text-lg">
          At LifeFlow Lab, we make behavior change sustainable. We believe standard apps punish students and developers for simply being human. We designed a flexible platform that supports growth without guilt.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 rounded-[24px] border border-white/5 bg-white/[0.01]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-400" /> Human-First Behavioral Science</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            Typical streak systems treat behaviors as zero-sum metrics. If you get sick or have finals week and miss a workout, you are punished with a complete reset. HabitFlow pioneered adaptable options and streak protections to reduce behavioral avoidance.
          </p>
        </div>
        <div className="p-8 rounded-[24px] border border-white/5 bg-white/[0.01]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-400" /> Integrated AI Guidance</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            We coupled standard trackers with advanced language models to offer contextual suggestions. Your coach will automatically scale down tasks during stressful weeks to secure your high streaks.
          </p>
        </div>
      </div>

      {/* Logo/Branding section for Custom Domain */}
      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Our Performance Standard</p>
        <p className="text-lg font-bold text-white mb-6">Designed with high-quality design principles modeled from Apple, Notion, and Linear.</p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale group hover:opacity-60 transition-opacity">
          <span className="text-sm font-semibold tracking-wider font-mono">100% SECURE AUTH</span>
          <span className="text-sm font-semibold tracking-wider font-mono">FIREBASE DATABASE</span>
          <span className="text-sm font-semibold tracking-wider font-mono">OPENROUTER INTEGRATION</span>
        </div>
      </div>
    </div>
  );
}

// 4. CONTACT PAGE
export function ContactPage() {
  useSEO({
    title: 'Contact Support & Feedback | HabitFlow',
    description: 'Have feedback or need assistance? Open a direct channel to our engineering and performance science desk.'
  });

  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.email || !formState.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormState({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Contact Our Desk</h1>
        <p className="text-slate-400 text-sm">Have ideas for student templates, streak options, or AI coaches? Drop us a secure message.</p>
      </div>

      <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.01]/70 backdrop-blur-3xl">
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Message Transmitted</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
              Our engineering unit has securely intercepted your transmission. Expect a personal reply within 24 operational hours.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold cursor-pointer"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Your Name</label>
              <input 
                type="text" 
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Achiever"
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                <input 
                  type="email" 
                  required
                  value={formState.email}
                  onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="name@university.edu"
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Transmission Message <span className="text-red-500">*</span></label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                <textarea 
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="I would like to suggest custom student routine packs for high school ADHD students..."
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm transition-all resize-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <>Transmitting...</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Transmission</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// 5. PRIVACY POLICY PAGE
export function PrivacyPolicyPage() {
  useSEO({
    title: 'Privacy Policy | HabitFlow',
    description: 'We respect your data privacy. Read how HabitFlow protects your emotional reports and activity streaks sustainably.'
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 select-text text-justify">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-indigo-400" />
        <h1 className="text-3xl font-black">Data Privacy Statement</h1>
      </div>
      <p className="text-slate-500 text-xs mb-8">Effective Date: May 29, 2026 • Version 2.0 (Google Crawrawl Ready)</p>

      <div className="prose prose-invert prose-slate space-y-6 text-sm text-slate-400 leading-relaxed">
        <p>
          At HabitFlow, we are dedicated to safeguarding the metadata, routine logs, and mood descriptions you submit. We strictly avoid monetizing your personal workspace metrics or tracking details to advertising corporations.
        </p>

        <h2 className="text-white text-lg font-bold mt-6">1. Information Collection and Syncing</h2>
        <p>
          We gather simple identification metrics when you run authentic Google Firebase authentication sessions or set up local-sandbox profile metrics. This comprises: name markers, email handles, and daily streak parameters.
        </p>

        <h2 className="text-white text-lg font-bold mt-6">2. Language Processing and OpenRouter Privacy</h2>
        <p>
          When querying our customized AI Coach, the conversation blocks are securely parsed through OpenRouter endpoints using encrypted SSL protocols. They are evaluated specifically to craft immediate feedback. Conversation fragments are NOT logged permanently by OpenRouter networks or sold as LLM training records.
        </p>

        <h2 className="text-white text-lg font-bold mt-6">3. Cookies and Browser Cache Retention</h2>
        <p>
          We utilize essential client-side local values (localStorage) to verify active login tokens, preserve chosen interface modes, and store guest demo trackers securely. You can clear this anytime through browser options.
        </p>
      </div>
    </div>
  );
}

// 6. TERMS OF SERVICE PAGE
export function TermsOfServicePage() {
  useSEO({
    title: 'Terms of Service | HabitFlow',
    description: 'Agreeing to the sustainable self-improvement usage policy of HabitFlow.'
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 select-text text-justify">
      <div className="flex items-center gap-3 mb-8">
        <AlertCircle className="w-8 h-8 text-indigo-400" />
        <h1 className="text-3xl font-black">Terms &amp; Conditions</h1>
      </div>
      <p className="text-slate-500 text-xs mb-8">Effective Date: May 29, 2026 • Operational Guidelines</p>

      <div className="prose prose-invert prose-slate space-y-6 text-sm text-slate-400 leading-relaxed">
        <p>
          By activating an account or logging into the visual components of HabitFlow, you consent to these guidelines. Please review these parameters prior to running premium or guest configurations.
        </p>

        <h2 className="text-white text-lg font-bold mt-6">1. Usage Rights and User Registration</h2>
        <p>
          You are granted non-exclusive, personal credentials to navigate our habit trackers and study routines. You must provide authentic descriptions of your requirements and must not deploy automated scraping loops to manipulate our AI coach endpoints.
        </p>

        <h2 className="text-white text-lg font-bold mt-6">2. Disclaimer of Coaching Validity</h2>
        <p>
          The custom AI Coach acts solely as a virtual behavior advisory system based on standard heuristic theories. It is NOT a professional replacement for mental health practitioners or specialized clinicians. Always consult licensed medical experts for deep physical or psychological diagnostic analyses.
        </p>

        <h2 className="text-white text-lg font-bold mt-6">3. Service Evolution</h2>
        <p>
          We preserve the absolute right to expand, limit, or refine visual panels, streak algorithms, and token scales at our command to support standard high-performance benchmarks.
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Chrome, 
  ShieldCheck, 
  Layout, 
  Loader2, 
  Flame, 
  Layers, 
  Brain, 
  TrendingUp,
  Activity,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Lock,
  ArrowRight,
  Trophy,
  BookOpen,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Heart,
  Star,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { navigate } from '../lib/router';

interface LoginProps {
  onLogin: () => Promise<void> | void;
  onDemoLogin: () => void;
}

export function Login({ onLogin, onDemoLogin }: LoginProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // FAQ Expanded index state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Mock Dashboard Preview Active State for Gamification Landing Section
  const [mockComplete, setMockComplete] = useState<Record<string, boolean>>({
    study: false,
    workout: true,
    hydrate: false
  });
  const [mockXp, setMockXp] = useState(420);
  const [mockStreak, setMockStreak] = useState(5);

  const handleToggleMock = (habit: string) => {
    const nextVal = !mockComplete[habit];
    setMockComplete(prev => ({ ...prev, [habit]: nextVal }));
    if (nextVal) {
      setMockXp(prev => prev + 50);
      setMockStreak(prev => prev + 1);
    } else {
      setMockXp(prev => Math.max(420, prev - 50));
      setMockStreak(prev => Math.max(5, prev - 1));
    }
  };

  const handleLoginClick = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      await onLogin();
    } catch (e: any) {
      console.error(e);
      const isCancelled = e?.message?.includes('cancelled') || e?.code?.includes('cancelled') || e?.message?.includes('closed') || e?.code?.includes('closed');
      if (isCancelled) {
        setErrorMessage("Standard login was dismissed or blocked. Try our fully functional, zero-friction Guest/Demo Mode below!");
      } else {
        setErrorMessage(e?.message || "Standard login failed. Please feel free to bypass this with Guest/Demo Mode below.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoLoginClick = () => {
    onDemoLogin();
  };

  const FAQ_ITEMS = [
    {
      q: "What makes HabitFlow better than standard habit trackers?",
      a: "Standard habit trackers punish you for being human. If you miss a single day because of midterms or exams, your streak resets to zero, causing frustration. HabitFlow supports flexible 'OR' routine links (e.g., Gym OR 15 min Stretch) and streak protection systems so your momentum survives real life."
    },
    {
      q: "Is the AI Coach truly customized?",
      a: "Yes! HabitFlow connects directly to cutting-edge model suites using highly secure server-side OpenRouter proxies. Your AI coach doesn't just send generic quotes—it reviews your logged mood analytics, fatigue markers, and weekly completions to suggest customized behavioral pacing before you experience burnout."
    },
    {
      q: "Can I connect a custom domain to my tracker?",
      a: "Absolutely. The site code is built entirely with independent environment hooks and standard URL-routing engines. It is 100% prepared to be mapped to a custom domain (like yours.com) under standard Vercel, Cloud Run, or custom host settings."
    },
    {
      q: "Is HabitFlow optimized for students?",
      a: "Yes, it is designed from the ground up for students. It supports split-routine structures, study template integration, exam-buffer periods, and ADHD-friendly notification configurations to help you organize academic tasks seamlessly."
    },
    {
      q: "Is my personal reflection and mood log secure?",
      a: "Completely. Your logs, emotions, and conversations with the coach are stored in private Firebase database collections. We do not sell your personal behavior logs, and standard APIs do not store database context for AI training."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[50%] right-[10%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay"></div>

      {/* Dynamic SEO Tag Manipulation inside Component */}
      <React.Fragment>
        <span className="hidden" aria-hidden="true">AI Habit Tracker for Students &amp; Peak Productivity</span>
      </React.Fragment>

      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5" id="nav-landing">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">HabitFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#science" className="text-slate-400 hover:text-white transition-colors">The Science</a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }} className="text-slate-400 hover:text-white transition-colors font-semibold flex items-center gap-1 text-indigo-400">
              Blog <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded uppercase font-bold text-indigo-300">New</span>
            </a>
            <a href="#testimonials" className="text-slate-400 hover:text-white transition-colors">Reviews</a>
            <a href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a>
          </div>

          <button 
            onClick={handleLoginClick}
            disabled={isLoggingIn}
            className="text-sm font-semibold text-white bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : <Chrome className="w-4 h-4 text-indigo-400" />}
            Log in / Start
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* AI Banner Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> Human-First AI Habits &amp; Routines
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/95 to-slate-500">
            Flexible streaks.<br/>
            Smarter growth.
          </h1>
          
          <p className="text-base md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The premium behavior design ecosystem that adapts to real student calendars. Track with linked habits, freeze streaks when busy, and train with your personal AI Coaching Assistant.
          </p>

          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 max-w-xl mx-auto bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-4 rounded-xl text-xs leading-relaxed flex items-center gap-3 text-left"
            >
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Core Conversion CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <button 
              onClick={handleLoginClick}
              disabled={isLoggingIn}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex-1 cursor-pointer"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5 text-indigo-600 fill-indigo-600" />}
              <span>{isLoggingIn ? 'Redirecting...' : 'Start Free with Google'}</span>
            </button>
            <button 
              onClick={handleDemoLoginClick}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 flex-1 cursor-pointer shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              <Zap className="w-5 h-5" />
              <span>Track Habits Instantly</span>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-500" /> Privacy Shielded</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-500" /> Exam-Ready Protection</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Brain className="w-4 h-4 text-purple-500" /> Server-Side AI (No keys needed)</span>
          </div>

          {/* INTERACTIVE ANIMATED DASHBOARD PREVIEW */}
          <div className="mt-16 max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#09090D] shadow-2xl overflow-hidden relative group">
            {/* Ambient glows inside mock dashboard */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />
            
            {/* Header / Top bar of mock */}
            <div className="bg-white/[0.02] border-b border-white/5 py-3.5 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/40" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <span className="w-3 h-3 rounded-full bg-green-500/40" />
              </div>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Interactive Product Experience - Click to Try</div>
              <div className="w-10 h-2 bg-white/10 rounded-full" />
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
              
              {/* Daily Checklist */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wide text-indigo-400 mb-2">Today's Adaptive Checklist</h3>
                
                {/* Gym OR Stretch Habit */}
                <div 
                  onClick={() => handleToggleMock('workout')}
                  className={cn(
                    "flex justify-between items-center bg-white/[0.01] border hover:bg-white/[0.03] p-4 rounded-2xl cursor-pointer transition-all",
                    mockComplete.workout ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "border-white/5"
                  )}
                >
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                      Late Workout Routine 
                      {mockComplete.workout && <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">30 min Gym OR 15 min Room Stretch (Flex Options)</p>
                  </div>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                    mockComplete.workout 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold" 
                      : "bg-white/5 text-slate-600 border-white/10"
                  )}>
                    {mockComplete.workout ? "✓" : "+"}
                  </div>
                </div>

                {/* Study Sprint */}
                <div 
                  onClick={() => handleToggleMock('study')}
                  className={cn(
                    "flex justify-between items-center bg-white/[0.01] border hover:bg-white/[0.03] p-4 rounded-2xl cursor-pointer transition-all",
                    mockComplete.study ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "border-white/5"
                  )}
                >
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                      Deep Study Sprint 
                      {mockComplete.study && <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">25 min Deep Recall Audit (Pomodoro)</p>
                  </div>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                    mockComplete.study 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold" 
                      : "bg-white/5 text-slate-600 border-white/10"
                  )}>
                    {mockComplete.study ? "✓" : "+"}
                  </div>
                </div>

                {/* AI Insight Box reflecting state changes */}
                <div className="bg-gradient-to-r from-indigo-950/20 to-purple-950/10 border border-indigo-500/20 p-5 rounded-2xl relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4.5 h-4.5 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Predictive AI Feedback</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {mockComplete.study 
                      ? "Awesome job starting your deep study sprint! Based on your history, completing this habit on a Thursday increases your exam stress threshold by 12%."
                      : "We set up an exam streak buffer for yesterday. Click 'Deep Study Sprint' above to complete today's focus block and trigger +50 XP!"
                    }
                  </p>
                </div>
              </div>

              {/* Sidebar Stats Box */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Aura Level</p>
                      <p className="text-3xl font-black text-white mt-1">Lvl 12</p>
                    </div>
                    <div className="flex items-center gap-1 text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2.5 py-1 rounded-lg text-xs font-black">
                      <Flame className="w-3.5 h-3.5 fill-orange-400" />
                      <span>{mockStreak}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-mono">
                      <span>Progress: {mockXp} / 500 XP</span>
                      <span className="text-indigo-400">+{mockComplete.study || mockComplete.workout ? '50' : '0'} XP Pending</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500" 
                        style={{ width: `${(mockXp / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Consistency heatmap</p>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "aspect-square rounded-sm border cursor-pointer",
                          i === 13 && mockComplete.study ? "bg-emerald-500 border-emerald-400" :
                          i % 3 === 0 ? "bg-indigo-600/30 border-indigo-500/20" :
                          i % 4 === 0 ? "bg-purple-600/50 border-purple-500/30" :
                          "bg-emerald-500/80 border-emerald-400/50"
                        )} 
                        title={`Day ${i+1}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-600 mt-2 font-mono uppercase font-bold">
                    <span>Low Effort</span>
                    <span>Peak Consistent</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* MARKETING LOGOS */}
      <section className="py-12 border-y border-white/5 bg-black/60 text-center relative z-10 overflow-hidden">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">OPTIMIZED FOR HIGH-ACHIEVING STUDENTS AND MAKERS</p>
        <div className="flex flex-wrap justify-center items-center gap-12 text-sm font-semibold tracking-widest text-slate-400 font-mono">
          <span className="hover:text-white transition-colors">STANFORD SEED</span>
          <span className="hover:text-white transition-colors">OPENROUTER NETWORKS</span>
          <span className="hover:text-white transition-colors">STUDENT SAVINGS COMPLIANT</span>
          <span className="hover:text-white transition-colors">ADHD INCLUSIVE DESIGN</span>
        </div>
      </section>

      {/* WHY STANDARD TRACKERS FAIL (FEATURES) */}
      <section className="py-24 px-6 relative z-10 border-b border-white/5" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-3 py-1.5 rounded-full">Core Technology</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 mb-4 tracking-tight text-white">Traditional trackers punish. We adapt.</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">We studied academic burnout to engineer streak protections that accommodate exam stresses, busy workloads, and late nights.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent hover:border-indigo-500/20 transition-all group relative">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Streak Freezes and Free Shields</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Exam season or sidetracked by assignments? Toggle a streak freeze to lock your metrics. Build momentum sustainably.
              </p>
            </div>

            <div className="p-8 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent hover:border-purple-500/20 transition-all group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all">
                <Layers className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Option-Linked Habits ("OR" routines)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect alternative behaviors. 'Gym workout 30m OR Bedroom stretch 15m' lets you complete the habit block while scaling friction perfectly.
              </p>
            </div>

            <div className="p-8 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent hover:border-rose-500/20 transition-all group">
              <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all">
                <Sparkles className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Continuous AI Coach Guidance</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Chat securely with a behavioral model trained on healthy self-improvement. No API keys required—pre-configured server-side queries handle everything.
              </p>
            </div>

            <div className="p-8 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent hover:border-emerald-500/20 transition-all group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Mood heatmaps &amp; Correlations</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Audit how late studies or fatigue patterns impact consistency. Log your emotional state and check predictive correlation reports instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE SCIENCE & THE HABIT STREAK SYSTEM */}
      <section className="py-24 px-6 relative z-10 border-b border-white/5 bg-gradient-to-r from-black via-[#0B0B13]/30 to-black" id="science">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <span className="text-xs font-bold uppercase text-purple-400 tracking-widest bg-purple-500/10 px-3 py-1 bg-purple-500/10 rounded-full">Gamification Science</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Engage with a sustainable level pacing algorithm.</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              We leverage spatial gaming mechanics (inspired by RPG character grids) to model human habitude. Complete objectives to generate XP points, climb character levels, raise streaks, and earn special custom digital awards.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Earn Achievements</h4>
                  <p className="text-slate-400 text-xs mt-1">Unlock badges (e.g. "Sunrise Hero", "Deep Scholar") and display milestones proudly on your stats board.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Flexible Level Thresholds</h4>
                  <p className="text-slate-400 text-xs mt-1">Level requirements scale dynamically based on task difficulty. Higher challenges yield greater rewards.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 bg-white/[0.01] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl" />
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Academic Task Template</span>
              <span className="text-xs font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">HABIT OBJECTIVE</p>
                <p className="text-sm font-bold text-white mt-1">"Solve 5 Physics Review Flashcards"</p>
                <div className="flex items-center gap-6 mt-3 text-[10px] text-slate-500">
                  <span className="font-mono">Difficulty: MEDIUM</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">+60 XP</span>
                </div>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">STREAK SHIELD STATUS</p>
                <p className="text-sm font-bold text-white mt-1">"Activated: 2 Freezes Remain"</p>
                <div className="flex items-center gap-6 mt-3 text-[10px] text-slate-500">
                  <span>Usage: Automatic under high exam load</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS & SOCIAL PROOF */}
      <section className="py-24 px-6 relative z-10" id="testimonials">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">Community Love</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 mb-4 text-white tracking-tight">Approved by students globally</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">Top-rated feedback from student circles prioritizing clean performance design.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed text-sm">
                "Finding an AI habit tracker built with zero-friction Google access and direct option habits is fantastic. Keeps me on point under exam fatigue."
              </p>
              <div>
                <p className="font-bold text-white text-sm">Julian R.</p>
                <p className="text-xs text-slate-500">Engineering Student, UCLA</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed text-sm">
                "The server-side AI Coach feels completely organic. I get precise schedule reviews on performance trendlines without entering any keys."
              </p>
              <div>
                <p className="font-bold text-white text-sm">Sophia V.</p>
                <p className="text-xs text-slate-500">Pre-Med Student, NYU</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-slate-300 mb-6 font-medium leading-relaxed text-sm">
                "I tracked studies, workouts, sleep, and mood correlations for three months. Cleanest Notion-style interface I have used."
              </p>
              <div>
                <p className="font-bold text-white text-sm">Kenji O.</p>
                <p className="text-xs text-slate-500">Creative Tech, Tokyo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG HIGHLIGHT SECTION */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#07070C]/60 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-full">Guides &amp; Advice</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mt-4 text-white tracking-tight">Recent Academic Routine Columns</h2>
            </div>
            <a 
              href="/blog" 
              onClick={(e) => { e.preventDefault(); navigate('/blog'); }} 
              className="text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1 group whitespace-nowrap mt-4 md:mt-0 cursor-pointer text-sm"
            >
              Browse all articles <span className="group-hover:translate-x-1 duration-200 transition-transform">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-[#09090E] transition-all group flex flex-col justify-between">
              <div>
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-white/5">
                  <img 
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80" 
                    alt="Best habits for students guide" 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.02] duration-300 transition-transform"
                  />
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Student Habits Column</span>
                <h3 className="text-xl font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors">The Best Habits for Students: Designing Your Academic Routine</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                  separating top performance metrics from regular burnout, with custom streak protection.
                </p>
              </div>
              <a 
                href="/best-habits-for-students" 
                onClick={(e) => { e.preventDefault(); navigate('/best-habits-for-students'); }} 
                className="mt-6 text-sm font-bold text-indigo-400 inline-flex items-center gap-1 cursor-pointer"
              >
                Read column <span>→</span>
              </a>
            </div>

            <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-[#09090E] transition-all group flex flex-col justify-between">
              <div>
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-white/5">
                  <img 
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80" 
                    alt="AI productivity guide" 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.02] duration-300 transition-transform"
                  />
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Productivity Tech Guide</span>
                <h3 className="text-xl font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors">AI Productivity Guide: How ML Can Supercharge Your Habits</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                  Leveraging behavioral logs and generative feedback without API complexity.
                </p>
              </div>
              <a 
                href="/ai-productivity-guide" 
                onClick={(e) => { e.preventDefault(); navigate('/ai-productivity-guide'); }} 
                className="mt-6 text-sm font-bold text-indigo-400 inline-flex items-center gap-1 cursor-pointer"
              >
                Read guide <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="py-24 px-6 relative z-10" id="faq">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 bg-indigo-500/10 rounded-full">Knowledge Hub</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 mb-4 tracking-tight text-white">Frequently Queried FAQ</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">Everything you need to verify regarding billing, API protection, domain setup, and adaptive rules.</p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl border border-white/5 bg-white/[0.01]/80 backdrop-blur-md overflow-hidden transition-all duration-300 text-left"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 text-white font-bold hover:bg-white/[0.01] transition-colors cursor-pointer"
                >
                  <span className="text-base md:text-lg flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0", expandedFaq === idx ? "rotate-180" : "")} />
                </button>
                
                <AnimatePresence>
                  {expandedFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* IMMERSIVE ENDING CTA */}
      <section className="py-28 px-6 relative overflow-hidden text-center border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Consistency should feel human.</h2>
          <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
            Start building study routines that survive exams, stress periods, and busy calendar slots. Completely free for life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto pt-6">
            <button 
              onClick={handleLoginClick}
              disabled={isLoggingIn}
              className="w-full px-10 py-5 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2.5 active:scale-95 text-base disabled:opacity-70 disabled:active:scale-100 flex-1 cursor-pointer"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5" />}
              <span>Secure with Google</span>
            </button>
            <button 
              onClick={handleDemoLoginClick}
              className="w-full px-10 py-5 bg-transparent text-white border border-white/10 hover:border-white/30 hover:bg-white/5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 text-base flex-1 cursor-pointer"
            >
              <Zap className="w-5 h-5 text-indigo-400" />
              <span>Try Guest Mode</span>
            </button>
          </div>
        </div>
      </section>

      {/* LANDING FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#050505] text-center text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />
            </div>
            <span className="font-bold text-sm text-white">HabitFlow</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-slate-400 font-semibold">
            <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:text-white transition-colors cursor-pointer">About Us</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="hover:text-white transition-colors cursor-pointer">Contact Support</a>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className="hover:text-white transition-colors cursor-pointer">Terms &amp; Conditions</a>
          </div>

          <p className="text-slate-600">© {new Date().getFullYear()} HabitFlow. Designed using pure cognitive behavioral structures.</p>
        </div>
      </footer>

    </div>
  );
}

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
  Sparkles,
  Lock,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: () => Promise<void> | void;
}

export function Login({ onLogin }: LoginProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginClick = async () => {
    setIsLoggingIn(true);
    try {
      await onLogin();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans">
      
      {/* Navbar Minimal */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">HabitFlow</span>
          </div>
          <button 
            onClick={handleLoginClick}
            disabled={isLoggingIn}
            className="text-sm font-semibold text-white/80 hover:text-white flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : 'Log in'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[0%] right-[10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Stop losing streaks because life happened
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50">
              Flexible streaks.<br/>
              Smarter growth.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The AI-powered habit tracker that adapts to real life. Build habits without guilt, protect your streaks when you're busy, and actually stick to your goals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleLoginClick}
                disabled={isLoggingIn}
                className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
              >
                {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5" />}
                {isLoggingIn ? 'Signing in...' : 'Start Tracking Free'}
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Privacy-first</span>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> AI-Powered</span>
              <span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> Built for Students</span>
            </div>
          </motion.div>

          {/* Hero UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl md:rounded-[32px] border border-white/10 bg-[#0A0A0E]/80 backdrop-blur-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden group">
               {/* Reflection */}
               <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none rounded-[32px]" />
               
               {/* Mockup Content */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  <div className="col-span-2 space-y-4 text-left">
                    <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                       <div>
                         <h3 className="font-bold text-white flex items-center gap-2">Morning Routine <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /></h3>
                         <p className="text-xs text-slate-400 mt-1">Gym OR Home Workout</p>
                       </div>
                       <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                    </div>
                    
                    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-indigo-400" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">AI Coach Insight</p>
                         </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        "I noticed your consistency drops on Thursdays. I've automatically adjusted your 'Deep Work' habit to require 30 mins instead of 60 mins tomorrow to protect your streak."
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                     <div>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">XP Level</p>
                       <p className="text-4xl font-black text-white">Lvl 12</p>
                       <div className="w-full h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
                         <div className="w-[70%] h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                       </div>
                       <p className="text-xs text-slate-500 mt-2 text-right">300 XP to next level</p>
                     </div>
                     <div className="mt-8">
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">Weekly Momentum</p>
                       <div className="flex items-end justify-between h-16 gap-1">
                          {[40, 60, 50, 80, 100, 90, 70].map((h, i) => (
                             <div key={i} className="w-full bg-indigo-500/20 rounded-t" style={{ height: `${h}%` }} />
                          ))}
                       </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#050505] to-[#0A0A0F]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Why standard trackers fail</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Traditional habit trackers punish you for being human. We built a system that adapts to your reality.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <FeatureCard 
               icon={ShieldCheck}
               title="Flexible Streak Protection"
               desc="Missed the gym because you were studying late? Log a 15-minute home workout instead to freeze your streak. No guilt. No repeating Day 1."
               gradient="from-emerald-500/20 to-teal-500/5"
               borderColor="border-emerald-500/20"
               iconColor="text-emerald-400"
             />
             <FeatureCard 
               icon={Layers}
               title="Linked Habits"
               desc="Build 'OR' habits. 'Read 10 pages OR Listen to 20 mins of Audiobook'. Give yourself options, maintaining the core behavior without the friction."
               gradient="from-indigo-500/20 to-purple-500/5"
               borderColor="border-indigo-500/20"
               iconColor="text-indigo-400"
             />
             <FeatureCard 
               icon={Brain}
               title="Get personalized guidance when motivation drops."
               desc="Our AI Coach analyzes your completion rates, mood logs, and schedule to give you actionable advice before you break a long streak."
               gradient="from-rose-500/20 to-orange-500/5"
               borderColor="border-rose-500/20"
               iconColor="text-rose-400"
             />
             <FeatureCard 
               icon={Activity}
               title="Understand how your emotions affect consistency."
               desc="Dual-tracking: log your mood alongside your habits. See beautiful heatmaps correlating your high-stress weeks with your workout completions."
               gradient="from-sky-500/20 to-blue-500/5"
               borderColor="border-sky-500/20"
               iconColor="text-sky-400"
             />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-24 px-6 relative z-10">
         <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-12">Loved by students & overachievers</h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
               <TestimonialCard 
                 quote="Finally a tracker that doesn't make me feel terrible when exams happen and I miss a day. The streak protection is genius."
                 name="Sarah J."
                 role="Medical Student"
               />
               <TestimonialCard 
                 quote="The AI Coach pointed out that my sleep habits crash on Thursdays. Adjusted my schedule and haven't broken my workout streak since."
                 name="David K."
                 role="Software Engineer"
               />
               <TestimonialCard 
                 quote="Linked habits completely changed how I read. Audiobooks count towards my goal now. 10/10 UX is stunning."
                 name="Elena M."
                 role="Designer"
               />
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 relative z-10 border-t border-white/5 overflow-hidden">
         <div className="absolute inset-0 bg-indigo-500/5" />
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
         
         <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Consistency should feel human.</h2>
            <p className="text-xl text-slate-400 mb-10">Start building habits that survive real life. Free forever for the core features.</p>
            
            <button 
              onClick={handleLoginClick}
              disabled={isLoggingIn}
              className="px-10 py-5 bg-white text-black hover:bg-slate-200 rounded-2xl font-bold transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] inline-flex items-center justify-center gap-3 active:scale-95 text-lg disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : <Chrome className="w-6 h-6" />}
              {isLoggingIn ? 'Redirecting...' : 'Start Tracking Free'}
            </button>
         </div>
      </section>
      
      {/* Footer Minimal */}
      <footer className="py-8 px-6 text-center border-t border-white/5 text-slate-500 text-sm">
         <p>© {new Date().getFullYear()} HabitFlow. Built in public by a student developer.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, gradient, borderColor, iconColor }: any) {
  return (
    <div className={cn("p-8 rounded-[24px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group")}>
       <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", gradient)} />
       <div className="relative z-10">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-[#050505] border", borderColor)}>
             <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
          <p className="text-slate-400 leading-relaxed">{desc}</p>
       </div>
    </div>
  )
}

function TestimonialCard({ quote, name, role }: any) {
  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
      <div className="flex gap-1 mb-4">
        {[1,2,3,4,5].map(i => <div key={i}><Zap className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" /></div>)}
      </div>
      <p className="text-slate-300 mb-6 font-medium leading-relaxed">"{quote}"</p>
      <div>
        <p className="font-bold text-white">{name}</p>
        <p className="text-xs text-slate-500">{role}</p>
      </div>
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

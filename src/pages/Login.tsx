import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Chrome, ShieldCheck, Github, Layout, Loader2 } from 'lucide-react';

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
      // Handle error
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050505] overflow-hidden relative transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 max-w-md w-full relative z-10 text-center"
      >
        <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-600/20">
          <Zap className="text-white w-8 h-8 fill-white" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 italic uppercase">HabitFlow</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-10 text-sm leading-relaxed">
          Master your routines. Rewrite your future. <br/> Join 10,000+ top performers.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={handleLoginClick}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-4 bg-slate-100 dark:bg-white text-slate-900 dark:text-black py-4 rounded-xl font-bold transition-all shadow-lg hover:bg-slate-200 dark:hover:bg-slate-100 active:scale-95 group disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            ) : (
              <Chrome className="w-5 h-5 group-hover:rotate-[20deg] transition-transform text-indigo-600" />
            )}
            {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
          </button>
          
          <button className="w-full flex items-center justify-center gap-4 bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all group">
            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Sign in with GitHub
          </button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5 grid grid-cols-3 gap-4">
            <Feature icon={ShieldCheck} text="Secure" />
            <Feature icon={Layout} text="Responsive" />
            <Feature icon={Zap} text="AI Driven" />
        </div>
      </motion.div>
    </div>
  );
}

function Feature({ icon: Icon, text }: any) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{text}</span>
        </div>
    )
}

import React from 'react';
import { useTheme } from '@/src/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export function MobileHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#0b0f1a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">H</div>
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">HabitFlow</span>
      </div>
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
}

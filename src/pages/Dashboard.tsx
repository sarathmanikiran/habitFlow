import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  Layout, 
  Plus, 
  ChevronRight,
  Sparkles,
  Trophy,
  Activity,
  Award,
  Medal
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { useHabitData } from '@/src/hooks/useHabitData';
import { format, subDays, isSameDay } from 'date-fns';

const HABIT_COLORS = [
  { value: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-400' },
  { value: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-400' },
  { value: 'amber', bg: 'bg-amber-500', text: 'text-amber-400' },
  { value: 'rose', bg: 'bg-rose-500', text: 'text-rose-400' },
  { value: 'violet', bg: 'bg-violet-500', text: 'text-violet-400' },
  { value: 'sky', bg: 'bg-sky-500', text: 'text-sky-400' },
  { value: 'orange', bg: 'bg-orange-500', text: 'text-orange-400' },
  { value: 'fuchsia', bg: 'bg-fuchsia-500', text: 'text-fuchsia-400' },
];

export function Dashboard({ userName, onPageChange }: { userName: string, onPageChange: (page: any) => void }) {
  const { habits, completions, toggleCompletion, calculateStreak } = useHabitData();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);

  // Stats calculation
  const totalCompleted = useMemo(() => completions.filter(c => c.completed).length, [completions]);
  
  const streaks = useMemo(() => activeHabits.map(h => ({
    id: h.id,
    name: h.name,
    streak: calculateStreak(h.id),
    color: h.color
  })), [activeHabits, calculateStreak]);

  const maxStreak = Math.max(0, ...streaks.map(s => s.streak));
  
  const completionRate = useMemo(() => {
    if (activeHabits.length === 0) return 0;
    const recentCompletions = completions.filter(c => {
      const date = new Date(c.date);
      const sevenDaysAgo = subDays(new Date(), 7);
      return date >= sevenDaysAgo && c.completed && activeHabits.some(h => h.id === c.habitId);
    });
    return Math.round((recentCompletions.length / (activeHabits.length * 7)) * 100);
  }, [activeHabits, completions]);

  // Achievement logic
  const achievements = useMemo(() => {
    const list = [];
    if (totalCompleted >= 100) list.push({ icon: Trophy, label: "Century Club", color: "text-amber-400", bg: "bg-amber-500/10" });
    if (maxStreak >= 7) list.push({ icon: Award, label: "Consistency Starter", color: "text-emerald-400", bg: "bg-emerald-500/10" });
    if (maxStreak >= 30) list.push({ icon: Medal, label: "Habit Master", color: "text-indigo-400", bg: "bg-indigo-500/10" });
    
    // Check for "Perfect Day" (all habits completed today)
    const todayCompletions = completions.filter(c => c.date === todayStr && c.completed && activeHabits.some(h => h.id === c.habitId));
    if (activeHabits.length > 0 && todayCompletions.length === activeHabits.length) {
      list.push({ icon: Activity, label: "Perfect Day", color: "text-rose-400", bg: "bg-rose-500/10" });
    }
    
    return list;
  }, [totalCompleted, maxStreak, activeHabits, completions, todayStr]);

  return (
    <div className="space-y-6 md:space-y-8 pb-12 transition-colors duration-300">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Good morning, {userName}</h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">Consistency is the key to success. 🔥</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => {
              const shareData = {
                title: 'HabitFlow Progress',
                text: `I've completed ${totalCompleted} habits on HabitFlow! Check out my consistency score: ${completionRate}%`,
                url: window.location.origin
              };

              if (navigator.share) {
                navigator.share(shareData).catch(err => console.log('Error sharing:', err));
              } else {
                navigator.clipboard.writeText(window.location.origin);
                alert('App link copied to clipboard!');
              }
            }}
            className="btn-secondary flex-1 sm:flex-none py-2 md:py-2.5"
          >
            Share
          </button>
          <button 
            onClick={() => onPageChange('habits')}
            className="btn-primary flex-1 sm:flex-none px-4 py-2 md:py-2.5"
          >
            + Add Habit
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Completed" 
          value={totalCompleted.toString()} 
          trend="All-time victories"
          color="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard 
          label="Best Streak" 
          value={`${maxStreak} days`} 
          trend="Keep the chain alive"
          color="text-orange-600 dark:text-orange-400"
        />
        <StatCard 
          label="Weekly Score" 
          value={`${completionRate}%`} 
          trend="Based on last 7 days"
          color="text-indigo-600 dark:text-indigo-400"
        />
        <div className="bg-indigo-600/10 border border-indigo-500/20 p-5 rounded-2xl relative overflow-hidden hidden sm:block">
          <div className="relative z-10">
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase mb-2">AI Coach Tip</p>
            <p className="text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed">"Habits are the compound interest of self-improvement."</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Sparkles className="w-20 h-20 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Today's Habits Checklist */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card flex flex-col overflow-hidden">
            <div className="p-5 md:p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/[0.02]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Today's Checklist</h3>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest bg-slate-200 dark:bg-white/5 px-2 py-1 rounded">
                {format(new Date(), 'MMM dd')}
              </span>
            </div>
            <div className="p-4 md:p-6 space-y-3">
              {activeHabits.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p>No habits scheduled for today.</p>
                  <button 
                    onClick={() => onPageChange('habits')}
                    className="mt-4 text-indigo-400 font-bold hover:underline"
                  >
                    Create one now
                  </button>
                </div>
              ) : activeHabits.map(habit => {
                const comp = completions.find(c => c.habitId === habit.id && c.date === todayStr);
                const habitColor = HABIT_COLORS.find(c => c.value === habit.color);
                return (
                  <HabitItem 
                    key={habit.id}
                    name={habit.name} 
                    desc={habit.category} 
                    colorClass={habitColor?.bg || "bg-indigo-600 dark:bg-indigo-500"}
                    completed={!!comp?.completed} 
                    onToggle={() => toggleCompletion(habit.id, todayStr)}
                  />
                );
              })}
            </div>
          </div>

          {/* Achievement Row */}
          {achievements.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((ach, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={idx} 
                  className={cn("flex flex-col items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-white/5 transition-all text-center", ach.bg)}
                >
                  <ach.icon className={cn("w-6 h-6", ach.color)} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white">{ach.label}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Side Progress Widgets */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-5 md:p-6">
            <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 tracking-wider uppercase text-[10px]">Weekly Progress</h4>
            <div className="flex items-end justify-between h-32 gap-1.5 md:gap-2">
              {[...Array(7)].map((_, i) => {
                const day = subDays(new Date(), 6 - i);
                const dayStr = format(day, 'yyyy-MM-dd');
                const dailyComps = completions.filter(c => c.date === dayStr && c.completed && activeHabits.some(h => h.id === c.habitId)).length;
                const dailyRate = activeHabits.length > 0 ? (dailyComps / activeHabits.length) * 100 : 0;
                
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "flex-1 bg-indigo-500/20 rounded-t transition-all",
                      i === 6 ? "bg-slate-200 dark:bg-white/10 border-t-2 border-indigo-500" : "hover:bg-indigo-500/40"
                    )}
                    style={{ height: `${Math.max(5, dailyRate)}%` }}
                  ></div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span className="text-indigo-400">S</span>
            </div>
          </div>

          <div className="glass-card p-5 md:p-6">
            <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 tracking-wider uppercase text-[10px]">Top Streaks</h4>
            <div className="space-y-4">
              {streaks.sort((a,b) => b.streak - a.streak).slice(0, 3).map(s => {
                  const habitColor = HABIT_COLORS.find(c => c.value === s.color);
                  return (
                    <div key={s.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-2 h-2 rounded-full", habitColor?.bg || "bg-indigo-500")} />
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{s.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span className="text-xs font-black text-slate-900 dark:text-white">{s.streak}</span>
                        </div>
                    </div>
                  )
              })}
              {streaks.length === 0 && <p className="text-[10px] text-slate-500 italic">Start a habit to see streaks here.</p>}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400">Activity Intensity</h4>
              <span className="text-[10px] text-slate-400 dark:text-slate-600">Last 14 days</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {[...Array(14)].map((_, i) => {
                const day = subDays(new Date(), 13 - i);
                const dayStr = format(day, 'yyyy-MM-dd');
                const hasComp = completions.some(c => c.date === dayStr && c.completed);
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "aspect-square rounded-sm transition-all duration-500",
                      hasComp ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-slate-200 dark:bg-white/5"
                    )}
                  ></div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-4 text-center">Consistent effort yields the best results.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HabitItem({ name, desc, colorClass, completed, onToggle }: { name: string, desc: string, colorClass: string, completed: boolean, onToggle: () => void }) {
  return (
    <div className={cn(
      "flex items-center justify-between gap-3 p-[10px_12px] bg-slate-100/50 dark:bg-white/[0.03] rounded-xl border border-slate-200 dark:border-white/5 group hover:border-indigo-500/50 transition-all duration-300",
      completed && "bg-slate-200/50 dark:bg-white/[0.01]"
    )}>
      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", colorClass)} />
      
      <div className="flex-1 ml-[10px] min-w-0">
        <p className={cn("font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight", completed && "line-through text-slate-400 dark:text-slate-500")}>{name}</p>
        {desc && <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest truncate">{desc}</p>}
      </div>

      <button 
        onClick={onToggle}
        className={cn(
          "w-10 h-10 flex-shrink-0 rounded-xl border flex items-center justify-center cursor-pointer transition-all active:scale-90",
          completed ? `${colorClass} border-transparent text-white shadow-lg` : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-transparent"
        )}
      >
        <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
      </button>
    </div>
  );
}

function StatCard({ label, value, trend, color }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 group hover:translate-y-[-4px] transition-all duration-300"
    >
      <p className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase mb-3 tracking-widest">{label}</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
      <p className={cn("text-xs mt-1 font-bold", color)}>{trend}</p>
    </motion.div>
  );
}

function GoalPreview({ title, progress, color }: any) {
  return (
    <div className="group cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">{title}</span>
        <span className="text-xs text-slate-500">{progress}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}

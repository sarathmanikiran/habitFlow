import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
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
  Medal,
  Share2,
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { useHabitData } from '../hooks/useHabitData';
import { format, subDays, isSameDay } from 'date-fns';
import { ShareStreakModal } from '../components/ShareStreakModal';
import { AchievementsModal } from '../components/AchievementsModal';
import { calculateTotalXP, calculateLevelAndXP } from '../lib/gamification';

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
  const { habits, completions, toggleCompletion, calculateStreak, reorderHabits, deleteHabit, editHabit } = useHabitData();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [shareStreak, setShareStreak] = useState<any>(null);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [localActiveHabits, setLocalActiveHabits] = useState<any[]>([]);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [editName, setEditName] = useState('');
  
  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);

  useEffect(() => {
    // Only sort by order
    setLocalActiveHabits([...activeHabits].sort((a,b) => (a.order || 0) - (b.order || 0)));
  }, [activeHabits]);

  const handleReorder = (newOrder: any[]) => {
    setLocalActiveHabits(newOrder);
    reorderHabits(newOrder);
  };


  // Gamification XP
  const totalXP = useMemo(() => calculateTotalXP(completions, habits), [completions, habits]);
  const { level, title, nextLevelXP, progress } = useMemo(() => calculateLevelAndXP(totalXP), [totalXP]);

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
    if (level >= 10) list.push({ icon: Award, label: "Level 10 Vanguard", color: "text-purple-400", bg: "bg-purple-500/10" });
    if (maxStreak >= 7) list.push({ icon: Flame, label: "7-Day Streak", color: "text-orange-400", bg: "bg-orange-500/10" });
    if (maxStreak >= 30) list.push({ icon: Medal, label: "Habit Master", color: "text-indigo-400", bg: "bg-indigo-500/10" });
    
    // Check for "Perfect Day" (all habits completed today)
    const todayCompletions = completions.filter(c => c.date === todayStr && c.completed && activeHabits.some(h => h.id === c.habitId));
    if (activeHabits.length > 0 && todayCompletions.length === activeHabits.length) {
      list.push({ icon: Activity, label: "Perfect Day", color: "text-rose-400", bg: "bg-rose-500/10" });
    }
    
    return list;
  }, [totalCompleted, maxStreak, activeHabits, completions, todayStr, level]);

  return (
    <div className="space-y-6 md:space-y-8 pb-12 transition-colors duration-300">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
          <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">AI Coach Online</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Welcome back, {userName.split(' ')[0]}</h1>
          <p className="text-sm md:text-lg font-medium text-slate-600 dark:text-slate-400">Your habits are adapting to your life. Stay consistent without the guilt.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => {
              const shareData = {
                title: 'HabitFlow Progress',
                text: `I'm Level ${level} with ${totalXP} XP on HabitFlow!`,
                url: window.location.origin
              };

              if (navigator.share) {
                navigator.share(shareData).catch(err => console.log('Error sharing:', err));
              } else {
                navigator.clipboard.writeText(window.location.origin);
                alert('App link copied to clipboard!');
              }
            }}
            className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button 
            onClick={() => onPageChange('habits')}
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Habit
          </button>
        </div>
      </header>

      {/* XP System Bar */}
      <div className="rounded-[24px] bg-slate-50 dark:bg-[#0A0A0E] border border-slate-200 dark:border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-sm">
          <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] relative overflow-hidden group">
                 <div className="absolute inset-0 bg-white/20 group-hover:translate-y-[-100%] transition-transform duration-500 rounded-[20px]" />
                 <span className="text-[10px] text-white/80 font-black uppercase tracking-widest leading-none mt-1 z-10">Lvl</span>
                 <span className="text-white font-black text-3xl leading-none z-10">{level}</span>
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white flex flex-wrap items-center gap-3 tracking-tight">
                   {title}
                   <span className="text-[10px] bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest">{totalXP} XP</span>
                 </h2>
                 <p className="text-sm text-slate-500 font-semibold mt-1">Level up by protecting your streaks.</p>
              </div>
          </div>
          <div className="w-full md:w-[40%] bg-slate-100 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/5">
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                 <span>Level {level}</span>
                 <span>Level {level + 1}</span>
             </div>
             <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                 />
             </div>
             <p className="text-right text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">{Math.max(0, nextLevelXP - totalXP)} XP to next rank</p>
          </div>
      </div>

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative p-6 rounded-[24px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 overflow-hidden hidden sm:flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-500"
        >
          <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">AI Coach Tip</p>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed max-w-[200px]">"Habits are the compound interest of self-improvement. Focus on the 1%."</p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <Sparkles className="w-32 h-32 text-indigo-500" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Today's Habits Checklist */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-[24px] bg-slate-50 dark:bg-[#0A0A0E] border border-slate-200 dark:border-white/5 flex flex-col overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#0A0A0E]/50">
              <div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Today's Focus</h3>
                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Consistency Over Intensity</p>
              </div>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-black tracking-widest bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1.5 rounded-lg">
                {format(new Date(), 'MMM dd')}
              </span>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              {localActiveHabits.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="font-bold">No active habits.</p>
                  <button 
                    onClick={() => onPageChange('habits')}
                    className="mt-4 text-indigo-500 font-bold hover:text-indigo-600 transition-colors uppercase tracking-widest text-xs"
                  >
                    Start tracking now
                  </button>
                </div>
              ) : (
                <Reorder.Group axis="y" values={localActiveHabits} onReorder={handleReorder} className="space-y-4">
                  {localActiveHabits.map(habit => {
                    const comp = completions.find(c => c.habitId === habit.id && c.date === todayStr);
                    const habitColor = HABIT_COLORS.find(c => c.value === habit.color);
                    return (
                      <Reorder.Item key={habit.id} value={habit}>
                        <HabitItem 
                          name={habit.name} 
                          desc={habit.category} 
                          colorClass={habitColor?.text || "text-indigo-500"}
                          completed={!!comp?.completed} 
                          onToggle={() => toggleCompletion(habit.id, todayStr)}
                          onDelete={() => deleteHabit(habit.id)}
                          onEdit={() => {
                            setEditingHabit(habit);
                            setEditName(habit.name);
                          }}
                        />
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              )}
            </div>
          </div>

          {/* Achievement Row */}
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Unlocks</h3>
               <button 
                 onClick={() => setShowAchievementsModal(true)}
                 className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1 group"
               >
                 View Collection <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
            
            {achievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((ach, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={idx} 
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] border border-slate-200 dark:border-white/5 transition-all text-center relative overflow-hidden group shadow-sm hover:shadow-xl", 
                      ach.bg
                    )}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.05] transition-colors duration-500 pointer-events-none" />
                    <ach.icon className={cn("w-8 h-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500", ach.color)} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white">{ach.label}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] p-6 text-center text-slate-500 text-sm font-bold border border-dashed border-slate-300 dark:border-white/10">
                Keep tracking habits to unlock achievements.
              </div>
            )}
          </div>
        </div>

        {/* Side Progress Widgets */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-[24px] bg-slate-50 dark:bg-[#0A0A0E] border border-slate-200 dark:border-white/5 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 tracking-[0.2em] uppercase">Weekly Progress</h4>
            <div className="flex items-end justify-between h-32 gap-2">
              {[...Array(7)].map((_, i) => {
                const day = subDays(new Date(), 6 - i);
                const dayStr = format(day, 'yyyy-MM-dd');
                const dailyComps = completions.filter(c => c.date === dayStr && c.completed && activeHabits.some(h => h.id === c.habitId)).length;
                const dailyRate = activeHabits.length > 0 ? (dailyComps / activeHabits.length) * 100 : 0;
                
                return (
                  <div 
                    key={i} 
                    className="flex-1 flex flex-col justify-end group"
                  >
                    <div 
                      className={cn(
                        "w-full rounded-t-xl transition-all duration-500 relative",
                        i === 6 ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "bg-indigo-500/20 group-hover:bg-indigo-500/40"
                      )}
                      style={{ height: `${Math.max(8, dailyRate)}%` }}
                    >
                      {i === 6 && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-300" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest border-t border-slate-200 dark:border-white/5 pt-4">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span className="text-indigo-500">S</span>
            </div>
          </div>

          <div className="rounded-[24px] bg-slate-50 dark:bg-[#0A0A0E] border border-slate-200 dark:border-white/5 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 tracking-[0.2em] uppercase">Top Streaks</h4>
            <div className="space-y-4">
              {streaks.sort((a,b) => b.streak - a.streak).slice(0, 3).map(s => {
                  const habitColor = HABIT_COLORS.find(c => c.value === s.color);
                  return (
                    <div key={s.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-2 h-2 rounded-full", habitColor?.bg || "bg-indigo-500")} />
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{s.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <Flame className="w-3 h-3 text-orange-500" />
                                <span className="text-xs font-black text-slate-900 dark:text-white">{s.streak}</span>
                            </div>
                            <button
                              onClick={() => setShareStreak(s)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-400 transition-all focus:opacity-100"
                              title="Share Streak"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                  )
              })}
              {streaks.length === 0 && <p className="text-[10px] text-slate-500 italic">Start a habit to see streaks here.</p>}
            </div>
          </div>

          <div className="rounded-[24px] bg-slate-50 dark:bg-[#0A0A0E] border border-slate-200 dark:border-white/5 p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase">Contribution</h4>
              <span className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">Last 15 weeks</span>
            </div>
            
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="grid grid-flow-col grid-rows-7 gap-2 min-w-max">
                {Array.from({ length: 105 }).map((_, i) => {
                  const day = subDays(new Date(), 104 - i);
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const count = completions.filter(c => c.date === dayStr && c.completed && activeHabits.some(h => h.id === c.habitId)).length;
                  
                  // Heatmap colors based on intensity
                  let bgClass = "bg-slate-200 dark:bg-white/[0.03]";
                  if (count > 0) bgClass = "bg-indigo-300 dark:bg-indigo-500/40";
                  if (count > 2) bgClass = "bg-indigo-400 dark:bg-indigo-500/60";
                  if (count > 4) bgClass = "bg-indigo-500 dark:bg-indigo-500/80 shadow-[0_0_8px_rgba(99,102,241,0.4)]";
                  if (count > 6) bgClass = "bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]";

                  return (
                    <div 
                      key={i} 
                      title={`${format(day, 'MMM do, yyyy')}: ${count} habits`}
                      className={cn(
                        "w-4 h-4 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer",
                        bgClass
                      )}
                    ></div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center mt-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Less</span>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-white/[0.03]"></div>
                  <div className="w-3 h-3 rounded-sm bg-indigo-300 dark:bg-indigo-500/40"></div>
                  <div className="w-3 h-3 rounded-sm bg-indigo-400 dark:bg-indigo-500/60"></div>
                  <div className="w-3 h-3 rounded-sm bg-indigo-500 dark:bg-indigo-500/80"></div>
                  <div className="w-3 h-3 rounded-sm bg-indigo-600 dark:bg-indigo-500"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ShareStreakModal 
        isOpen={!!shareStreak}
        onClose={() => setShareStreak(null)}
        streak={shareStreak}
        userName={userName}
      />

      <AchievementsModal 
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        stats={{
          level,
          totalXP,
          totalCompleted,
          maxStreak,
          activeHabitsCount: activeHabits.length,
          perfectDayUnlocked: activeHabits.length > 0 && completions.filter(c => c.date === todayStr && c.completed && activeHabits.some(h => h.id === c.habitId)).length === activeHabits.length
        }}
      />

      <AnimatePresence>
        {editingHabit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingHabit(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass-card p-6 shadow-2xl border-slate-200 dark:border-white/10"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-widest uppercase mb-4">Edit Habit</h2>
              <input 
                autoFocus
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="New name..."
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-all font-medium mb-6"
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingHabit(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (editName.trim()) {
                      editHabit(editingHabit.id, { name: editName.trim() });
                    }
                    setEditingHabit(null);
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HabitItem({ name, desc, colorClass, completed, onToggle, onDelete, onEdit }: { name: string, desc: string, colorClass: string, completed: boolean, onToggle: () => void, onDelete?: () => void, onEdit?: () => void }) {
  // Extracting from colorClass something we can use for glows. 
  // Let's assume colorClass has text-indigo-500 or bg-indigo-500. We will map to standard Tailwind colors.
  const isDark = true; // Dashboard is usually used in dark mode for this premium feel
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "relative flex items-center justify-between gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-500 group overflow-hidden cursor-grab active:cursor-grabbing",
        completed 
          ? "bg-slate-100/30 dark:bg-white/[0.01] border-transparent" 
          : "bg-white dark:bg-[#0A0A0E] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 shadow-sm hover:shadow-md"
      )}
    >
      {/* Glow Effect behind the card on hover */}
      {!completed && (
        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none", colorClass)} />
      )}
      
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* State Indicator */}
        <div className="relative flex-shrink-0">
          <div className={cn("w-3 h-3 rounded-full transition-all duration-300", colorClass, completed && "scale-50 opacity-40")} />
          {!completed && (
            <div className={cn("absolute inset-0 rounded-full animate-ping opacity-40", colorClass)} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-bold text-base md:text-lg tracking-tight transition-colors duration-300 truncate",
            completed ? "text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-600" : "text-slate-900 dark:text-white"
          )}>
            {name}
          </p>
          {desc && (
            <p className={cn(
              "text-xs font-semibold uppercase tracking-widest mt-1 truncate transition-colors duration-300",
              completed ? "text-slate-400/50 dark:text-slate-500/50" : "text-slate-500 dark:text-slate-400"
            )}>
              {desc}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all"
            title="Edit Habit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            title="Delete Habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={cn(
            "relative w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-500 active:scale-90 overflow-hidden",
            completed 
              ? `${colorClass} shadow-lg shadow-current/20` 
              : "bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
          )}
        >
          <CheckCircle2 className={cn("w-6 h-6 transition-all duration-500", completed ? "text-white scale-100" : "text-transparent scale-50 group-hover:scale-75 group-hover:text-slate-300 dark:group-hover:text-slate-600")} strokeWidth={completed ? 3 : 2} />
          
          {/* Subtle burst effect when completed */}
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn("absolute inset-0 rounded-full", colorClass)}
              />
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, trend, color }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-[24px] bg-slate-50 dark:bg-[#0A0A0E] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-500 overflow-hidden group shadow-sm hover:shadow-xl"
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.02] dark:group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none", color.split(' ')[0].replace('text-', 'bg-'))} />
      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{value}</p>
          <p className={cn("text-xs font-bold", color)}>{trend}</p>
        </div>
      </div>
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

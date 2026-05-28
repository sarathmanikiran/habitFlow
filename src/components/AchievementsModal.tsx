import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Flame, Medal, Award, Activity, Star, Zap, Crown, Target, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    level: number;
    totalXP: number;
    totalCompleted: number;
    maxStreak: number;
    activeHabitsCount: number;
    perfectDayUnlocked: boolean;
  };
}

export function AchievementsModal({ isOpen, onClose, stats }: AchievementsModalProps) {
  if (!isOpen) return null;

  const ALL_ACHIEVEMENTS = [
    {
      id: 'first_step',
      title: 'First Step',
      description: 'Track your very first habit.',
      icon: Star,
      unlocked: stats.totalCompleted >= 1,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20'
    },
    {
      id: 'seven_day_streak',
      title: '7-Day Streak',
      description: 'Maintain a habit streak for 7 consecutive days.',
      icon: Flame,
      unlocked: stats.maxStreak >= 7,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    },
    {
      id: 'perfect_day',
      title: 'Perfect Day',
      description: 'Complete all your active habits in a single day.',
      icon: Activity,
      unlocked: stats.perfectDayUnlocked,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    },
    {
      id: 'level_10',
      title: 'Level 10 Vanguard',
      description: 'Reach Level 10 in the XP system.',
      icon: Award,
      unlocked: stats.level >= 10,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      id: 'century_club',
      title: 'Century Club',
      description: 'Complete 100 habits overall.',
      icon: Trophy,
      unlocked: stats.totalCompleted >= 100,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      id: 'habit_master',
      title: 'Habit Master',
      description: 'Maintain a habit streak for 30 consecutive days.',
      icon: Medal,
      unlocked: stats.maxStreak >= 30,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      id: 'multi_tasker',
      title: 'Multi-Tasker',
      description: 'Track 5 or more active habits.',
      icon: Layers,
      unlocked: stats.activeHabitsCount >= 5,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20'
    },
    {
      id: 'legend',
      title: 'Living Legend',
      description: 'Reach Level 50 in the XP system.',
      icon: Crown,
      unlocked: stats.level >= 50,
      color: 'text-fuchsia-400',
      bg: 'bg-fuchsia-500/10',
      border: 'border-fuchsia-500/20'
    }
  ];

  const unlockedCount = ALL_ACHIEVEMENTS.filter(a => a.unlocked).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#0A0A0F] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#0A0A0F]/80 backdrop-blur-md z-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Achievements Board</h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
                {unlockedCount} of {ALL_ACHIEVEMENTS.length} Unlocked
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors text-slate-600 dark:text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 md:p-8 overflow-y-auto w-full scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {ALL_ACHIEVEMENTS.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={cn(
                    "p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group",
                    achievement.unlocked 
                      ? `${achievement.bg} ${achievement.border}` 
                      : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 grayscale-[50%] opacity-70"
                  )}
                >
                  {/* Background decoration */}
                  {achievement.unlocked && (
                    <div className="absolute -right-6 -bottom-6 opacity-[0.05] group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <achievement.icon className={cn("w-32 h-32", achievement.color)} />
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        achievement.unlocked ? achievement.bg : "bg-slate-200 dark:bg-white/5"
                      )}>
                        <achievement.icon className={cn("w-6 h-6", achievement.unlocked ? achievement.color : "text-slate-400 dark:text-slate-600")} strokeWidth={achievement.unlocked ? 2.5 : 2} />
                      </div>
                      
                      {achievement.unlocked ? (
                        <div className="px-2 py-1 bg-white/50 dark:bg-white/10 rounded-full flex items-center gap-1 border border-white/20">
                          <Zap className={cn("w-3 h-3 fill-current", achievement.color)} />
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", achievement.color)}>Unlocked</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          Locked
                        </span>
                      )}
                    </div>
                    
                    <h3 className={cn(
                      "text-lg font-black tracking-tight mb-2",
                      achievement.unlocked ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                    )}>
                      {achievement.title}
                    </h3>
                    <p className={cn(
                      "text-sm font-bold leading-relaxed",
                      achievement.unlocked ? "text-slate-600 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"
                    )}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

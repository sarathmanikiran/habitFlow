import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Calendar as CalendarIcon,
  Maximize2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

import { useHabitData } from '@/src/hooks/useHabitData';

export function Calendar() {
  const { habits, completions } = useHabitData();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getIntensity = (day: Date) => {
    if (!isSameMonth(day, monthStart)) return 0;
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayComps = completions.filter(c => c.date === dateStr && c.completed).length;
    if (habits.length === 0) return 0;
    return dayComps / habits.length;
  };

  const totalStreak = habits.length > 0 
    ? Math.max(...habits.map(h => {
        // Simple streak logic for display
        const hComps = completions.filter(c => c.habitId === h.id && c.completed);
        return hComps.length; // Placeholder for real streak in this context
    })) : 0;

  return (
    <div className="space-y-6 md:space-y-8 pb-12 transition-colors duration-300">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Consistency</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-0.5">Visualize your commitment over time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 md:flex-none">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all w-full md:w-48"
            />
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-1 shrink-0">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all outline-none">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-2 md:px-4 text-[10px] md:text-sm font-bold text-slate-900 dark:text-white min-w-[90px] md:min-w-[120px] text-center uppercase tracking-widest">
              {format(currentDate, 'MMM yyyy')}
            </span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all outline-none">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 glass-card p-4 md:p-8">
          <div className="grid grid-cols-7 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-4">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5 md:gap-3">
            {calendarDays.map((day, idx) => {
              const intensity = getIntensity(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              
              return (
                <CalendarDay 
                  key={idx} 
                  day={day} 
                  intensity={intensity} 
                  isCurrentMonth={isCurrentMonth} 
                />
              );
            })}
          </div>
        </div>

        {/* Legend & Details */}
        <div className="space-y-6">
            <div className="glass-card p-5 md:p-6">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-indigo-400" />
                    Heatmap Legend
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-tighter text-slate-600 dark:text-slate-500 font-bold">Zero</span>
                        <div className="w-4 h-4 rounded bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold">Minimal</span>
                        <div className="w-4 h-4 rounded bg-indigo-500/20" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold">Steady</span>
                        <div className="w-4 h-4 rounded bg-indigo-500/50" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold">Peak</span>
                        <div className="w-4 h-4 rounded bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                </div>
            </div>

            <div className="glass-card p-5 md:p-6 hidden md:block">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Today's Focus</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                        <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Flame className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Consistency Wins</p>
                            <p className="text-[10px] text-slate-500">Track habits daily!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function CalendarDay({ day, intensity, isCurrentMonth }: { day: Date, intensity: number, isCurrentMonth: boolean }) {
  const isTodayDate = isSameDay(day, new Date());
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "aspect-square rounded-lg md:rounded-xl relative group cursor-pointer flex items-center justify-center transition-all border",
        isCurrentMonth ? "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.06]" : "bg-transparent border-transparent opacity-10",
        isTodayDate && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-[#0b0f1a]"
      )}
    >
      {isCurrentMonth && (
        <div 
          className="absolute inset-[1px] rounded-[7px] md:rounded-[10px] transition-all duration-500"
          style={{ 
            backgroundColor: `rgba(99, 102, 241, ${intensity})`,
            boxShadow: intensity > 0.8 ? '0 0 10px rgba(99, 102, 241, 0.3)' : 'none'
          }}
        />
      )}
      <span className={cn(
        "text-[10px] md:text-xs font-bold z-10 transition-colors",
        isCurrentMonth ? (intensity > 0.5 ? "text-white" : "text-slate-500") : "text-transparent"
      )}>
        {format(day, 'd')}
      </span>
    </motion.div>
  );
}

import { Flame } from 'lucide-react';

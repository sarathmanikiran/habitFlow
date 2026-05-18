import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  MoreHorizontal,
  Flame,
  PieChart as PieIcon,
  Filter,
  Trash2,
  AlertTriangle,
  Archive,
  ArchiveRestore
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths
} from 'date-fns';

const CATEGORIES = [
  { name: 'Health', icon: 'Heart' },
  { name: 'Mind', icon: 'Brain' },
  { name: 'Productivity', icon: 'Zap' },
  { name: 'Lifestyle', icon: 'Coffee' },
  { name: 'Fitness', icon: 'Dumbbell' },
  { name: 'Work', icon: 'Briefcase' },
  { name: 'Growth', icon: 'TrendingUp' },
];

const HABIT_COLORS = [
  { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-400' },
  { name: 'Emerald', value: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-400' },
  { name: 'Amber', value: 'amber', bg: 'bg-amber-500', text: 'text-amber-400' },
  { name: 'Rose', value: 'rose', bg: 'bg-rose-500', text: 'text-rose-400' },
  { name: 'Violet', value: 'violet', bg: 'bg-violet-500', text: 'text-violet-400' },
  { name: 'Sky', value: 'sky', bg: 'bg-sky-500', text: 'text-sky-400' },
  { name: 'Orange', value: 'orange', bg: 'bg-orange-500', text: 'text-orange-400' },
  { name: 'Fuchsia', value: 'fuchsia', bg: 'bg-fuchsia-500', text: 'text-fuchsia-400' },
];

import { useHabitData } from '@/src/hooks/useHabitData';

export function Habits() {
  const { habits: dbHabits, completions, loading, addHabit, toggleCompletion, calculateStreak, deleteHabit, toggleArchive } = useHabitData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[1].name);
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0].value);
  const [showArchived, setShowArchived] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const habits = dbHabits.filter(h => showArchived ? h.archived : !h.archived);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDays, setReminderDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    await addHabit(
      newHabitName, 
      selectedCategory, 
      selectedColor,
      frequency,
      reminderTime || undefined,
      frequency === 'weekly' ? reminderDays : undefined
    );
    setNewHabitName('');
    setFrequency('daily');
    setReminderTime('');
    setReminderDays([1, 2, 3, 4, 5]);
    setSelectedColor(HABIT_COLORS[0].value);
    setIsModalOpen(false);
  };

  const toggleDay = (day: number) => {
    setReminderDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-12 transition-colors duration-300">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Consistency Grid</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-0.5">Small wins stacked together.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-1 shrink-0">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all outline-none">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-2 md:px-4 text-xs md:text-sm font-bold text-slate-900 dark:text-white min-w-[100px] md:min-w-[140px] text-center uppercase tracking-widest">
              {format(currentDate, 'MMM yyyy')}
            </span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all outline-none">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => setShowArchived(!showArchived)}
            className={cn("flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all",
              showArchived ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-600 dark:text-indigo-400" : "btn-secondary text-slate-500"
            )}
          >
            <Archive className="w-5 h-5" />
            <span className="text-sm font-bold hidden sm:inline">{showArchived ? 'Archived' : 'Active'}</span>
          </button>
          <button 
            id="add-habit-btn"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">New</span>
          </button>
        </div>
      </header>

      {/* Today Quick Check (Mobile Only) */}
      <div className="lg:hidden glass-card p-4 border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Quick Check</h3>
          <span className="text-[10px] text-slate-600 dark:text-slate-500 font-bold">{format(new Date(), 'EEEE, MMM do')}</span>
        </div>
        <div className="flex flex-col gap-3">
            {dbHabits.filter(h => !h.archived).length === 0 ? (
            <p className="text-[10px] text-slate-500 py-4">No active habits. Add one to start tracking!</p>
          ) : dbHabits.filter(h => !h.archived).map(habit => {
            const todayStr = format(new Date(), 'yyyy-MM-dd');
            const comp = completions.find(c => c.habitId === habit.id && c.date === todayStr);
            const isDone = comp?.completed;
            const habitColor = HABIT_COLORS.find(c => c.value === habit.color);

            return (
              <div key={habit.id} className="flex items-center justify-between gap-3 p-[10px_12px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl transition-all shadow-sm">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", habitColor?.bg || "bg-indigo-500")} />
                <div className="flex-1 ml-[10px] min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight">{habit.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{habit.category}</p>
                </div>
                <button 
                  onClick={() => toggleCompletion(habit.id, todayStr)}
                  className={cn(
                    "w-10 h-10 flex-shrink-0 rounded-xl border flex items-center justify-center transition-all active:scale-90",
                    isDone ? (habitColor?.bg || "bg-indigo-500") + " border-transparent text-white shadow-lg" : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400"
                  )}
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habits Spreadsheet UI */}
      <div className="glass-card shadow-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide border-slate-200 dark:border-white/5">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                <th className="sticky left-0 z-30 bg-slate-50 dark:bg-[#0b0f1a] p-4 md:p-6 text-left border-b border-r border-slate-200 dark:border-white/5 min-w-[200px] md:min-w-[280px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 tracking-tighter">Habit</span>
                    <Filter className="w-3 h-3 md:w-4 md:h-4 text-slate-500" />
                  </div>
                </th>
                {days.map(day => (
                  <th 
                    key={day.toString()} 
                    className={cn(
                      "p-2 md:p-4 border-b border-slate-200 dark:border-white/5 min-w-[44px] md:min-w-[60px] text-center",
                      isToday(day) && "bg-indigo-500/[0.03] dark:bg-indigo-500/5"
                    )}
                  >
                    <p className={cn(
                      "text-[9px] md:text-xs font-bold tracking-tighter uppercase mb-0.5",
                      isToday(day) ? "text-indigo-400" : "text-slate-500"
                    )}>{format(day, 'EEE')[0]}</p>
                    <p className={cn(
                      "text-xs md:text-sm font-black",
                      isToday(day) ? "text-indigo-400" : "text-slate-400"
                    )}>{format(day, 'd')}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.length === 0 ? (
                <tr>
                  <td colSpan={days.length + 1} className="p-20 text-center">
                    <div className="max-w-xs mx-auto">
                      {showArchived ? (
                        <>
                          <Archive className="w-12 h-12 text-slate-300 dark:text-white/10 mx-auto mb-4" />
                          <p className="text-slate-900 dark:text-white font-bold mb-2">No archived habits</p>
                          <p className="text-slate-500 text-sm mb-6">Habits you archive will appear here.</p>
                        </>
                      ) : (
                        <>
                          <Plus className="w-12 h-12 text-slate-300 dark:text-white/10 mx-auto mb-4" />
                          <p className="text-slate-900 dark:text-white font-bold mb-2">No active habits tracked yet</p>
                          <p className="text-slate-500 text-sm mb-6">Start building your streak by adding your first habit today.</p>
                          <button 
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary px-6 py-2"
                          >
                            Create My First Habit
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : habits.map((habit, idx) => {
                const habitColor = HABIT_COLORS.find(c => c.value === habit.color);
                return (
                  <tr key={habit.id} id={idx === 0 ? "habit-card-0" : undefined} className="group hover:bg-slate-100 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="sticky left-0 z-20 bg-white dark:bg-[#121826] p-4 md:p-6 border-b border-r border-slate-100 dark:border-white/5 group-hover:bg-slate-100 dark:group-hover:bg-[#121826] transition-colors">
                      <div className="flex items-center justify-between gap-2 overflow-hidden">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn("flex-none w-2 h-2 rounded-full", habitColor?.bg || "bg-indigo-500")} />
                          <div className="min-w-0">
                            <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate">{habit.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span className="text-[10px] font-black text-orange-500">{calculateStreak(habit.id)}</span>
                          </div>
                          <button
                            onClick={() => toggleArchive(habit.id)}
                            className="text-slate-600 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all hidden sm:block p-1"
                            title={habit.archived ? "Unarchive Habit" : "Archive Habit"}
                          >
                            {habit.archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(habit.id)}
                            className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hidden sm:block p-1"
                            title="Delete Habit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    {days.map(day => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const comp = completions.find(c => c.habitId === habit.id && c.date === dateStr);
                      const status = comp ? (comp.completed ? 'completed' : 'missed') : 'none';

                      return (
                        <td 
                          key={day.toString()} 
                          className={cn(
                            "p-1 md:p-2 border-r last:border-r-0 border-white/[0.02] text-center",
                            day.getDay() === 0 || day.getDay() === 6 ? "bg-white/[0.005]" : ""
                          )}
                        >
                          <div className="flex justify-center items-center min-h-[44px] sm:min-h-0">
                            <HabitCell 
                              day={day} 
                              status={status} 
                              colorClass={habitColor?.bg || "bg-emerald-500"}
                              onToggle={() => toggleCompletion(habit.id, dateStr)} 
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Legend & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Progress Overview</h3>
            <div className="flex items-center gap-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Monthly</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">78%</span>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Completed</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{completions.filter(c => c.completed).length}</span>
                </div>
            </div>
        </div>
        <div className="glass-card p-6 md:col-span-2 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Yearly Score</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">92.4</span>
                </div>
                <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Checks</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{completions.filter(c => c.completed).length}</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">User Rank</span>
                  <span className="text-sm font-black text-indigo-400 uppercase tracking-widest">Top 5%</span>
                </div>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                <PieIcon className="w-4 h-4" />
                Detailed Report
            </button>
        </div>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-card p-6 shadow-2xl border-slate-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-widest uppercase">New Habit</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddHabit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Habit Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="e.g. Read for 30 mins"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setSelectedCategory(cat.name)}
                        className={cn(
                          "p-2 rounded-xl border text-[10px] font-bold transition-all flex flex-col items-center gap-1",
                          selectedCategory === cat.name 
                            ? "bg-indigo-600 text-white border-transparent" 
                            : "btn-secondary"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Custom Color</label>
                  <div className="flex flex-wrap gap-2">
                    {HABIT_COLORS.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setSelectedColor(color.value)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            color.bg,
                            selectedColor === color.value ? "border-slate-400 dark:border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                          )}
                        />
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Frequency</label>
                    <select 
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all font-medium text-xs appearance-none"
                    >
                      <option value="daily" className="bg-white dark:bg-slate-900">Daily</option>
                      <option value="weekly" className="bg-white dark:bg-slate-900">Weekly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Reminder Time</label>
                    <input 
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all font-medium text-xs font-mono"
                    />
                  </div>
                </div>

                {frequency === 'weekly' && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Repeat Days</label>
                    <div className="flex justify-between gap-1">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleDay(i)}
                          className={cn(
                            "w-8 h-8 rounded-lg text-[10px] font-black transition-all border",
                            reminderDays.includes(i)
                              ? "bg-indigo-500 border-transparent text-white"
                              : "bg-white/5 border-white/10 text-slate-500"
                          )}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={!newHabitName.trim()}
                  className="w-full btn-primary py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                >
                  Create Habit
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass-card p-8 border-white/10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-widest">Delete Habit?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                This will delete <span className="text-slate-900 dark:text-white font-bold">"{habits.find(h => h.id === deleteConfirmId)?.name}"</span> and all its progress history. This cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (deleteConfirmId) {
                      await deleteHabit(deleteConfirmId);
                      setDeleteConfirmId(null);
                    }
                  }}
                  className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HabitCell({ 
  day, 
  status, 
  colorClass,
  onToggle 
}: { 
  day: Date, 
  status: 'none' | 'completed' | 'missed', 
  colorClass: string,
  onToggle: () => void 
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 relative group/cell overflow-hidden border",
        status === 'completed' && `${colorClass} border-transparent shadow-lg text-white scale-110 z-10`,
        status === 'missed' && "bg-rose-500/10 dark:bg-rose-500/0 border-rose-500/40 text-rose-500",
        status === 'none' && "bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.06] hover:border-indigo-400 text-transparent"
      )}
    >
      {status === 'completed' && <Check className="w-4 h-4 stroke-[3px]" />}
      {status === 'missed' && <X className="w-4 h-4 stroke-[3px]" />}
      {status === 'none' && <Check className="w-4 h-4 stroke-[3px] opacity-0 group-hover/cell:opacity-40" />}
      
      {isToday(day) && status === 'none' && (
        <span className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
    </button>
  );
}

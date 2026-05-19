import React from 'react';
import { motion } from 'motion/react';
import { 
    BarChart3, 
    PieChart as PieIcon, 
    TrendingUp, 
    Calendar as CalendarIcon,
    Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const barData = [
  { name: 'Mon', count: 4 },
  { name: 'Tue', count: 6 },
  { name: 'Wed', count: 3 },
  { name: 'Thu', count: 7 },
  { name: 'Fri', count: 5 },
  { name: 'Sat', count: 2 },
  { name: 'Sun', count: 6 },
];

const pieData = [
  { name: 'Health', value: 40, color: '#10b981' },
  { name: 'Mind', value: 25, color: '#6366f1' },
  { name: 'Productivity', value: 20, color: '#f59e0b' },
  { name: 'Lifestyle', value: 15, color: '#f43f5e' },
];

import { useHabitData } from '../hooks/useHabitData';
import { subDays, format, startOfWeek, eachDayOfInterval } from 'date-fns';

export function Stats() {
  const { habits, completions } = useHabitData();

  // Statistics Calculation
  const totalCompleted = completions.filter(c => c.completed).length;
  
  // Weekly Volume Data
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const barData = last7Days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const count = completions.filter(c => c.date === dayStr && c.completed).length;
    return { name: format(day, 'EEE'), count };
  });

  // Category Breakdown
  const categories = Array.from(new Set(habits.map(h => h.category)));
  const totalCategoryComps = categories.map(cat => {
    const catHabits = habits.filter(h => h.category === cat).map(h => h.id);
    const count = completions.filter(c => catHabits.includes(c.habitId) && c.completed).length;
    return { name: cat, count };
  });

  const totalCompsCount = totalCategoryComps.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const pieData = totalCategoryComps.map((cat, i) => ({
    name: cat.name,
    value: Math.round((cat.count / totalCompsCount) * 100),
    color: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'][i % 5]
  })).filter(d => d.value > 0);

  // Fallback for pie data
  const finalPieData = pieData.length > 0 ? pieData : [{ name: 'No Data', value: 100, color: '#334155' }];

  const consistencyScore = habits.length > 0 
    ? Math.round((totalCompleted / (habits.length * 30)) * 100) // Rough score
    : 0;

  return (
    <div className="space-y-6 md:space-y-8 pb-12 transition-colors duration-300">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Performance</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-0.5">Deep dive into your behavioral patterns.</p>
      </header>

      {/* Summary Cards Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        <div className="glass-card p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-indigo-500/30 transition-all gap-3 shadow-none dark:shadow-2xl">
            <div>
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-1">Consistency</p>
                <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white">{consistencyScore}%</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            </div>
        </div>
        <div className="glass-card p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-emerald-500/30 transition-all gap-3 shadow-none dark:shadow-2xl">
            <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total</p>
                <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white">{totalCompleted}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
            </div>
        </div>
        <div className="glass-card p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-amber-500/30 transition-all gap-3 col-span-2 md:col-span-1 shadow-none dark:shadow-2xl">
            <div className="flex md:block items-center justify-between w-full">
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white uppercase italic">
                      {totalCompleted > 50 ? 'Legend' : totalCompleted > 20 ? 'Expert' : 'Novice'}
                    </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Award className="w-5 h-5 md:w-6 md:h-6" />
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Weekly Volume */}
        <div className="glass-card p-5 md:p-8">
            <h2 className="text-sm md:text-lg font-bold text-slate-900 dark:text-white mb-6 md:mb-8 flex items-center gap-3 tracking-widest uppercase">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                Weekly Volume
            </h2>
            <div className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.1} vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip 
                            cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                            contentStyle={{ 
                                backgroundColor: 'var(--card)', 
                                border: '1px solid var(--border)', 
                                borderRadius: '12px', 
                                fontSize: '12px', 
                                color: 'var(--text-primary)' 
                            }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card p-5 md:p-8">
            <h2 className="text-sm md:text-lg font-bold text-slate-900 dark:text-white mb-6 md:mb-8 flex items-center gap-3 tracking-widest uppercase">
                <PieIcon className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                Allocation
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="h-[200px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={finalPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {finalPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--card)', 
                                    border: '1px solid var(--border)', 
                                    borderRadius: '12px', 
                                    fontSize: '12px' 
                                }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 md:p-6 space-y-3 w-full md:min-w-[180px]">
                    {finalPieData.map(item => (
                        <div key={item.name} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <div className="flex-1">
                                <p className="text-[10px] md:text-xs font-bold text-slate-900 dark:text-white uppercase">{item.name}</p>
                                <p className="text-[9px] text-slate-500 font-bold tracking-widest">{item.value}% Effort</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Long Term Trends */}
      <div className="glass-card p-8 bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.03] dark:from-indigo-500/[0.03] dark:to-purple-500/[0.03]">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Long-term Progress Trend</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.1} vertical={false} />
                    <XAxis dataKey="name" hide />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--tw-backdrop-blur)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
                </LineChart>
            </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
}

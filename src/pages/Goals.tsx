import { useGoalData } from '../hooks/useGoalData';
import { useGoalTasks } from '../hooks/useGoalTasks';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Plus, Target, CheckCircle2, Clock, Trash2, ArrowUpRight, X, Award, ChevronDown, ChevronUp, User } from 'lucide-react';

export function Goals() {
  const { goals, loading, addGoal, deleteGoal, updateGoalProgress } = useGoalData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', category: 'Mind', deadline: '', items: '' });

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;
    await addGoal(newGoal.title, newGoal.category, newGoal.deadline, newGoal.items);
    setNewGoal({ title: '', category: 'Mind', deadline: '', items: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-12 transition-colors duration-300">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Growth Objectives</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-0.5">Track your long-term evolution.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary w-full sm:w-auto px-5 py-2.5 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">New Goal</span>
        </button>
      </header>

      {activeGoals.length === 0 && !loading ? (
        <div className="glass-card p-12 text-center">
          <Target className="w-12 h-12 text-slate-300 dark:text-white/10 mx-auto mb-4" />
          <p className="text-slate-900 dark:text-white font-bold">No active goals</p>
          <p className="text-slate-500 text-sm mb-6">Setting clear objectives is the first step in turning the invisible into the visible.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary px-6 py-2">Set My First Goal</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {activeGoals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onDelete={() => deleteGoal(goal.id)}
              onUpdateProgress={(p) => updateGoalProgress(goal.id, p)}
            />
          ))}
        </div>
      )}

      {/* Completion Wall */}
      {completedGoals.length > 0 && (
        <section className="mt-8 md:mt-12">
          <h2 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Victory Wall
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1">
              {completedGoals.map(goal => (
                <CompletedGoal key={goal.id} title={goal.title} date={new Date(goal.createdAt).toLocaleDateString()} />
              ))}
          </div>
        </section>
      )}

      {/* Add Goal Modal */}
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
              className="relative w-full max-w-md glass-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-widest uppercase">New Goal</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Goal Title</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="e.g. Read 5 books"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Category</label>
                    <select 
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all text-sm appearance-none"
                    >
                      <option value="Mind" className="bg-white dark:bg-[#121826]">Mind</option>
                      <option value="Health" className="bg-white dark:bg-[#121826]">Health</option>
                      <option value="Productivity" className="bg-white dark:bg-[#121826]">Productivity</option>
                      <option value="Lifestyle" className="bg-white dark:bg-[#121826]">Lifestyle</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Deadline</label>
                    <input 
                      type="text" 
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      placeholder="May 30"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Milestones (e.g. 0/5)</label>
                  <input 
                    type="text" 
                    value={newGoal.items}
                    onChange={(e) => setNewGoal({...newGoal, items: e.target.value})}
                    placeholder="0/5"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!newGoal.title.trim()}
                  className="w-full btn-primary py-3 text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 disabled:opacity-50 mt-4"
                >
                  Set Goal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GoalCard({ goal, onDelete, onUpdateProgress }: { goal: any, onDelete: () => void, onUpdateProgress: (p: number) => void }) {
    const { tasks, loading: tasksLoading, addTask, toggleTask, deleteTask } = useGoalTasks(goal.id);
    const [isExpanded, setIsExpanded] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskAssignee, setNewTaskAssignee] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');

    // Compute progress based on tasks if there are any
    const completedTasks = tasks.filter(t => t.completed).length;
    const computedProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : goal.progress;

    useEffect(() => {
      if (!tasksLoading && tasks.length > 0 && goal.progress !== computedProgress) {
        onUpdateProgress(computedProgress);
      }
    }, [computedProgress, goal.progress, tasks.length, tasksLoading, onUpdateProgress]);

    const handleAddTask = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTaskTitle.trim()) return;
      await addTask(newTaskTitle, newTaskAssignee, newTaskDueDate);
      setNewTaskTitle('');
      setNewTaskAssignee('');
      setNewTaskDueDate('');
    };

    return (
        <motion.div 
            whileHover={!isExpanded ? { y: -5 } : undefined}
            className="glass-card p-5 md:p-6 flex flex-col group transition-all"
        >
            <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                    <Target className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex gap-1 md:gap-2">
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-2 text-slate-600 hover:text-indigo-400 transition-colors"
                      title="Toggle Tasks"
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                    {(!tasks || tasks.length === 0) && (
                      <button 
                        onClick={() => {
                          const next = Math.min(100, goal.progress + 10);
                          onUpdateProgress(next);
                        }}
                        className="p-2 text-slate-600 hover:text-emerald-400 transition-colors"
                        title="Manual Progress Milestones"
                      >
                          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    )}
                    <button 
                      onClick={onDelete}
                      className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>
            
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{goal.title}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-6">{goal.category}</p>
 
             <div className="flex-1 space-y-4">
                 <div className="flex items-center justify-between text-xs">
                     <span className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Milestones</span>
                     <span className="text-slate-900 dark:text-white font-black">{computedProgress}%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${computedProgress}%` }}
                         className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                     />
                 </div>
                <div className="flex items-center justify-between text-[10px] pt-2">
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="font-bold">Due: {goal.deadline || 'No date'}</span>
                    </div>
                    {tasks.length > 0 ? (
                      <span className="text-indigo-400 font-black flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {completedTasks}/{tasks.length} tasks
                      </span>
                    ) : (
                      <span className="text-indigo-400 font-black uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{goal.items || '0%'} done</span>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-6 pt-6 border-t border-white/10 space-y-4"
                    >
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tasks</h4>
                        
                        {/* Task List */}
                        <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-hide pr-1">
                            {tasks.map(task => (
                                <div key={task.id} className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl group/task">
                                    <div className="flex items-center gap-3">
                                      <button 
                                          onClick={() => toggleTask(task.id, task.completed)}
                                          className={`w-5 h-5 rounded border flex-none flex items-center justify-center transition-colors ${task.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-white/20 text-transparent hover:border-indigo-400'}`}
                                      >
                                          <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
                                      </button>
                                      <span className={`text-sm font-medium flex-1 ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                                          {task.title}
                                      </span>
                                      <button 
                                          onClick={() => deleteTask(task.id)}
                                          className="text-slate-500 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover/task:opacity-100 transition-all p-1"
                                      >
                                          <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-3 pl-8 text-[10px] font-bold text-slate-500">
                                      {task.assignee && (
                                        <div className="flex items-center gap-1">
                                          <User className="w-3 h-3" />
                                          {task.assignee}
                                        </div>
                                      )}
                                      {task.dueDate && (
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {task.dueDate}
                                        </div>
                                      )}
                                    </div>
                                </div>
                            ))}
                            {tasks.length === 0 && !tasksLoading && (
                                <p className="text-center text-xs text-slate-500 py-2">No tasks yet. Break down your goal!</p>
                            )}
                        </div>

                        {/* Add Task Form */}
                        <form onSubmit={handleAddTask} className="flex flex-col gap-2 pt-2">
                            <input 
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Task description..."
                                className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-colors"
                            />
                            <div className="flex gap-2">
                              <input 
                                  type="text"
                                  value={newTaskAssignee}
                                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                                  placeholder="Assignee (opt)"
                                  className="w-1/2 bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-colors"
                              />
                              <input 
                                  type="date"
                                  value={newTaskDueDate}
                                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                                  className="w-1/2 bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                              />
                            </div>
                            <button 
                                type="submit"
                                disabled={!newTaskTitle.trim()}
                                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white disabled:opacity-50 border border-slate-200 dark:border-white/10 rounded-lg py-2 mt-1 text-xs font-bold transition-colors"
                            >
                                Add Task
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function CompletedGoal({ title, date }: any) {
    return (
        <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-5 md:p-6 min-w-[220px] md:min-w-[240px] relative overflow-hidden group">
            <CheckCircle2 className="w-20 h-20 text-emerald-500/10 absolute -right-4 -bottom-4 rotate-12 group-hover:rotate-0 transition-all duration-700" />
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-8">{title}</p>
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 uppercase font-black tracking-widest">Victory on {date}</span>
                <Award className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
        </div>
    )
}

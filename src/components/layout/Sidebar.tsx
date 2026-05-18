import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Sparkles, 
  Target, 
  Settings,
  LogOut,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTheme } from '@/src/hooks/useTheme';

export type Page = 'dashboard' | 'habits' | 'calendar' | 'stats' | 'ai-coach' | 'goals' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
  userName: string;
}

export function Sidebar({ currentPage, onPageChange, onLogout, userName }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'ai-coach', label: 'AI Coach', icon: Sparkles },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 glass-sidebar h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">H</div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">HabitFlow</span>
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={cn(
              "nav-item w-full flex items-center gap-3 px-3 py-2 transition-colors cursor-pointer",
              currentPage === item.id && "active"
            )}
            id={`nav-${item.id}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/[0.05]">
        <div className="glass-card p-4 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-indigo-400 font-bold uppercase">{userName[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{userName}</p>
            <p className="text-xs text-slate-500 truncate">Free Plan</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="nav-item w-full justify-start text-red-400/80 hover:text-red-400 hover:bg-red-400/5"
          id="logout-button"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

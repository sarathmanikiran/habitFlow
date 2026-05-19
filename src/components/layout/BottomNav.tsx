import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Sparkles, 
  Target, 
  Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Page } from './Sidebar';

interface BottomNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'calendar', label: 'Cal', icon: Calendar },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'ai-coach', label: 'AI', icon: Sparkles },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass-card !rounded-2xl z-50 px-2 py-3 flex items-center justify-around shadow-xl shadow-indigo-500/10">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id)}
          className={cn(
            "flex flex-col items-center gap-1 min-w-[44px] transition-all duration-300",
            currentPage === item.id ? "text-indigo-600 dark:text-indigo-400 scale-110" : "text-slate-500"
          )}
        >
          <item.icon className={cn(
            "w-5 h-5",
            currentPage === item.id && "fill-indigo-600/10 dark:fill-indigo-400/10"
          )} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

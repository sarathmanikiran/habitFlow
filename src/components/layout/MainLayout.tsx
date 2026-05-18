import React from 'react';
import { Sidebar, Page } from './Sidebar';
import { BottomNav } from './BottomNav';
import { MobileHeader } from './MobileHeader';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
  userName: string;
}

export function MainLayout({ children, currentPage, onPageChange, onLogout, userName }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] transition-colors duration-300">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={onPageChange} 
          onLogout={onLogout}
          userName={userName}
        />
      </div>

      {/* Mobile Navigation */}
      <BottomNav currentPage={currentPage} onPageChange={onPageChange} />

      {/* Main Content Area */}
      <main className="lg:pl-64 min-h-[calc(100vh-64px)] lg:min-h-screen transition-colors duration-300">
        <div className="px-4 md:px-8 pt-6 md:pt-8 pb-32 md:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

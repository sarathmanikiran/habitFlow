import React, { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase/config';
import { MainLayout } from './components/layout/MainLayout';
import { Page } from './components/layout/Sidebar';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { OnboardingTutorial } from './components/OnboardingTutorial';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Habits } from './pages/Habits';
import { Calendar } from './pages/Calendar';
import { Stats } from './pages/Stats';
import { AICoach } from './pages/AICoach';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, profile, loading, completeOnboarding } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase text-xs">Initializing HabitFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard userName={user.displayName || 'Achiever'} onPageChange={setCurrentPage} />;
      case 'habits': return <Habits />;
      case 'calendar': return <Calendar />;
      case 'stats': return <Stats />;
      case 'ai-coach': return <AICoach />;
      case 'goals': return <Goals />;
      case 'settings': return <Settings />;
      default: return <Dashboard userName={user.displayName || 'Achiever'} onPageChange={setCurrentPage} />;
    }
  };

  return (
    <>
      <MainLayout 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        onLogout={handleLogout}
        userName={user.displayName || 'Achiever'}
      >
        {renderPage()}
      </MainLayout>

      {profile && profile.hasCompletedOnboarding === false && (
        <OnboardingTutorial onComplete={completeOnboarding} />
      )}
    </>
  );
}

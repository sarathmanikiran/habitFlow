import React, { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase/config';
import { MainLayout } from './components/layout/MainLayout';
import { Page } from './components/layout/Sidebar';
import { useAuth } from './hooks/useAuth';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { AnimatePresence } from 'motion/react';
import { navigate } from './lib/router';
import { useSEO } from './hooks/useSEO';

// Core Pages
import { Dashboard } from './pages/Dashboard';
import { Habits } from './pages/Habits';
import { Calendar } from './pages/Calendar';
import { Stats } from './pages/Stats';
import { AICoach } from './pages/AICoach';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

// Public SEO and Blogging Pages
import { 
  PublicLayout, 
  BlogsPage, 
  BlogPostReader, 
  AboutPage, 
  ContactPage, 
  PrivacyPolicyPage, 
  TermsOfServicePage,
  BLOG_POSTS
} from './pages/PublicPages';

import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, profile, loading, completeOnboarding, loginAsDemo, logout } = useAuth();
  
  // Track browser location as reactive state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // After login, send user to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed', error);
      if (error?.code === 'auth/network-request-failed') {
        alert("Network Error: Could not connect to authentication server. This is often caused by ad blockers, brave shields, or cross-site tracking prevention. Please disable them for this site and try again.");
      } else if (error?.code !== 'auth/popup-closed-by-user') {
        alert(`Login failed: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Setup master SEO defaults for index page
  useSEO({
    title: 'HabitFlow | AI Habit Tracker for Students & Peak Productivity',
    description: 'The ultimate behavior design ecosystem that adapts to real student calendars. Track with linked habits, freeze streaks under exam stress, and consult your personal AI Coach.',
    keywords: 'AI habit tracker, habit tracker for students, productivity app, self improvement app, streak tracker'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase text-xs">Initializing HabitFlow System...</p>
        </div>
      </div>
    );
  }

  // 1. PUBLIC ROUTING FRAME
  const isBlogPost = BLOG_POSTS.some(p => currentPath === `/${p.slug}`);
  const isPublicRoute = ['/blog', '/about', '/contact', '/privacy', '/terms'].includes(currentPath) || isBlogPost;

  if (isPublicRoute) {
    const renderPublicPage = () => {
      if (currentPath === '/blog') {
        return <BlogsPage onLogin={user ? () => navigate('/dashboard') : handleLogin} />;
      }
      if (currentPath === '/about') {
        return <AboutPage />;
      }
      if (currentPath === '/contact') {
        return <ContactPage />;
      }
      if (currentPath === '/privacy') {
        return <PrivacyPolicyPage />;
      }
      if (currentPath === '/terms') {
        return <TermsOfServicePage />;
      }
      if (isBlogPost) {
        return <BlogPostReader slug={currentPath.substring(1)} onLogin={user ? () => navigate('/dashboard') : handleLogin} />;
      }
      return null;
    };

    return (
      <PublicLayout 
        currentPath={currentPath} 
        onLogin={user ? () => navigate('/dashboard') : handleLogin} 
        onDemoLogin={user ? () => navigate('/dashboard') : loginAsDemo}
      >
        {renderPublicPage()}
      </PublicLayout>
    );
  }

  // 2. UNAUTHENTICATED PRIVATE ACCESS -> REDIRECT TO HOME LANDING PAGE
  if (!user) {
    return <Login onLogin={handleLogin} onDemoLogin={loginAsDemo} />;
  }

  // 3. AUTHENTICATED WORKSPACE PANEL
  // Resolve active page tab based on path segment
  const getCurrentPage = (): Page => {
    const pageSegment = currentPath.replace('/', '');
    const validPages: Page[] = ['dashboard', 'habits', 'calendar', 'stats', 'ai-coach', 'goals', 'settings'];
    if (validPages.includes(pageSegment as Page)) {
      return pageSegment as Page;
    }
    return 'dashboard';
  };

  const activePage = getCurrentPage();

  const renderActivePageContent = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard userName={user.displayName || 'Achiever'} onPageChange={(p) => navigate('/' + p)} />;
      case 'habits': return <Habits />;
      case 'calendar': return <Calendar />;
      case 'stats': return <Stats />;
      case 'ai-coach': return <AICoach />;
      case 'goals': return <Goals />;
      case 'settings': return <Settings />;
      default: return <Dashboard userName={user.displayName || 'Achiever'} onPageChange={(p) => navigate('/' + p)} />;
    }
  };

  return (
    <>
      <MainLayout 
        currentPage={activePage} 
        onPageChange={(p) => navigate('/' + p)} 
        onLogout={handleLogout}
        userName={user.displayName || 'Achiever'}
      >
        {renderActivePageContent()}
      </MainLayout>

      <AnimatePresence>
        {profile && profile.hasCompletedOnboarding === false && (
          <OnboardingTutorial onComplete={completeOnboarding} />
        )}
      </AnimatePresence>
    </>
  );
}

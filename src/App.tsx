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

import { PublicLayout, BLOG_POSTS } from './pages/PublicPages';

// Dynamic code-splitting for child views & modals
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Habits = React.lazy(() => import('./pages/Habits').then(m => ({ default: m.Habits })));
const Calendar = React.lazy(() => import('./pages/Calendar').then(m => ({ default: m.Calendar })));
const Stats = React.lazy(() => import('./pages/Stats').then(m => ({ default: m.Stats })));
const AICoach = React.lazy(() => import('./pages/AICoach').then(m => ({ default: m.AICoach })));
const Goals = React.lazy(() => import('./pages/Goals').then(m => ({ default: m.Goals })));
const Settings = React.lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));

const BlogsPage = React.lazy(() => import('./pages/PublicPages').then(m => ({ default: m.BlogsPage })));
const BlogPostReader = React.lazy(() => import('./pages/PublicPages').then(m => ({ default: m.BlogPostReader })));
const AboutPage = React.lazy(() => import('./pages/PublicPages').then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./pages/PublicPages').then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PublicPages').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = React.lazy(() => import('./pages/PublicPages').then(m => ({ default: m.TermsOfServicePage })));

// Loading spinner fallback optimized for code split transitions
function LazySpinner() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-500 animate-spin" />
    </div>
  );
}

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
      // Rethrow to let callers (like Login page) display context-appropriate feedback
      throw error;
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
        <React.Suspense fallback={<LazySpinner />}>
          {renderPublicPage()}
        </React.Suspense>
      </PublicLayout>
    );
  }

  // 2. UNAUTHENTICATED PRIVATE ACCESS -> REDIRECT TO HOME LANDING PAGE
  if (!user) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center transition-colors duration-300">
          <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-500 animate-spin" />
        </div>
      }>
        <Login onLogin={handleLogin} onDemoLogin={loginAsDemo} />
      </React.Suspense>
    );
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
        <React.Suspense fallback={<LazySpinner />}>
          {renderActivePageContent()}
        </React.Suspense>
      </MainLayout>

      <AnimatePresence>
        {profile && profile.hasCompletedOnboarding === false && (
          <OnboardingTutorial onComplete={completeOnboarding} />
        )}
      </AnimatePresence>
    </>
  );
}

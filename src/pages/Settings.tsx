import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    User, 
    Bell, 
    Moon, 
    Shield, 
    Database, 
    Printer,
    Download,
    AlertCircle,
    FileText,
    Smartphone,
    Mail,
    ChevronRight,
    Trash2,
    LogOut,
    X,
    Watch,
    ActivitySquare,
    HeartPulse,
    Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, db } from '../firebase/config';
import { signOut, deleteUser } from 'firebase/auth';
import { collection, query, where, getDocs, writeBatch, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { useHabitData } from '../hooks/useHabitData';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

export function Settings() {
  const { user, profile, updatePrivacyPreferences, updateWearableIntegration, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isWearablesModalOpen, setIsWearablesModalOpen] = useState(false);
  const [connectingWearable, setConnectingWearable] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingPrint, setIsGeneratingPrint] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleToggleWearable = async (provider: string, currentlyConnected: boolean) => {
    if (currentlyConnected) {
      await updateWearableIntegration(provider, false);
      return;
    }
    setConnectingWearable(provider);
    // Simulate OAuth redirect and connection delay
    setTimeout(async () => {
      await updateWearableIntegration(provider, true);
      setConnectingWearable(null);
    }, 1500);
  };

  const handleExportData = async () => {
    if (!user) return;
    setIsExporting(true);
    try {
      if (user.uid === 'demo_user') {
        const localHabits = localStorage.getItem('demo_habits');
        const localCompletions = localStorage.getItem('demo_completions');
        const localGoals = localStorage.getItem('demo_goals');
        const exportData = {
          habits: localHabits ? JSON.parse(localHabits) : [],
          completions: localCompletions ? JSON.parse(localCompletions) : [],
          goals: localGoals ? JSON.parse(localGoals) : []
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habitflow-data-demo.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }

      const collections = ['habits', 'completions', 'goals'];
      const exportData: any = {};

      for (const collName of collections) {
        const q = query(collection(db, collName), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        exportData[collName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habitflow-data-${user.uid}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintReport = async () => {
    if (!user) return;
    setIsGeneratingPrint(true);
    try {
      let habits: any[] = [];
      let completions: any[] = [];
      const currentMonth = format(new Date(), 'yyyy-MM');

      if (user.uid === 'demo_user') {
        const localHabits = localStorage.getItem('demo_habits');
        const localCompletions = localStorage.getItem('demo_completions');
        const itemsList = localHabits ? JSON.parse(localHabits) : [];
        habits = itemsList.filter((h: any) => !h.archived);
        completions = localCompletions ? JSON.parse(localCompletions) : [];
      } else {
        const habitsQ = query(collection(db, 'habits'), where('userId', '==', user.uid));
        const habitsSnapshot = await getDocs(habitsQ);
        habits = habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        habits.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        const completionsQ = query(
          collection(db, 'completions'), 
          where('userId', '==', user.uid)
        );
        const completionsSnapshot = await getDocs(completionsQ);
        completions = completionsSnapshot.docs.map(doc => doc.data())
          .filter((c: any) => c.date >= `${currentMonth}-01` && c.date <= `${currentMonth}-31`);
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const dateStr = format(new Date(), 'MMMM yyyy');
      
      let habitsHtml = habits.map((h: any) => {
        const habitCompletions = completions.filter((c: any) => c.habitId === h.id && c.completed);
        
        return `
          <div class="habit-row">
            <div class="habit-info">
              <div class="habit-name">${h.name}</div>
              <div class="habit-category">${h.category}</div>
            </div>
            <div class="check-grid">
              ${Array.from({ length: 31 }).map((_, i) => {
                const dayNum = i + 1;
                const dateString = `${currentMonth}-${dayNum.toString().padStart(2, '0')}`;
                const isDone = habitCompletions.some((c: any) => c.date === dateString);
                return `<div class="check-box ${isDone ? 'checked' : ''}">${dayNum}</div>`;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>HabitFlow - ${dateStr}</title>
            <style>
              @page { size: A4 landscape; margin: 1cm; }
              body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1e293b; line-height: 1.5; padding: 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
              h1 { margin: 0; font-size: 24px; color: #6366f1; letter-spacing: -0.02em; font-weight: 900; }
              .user-meta { text-align: right; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
              .habit-row { display: flex; border-bottom: 1px solid #f1f5f9; padding: 12px 0; align-items: center; page-break-inside: avoid; }
              .habit-info { width: 220px; flex-shrink: 0; padding-right: 15px; }
              .habit-name { font-weight: 700; font-size: 13px; margin-bottom: 2px; color: #0f172a; }
              .habit-category { font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; }
              .check-grid { display: grid; grid-template-columns: repeat(31, 1fr); gap: 3px; flex-grow: 1; }
              .check-box { 
                aspect-ratio: 1; 
                border: 1px solid #e2e8f0; 
                border-radius: 4px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 8px; 
                color: #cbd5e1;
                background: #fff;
                font-weight: 900;
              }
              .check-box.checked {
                background: #10b981 !important;
                border-color: #059669 !important;
                color: #fff !important;
                border-radius: 4px;
              }
              .legend { margin-top: 40px; font-size: 10px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 15px; text-align: center; font-style: italic; }
            </style>
          </head>
          <body>
            <header>
              <div>
                <h1>HABIT PROGRESS REPORT</h1>
                <div style="font-size: 16px; color: #475569; font-weight: 600; margin-top: 2px;">${dateStr}</div>
              </div>
              <div class="user-meta">
                User: <strong>${user.displayName || user.email}</strong><br/>
                Generated: ${new Date().toLocaleString()}
              </div>
            </header>
            ${habitsHtml}
            <div class="legend">
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit." — HabitFlow
            </div>
            <script>window.onload = () => { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Print failed', error);
      alert('Failed to generate print sheet.');
    } finally {
      setIsGeneratingPrint(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (user.uid === 'demo_user') {
      localStorage.removeItem('demo_user_profile');
      localStorage.removeItem('demo_profile_data');
      localStorage.removeItem('demo_habits');
      localStorage.removeItem('demo_completions');
      localStorage.removeItem('demo_goals');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('demo_tasks_')) {
          localStorage.removeItem(key);
        }
      });
      window.location.reload();
      return;
    }

    try {
      // 1. Delete user data from Firestore
      const collections = ['habits', 'completions', 'goals'];
      const batch = writeBatch(db);

      for (const collName of collections) {
        const q = query(collection(db, collName), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }
      await batch.commit();

      // 2. Delete auth user
      await deleteUser(user);
    } catch (error: any) {
      console.error('Account deletion failed', error);
      if (error.code === 'auth/requires-recent-login') {
        alert('This operation is sensitive and requires recent authentication. Please log in again.');
        await logout();
      } else {
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences.</p>
      </header>

      <div className="space-y-6">
        <SettingSection title="Account & Profile">
            <div className="p-6 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </div>
            <SettingItem icon={Mail} title="Email Preferences" description="Manage what updates you receive" />
        </SettingSection>

        <SettingSection title="App Settings">
            <SettingToggle icon={Bell} title="Push Notifications" description="Daily habit reminders and motivation" checked={true} onToggle={() => {}} />
            <SettingToggle 
                icon={Moon} 
                title="Dark Mode" 
                description="Switch between dark and light themes" 
                checked={theme === 'dark'} 
                onToggle={toggleTheme} 
            />
            <SettingItem 
                icon={Smartphone} 
                title="Mobile Integration" 
                description="Connect your wearable devices" 
                onClick={() => setIsWearablesModalOpen(true)} 
                rightContent={
                    Object.values(profile?.wearables || {}).some((w: any) => w.connected) && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] mr-2" />
                    )
                }
            />
        </SettingSection>

        <SettingSection title="Privacy & Security">
            <SettingItem icon={Shield} title="Data Privacy" description="Manage your data and visibility" onClick={() => setIsPrivacyModalOpen(true)} />
            <div className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors text-left group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Printable Sheet</p>
                        <p className="text-xs text-slate-500">Generate a professional log for manual tracking</p>
                    </div>
                </div>
                <button 
                    onClick={handlePrintReport}
                    disabled={isGeneratingPrint}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                >
                    <Printer className={cn("w-4 h-4", isGeneratingPrint && "animate-pulse")} />
                    {isGeneratingPrint ? 'Generating...' : 'Print Sheet'}
                </button>
            </div>
            <div className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors text-left group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all">
                        <Database className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Export Data</p>
                        <p className="text-xs text-slate-500">Download all your habit history as JSON</p>
                    </div>
                </div>
                <button 
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50"
                >
                    <Download className={cn("w-4 h-4", isExporting && "animate-bounce")} />
                    {isExporting ? 'Exporting...' : 'Export JSON'}
                </button>
            </div>
        </SettingSection>

        <section className="pt-8 flex flex-col gap-4 border-t border-red-500/10">
            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                   <h3 className="text-red-400 font-bold mb-1">Danger Zone</h3>
                   <p className="text-slate-500 text-sm">Once you delete your account, there is no going back. All data will be permanently wiped.</p>
                </div>
                <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                </button>
            </div>
        </section>
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteConfirmText("");
                    }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md glass-card p-8 shadow-2xl"
                >
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">Are you sure?</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-center mb-6">This action is permanent and cannot be undone. All your habits, progress, and goals will be lost forever.</p>
                    
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">Type 'DELETE' to confirm</label>
                        <input 
                            type="text" 
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-center text-slate-900 dark:text-white placeholder:text-slate-400 font-bold tracking-widest outline-none focus:border-red-500 transition-all uppercase"
                            placeholder="DELETE"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmText !== 'DELETE'}
                            className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all"
                        >
                            Confirm Deletion
                        </button>
                        <button 
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setDeleteConfirmText("");
                            }}
                            className="w-full py-4 btn-secondary font-black uppercase tracking-widest text-xs rounded-2xl"
                        >
                            Nevermind
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPrivacyModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPrivacyModalOpen(false)}
                    className="absolute inset-0 bg-black/50 backdrop-blur-md"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md glass-card overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Privacy</h2>
                        </div>
                        <button 
                            onClick={() => setIsPrivacyModalOpen(false)}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 space-y-6">
                        <div className="pb-6">
                           <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Anonymous Analytics</h3>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Help us improve HabitFlow by sharing anonymous usage data. This data is untethered from your identity.</p>
                           <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                               <SettingToggle 
                                   icon={Database} 
                                   title="Share Analytics" 
                                   description="Opt-in to anonymous telemetry" 
                                   checked={profile?.privacyPreferences?.shareAnalytics ?? true} 
                                   onToggle={(val: boolean) => updatePrivacyPreferences({...profile?.privacyPreferences, shareAnalytics: !profile?.privacyPreferences?.shareAnalytics})} 
                               />
                           </div>
                        </div>

                        <div className="pt-6">
                           <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Personalized AI Coach</h3>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Allow the AI Coach to read your habit descriptions and progress history to provide tailored guidance.</p>
                           <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                               <SettingToggle 
                                   icon={Smartphone} 
                                   title="Allow AI Context" 
                                   description="Share habit context with AI" 
                                   checked={profile?.privacyPreferences?.personalizedCoach ?? true} 
                                   onToggle={(val: boolean) => updatePrivacyPreferences({...profile?.privacyPreferences, personalizedCoach: !profile?.privacyPreferences?.personalizedCoach})} 
                               />
                           </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWearablesModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsWearablesModalOpen(false)}
                    className="absolute inset-0 bg-black/50 backdrop-blur-md"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md glass-card overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Watch className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Wearables</h2>
                        </div>
                        <button 
                            onClick={() => setIsWearablesModalOpen(false)}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 space-y-6">
                        <div className="pb-4">
                           <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Automatically sync your activity and sleep data from popular devices to complete habits seamlessly.</p>
                           
                           <div className="space-y-4">
                               <WearableProviderItem 
                                   icon={HeartPulse} 
                                   colorClass="text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                                   title="Fitbit" 
                                   description="Sync steps, sleep & active minutes" 
                                   connected={!!profile?.wearables?.fitbit?.connected} 
                                   isLoading={connectingWearable === 'fitbit'}
                                   onToggle={() => handleToggleWearable('fitbit', !!profile?.wearables?.fitbit?.connected)} 
                               />
                               
                               <WearableProviderItem 
                                   icon={ActivitySquare} 
                                   colorClass="text-rose-500 bg-rose-500/10 border-rose-500/20"
                                   title="Apple Health" 
                                   description="Sync activity circles & workouts" 
                                   connected={!!profile?.wearables?.appleHealth?.connected} 
                                   isLoading={connectingWearable === 'appleHealth'}
                                   onToggle={() => handleToggleWearable('appleHealth', !!profile?.wearables?.appleHealth?.connected)} 
                               />
                               
                               <WearableProviderItem 
                                   icon={Moon} 
                                   colorClass="text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
                                   title="Oura Ring" 
                                   description="Sync readiness & sleep scores" 
                                   connected={!!profile?.wearables?.oura?.connected} 
                                   isLoading={connectingWearable === 'oura'}
                                   onToggle={() => handleToggleWearable('oura', !!profile?.wearables?.oura?.connected)} 
                               />

                               <WearableProviderItem 
                                   icon={Activity} 
                                   colorClass="text-blue-500 bg-blue-500/10 border-blue-500/20"
                                   title="Google Fit" 
                                   description="Sync heart points & activity" 
                                   connected={!!profile?.wearables?.googleFit?.connected} 
                                   isLoading={connectingWearable === 'googleFit'}
                                   onToggle={() => handleToggleWearable('googleFit', !!profile?.wearables?.googleFit?.connected)} 
                               />
                           </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WearableProviderItem({ icon: Icon, title, description, colorClass, connected, isLoading, onToggle }: any) {
    return (
        <div className="w-full flex items-center justify-between p-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", colorClass)}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {title}
                        {connected && <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-black tracking-wider">Connected</span>}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
                </div>
            </div>
            <button 
                onClick={onToggle}
                disabled={isLoading}
                className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50",
                    connected 
                        ? "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/20" 
                        : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                )}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4 animate-spin hidden sm:block" /> Connecting...
                    </span>
                ) : connected ? 'Disconnect' : 'Connect'}
            </button>
        </div>
    );
}

function SettingSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">{title}</h2>
            <div className="glass-card overflow-hidden divide-y divide-white/[0.03]">
                {children}
            </div>
        </section>
    )
}

function SettingItem({ icon: Icon, title, description, onClick, rightContent }: any) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors text-left group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{title}</p>
                   <p className="text-xs text-slate-500">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {rightContent}
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-white transition-all transform group-hover:translate-x-1" />
            </div>
        </button>
    )
}

function SettingToggle({ icon: Icon, title, description, checked, onToggle }: any) {
    return (
        <div className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-white/[0.01]">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl border flex items-center justify-center transition-all",
                    checked 
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400" 
                        : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500"
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{title}</p>
                   <p className="text-xs text-slate-500">{description}</p>
                </div>
            </div>
            <button 
                onClick={onToggle}
                className={cn(
                    "w-11 h-6 rounded-full relative transition-all duration-300",
                    checked ? "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]" : "bg-slate-700"
                )}
            >
                <motion.div 
                    animate={{ x: checked ? 22 : 4 }}
                    className="w-4 h-4 rounded-full bg-white absolute top-1 shadow-sm"
                />
            </button>
        </div>
    )
}

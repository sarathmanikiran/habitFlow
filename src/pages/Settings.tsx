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
    X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, db } from '../firebase/config';
import { signOut, deleteUser } from 'firebase/auth';
import { collection, query, where, getDocs, writeBatch, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { useHabitData } from '../hooks/useHabitData';
import { useTheme } from '../hooks/useTheme';

export function Settings() {
  const user = auth.currentUser;
  const { theme, toggleTheme } = useTheme();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingPrint, setIsGeneratingPrint] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    setIsExporting(true);
    try {
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
      const habitsQ = query(collection(db, 'habits'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      const habitsSnapshot = await getDocs(habitsQ);
      const habits = habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const currentMonth = format(new Date(), 'yyyy-MM');
      const completionsQ = query(
        collection(db, 'completions'), 
        where('userId', '==', user.uid),
        where('date', '>=', `${currentMonth}-01`),
        where('date', '<=', `${currentMonth}-31`)
      );
      const completionsSnapshot = await getDocs(completionsQ);
      const completions = completionsSnapshot.docs.map(doc => doc.data());

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
                const dateStr = `${currentMonth}-${dayNum.toString().padStart(2, '0')}`;
                const isDone = habitCompletions.some((c: any) => c.date === dateStr);
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
        await signOut(auth);
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
            <SettingItem icon={Smartphone} title="Mobile Integration" description="Connect your wearable devices" />
        </SettingSection>

        <SettingSection title="Privacy & Security">
            <SettingItem icon={Shield} title="Data Privacy" description="Manage your data and visibility" />
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
                    onClick={() => setIsDeleteModalOpen(false)}
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
                    <p className="text-slate-500 dark:text-slate-400 text-center mb-8">This action is permanent and cannot be undone. All your habits, progress, and goals will be lost forever.</p>
                    
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleDeleteAccount}
                            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all"
                        >
                            Confirm Deletion
                        </button>
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="w-full py-4 btn-secondary font-black uppercase tracking-widest text-xs rounded-2xl"
                        >
                            Nevermind
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
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

function SettingItem({ icon: Icon, title, description }: any) {
    return (
        <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors text-left group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{title}</p>
                   <p className="text-xs text-slate-500">{description}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-white transition-all transform group-hover:translate-x-1" />
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

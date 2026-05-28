import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Download, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface ShareStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: { id: string; name: string; streak: number; color: string } | null;
  userName: string;
}

const HABIT_COLORS = [
  { value: 'indigo', text: 'text-indigo-400', from: 'from-indigo-500', to: 'to-indigo-700' },
  { value: 'emerald', text: 'text-emerald-400', from: 'from-emerald-500', to: 'to-emerald-700' },
  { value: 'amber', text: 'text-amber-400', from: 'from-amber-500', to: 'to-amber-700' },
  { value: 'rose', text: 'text-rose-400', from: 'from-rose-500', to: 'to-rose-700' },
  { value: 'violet', text: 'text-violet-400', from: 'from-violet-500', to: 'to-violet-700' },
  { value: 'sky', text: 'text-sky-400', from: 'from-sky-500', to: 'to-sky-700' },
  { value: 'orange', text: 'text-orange-400', from: 'from-orange-500', to: 'to-orange-700' },
  { value: 'fuchsia', text: 'text-fuchsia-400', from: 'from-fuchsia-500', to: 'to-fuchsia-700' },
];

export function ShareStreakModal({ isOpen, onClose, streak, userName }: ShareStreakModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !streak) return null;

  const colorData = HABIT_COLORS.find(c => c.value === streak.color) || HABIT_COLORS[0];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(cardRef.current, { 
        quality: 1, 
        pixelRatio: 3,
        width: 1080,
        height: 1920 // optimized for Instagram Story
      });
      const link = document.createElement('a');
      link.download = `habitflow-streak-${streak.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(cardRef.current, { 
        quality: 1, 
        pixelRatio: 3,
        width: 1080,
        height: 1920
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `habitflow-streak-${streak.name}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My HabitFlow Streak',
          text: `Check out my ${streak.streak} day streak for ${streak.name} on HabitFlow!`,
        });
      } else {
        handleDownload(); // Fallback to download
      }
    } catch (err) {
      console.error('Failed to share image', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm"
        >
          {/* Card to be captured */}
          <div className="rounded-[40px] overflow-hidden bg-black mb-6 relative">
             <div 
               ref={cardRef} 
               className={cn(
                 "w-full aspect-[9/16] relative flex flex-col items-center justify-center p-12 text-center",
                 `bg-gradient-to-br ${colorData.from} ${colorData.to}`
               )}
               style={{ width: 1080, height: 1920, transform: 'scale(0.35)', transformOrigin: 'top left', marginBottom: '-1248px', marginRight: '-702px' }}
             >
               <div className="absolute inset-0 bg-black/20" />
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay" />
               
               <div className="relative z-10 w-full flex flex-col h-full">
                  <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl border-4 border-white/20 shadow-2xl mb-12">
                      <Flame className="w-24 h-24 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]" />
                    </div>
                    <h2 className="text-white font-black text-[180px] leading-none mb-4 drop-shadow-xl">{streak.streak}</h2>
                    <p className="text-white/80 font-bold text-5xl uppercase tracking-[0.3em] mb-16">Day Streak</p>
                    
                    <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl p-10 w-full">
                       <p className="text-white/70 text-4xl font-bold uppercase tracking-widest mb-4">Habit</p>
                       <p className="text-white text-6xl font-black">{streak.name}</p>
                    </div>
                  </div>
                  
                  <div className="w-full flex items-center justify-between pb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                           <span className={cn("font-black text-2xl", colorData.text)}>{userName.charAt(0)}</span>
                        </div>
                        <p className="text-white font-bold text-4xl">{userName}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-white font-black text-4xl tracking-tight">HabitFlow</p>
                        <p className="text-white/60 font-bold text-2xl">{format(new Date(), 'MMM d, yyyy')}</p>
                     </div>
                  </div>
               </div>
             </div>
             
             {/* Display representation (what user sees in modal) */}
             <div className={cn(
                 "w-full aspect-[9/16] relative flex flex-col items-center justify-center p-6 text-center pointer-events-none",
                 `bg-gradient-to-br ${colorData.from} ${colorData.to}`
               )}>
               <div className="absolute inset-0 bg-black/20" />
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
               <button onClick={onClose} className="absolute top-4 right-4 text-white z-20 hover:scale-110 transition-all pointer-events-auto">
                 <X className="w-6 h-6" />
               </button>
               <div className="relative z-10 w-full flex flex-col h-full">
                  <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border-[2px] border-white/20 shadow-xl mb-6">
                      <Flame className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                    </div>
                    <h2 className="text-white font-black text-[90px] leading-none mb-2 drop-shadow-md">{streak.streak}</h2>
                    <p className="text-white/80 font-bold text-xl uppercase tracking-[0.2em] mb-8">Day Streak</p>
                    
                    <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full">
                       <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Habit</p>
                       <p className="text-white text-2xl font-black">{streak.name}</p>
                    </div>
                  </div>
                  
                  <div className="w-full flex items-center justify-between mt-auto">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                           <span className={cn("font-black text-sm", colorData.text)}>{userName.charAt(0)}</span>
                        </div>
                        <p className="text-white font-bold">{userName}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-white font-black leading-tight tracking-tight">HabitFlow</p>
                        <p className="text-white/60 font-bold text-[10px] uppercase tracking-wider">{format(new Date(), 'MMM d, yyyy')}</p>
                     </div>
                  </div>
               </div>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center gap-2 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Save
            </button>
            <button 
              onClick={handleShare}
              disabled={downloading}
              className={cn(
                "flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl disabled:opacity-50",
                `bg-gradient-to-r ${colorData.from} ${colorData.to}`
              )}
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  CheckCircle2, 
  BarChart3, 
  ArrowRight, 
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Step {
  title: string;
  description: string;
  icon: any;
  targetId?: string;
}

const STEPS: Step[] = [
  {
    title: "Welcome to HabitFlow!",
    description: "Ready to transform your life? Let's take a quick 1-minute tour of the key features.",
    icon: Sparkles
  },
  {
    title: "Add Your First Habit",
    description: "Start small. Use the '+' button in the Habits tab to define what you want to achieve daily or weekly.",
    icon: Plus,
    targetId: "add-habit-btn"
  },
  {
    title: "Track Your Progress",
    description: "Consistency is key. Click on a habit to mark it as complete for the day and watch your streaks grow!",
    icon: CheckCircle2,
    targetId: "habit-card-0"
  },
  {
    title: "Visualize Results",
    description: "Head to the Dashboard to see your weekly performance and overall consistency metrics.",
    icon: BarChart3,
    targetId: "nav-dashboard"
  }
];

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md glass-card p-8 shadow-2xl"
      >
        <button 
          onClick={onComplete}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 font-black text-2xl">
            <step.icon className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-tighter">{step.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
            {step.description}
          </p>

          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === currentStep ? "w-8 bg-indigo-600 dark:bg-indigo-500" : "w-1.5 bg-slate-200 dark:bg-white/10"
                )}
              />
            ))}
          </div>

          <button 
            onClick={nextStep}
            className="w-full btn-primary py-4 text-xs font-black uppercase tracking-[0.2em]"
          >
            {currentStep === STEPS.length - 1 ? "Get Started" : "Next Step"}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Brain, 
  Lightbulb, 
  Zap,
  BarChart3,
  Plus
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import ReactMarkdown from 'react-markdown';

import { useHabitData } from '@/src/hooks/useHabitData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AICoach() {
  const { habits, completions, calculateStreak } = useHabitData();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI Habit Coach. I can analyze your progress and help you stay consistent. Want me to take a look at your stats?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input.trim();
    if (!textToSend || isLoading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Prepare context: recent completions and active habit list
      const activeHabits = habits.filter(h => !h.archived);
      const habitSummary = activeHabits.map(h => `- ${h.name} (${h.category}) - Current Streak: ${calculateStreak(h.id)} days`).join('\n');
      const recentCompletions = completions
        .filter(c => activeHabits.some(h => h.id === c.habitId))
        .slice(-20)
        .map(c => `- ${c.date}: ${ activeHabits.find(h => h.id === c.habitId)?.name || 'Unknown' } - ${c.completed ? 'Success' : 'Missed'}`)
        .join('\n');

      const systemInstruction = `You are a professional habit coach like James Clear. 
      You have access to the user's habit data:
      
      HABITS:
      ${habitSummary}
      
      RECENT ACTIVITY:
      ${recentCompletions}
      
      Provide concise, actionable, and encouraging advice. If the user asks for analysis, look for patterns (e.g., missed days on weekends, best performing habits). Use markdown. Be direct but empathetic.`;

      // Call our backend proxy instead of Gemini SDK directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.slice(1), // Exclude the initial greeting as it's an assistant response, or we just pass the history
          systemInstruction,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to communicate with AI Coach API');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.text || "I couldn't process that. Please try again." }]);
    } catch (error: any) {
      console.error('AI API Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `I'm having trouble connecting: ${error.message || 'Please test again later.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] md:h-[calc(100vh-100px)]">
      {/* Desktop Only Header */}
      <header className="hidden lg:flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AI Habit Coach</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Personalized insights based on your behavior</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: "Chat cleared. How can I help you today?" }])}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            Clear Chat
          </button>
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
            <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Premium AI Active</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 lg:glass-card lg:rounded-3xl shadow-none dark:shadow-2xl">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-[120px] md:pb-[140px] space-y-4 md:space-y-6 scroll-smooth scrollbar-hide" ref={scrollRef}>
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse text-right" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 border",
                  msg.role === 'assistant' 
                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400" 
                    : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400"
                )}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4 md:w-5 md:h-5" /> : <User className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
                <div className={cn(
                  "p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed",
                  msg.role === 'assistant' 
                    ? "bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-bl-none" 
                    : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 rounded-br-none"
                )}>
                  <div className={cn("markdown-body prose-sm", msg.role === 'assistant' ? "dark:prose-invert" : "prose-invert")}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 items-center"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Bot className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 p-3 md:p-4 rounded-2xl rounded-bl-none">
                <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggested Prompts & Input Area */}
        <div className="flex-none p-4 md:px-6">
          <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide pb-4">
            <SuggestionChip text="Analyze my week" icon={BarChart3} onClick={() => handleSend("Analyze my habit completion data for the past week and provide a summary of my performance, highlighting any streaks maintained or broken, and suggest one actionable tip to improve consistency for the coming week.")} />
            <SuggestionChip text="Morning routine tips" icon={Lightbulb} onClick={() => handleSend("What are some good morning habits I should add?")} />
            <SuggestionChip text="Stop missing days" icon={Zap} onClick={() => handleSend("I keep missing my habits on weekends. How can I stay consistent?")} />
            <SuggestionChip text="New habit ideas" icon={Plus} onClick={() => handleSend("Give me some habit ideas for personal growth.")} />
          </div>
        </div>

        {/* Fixed Typing Bar - Safe for Mobile Thumb Interaction */}
        <div className="fixed bottom-[85px] md:bottom-[40px] left-0 right-0 px-4 z-40">
          <div className="max-w-[600px] mx-auto glass-card flex items-center gap-[10px] p-1.5 md:p-2 rounded-[28px] shadow-2xl shadow-indigo-600/10 border-indigo-500/20 active-ring transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask your coach anything..."
              className="flex-1 bg-transparent border-none outline-none px-[14px] py-[12px] text-[14px] md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className={cn(
                "w-[44px] h-[44px] flex-shrink-0 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:grayscale",
                !isLoading && input.trim() && "ring-4 ring-indigo-500/20"
              )}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionChip({ text, icon: Icon, onClick }: { text: string, icon: any, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-full px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all whitespace-nowrap shadow-sm"
    >
      <Icon className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
      {text}
    </button>
  );
}

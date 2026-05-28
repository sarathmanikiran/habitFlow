export function calculateLevelAndXP(xp: number) {
  let level = 1;
  let title = "Beginner";
  let nextLevelXP = 500;
  let progress = 0;

  if (xp >= 15000) {
    level = 51 + Math.floor((xp - 15000) / 1000); // just scale up
    title = "Legend";
    nextLevelXP = xp + 1000;
    progress = 100;
  } else if (xp >= 5000) {
    level = 31 + Math.floor(((xp - 5000) / 10000) * 20); 
    title = "Master";
    nextLevelXP = 15000;
    progress = ((xp - 5000) / (15000 - 5000)) * 100;
  } else if (xp >= 2000) {
     level = 16 + Math.floor(((xp - 2000) / 3000) * 15);
     title = "Dedicated";
     nextLevelXP = 5000;
     progress = ((xp - 2000) / (5000 - 2000)) * 100;
  } else if (xp >= 500) {
     level = 6 + Math.floor(((xp - 500) / 1500) * 10);
     title = "Consistent";
     nextLevelXP = 2000;
     progress = ((xp - 500) / (2000 - 500)) * 100;
  } else {
     level = 1 + Math.floor((xp / 500) * 4);
     title = "Beginner";
     nextLevelXP = 500;
     progress = (xp / 500) * 100;
  }

  return { level, title, nextLevelXP, progress };
}

export function calculateTotalXP(completions: any[], habits: any[]) {
  let xp = 0;
    
  // 10 XP per completion
  const activeCompletions = completions.filter(c => c.completed);
  xp += activeCompletions.length * 10;
  
  // 50 XP bonus for completing all habits in a day
  const completionsByDate = activeCompletions.reduce((acc, c) => {
    acc[c.date] = (acc[c.date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const activeHabitIds = habits.filter(h => !h.archived).map(h => h.id);
  const activeHabitsCount = activeHabitIds.length;
  
  if (activeHabitsCount > 0) {
    Object.keys(completionsByDate).forEach(date => {
      // We check if the user completed ALL of their CURRENT active habits on that date.
      // This is a rough estimation since historical active habits aren't tracked, 
      // but it works nicely to reward highly active days.
      if (completionsByDate[date] >= activeHabitsCount) {
         xp += 50; 
      }
    });
  }
  
  // Streak bonuses
  habits.forEach(habit => {
      const habitComps = activeCompletions
        .filter(c => c.habitId === habit.id)
        .sort((a,b) => b.date.localeCompare(a.date)); // descending
        
      if(habitComps.length === 0) return;
      
      let currentStreak = 1;
      let maxStreak = 1;
      
      for(let i=1; i<habitComps.length; i++) {
         const prev = new Date(habitComps[i-1].date + 'T00:00:00');
         const curr = new Date(habitComps[i].date + 'T00:00:00');
         const diff = Math.round((prev.getTime() - curr.getTime()) / (1000 * 3600 * 24));
         if (diff === 1) {
           currentStreak++;
           maxStreak = Math.max(maxStreak, currentStreak);
         } else {
           currentStreak = 1;
         }
      }
      
      if (maxStreak >= 7) xp += 100;
      if (maxStreak >= 30) xp += 500;
  });

  return xp;
}

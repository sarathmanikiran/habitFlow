import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Habit, Completion } from '../types';
import { format, subDays } from 'date-fns';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (errorMessage.includes('offline')) {
    alert('Could not connect to Firestore database. Please ensure you have enabled "Cloud Firestore" in your Firebase Console and created a database.');
  } else if (errorMessage.includes('permission')) {
    alert('Missing permissions. Please update your Firestore security rules.');
  }
  
  const errInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

function getInitialDemoHabits(): Habit[] {
  return [
    {
      id: 'habit_demo_1',
      userId: 'demo_user',
      name: 'Morning Gym or Home Workout',
      category: 'Health',
      color: 'emerald',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      archived: false
    },
    {
      id: 'habit_demo_2',
      userId: 'demo_user',
      name: 'Read 10 pages or Listen to Audiobook',
      category: 'Mind',
      color: 'indigo',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      archived: false
    },
    {
      id: 'habit_demo_3',
      userId: 'demo_user',
      name: 'Plan the upcoming daily tasks',
      category: 'Productivity',
      color: 'pink',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      archived: false
    }
  ];
}

export function useHabitData() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);

  const isDemo = auth.currentUser?.uid === 'demo_user';

  useEffect(() => {
    if (!auth.currentUser) return;

    if (isDemo) {
      const localHabits = localStorage.getItem('demo_habits');
      const localCompletions = localStorage.getItem('demo_completions');
      setHabits(localHabits ? JSON.parse(localHabits) : getInitialDemoHabits());
      setCompletions(localCompletions ? JSON.parse(localCompletions) : []);
      setLoading(false);
      return;
    }

    const habitsPath = 'habits';
    const habitsQuery = query(
      collection(db, habitsPath),
      where('userId', '==', auth.currentUser.uid)
    );

    const completionsPath = 'completions';
    const completionsQuery = query(
      collection(db, completionsPath),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubHabits = onSnapshot(habitsQuery, (snapshot) => {
      const h = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
      setHabits(h);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, habitsPath);
    });

    const unsubCompletions = onSnapshot(completionsQuery, (snapshot) => {
      const c = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Completion));
      setCompletions(c);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, completionsPath);
    });

    return () => {
      unsubHabits();
      unsubCompletions();
    };
  }, [isDemo]);

  const addHabit = async (
    name: string, 
    category: string, 
    color: string, 
    frequency: 'daily' | 'weekly' = 'daily',
    reminderTime?: string,
    reminderDays?: number[]
  ) => {
    if (!auth.currentUser) return;

    if (isDemo) {
      const newHabit: Habit = {
        id: 'habit_' + Date.now().toString(),
        userId: auth.currentUser.uid,
        name,
        category: category as any,
        color,
        frequency,
        createdAt: new Date().toISOString(),
        archived: false,
        ...(reminderTime !== undefined && { reminderTime }),
        ...(reminderDays !== undefined && { reminderDays })
      };
      const updated = [newHabit, ...habits];
      setHabits(updated);
      localStorage.setItem('demo_habits', JSON.stringify(updated));
      return;
    }

    const path = 'habits';
    try {
      const data: any = {
        userId: auth.currentUser.uid,
        name,
        category,
        color,
        frequency,
        createdAt: serverTimestamp()
      };
      if (reminderTime !== undefined) data.reminderTime = reminderTime;
      if (reminderDays !== undefined) data.reminderDays = reminderDays;

      await addDoc(collection(db, path), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const toggleCompletion = async (habitId: string, date: string): Promise<'completed' | 'none'> => {
    if (!auth.currentUser) return 'none';

    if (isDemo) {
      const existingIndex = completions.findIndex(c => c.habitId === habitId && c.date === date);
      let updatedCompletions = [...completions];
      let newStatus: 'completed' | 'none' = 'none';
      
      if (existingIndex > -1) {
        // If it exists, we remove it completely to unachieve it back to 'none'
        updatedCompletions.splice(existingIndex, 1);
        newStatus = 'none';
      } else {
        // Create new completion
        const newCompletion: Completion = {
          id: 'completion_' + Date.now().toString(),
          habitId,
          userId: auth.currentUser.uid,
          date,
          completed: true,
          updatedAt: new Date().toISOString()
        };
        updatedCompletions.push(newCompletion);
        newStatus = 'completed';
      }
      
      setCompletions(updatedCompletions);
      localStorage.setItem('demo_completions', JSON.stringify(updatedCompletions));
      return newStatus;
    }
    
    const existing = completions.find(c => c.habitId === habitId && c.date === date);
    const path = 'completions';
    
    try {
      if (existing) {
        // If it existing completion, delete it to fully unachieve it back to 'none'
        await deleteDoc(doc(db, path, existing.id));
        return 'none';
      } else {
        await addDoc(collection(db, path), {
          habitId,
          userId: auth.currentUser.uid,
          date,
          completed: true,
          updatedAt: serverTimestamp()
        });
        return 'completed';
      }
    } catch (error) {
      const op = existing ? OperationType.DELETE : OperationType.CREATE;
      handleFirestoreError(error, op, path);
      return 'none';
    }
  };

  const calculateStreak = (habitId: string) => {
    const habitCompletions = completions
      .filter(c => c.habitId === habitId && c.completed)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (habitCompletions.length === 0) return 0;

    let streak = 0;
    
    // If not completed today, check if completed yesterday to continue streak
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    const hasToday = habitCompletions.some(c => c.date === todayStr);
    const hasYesterday = habitCompletions.some(c => c.date === yesterdayStr);

    if (!hasToday && !hasYesterday) return 0;

    let current = hasToday ? new Date() : subDays(new Date(), 1);

    while (true) {
      const dateStr = format(current, 'yyyy-MM-dd');
      if (habitCompletions.some(c => c.date === dateStr)) {
        streak++;
        current = subDays(current, 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const toggleArchive = async (habitId: string) => {
    if (!auth.currentUser) return;

    if (isDemo) {
      const updated = habits.map(h => h.id === habitId ? { ...h, archived: !h.archived } : h);
      setHabits(updated);
      localStorage.setItem('demo_habits', JSON.stringify(updated));
      return;
    }

    const path = 'habits';
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    try {
      await updateDoc(doc(db, path, habitId), {
        archived: !habit.archived
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!auth.currentUser) return;

    if (isDemo) {
      const updatedHabits = habits.filter(h => h.id !== habitId);
      const updatedCompletions = completions.filter(c => c.habitId !== habitId);
      setHabits(updatedHabits);
      setCompletions(updatedCompletions);
      localStorage.setItem('demo_habits', JSON.stringify(updatedHabits));
      localStorage.setItem('demo_completions', JSON.stringify(updatedCompletions));
      return;
    }

    const path = 'habits';
    try {
      // 1. Delete the habit
      await deleteDoc(doc(db, path, habitId));
      
      // 2. Delete all completions for this habit (cleanup)
      const q = query(collection(db, 'completions'), where('habitId', '==', habitId));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const reorderHabits = async (newHabitsOrder: Habit[]) => {
    if (!auth.currentUser) return;

    if (isDemo) {
      const updated = newHabitsOrder.map((habit, index) => ({ ...habit, order: index }));
      setHabits(updated);
      localStorage.setItem('demo_habits', JSON.stringify(updated));
      return;
    }

    const batch = writeBatch(db);
    newHabitsOrder.forEach((habit, index) => {
      const habitRef = doc(db, 'habits', habit.id);
      batch.update(habitRef, { order: index });
    });
    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'habits');
    }
  };

  const editHabit = async (habitId: string, updates: Partial<Habit>) => {
    if (!auth.currentUser) return;

    if (isDemo) {
      const updated = habits.map(h => h.id === habitId ? { ...h, ...updates } : h);
      setHabits(updated);
      localStorage.setItem('demo_habits', JSON.stringify(updated));
      return;
    }

    const path = 'habits';
    try {
      await updateDoc(doc(db, path, habitId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  return { habits, completions, loading, addHabit, toggleCompletion, calculateStreak, deleteHabit, toggleArchive, reorderHabits, editHabit };
}

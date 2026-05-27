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

export function useHabitData() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

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
  }, []);

  const addHabit = async (
    name: string, 
    category: string, 
    color: string, 
    frequency: 'daily' | 'weekly' = 'daily',
    reminderTime?: string,
    reminderDays?: number[]
  ) => {
    if (!auth.currentUser) return;
    const path = 'habits';
    try {
      await addDoc(collection(db, path), {
        userId: auth.currentUser.uid,
        name,
        category,
        color,
        frequency,
        reminderTime,
        reminderDays,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const toggleCompletion = async (habitId: string, date: string) => {
    if (!auth.currentUser) return;
    
    const existing = completions.find(c => c.habitId === habitId && c.date === date);
    const path = 'completions';
    
    try {
      if (existing) {
        await updateDoc(doc(db, path, existing.id), {
          completed: !existing.completed,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, path), {
          habitId,
          userId: auth.currentUser.uid,
          date,
          completed: true,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      const op = existing ? OperationType.UPDATE : OperationType.CREATE;
      handleFirestoreError(error, op, path);
    }
  };

  const calculateStreak = (habitId: string) => {
    const habitCompletions = completions
      .filter(c => c.habitId === habitId && c.completed)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (habitCompletions.length === 0) return 0;

    let streak = 0;
    let checkDate = new Date(); // Start from today
    
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

  return { habits, completions, loading, addHabit, toggleCompletion, calculateStreak, deleteHabit, toggleArchive };
}

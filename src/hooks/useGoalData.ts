import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  doc, 
  deleteDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: string;
  progress: number;
  deadline: string;
  items: string;
  completed: boolean;
  createdAt: any; // Using any for Firestore compatibility
}

function getInitialDemoGoals(): Goal[] {
  return [
    {
      id: 'goal_demo_1',
      userId: 'demo_user',
      title: 'Run a 10K Marathon',
      category: 'health',
      progress: 66,
      deadline: '2026-09-30',
      items: '3 tasks',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'goal_demo_2',
      userId: 'demo_user',
      title: 'Complete 3 online certifications',
      category: 'productivity',
      progress: 33,
      deadline: '2026-12-15',
      items: '3 tasks',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];
}

export function useGoalData() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const isDemo = auth.currentUser?.uid === 'demo_user';

  useEffect(() => {
    if (!auth.currentUser) return;

    if (isDemo) {
      const localGoals = localStorage.getItem('demo_goals');
      setGoals(localGoals ? JSON.parse(localGoals) : getInitialDemoGoals());
      setLoading(false);
      return;
    }

    const path = 'goals';
    const q = query(
      collection(db, path),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const g = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
      setGoals(g);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [isDemo]);

  const addGoal = async (title: string, category: string, deadline: string, items: string) => {
    if (!auth.currentUser) return;

    if (isDemo) {
      const newGoal: Goal = {
        id: 'goal_' + Date.now().toString(),
        userId: auth.currentUser.uid,
        title,
        category,
        deadline,
        items,
        progress: 0,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updated = [newGoal, ...goals];
      setGoals(updated);
      localStorage.setItem('demo_goals', JSON.stringify(updated));
      return;
    }

    const path = 'goals';
    try {
      await addDoc(collection(db, path), {
        userId: auth.currentUser.uid,
        title,
        category,
        deadline,
        items,
        progress: 0,
        completed: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateGoalProgress = async (id: string, progress: number) => {
    if (isDemo) {
      const updated = goals.map(g => g.id === id ? { ...g, progress, completed: progress >= 100 } : g);
      setGoals(updated);
      localStorage.setItem('demo_goals', JSON.stringify(updated));
      return;
    }

    const path = 'goals';
    try {
      await updateDoc(doc(db, path, id), {
        progress,
        completed: progress >= 100
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteGoal = async (id: string) => {
    if (isDemo) {
      const updated = goals.filter(g => g.id !== id);
      setGoals(updated);
      localStorage.setItem('demo_goals', JSON.stringify(updated));
      
      // Also cleanup tasks
      localStorage.removeItem(`demo_tasks_${id}`);
      return;
    }

    const path = 'goals';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return { goals, loading, addGoal, updateGoalProgress, deleteGoal };
}

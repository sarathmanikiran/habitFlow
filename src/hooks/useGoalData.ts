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

export function useGoalData() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

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
  }, []);

  const addGoal = async (title: string, category: string, deadline: string, items: string) => {
    if (!auth.currentUser) return;
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
    const path = 'goals';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return { goals, loading, addGoal, updateGoalProgress, deleteGoal };
}

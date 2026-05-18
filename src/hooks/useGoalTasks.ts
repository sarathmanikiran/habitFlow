import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  doc, 
  deleteDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export interface GoalTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
  dueDate?: string;
  createdAt: any;
}

export function useGoalTasks(goalId: string) {
  const [tasks, setTasks] = useState<GoalTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser || !goalId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const path = `goals/${goalId}/tasks`;
    const q = query(collection(db, path)); // get rule checks goalId ownership

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const t = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GoalTask));
      setTasks(t);
      setLoading(false);
    }, (error) => {
      console.error(error);
    });

    return () => unsubscribe();
  }, [goalId]);

  const addTask = async (title: string, assignee?: string, dueDate?: string) => {
    if (!auth.currentUser || !goalId) return;
    const path = `goals/${goalId}/tasks`;
    try {
      const payload: any = {
        title,
        completed: false,
        createdAt: serverTimestamp()
      };
      if (assignee) payload.assignee = assignee;
      if (dueDate) payload.dueDate = dueDate;

      await addDoc(collection(db, path), payload);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTask = async (taskId: string, currentCompleted: boolean) => {
    const path = `goals/${goalId}/tasks`;
    try {
      await updateDoc(doc(db, path, taskId), {
        completed: !currentCompleted
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<GoalTask>) => {
    const path = `goals/${goalId}/tasks`;
    try {
      await updateDoc(doc(db, path, taskId), updates);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId: string) => {
    const path = `goals/${goalId}/tasks`;
    try {
      await deleteDoc(doc(db, path, taskId));
    } catch (error) {
      console.error(error);
    }
  };

  return { tasks, loading, addTask, toggleTask, updateTask, deleteTask };
}

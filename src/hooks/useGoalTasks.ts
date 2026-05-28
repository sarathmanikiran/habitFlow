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

function getInitialDemoTasks(goalId: string): GoalTask[] {
  if (goalId === 'goal_demo_1') {
    return [
      { id: 'task_demo_1', title: 'Buy running shoes', completed: true, createdAt: new Date().toISOString() },
      { id: 'task_demo_2', title: '5K run test', completed: true, createdAt: new Date().toISOString() },
      { id: 'task_demo_3', title: '8K run training session', completed: false, createdAt: new Date().toISOString() }
    ];
  } else if (goalId === 'goal_demo_2') {
    return [
      { id: 'task_demo_4', title: 'Vite & React course completion', completed: true, createdAt: new Date().toISOString() },
      { id: 'task_demo_5', title: 'TypeScript mastery exam', completed: false, createdAt: new Date().toISOString() },
      { id: 'task_demo_6', title: 'Final capstone project submission', completed: false, createdAt: new Date().toISOString() }
    ];
  }
  return [];
}

export function useGoalTasks(goalId: string) {
  const [tasks, setTasks] = useState<GoalTask[]>([]);
  const [loading, setLoading] = useState(true);

  const isDemo = auth.currentUser?.uid === 'demo_user';

  useEffect(() => {
    if (!auth.currentUser || !goalId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    if (isDemo) {
      const localTasks = localStorage.getItem(`demo_tasks_${goalId}`);
      setTasks(localTasks ? JSON.parse(localTasks) : getInitialDemoTasks(goalId));
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
  }, [goalId, isDemo]);

  const addTask = async (title: string, assignee?: string, dueDate?: string) => {
    if (!auth.currentUser || !goalId) return;

    if (isDemo) {
      const newTask: GoalTask = {
        id: 'task_' + Date.now().toString(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
        ...(assignee && { assignee }),
        ...(dueDate && { dueDate })
      };
      const updated = [...tasks, newTask];
      setTasks(updated);
      localStorage.setItem(`demo_tasks_${goalId}`, JSON.stringify(updated));
      return;
    }

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
    if (isDemo) {
      const updated = tasks.map(t => t.id === taskId ? { ...t, completed: !currentCompleted } : t);
      setTasks(updated);
      localStorage.setItem(`demo_tasks_${goalId}`, JSON.stringify(updated));
      return;
    }

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
    if (isDemo) {
      const updated = tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
      setTasks(updated);
      localStorage.setItem(`demo_tasks_${goalId}`, JSON.stringify(updated));
      return;
    }

    const path = `goals/${goalId}/tasks`;
    try {
      await updateDoc(doc(db, path, taskId), updates);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (isDemo) {
      const updated = tasks.filter(t => t.id !== taskId);
      setTasks(updated);
      localStorage.setItem(`demo_tasks_${goalId}`, JSON.stringify(updated));
      return;
    }

    const path = `goals/${goalId}/tasks`;
    try {
      await deleteDoc(doc(db, path, taskId));
    } catch (error) {
      console.error(error);
    }
  };

  return { tasks, loading, addTask, toggleTask, updateTask, deleteTask };
}

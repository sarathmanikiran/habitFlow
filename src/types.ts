export type HabitCategory = 'Health' | 'Mind' | 'Productivity' | 'Lifestyle';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  joinedAt: number;
  hasCompletedOnboarding?: boolean;
  privacyPreferences?: {
    shareAnalytics?: boolean;
    personalizedCoach?: boolean;
  };
  wearables?: {
    fitbit?: { connected: boolean; lastSync?: number };
    appleHealth?: { connected: boolean; lastSync?: number };
    oura?: { connected: boolean; lastSync?: number };
    googleFit?: { connected: boolean; lastSync?: number };
  };
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  category: HabitCategory;
  color: string;
  frequency: 'daily' | 'weekly';
  reminderTime?: string; // HH:mm
  reminderDays?: number[]; // [0-6] for weekly or specific days
  archived?: boolean;
  order?: number;
  createdAt: any;
}

export interface Completion {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  updatedAt: any;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: string;
  deadline: string;
  items: string;
  progress: number;
  completed: boolean;
  createdAt: any;
}

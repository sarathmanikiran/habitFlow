import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        const profileRef = doc(db, 'users', authUser.uid);
        try {
          const profileSnap = await getDoc(profileRef);
          
          if (profileSnap.exists()) {
            setProfile({ id: profileSnap.id, ...profileSnap.data() } as any);
          } else {
            // Create new profile
            const newProfile = {
              uid: authUser.uid,
              displayName: authUser.displayName,
              email: authUser.email,
              photoURL: authUser.photoURL,
              joinedAt: Date.now(),
              hasCompletedOnboarding: false
            };
            await setDoc(profileRef, newProfile);
            setProfile(newProfile as any);
          }
        } catch (error: any) {
          console.error("Firestore Error in useAuth:", error);
          if (error?.message?.includes('offline')) {
             alert(`Could not connect to Firestore database. Please ensure you have enabled "Cloud Firestore" in your Firebase Console (habit-flow-1228) and created a database.`);
          } else if (error?.message?.includes('permission')) {
             alert(`Missing permissions. Please update your Firestore security rules.`);
          } else {
             alert(`Database error: ${error.message}`);
          }
        }

      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const completeOnboarding = async () => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    await updateDoc(profileRef, {
      hasCompletedOnboarding: true
    });
    setProfile(prev => prev ? { ...prev, hasCompletedOnboarding: true } : null);
  };

  const updatePrivacyPreferences = async (preferences: any) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    await updateDoc(profileRef, {
      privacyPreferences: preferences
    });
    setProfile(prev => prev ? { ...prev, privacyPreferences: preferences } : null);
  };

  const updateWearableIntegration = async (provider: string, connected: boolean) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    const updatedWearables = {
      ...(profile?.wearables || {}),
      [provider]: { connected, lastSync: connected ? Date.now() : undefined }
    };
    await updateDoc(profileRef, {
      wearables: updatedWearables
    });
    setProfile(prev => prev ? { ...prev, wearables: updatedWearables } : null);
  };

  return { user, profile, loading, completeOnboarding, updatePrivacyPreferences, updateWearableIntegration };
}

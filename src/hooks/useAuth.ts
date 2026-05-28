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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loginAsDemo = () => {
    const demoUserObj = {
      uid: 'demo_user',
      displayName: 'Demo Achiever',
      email: 'demo@habitflow.com',
      photoURL: null,
      isAnonymous: false,
      emailVerified: true
    };
    localStorage.setItem('demo_user_profile', JSON.stringify(demoUserObj));
    
    const defaultDemoProfile = {
      uid: 'demo_user',
      displayName: 'Demo Achiever',
      email: 'demo@habitflow.com',
      photoURL: null,
      joinedAt: Date.now(),
      hasCompletedOnboarding: true,
      privacyPreferences: {
        shareAnalytics: true,
        personalizedCoach: true
      },
      wearables: {
        fitbit: { connected: true, lastSync: Date.now() - 3600000 },
        appleHealth: { connected: false }
      }
    };
    localStorage.setItem('demo_profile_data', JSON.stringify(defaultDemoProfile));
    
    setUser(demoUserObj);
    setProfile(defaultDemoProfile as any);
  };

  useEffect(() => {
    // Check if session has active demo/guest user
    const localDemoUser = localStorage.getItem('demo_user_profile');
    if (localDemoUser) {
      try {
        const parsedDemo = JSON.parse(localDemoUser);
        setUser(parsedDemo);
        
        const localProfile = localStorage.getItem('demo_profile_data');
        if (localProfile) {
          setProfile(JSON.parse(localProfile));
        } else {
          const defaultDemoProfile = {
            uid: 'demo_user',
            displayName: 'Demo Achiever',
            email: 'demo@habitflow.com',
            photoURL: null,
            joinedAt: Date.now(),
            hasCompletedOnboarding: true,
            privacyPreferences: {
              shareAnalytics: true,
              personalizedCoach: true
            },
            wearables: {
              fitbit: { connected: true, lastSync: Date.now() - 3600000 },
              appleHealth: { connected: false }
            }
          };
          localStorage.setItem('demo_profile_data', JSON.stringify(defaultDemoProfile));
          setProfile(defaultDemoProfile as any);
        }
        setLoading(false);
        return;
      } catch (e) {
        console.error("Failed parsing demo user profile", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (localStorage.getItem('demo_user_profile')) {
        return; // Don't override demo session if active
      }
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
    if (user.uid === 'demo_user') {
      const updatedProfile = profile ? { ...profile, hasCompletedOnboarding: true } : null;
      setProfile(updatedProfile);
      localStorage.setItem('demo_profile_data', JSON.stringify(updatedProfile));
      return;
    }
    const profileRef = doc(db, 'users', user.uid);
    await updateDoc(profileRef, {
      hasCompletedOnboarding: true
    });
    setProfile(prev => prev ? { ...prev, hasCompletedOnboarding: true } : null);
  };

  const updatePrivacyPreferences = async (preferences: any) => {
    if (!user) return;
    if (user.uid === 'demo_user') {
      const updatedProfile = profile ? { ...profile, privacyPreferences: preferences } : null;
      setProfile(updatedProfile);
      localStorage.setItem('demo_profile_data', JSON.stringify(updatedProfile));
      return;
    }
    const profileRef = doc(db, 'users', user.uid);
    await updateDoc(profileRef, {
      privacyPreferences: preferences
    });
    setProfile(prev => prev ? { ...prev, privacyPreferences: preferences } : null);
  };

  const updateWearableIntegration = async (provider: string, connected: boolean) => {
    if (!user) return;
    if (user.uid === 'demo_user') {
      const updatedWearables = {
        ...(profile?.wearables || {}),
        [provider]: { connected, lastSync: connected ? Date.now() : undefined }
      };
      const updatedProfile = profile ? { ...profile, wearables: updatedWearables } : null;
      setProfile(updatedProfile);
      localStorage.setItem('demo_profile_data', JSON.stringify(updatedProfile));
      return;
    }
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

  return { user, profile, loading, completeOnboarding, updatePrivacyPreferences, updateWearableIntegration, loginAsDemo };
}

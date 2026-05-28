import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCffqEOX0-AAqAjA9GZjJoIUVcgcZFTjjA",
  authDomain: "habit-flow-1228.firebaseapp.com",
  projectId: "habit-flow-1228",
  storageBucket: "habit-flow-1228.firebasestorage.app",
  messagingSenderId: "90066317205",
  appId: "1:90066317205:web:8d0391b170e710ba7cd09c",
  measurementId: "G-F22FY39LX1"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });

const rawAuth = getAuth(app);
export const auth = new Proxy(rawAuth, {
  get(target, prop, receiver) {
    if (prop === 'currentUser') {
      const demoUser = localStorage.getItem('demo_user_profile');
      if (demoUser) {
        try {
          return JSON.parse(demoUser);
        } catch (e) {
          return null;
        }
      }
    }
    const val = Reflect.get(target, prop, receiver);
    if (typeof val === 'function') {
      return val.bind(target);
    }
    return val;
  }
});

export const googleProvider = new GoogleAuthProvider();


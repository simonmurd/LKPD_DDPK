import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyB4rfB7u-fuVNEZzwgHUVK6HNsWcSerXUg",
  authDomain: "elearning-komputer-jaringan.firebaseapp.com",
  projectId: "elearning-komputer-jaringan",
  storageBucket: "elearning-komputer-jaringan.firebasestorage.app",
  messagingSenderId: "856913609179",
  appId: "1:856913609179:web:13d263c2b88d2a336567fe"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Enable offline persistence if in browser environment
try {
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('Firestore persistence failed: multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn('Firestore persistence is not supported in this browser');
      }
    });
  }
} catch {
  // Ignore in environments where persistence is already active
}

export {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
};

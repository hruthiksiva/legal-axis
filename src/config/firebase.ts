// Import necessary Firebase services
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration loaded from .env file to keep it secure and reusable
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize the app with the config
const app = initializeApp(firebaseConfig);

// Export commonly used Firebase services for use across the app
export const auth = getAuth(app);         // 🔐 For Firebase Authentication
export const db = getFirestore(app);      // 🗃️ For Firestore Database
export const storage = getStorage(app);   // 📁 For File/Media Storage (images, docs)

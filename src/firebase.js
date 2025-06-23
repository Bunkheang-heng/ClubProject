import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Functions
const functions = getFunctions(app);

// Connect to emulators in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  try {
    // Only connect to emulators if we haven't already
    if (!auth._delegate._config?.emulator) {
      connectAuthEmulator(auth, "http://127.0.0.1:9099");
    }
    
    if (!db._delegate._databaseId?.database?.includes('emulator')) {
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
    }
    
    if (!functions._delegate?.customDomain) {
      connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    }
  } catch (error) {
    console.log('Emulators already connected or not available');
  }
}

export { app, db, auth, functions };

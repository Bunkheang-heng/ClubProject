
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnBM1QqrHF9369_MEwjnsp-uwiDxTEmp0",
  authDomain: "bytebuilder-6cc09.firebaseapp.com",
  projectId: "bytebuilder-6cc09",
  storageBucket: "bytebuilder-6cc09.appspot.com",
  messagingSenderId: "911153425392",
  appId: "1:911153425392:web:c52eedf694b128c8a8cb35"
};


const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

export { app, db, auth };

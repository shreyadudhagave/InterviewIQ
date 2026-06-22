import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-ab442.firebaseapp.com",
  projectId: "interviewiq-ab442",
  storageBucket: "interviewiq-ab442.firebasestorage.app",
  messagingSenderId: "947647288367",
  appId: "1:947647288367:web:5c99f8545f43adf78e22da",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };

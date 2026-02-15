import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyANEbqOmBO1iYDFXkYMUCC2vl3TaYRMgjs",
  authDomain: "unitask-b9b5e.firebaseapp.com",
  projectId: "unitask-b9b5e",
  storageBucket: "unitask-b9b5e.firebasestorage.app",
  messagingSenderId: "103699486640",
  appId: "1:103699486640:web:9352f9ea290b260e8f2875",
  measurementId: "G-8FG7KVP785"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


auth.languageCode = 'it';

export { auth, app, db, storage};
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app)
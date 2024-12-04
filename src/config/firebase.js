import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANEbqOmBO1iYDFXkYMUCC2vl3TaYRMgjs",
  authDomain: "unitask-b9b5e.firebaseapp.com",
  projectId: "unitask-b9b5e",
  storageBucket: "unitask-b9b5e.firebasestorage.app",
  messagingSenderId: "103699486640",
  appId: "1:103699486640:web:9352f9ea290b260e8f2875",
  measurementId: "G-8FG7KVP785"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
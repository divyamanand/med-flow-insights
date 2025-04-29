
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZpvxAmO1PYFiqOvq8Ws0O03SXlHw2Dao",
  authDomain: "hospital-f5f91.firebaseapp.com",
  projectId: "hospital-f5f91",
  storageBucket: "hospital-f5f91.firebasestorage.app",
  messagingSenderId: "26921104250",
  appId: "1:26921104250:web:4285d6c4e33d61d1211cc3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
const db = getFirestore(app);

export { db };


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
// Replace these with your actual Firebase project configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_APIKEY,
//   authDomain: import.meta.env.VITE_AUTHDOMAIN,
//   projectId: import.meta.env.VITE_PROJECTID,
//   storageBucket: import.meta.env.VITE_STORAGEBUCKET,
//   messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
//   appId: import.meta.env.VITE_APPID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyAmZCMpwJRuY80CuqzCzT5Eip7HLVN65jc",
  authDomain: "edp82-2653d.firebaseapp.com",
  databaseURL: "https://edp82-2653d-default-rtdb.firebaseio.com",
  projectId: "edp82-2653d",
  storageBucket: "edp82-2653d.firebasestorage.app",
  messagingSenderId: "737187621446",
  appId: "1:737187621446:web:c128dd113d7dd438643847",
  measurementId: "G-09LNEQDYEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
const db = getFirestore(app);

export { db };

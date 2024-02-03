import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB26Y6Mgq__1P4gL5oY3t3awXwLpsQsrPQ",
  authDomain: "crud-app-702-913e4.firebaseapp.com",
  projectId: "crud-app-702-913e4",
  storageBucket: "crud-app-702-913e4.appspot.com",
  messagingSenderId: "64759896350",
  appId: "1:64759896350:web:ea60ccaebd68d1d18d110f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

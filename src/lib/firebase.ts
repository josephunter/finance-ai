import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDRy_Sq0RArEYbc0--RuLX9gAta7aOLrVA",
  authDomain: "finance-ai-2e6ef.firebaseapp.com",
  projectId: "finance-ai-2e6ef",
  storageBucket: "finance-ai-2e6ef.firebasestorage.app",
  messagingSenderId: "90162097831",
  appId: "1:90162097831:web:954c94c8f05251cdfdf582",
  measurementId: "G-Q0YELME2MM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
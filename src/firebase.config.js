import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB_W7u68Gp2cyFFfOkg5ZTC3W3YMe9ahBA',
  authDomain: 'petsagram-55fed.firebaseapp.com',
  projectId: 'petsagram-55fed',
  storageBucket: 'petsagram-55fed.appspot.com',
  messagingSenderId: '714002607089',
  appId: '1:714002607089:web:32471c762a44ccb8f33250',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();

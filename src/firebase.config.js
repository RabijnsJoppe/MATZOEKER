import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWyeyg0yYZUxUzuM3s3JPp2WF-7edQIc4",
  authDomain: "matzoeker.firebaseapp.com",
  projectId: "matzoeker",
  storageBucket: "matzoeker.appspot.com",
  messagingSenderId: "722353697346",
  appId: "1:722353697346:web:eb6ac6012ada468e4d33db",
  measurementId: "G-1CTF9P6XP6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBpUiHh9FEOUjITFJ0hRdtoCYFu7QNUDKg",
  authDomain: "householdapp-3202a.firebaseapp.com",
  projectId: "householdapp-3202a",
  storageBucket: "householdapp-3202a.firebasestorage.app",
  messagingSenderId: "961959543894",
  appId: "1:961959543894:web:7a65190741eba47e8f27f7",
  measurementId: "G-5JQ4XCPT7M"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
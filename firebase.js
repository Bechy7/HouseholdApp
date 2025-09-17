// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpUiHh9FEOUjITFJ0hRdtoCYFu7QNUDKg",
  authDomain: "householdapp-3202a.firebaseapp.com",
  projectId: "householdapp-3202a",
  storageBucket: "householdapp-3202a.firebasestorage.app",
  messagingSenderId: "961959543894",
  appId: "1:961959543894:web:7a65190741eba47e8f27f7",
  measurementId: "G-5JQ4XCPT7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF8d9f80h0YegSU1q21QOb37yaLPa0MRI",
  authDomain: "time-tracking-devot.firebaseapp.com",
  projectId: "time-tracking-devot",
  storageBucket: "time-tracking-devot.appspot.com",
  messagingSenderId: "7556892881",
  appId: "1:7556892881:web:523106f5872f58a0ff9df0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

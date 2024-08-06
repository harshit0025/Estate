// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-a3ce2.firebaseapp.com",
  projectId: "realestate-a3ce2",
  storageBucket: "realestate-a3ce2.appspot.com",
  messagingSenderId: "181152670824",
  appId: "1:181152670824:web:901f5a02ce98608c9bc7dd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
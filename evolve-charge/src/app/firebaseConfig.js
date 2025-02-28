// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeTSRqDsFtwqlvyMFMI2GCgLq2j4AMckA",
  authDomain: "evolve-charge-e9889.firebaseapp.com",
  projectId: "evolve-charge-e9889",
  storageBucket: "evolve-charge-e9889.firebasestorage.app",
  messagingSenderId: "884057943130",
  appId: "1:884057943130:web:c5b149b901c31c94d33c63",
  measurementId: "G-8YCRJG86FD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
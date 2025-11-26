import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy, serverTimestamp,where } from "firebase/firestore";

const firebaseConfig = {
 // Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

  apiKey: "AIzaSyDjMq323OJ4NvMJU0rdRTjfi1-ADj9K4Xo",
  authDomain: "evmproject-3a874.firebaseapp.com",
  projectId: "evmproject-3a874",
  storageBucket: "evmproject-3a874.firebasestorage.app",
  messagingSenderId: "10615477842",
  appId: "1:10615477842:web:a86f1ed7374c1727acf18b",
  measurementId: "G-PHERCHSLQX"
};




const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp, where }
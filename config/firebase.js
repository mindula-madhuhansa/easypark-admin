import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "easypark-cc6dd.firebaseapp.com",
  projectId: "easypark-cc6dd",
  storageBucket: "easypark-cc6dd.appspot.com",
  messagingSenderId: "940835881102",
  appId: "1:940835881102:web:90e67bed46875e46dec9df",
  measurementId: "G-NP0W8K29L8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

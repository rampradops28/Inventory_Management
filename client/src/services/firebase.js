import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "lendify-web",
  storageBucket: "lendify-web.firebasestorage.app",
  messagingSenderId: "554425285421",
  appId: "1:554425285421:web:9c353b5a15acabccdcb1a4",
  measurementId: "G-1X5ZP4357E",
};

export const app = initializeApp(firebaseConfig);

import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: "trekbuddy-72b01.firebaseapp.com",
  projectId: "trekbuddy-72b01",
  storageBucket: "trekbuddy-72b01.firebasestorage.app",
  messagingSenderId: "512827597054",
  appId: "1:512827597054:web:a01e3ff2f07534446c85af",
  measurementId: "G-ZJQ3YQ287N"
};

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


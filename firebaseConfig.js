import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqyUcfTz-MqujW6-P8auTKk2DeHwOdzVo",
  authDomain: "sidec-8de34.firebaseapp.com",
  projectId: "sidec-8de34",
  storageBucket: "sidec-8de34.firebasestorage.app",
  messagingSenderId: "962136101295",
  appId: "1:962136101295:web:c6355c0555137eb2e39f5a",
  measurementId: "G-8C1DD2F04J"
};

let app;
let auth;
let firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  firestore = getFirestore(app);
} else {
  app = getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
}

export { auth, firestore };

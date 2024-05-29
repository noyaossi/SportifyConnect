import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from './firebaseConfig'; // Import your firebaseConfig

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Function to register a new user
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Function to login a user
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Function to logout a user
export const logoutUser = () => {
  return signOut(auth);
};

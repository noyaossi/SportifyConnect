// firebase/auth.js
import { initializeApp, getApps } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from './firebaseConfig'; 

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Function to register a new user
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Function to login a user
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Function to logout a user
export const logoutUser = () => {
  return signOut(auth);
};

// Function to check login status
export const checkLoginStatus = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); 
      resolve(user);
    }, reject);
  });
};
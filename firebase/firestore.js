// firebase/firestore.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const firestore = getFirestore(app);

// Function to add a new event
export const addEvent = async (event) => {
  try {
    const docRef = await addDoc(collection(firestore, 'events'), event);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

export default firestore;

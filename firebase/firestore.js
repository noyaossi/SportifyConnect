// firebase/firestore.js

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
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

// Function to add a new user
export const addUser = async (uid, user) => {
  try {
    await setDoc(doc(firestore, 'users', uid), user);
  } catch (e) {
    console.error('Error adding user: ', e);
    throw e;
  }
};

// Function to get user details
export const getUser = async (uid) => {
  try {
    const docRef = doc(firestore, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('No such user!');
    }
  } catch (e) {
    console.error('Error fetching user: ', e);
    throw e;
  }
};

export const updateUser = async (uid, userDetails) => {
  try {
    await updateDoc(doc(firestore, 'users', uid), userDetails);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Function to fetch events data from Firestore
export const getEvents = async () => {
  try {
    const eventsCollection = collection(firestore, 'events');
    const eventsSnapshot = await getDocs(eventsCollection);
    const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return eventsData;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Function to register for an event
export const registerForEvent = async (userId, eventId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error('User does not exist');
    }
    
    const userData = userSnap.data();
    const registeredEvents = userData.registeredEvents || [];
    registeredEvents.push(eventId);

    await updateDoc(userRef, { registeredEvents });
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

// Function to get registered events for a user
export const getRegisteredEvents = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error('User does not exist');
    }

    const userData = userSnap.data();
    const registeredEventIds = userData.registeredEvents || [];


    if (registeredEventIds.length > 0) {
      const eventsCollection = collection(firestore, 'events');
      const q = query(eventsCollection, where('_name_', 'in', registeredEventIds));
      const eventsSnapshot = await getDocs(q);
      const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return eventsData;
    } else {
      // Handle the case where registeredEventIds is empty
      // Option 1: Return an empty array
      return [];
    }
  } catch (error) {
    console.error('Error fetching registered events:', error);
    throw error;
  }
};

export default firestore;
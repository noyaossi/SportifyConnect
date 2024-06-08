// firebase/firestore.js

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
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
      const userData = docSnap.data();
      return userData;
    } else {
      throw new Error('No such user!');
    }
  } catch (e) {
    console.error('Error fetching user: ', e);
    throw e;
  }
};

// Function to update a user
export const updateUser = async (updatedUser) => {
  try {
    await updateDoc(doc(firestore, 'users',  updatedUser.uid), updatedUser);
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

// Function to fetch a single event by ID
export const getEvent = async (eventId) => {
  try {
    console.log(`Fetching event with ID: ${eventId}`);
    const eventDoc = await getDoc(doc(firestore, 'events', eventId));
    if (eventDoc.exists()) {
      console.log(`Event found: ${JSON.stringify(eventDoc.data())}`);
      return { id: eventDoc.id, ...eventDoc.data() };
    } else {
      throw new Error('Event not found');
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// Function to update an event
export const updateEvent = async (eventId, eventDetails) => {
  try {
    await updateDoc(doc(firestore, 'events', eventId), eventDetails);
  } catch (error) {
    console.error('Error updating event:', error);
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
    if (!registeredEvents.includes(eventId)) {
      registeredEvents.push(eventId);
      await updateDoc(userRef, { registeredEvents });
    } else {
      throw new Error('User already registered for this event');
    }
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

// Function to register for an event
export const createNewEvent = async (userId, eventId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error('User does not exist');
    }
    
    const userData = userSnap.data();
    const createdEvents = userData.createdEvents || [];
    if (!createdEvents.includes(eventId)) {
      createdEvents.push(eventId);
      await updateDoc(userRef, { createdEvents });
    } else {
      throw new Error('Can not create new event');
    }
  } catch (error) {
    console.error('Error for create event:', error);
    throw error;
  }
};

// Function to unregister from an event
export const unregisterForEvent = async (userId, eventId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error('User does not exist');
    }
    
    const userData = userSnap.data();
    const registeredEvents = userData.registeredEvents || [];
    
    if (registeredEvents.includes(eventId)) {
      const updatedEvents = registeredEvents.filter(id => id !== eventId);
      await updateDoc(userRef, { registeredEvents: updatedEvents });
    } else {
      throw new Error('User not registered for this event');
    }
  } catch (error) {
    console.error('Error unregistering for event:', error);
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
      const eventsPromises = registeredEventIds.map(async (eventId) => {
        const eventDoc = await getDoc(doc(firestore, 'events', eventId));
        return { id: eventDoc.id, ...eventDoc.data() };
      });
      const registeredEvents = await Promise.all(eventsPromises);
      return registeredEvents;
    } else {
      // Return an empty array if no registered events
      return [];
    }
  } catch (error) {
    console.error('Error fetching registered events:', error);
    throw error;
  }
};

// Function to get created events by user
export const getCreatedEvents = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error('User does not exist');
    }
    const userData = userSnap.data();
    const createdEventsIds = userData.createdEvents || [];
    if (createdEventsIds.length > 0) {
      const eventsPromises = createdEventsIds.map(async (eventId) => {
        const eventDoc = await getDoc(doc(firestore, 'events', eventId));
        return { id: eventDoc.id, ...eventDoc.data() };
      });
      const createdEvents = await Promise.all(eventsPromises);
      return createdEvents;
    } else {
      // Return an empty array if no created new events
      return [];
    }
  } catch (error) {
    console.error('Error fetching created events:', error);
    throw error;
  }
};

// Add a new function to delete an event
export const handleDeleteEvent = async (eventId, userId) => {
  try {
    await deleteDoc(doc(firestore, 'events', eventId));
    console.log('Event deleted successfully!');
     // Fetch the user document
     const userRef = doc(firestore, 'users', userId);
     const userSnap = await getDoc(userRef);
 
     if (userSnap.exists()) {
       const userData = userSnap.data();
       const createdEvents = userData.createdEvents || [];
 
       // Remove the deleted event from the createdEvents list
       const updatedEvents = createdEvents.filter(id => id !== eventId);
       await updateDoc(userRef, { createdEvents: updatedEvents });
     } else {
       throw new Error('User not found');
     }


  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export default firestore;
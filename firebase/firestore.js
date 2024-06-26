// firebase/firestore.js

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
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
export const updateUser = async (uid,updatedUser) => {
  try {
    const userRef = doc(firestore, 'users', uid);
    await updateDoc(userRef, updatedUser);
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
    const eventDoc = await getDoc(doc(firestore, 'events', eventId));
    if (eventDoc.exists()) {
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
    const eventRef = doc(firestore, 'events', eventId);

    const [userSnap, eventSnap] = await Promise.all([getDoc(userRef), getDoc(eventRef)]);

    if (!userSnap.exists()) throw new Error('User does not exist');
    if (!eventSnap.exists()) throw new Error('Event does not exist');
    
    const userData = userSnap.data();
    const eventData = eventSnap.data();

    const registeredEvents = userData.registeredEvents || [];
    const registeredUsers = eventData.registeredUsers || [];

    if (!registeredEvents.includes(eventId)) {
      registeredEvents.push(eventId);
      await updateDoc(userRef, { registeredEvents });
    }
    if (!registeredUsers.includes(userId)) {
      registeredUsers.push(userId);
      await updateDoc(eventRef, { registeredUsers });
    }
    else {
      throw new Error('User already registered for this event');
    }
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

// Function to create a new event
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
    console.error('Error creating event:', error);
    throw error;
  }
};

// Function to unregister from an event
export const unregisterForEvent = async (userId, eventId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const eventRef = doc(firestore, 'events', eventId);

    // Get both user and event data
    const [userSnap, eventSnap] = await Promise.all([getDoc(userRef), getDoc(eventRef)]);

    if (!userSnap.exists()) {
      throw new Error('User does not exist');
    }

    if (!eventSnap.exists()) {
      throw new Error('Event does not exist');
    }

    const userData = userSnap.data();
    const eventData = eventSnap.data();

    const registeredEvents = userData.registeredEvents || [];
    const registeredUsers = eventData.registeredUsers || [];

    if (!registeredEvents.includes(eventId)) {
      throw new Error('User not registered for this event');
    }

    const updatedUserEvents = registeredEvents.filter(id => id !== eventId);

    const updatedEventUsers = registeredUsers.filter(id => id !== userId);

    await Promise.all([
      updateDoc(userRef, { registeredEvents: updatedUserEvents }),
      updateDoc(eventRef, { registeredUsers: updatedEventUsers })
    ]);

    console.log('Successfully unregistered user from event');

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
      return [];
    }
  } catch (error) {
    console.error('Error fetching created events:', error);
    throw error;
  }
};

// Function to delete an event and update registered users
export const handleDeleteEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(firestore, 'events', eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) throw new Error('Event does not exist');
    
    const eventData = eventSnap.data();
    const registeredUsers = eventData.registeredUsers || [];

    await deleteDoc(eventRef);
    console.log('Event deleted successfully!');

    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
 
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const createdEvents = userData.createdEvents || [];
      const updatedCreatedEvents = createdEvents.filter(id => id !== eventId);
      await updateDoc(userRef, { createdEvents: updatedCreatedEvents });
    } else {
      throw new Error('User not found');
    }

    await Promise.all(registeredUsers.map(async (user) => {
      const userRef = doc(firestore, 'users', user);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const registeredEvents = userData.registeredEvents || [];
        const updatedRegisteredEvents = registeredEvents.filter(id => id !== eventId);
        await updateDoc(userRef, { registeredEvents: updatedRegisteredEvents });
      }
    }));
    
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Function to check if a user is registered for an event
export const isUserRegisteredForEvent = async (userId, eventId) => {
  try {
    const eventRef = doc(firestore, 'events', eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      throw new Error('Event does not exist');
    }

    const eventData = eventSnap.data();
    const registeredUsers = eventData.registeredUsers || [];

    return registeredUsers.includes(userId);
  } catch (error) {
    console.error('Error checking user registration:', error);
    throw error;
  }
};


export default firestore;
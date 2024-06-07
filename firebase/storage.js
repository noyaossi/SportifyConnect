// firebase/storage.js

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

export const uploadImageToStorage = async (imageUri) => {
  if (!imageUri) return null;

  try {
    console.log('Uploading image from URI:', imageUri);

    // Create a blob from the local file
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create a unique file name for the image using a timestamp
    const fileName = `profilePictures/${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    // Upload the file to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, blob);
    console.log('Image uploaded to Firebase Storage at path:', uploadResult.metadata.fullPath);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadImage = async (uri) => {
  if (!uri) return null;

  try {
    console.log('Uploading image from URI:', uri);

    // Create a blob from the local file
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a unique file name for the image using a timestamp
    const fileName = `images/${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    // Upload the file to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, blob);
    console.log('Image uploaded to Firebase Storage at path:', uploadResult.metadata.fullPath);

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

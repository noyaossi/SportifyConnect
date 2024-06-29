// database.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = '@user_profile_';

export const initDB = async () => {
  console.log('AsyncStorage ready to use');
};

export const saveUserProfile = async (userId, userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(`${USER_PROFILE_KEY}${userId}`, jsonValue);
    console.log('User profile saved successfully');
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${USER_PROFILE_KEY}${userId}`);
    if (jsonValue !== null) {
      console.log('User profile retrieved successfully');
      return JSON.parse(jsonValue);
    }
    console.log('No user profile found');
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const clearUserProfile = async (userId) => {
  try {
    await AsyncStorage.removeItem(`${USER_PROFILE_KEY}${userId}`);
    console.log('User profile cleared successfully');
  } catch (error) {
    console.error('Error clearing user profile:', error);
    throw error;
  }
};
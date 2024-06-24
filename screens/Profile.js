// screens/Profile.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl, ImageBackground } from 'react-native';
import { logoutUser, checkLoginStatus  } from '../firebase/auth';
import { getUser, updateUser  } from '../firebase/firestore';
import BottomNavigationBar from '../components/BottomNavigationBar';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { uploadImageToStorage } from '../firebase/storage'; // Import uploadImageToStorage function
import commonStyles from '../styles/styles'; // Import common styles
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import db, {setupDatabase} from '../services/DatabaseService';



const Profile = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [newProfilePicture, setNewProfilePicture] = useState(null); // New state for storing the selected picture
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setupDatabase(); //Initialize the SQLite db
    fetchUserDetails();
  }, []);

    const fetchUserDetails = async () => {
      setIsRefreshing(true);

      try {
        const user = await checkLoginStatus();
        if (user) {
          const details = await getUser(user.uid);
          setUserDetails(details);
          setUpdatedDetails(details); // Initialize updatedDetails with current user details

        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);

      }
    };


// Function to handle the selection of a new profile picture
const pickNewProfilePicture = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('New profile picture picked:', result.assets[0].uri);
      setNewProfilePicture(result.assets[0].uri);
    }
  } catch (error) {
    console.error('Error accessing gallery:', error);
  }
};

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
// Function to handle saving changes
const handleSave = async () => {
  try {
    const user = await checkLoginStatus();
    if (user) {
      const updatedUserDetails = { ...userDetails }; // Clone the userDetails object
      if (newProfilePicture) {
        console.log('Uploading new profile picture...');
        const profilePictureUrl = await uploadImageToStorage(newProfilePicture);
        updatedUserDetails.profilepicture = profilePictureUrl; // Update the profile picture URL
        setNewProfilePicture(null); // Clear the selected picture
      }

      // Update other details if they have changed
      Object.keys(updatedDetails).forEach(key => {
        if (updatedDetails[key] !== userDetails[key]) {
          updatedUserDetails[key] = updatedDetails[key];
        }
      });

      await updateUser(user.uid, updatedUserDetails);
      setUserDetails(updatedUserDetails);
      setIsEditing(false);
      console.log('Profile updated successfully!');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};
const handleRefresh = () => {
  fetchUserDetails();
};

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        {userDetails ? (
          <View style={styles.profileContainer}>
            <ImageBackground source={{ uri: userDetails.profilepicture || 'https://via.placeholder.com/150' }} style={styles.profileImageBackground} imageStyle={styles.profileImageBackgroundImage}>
              {isEditing && (
                <TouchableOpacity style={styles.profileImageEditButton} onPress={pickNewProfilePicture}>
                  <Ionicons name="camera" size={24} color="white" />
                </TouchableOpacity>
              )}
            </ImageBackground>
            {isEditing ? (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>First Name:</Text>
                  <TextInput
                    style={styles.input}
                    value={updatedDetails.firstname}
                    onChangeText={(text) => setUpdatedDetails({ ...updatedDetails, firstname: text })}
                  />
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Last Name:</Text>
                  <TextInput
                    style={styles.input}
                    value={updatedDetails.lastname}
                    onChangeText={(text) => setUpdatedDetails({ ...updatedDetails, lastname: text })}
                  />
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Email:</Text>
                  <TextInput
                    style={styles.input}
                    value={updatedDetails.email}
                    onChangeText={(text) => setUpdatedDetails({ ...updatedDetails, email: text })}
                  />
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Mobile Number:</Text>
                  <TextInput
                    style={styles.input}
                    value={updatedDetails.mobilenumber}
                    onChangeText={(text) => setUpdatedDetails({ ...updatedDetails, mobilenumber: text })}
                  />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>First Name:</Text>
                  <Text style={styles.value}>{userDetails.firstname}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Last Name:</Text>
                  <Text style={styles.value}>{userDetails.lastname}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{userDetails.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Mobile Number:</Text>
                  <Text style={styles.value}>{userDetails.mobilenumber}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.errorText}>No user details found.</Text>
        )}
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  profileImageBackground: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
  },
  profileImageBackgroundImage: {
    resizeMode: 'cover',
  },
  profileImageEditButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '90%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    width: 120,
  },
  value: {
    fontSize: 18,
    color: '#888',
    flex: 1,
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    flex: 1,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});

export default Profile;
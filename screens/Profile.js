import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, ImageBackground } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getUser, updateUser } from '../firebase/firestore';
import ImagePickerComponent from '../components/ImagePickerComponent';
import BottomNavigationBar from '../components/BottomNavigationBar'; // Import BottomNavigationBar
import commonStyles from '../styles/styles';
import db, {setupDatabase} from '../services/DatabaseService';

const Profile = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

    const fetchUserDetails = async () => {
      setIsRefreshing(true);

      try {
        const data = await getUser(currentUser.uid);
        setUserData(data);
        setProfilePicture(data.profilepicture);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);

      }
    };

    const handleUpdate = async () => {
      try {
        const updatedUser = {
          ...userData,
          profilepicture: profilePicture,
        };
        await updateUser(currentUser.uid, updatedUser);
        Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
        setEditing(false);
      } catch (error) {
        console.error('Error updating user data:', error);
        Alert.alert('Update Failed', 'Failed to update profile. Please try again.');
      }
    };
  





  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/images/backgroundlogin.jpg')} style={commonStyles.profileBackgroundImage}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text style={commonStyles.title}>
              {editing ? 'Edit Profile' : `${userData.firstname} ${userData.lastname}`}
            </Text>
            <View style={styles.imageContainer}>
              {profilePicture && !editing && <Image source={{ uri: profilePicture }} style={styles.profileImage} />}
              {editing && (
                <ImagePickerComponent initialImage={profilePicture} onImagePicked={setProfilePicture} buttonText="Change Profile Picture" />
              )}
            </View>
            {editing ? (
              <>
                <TextInput
                  style={commonStyles.input}
                  placeholder="First Name"
                  value={userData.firstname}
                  onChangeText={(text) => setUserData({ ...userData, firstname: text })}
                />
                <TextInput
                  style={commonStyles.input}
                  placeholder="Last Name"
                  value={userData.lastname}
                  onChangeText={(text) => setUserData({ ...userData, lastname: text })}
                />
                <TextInput
                  style={commonStyles.input}
                  placeholder="Email"
                  value={userData.email}
                  onChangeText={(text) => setUserData({ ...userData, email: text })}
                />
                <TextInput
                  style={commonStyles.input}
                  placeholder="Mobile Number"
                  value={userData.mobilenumber}
                  onChangeText={(text) => setUserData({ ...userData, mobilenumber: text })}
                />
                <TouchableOpacity style={commonStyles.button} onPress={handleUpdate}>
                  <Text style={commonStyles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={commonStyles.button} onPress={() => setEditing(false)}>
                  <Text style={commonStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>First Name: {userData.firstname}</Text>
                <Text style={styles.label}>Last Name: {userData.lastname}</Text>
                <Text style={styles.label}>Email: {userData.email}</Text>
                <Text style={styles.label}>Mobile Number: {userData.mobilenumber}</Text>
                <TouchableOpacity style={commonStyles.button} onPress={() => setEditing(true)}>
                  <Text style={commonStyles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={commonStyles.button} onPress={handleLogout}>
              <Text style={commonStyles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150, // Increased size
    height: 150, // Increased size
    borderRadius: 75, // Adjust border radius for a round image
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Profile;
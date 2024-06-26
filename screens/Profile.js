// screens/Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getUser, updateUser } from '../firebase/firestore';
import ImagePickerComponent from '../components/ImagePickerComponent';
import commonStyles from '../styles/styles';
import db, {setupDatabase} from '../services/DatabaseService';
import ScreenContainer from '../components/ScreenContainer';

const Profile = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true); 

    const fetchUserData = async () => {
      try {
        const data = await getUser(currentUser.uid);
        setUserData(data);
        setProfilePicture(data.profilepicture);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchUserData();
    }, [currentUser]);

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
    <ScreenContainer loading={loading} onRefresh={fetchUserData} navigation={navigation}>
      <View style={commonStyles.container}>
        {userData ? (
          <>
            <Text style={commonStyles.title}>
              {editing ? 'Edit Profile' : `${userData.firstname} ${userData.lastname}`}
            </Text>
            <View style={commonStyles.imageContainer}>
              {profilePicture && !editing && <Image source={{ uri: profilePicture }} style={commonStyles.profileImage} />}
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
                <Text style={commonStyles.label}>First Name: {userData.firstname}</Text>
                <Text style={commonStyles.label}>Last Name: {userData.lastname}</Text>
                <Text style={commonStyles.label}>Email: {userData.email}</Text>
                <Text style={commonStyles.label}>Mobile Number: {userData.mobilenumber}</Text>
                <TouchableOpacity style={commonStyles.button} onPress={() => setEditing(true)}>
                  <Text style={commonStyles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={commonStyles.button} onPress={handleLogout}>
              <Text style={commonStyles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </ScreenContainer>
  );
};

export default Profile;
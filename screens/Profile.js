// screens/Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getUser, updateUser } from '../firebase/firestore';
import ImagePickerComponent from '../components/ImagePickerComponent';
import commonStyles from '../styles/styles';
import ScreenContainer from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';

const Profile = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true); 

    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
      return;
      }
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
      if (!currentUser) return;
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
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {userData ? (
          <>
            <View style={styles.imageContainer}>
              {profilePicture && !editing && (
                <Image source={{ uri: profilePicture }} style={styles.profileImage} />
              )}
              {editing && (
                <ImagePickerComponent
                  initialImage={profilePicture}
                  onImagePicked={setProfilePicture}
                  buttonText="Change Profile Picture"
                />
              )}
            </View>
            <Text style={styles.header}>
              {editing ? 'Edit Profile' : `${userData.firstname} ${userData.lastname}`}
            </Text>
            {editing ? (
              <>
                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={24} color="#8A2BE2" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#A9A9A9"
                    value={userData.firstname}
                    onChangeText={(text) => setUserData({ ...userData, firstname: text })}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={24} color="#8A2BE2" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#A9A9A9"
                    value={userData.lastname}
                    onChangeText={(text) => setUserData({ ...userData, lastname: text })}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={24} color="#8A2BE2" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#A9A9A9"
                    value={userData.email}
                    onChangeText={(text) => setUserData({ ...userData, email: text })}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="call" size={24} color="#8A2BE2" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#A9A9A9"
                    value={userData.mobilenumber}
                    onChangeText={(text) => setUserData({ ...userData, mobilenumber: text })}
                  />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setEditing(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.infoContainer}>
                  <Ionicons name="person" size={24} color="#8A2BE2" style={styles.icon} />
                  <Text style={styles.infoText}>First Name: {userData.firstname}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Ionicons name="person" size={24} color="#8A2BE2" style={styles.icon} />
                  <Text style={styles.infoText}>Last Name: {userData.lastname}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Ionicons name="mail" size={24} color="#8A2BE2" style={styles.icon} />
                  <Text style={styles.infoText}>Email: {userData.email}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Ionicons name="call" size={24} color="#8A2BE2" style={styles.icon} />
                  <Text style={styles.infoText}>Mobile Number: {userData.mobilenumber}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
                  <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8A2BE2',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    //backgroundColor: 'white',
    //borderRadius: 10,
    paddingHorizontal: 10,
    //paddingVertical: 15,
    //elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#D8BFD8',
  },
  logoutButton: {
    backgroundColor: 'darkblue',
  },
});

export default Profile;
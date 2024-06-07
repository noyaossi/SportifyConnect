// screens/Profile.js

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Image   } from 'react-native';
import { logoutUser, checkLoginStatus  } from '../firebase/auth';
import { getUser, updateUser  } from '../firebase/firestore';
import BottomNavigationBar from '../components/BottomNavigationBar';


const Profile = ({ navigation }) => {
  {/* Include the bottom navigation bar */}
  <BottomNavigationBar navigation={navigation} />
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await checkLoginStatus();
        if (user) {
          const details = await getUser(user.uid);
          setUserDetails(details);
          setUpdatedDetails(details); // Initialize updatedDetails with user details
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigation]);

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

  const handleSave = async () => {
    try {
      const user = await checkLoginStatus();
      if (user) {
        await updateUser(user.uid, updatedDetails);
        setUserDetails(updatedDetails);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userDetails ? (
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: userDetails.profilepicture || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
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
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={() => setIsEditing(false)} />
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
              <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
            </>
          )}
          <Button title="Logout" onPress={handleLogout} style={styles.logoutButton} />
        </View>
      ) : (
        <Text style={styles.errorText}>No user details found.</Text>
      )}
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
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    fontSize: 18,
    color: '#888',
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    flex: 1,
  },
  logoutButton: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default Profile;
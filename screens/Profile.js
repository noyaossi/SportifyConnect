// screens/Profile.js

import React from 'react';
import { View, Text, Button } from 'react-native';
import { logoutUser } from '../firebase/auth';
import BottomNavigationBar from '../components/BottomNavigationBar';


const Profile = ({ navigation }) => {
  {/* Include the bottom navigation bar */}
  <BottomNavigationBar navigation={navigation} />
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

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Profile;
// components/BottomNavigationBar.js

import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const BottomNavigationBar = () => {
  const navigation = useNavigation();

  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
       <TouchableOpacity onPress={() => handleNavigate('Profile')}>
        <Image source={require('../assets/images/profile.jpg')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigate('Homepage')}>
        <Image source={require('../assets/images/home.jpg')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigate('Events')}>
        <Image source={require('../assets/images/events.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'absolute', // Position the bar at the bottom
    bottom: 0, // Align it to the bottom of the screen
    width: '100%', // Take up the full width
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1, // Add a border at the top
    borderTopColor: '#ccc', // Border color
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default BottomNavigationBar;
// screens/Register.js

import React, { useState, useEffect  } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, ImageBackground    } from 'react-native';
import { registerUser } from '../firebase/auth'; // Import registerUser from firebase/auth
import { addUser, updateUser  } from '../firebase/firestore'; // Import addUser from firebase/firestore
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToStorage } from '../firebase/storage'; // Import the uploadImageToStorage function
import commonStyles from '../styles/styles'; // Import common styles



const Register = ({ navigation }) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [profilepicture, setProfilePicture] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);


  const handleRegister = async () => {
    try {
      const userCredential = await registerUser(email, password);
      const user = userCredential.user;
      let profilePictureUrl = '';

      if (profilepicture) {
        //console.log('Uploading profile picture...');
        profilePictureUrl = await uploadImageToStorage(profilepicture);
        //console.log('Profile picture URL:', profilePictureUrl);
      }

      const userDetails = {
        firstname,
        lastname,
        email,
        mobilenumber,
        profilepicture: profilePictureUrl,
      };

      //console.log('User details to save:', userDetails);
      await addUser(user.uid, userDetails);
      Alert.alert('Registration Successful', `Welcome ${user.email}`);
      navigation.navigate('Login');
    } catch (error) {
      const errorMessage = error.message;
      console.error('Error during registration:', error);
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      console.log('Image picked:', result.assets[0].uri);
      setProfilePicture(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground source={require('../assets/images/backgroundlogin.jpg')} style={commonStyles.backgroundImage}>
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Register</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstName}
        autoCapitalize="none"
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={setLastName}
        autoCapitalize="none"
      /><TextInput
      style={commonStyles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    /><TextInput
    style={commonStyles.input}
    placeholder="Mobile Number"
    value={mobilenumber}
    onChangeText={setMobileNumber}
    keyboardType="phone-pad"
    autoCapitalize="none"
  />
      <TextInput
        style={commonStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={commonStyles.button} onPress={pickImage}>
          <Text style={commonStyles.buttonText}>Choose Profile Picture</Text>
        </TouchableOpacity>
      {profilepicture ? (
        <Image source={{ uri: profilepicture }} style={commonStyles.profileImage} />
      ) : null}
      <TouchableOpacity style={commonStyles.button} onPress={handleRegister}>
          <Text style={commonStyles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={commonStyles.buttonText}>Already have an account? Login</Text>
        </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};
export default Register;
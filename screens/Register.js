// screens/Register.js

import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { registerUser } from '../firebase/auth'; // Import registerUser from firebase/auth
import { addUser } from '../firebase/firestore'; // Import addUser from firebase/firestore
import commonStyles from '../styles/styles'; // Import common styles
import ImagePickerComponent from '../components/ImagePickerComponent'; // Import ImagePickerComponent
import { uploadImageToStorage } from '../firebase/storage'; // Import the upload image function
import ScreenContainer from '../components/ScreenContainer';





const Register = ({ navigation }) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [profilepicture, setProfilePicture] = useState('');
  const [error, setError] = useState('');



  const handleRegister = async () => {
    if (!firstname || !lastname || !email || !mobilenumber || !password) {
      Alert.alert(
        'Missing Information',
        'Please fill in all fields',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      return;
    }
    try {
      const userCredential = await registerUser(email, password);
      const user = userCredential.user;
      let profilePictureUrl = '';

      if (profilepicture) {
        profilePictureUrl = await uploadImageToStorage(profilepicture);
      }

      const userDetails = {
        firstname,
        lastname,
        email,
        mobilenumber,
        profilepicture: profilePictureUrl,
      };

      await addUser(user.uid, userDetails);
      Alert.alert('Registration Successful', `Welcome ${user.email}`);
      navigation.navigate('Login');
    } catch (error) {
      const errorMessage = error.message;
      console.error('Error during registration:', error);
      Alert.alert('Registration Failed', errorMessage);
    } 
  };

  return (
    <ScreenContainer loading={false} onRefresh={() => {}} navigation={navigation} hideBottomNav>
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
      <ImagePickerComponent initialImage={profilepicture} onImagePicked={setProfilePicture} buttonText="Choose Profile Picture" />
      <TouchableOpacity style={commonStyles.button} onPress={handleRegister}>
          <Text style={commonStyles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={commonStyles.buttonText}>Already have an account? Login</Text>
        </TouchableOpacity>
        </ScreenContainer>

  );
};
export default Register;
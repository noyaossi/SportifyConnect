// screens/Register.js

import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Alert, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { registerUser } from '../firebase/auth'; 
import { addUser } from '../firebase/firestore'; 
import ImagePickerComponent from '../components/ImagePickerComponent'; 
import { uploadImageToStorage } from '../firebase/storage'; 
import ScreenContainer from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';

const Register = ({ navigation }) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [profilepicture, setProfilePicture] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


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
      navigation.replace('Login');
     } catch (error) {
      const errorMessage = error.message;
      console.log('Error during registration:', error);
      if (errorMessage =="Firebase: Error (auth/email-already-in-use)."){
          Alert.alert('Registration Failed', 'Email already in use');
      } 
      else {Alert.alert('Registration Failed');}
    } 
  };

  return (
    <ScreenContainer loading={false} onRefresh={() => {}} navigation={navigation} hideBottomNav>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
          <Image
              source={require('../assets/images/logo.png')} 
              style={styles.logo}
            />
            <Text style={styles.title}>Register</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={24} color="#8A2BE2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstname}
                onChangeText={setFirstName}
                autoCapitalize="words"
                placeholderTextColor="#A9A9A9"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person" size={24} color="#8A2BE2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastname}
                onChangeText={setLastName}
                autoCapitalize="words"
                placeholderTextColor="#A9A9A9"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={24} color="#8A2BE2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#A9A9A9"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call" size={24} color="#8A2BE2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                value={mobilenumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                autoCapitalize="none"
                placeholderTextColor="#A9A9A9"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={24} color="#8A2BE2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                placeholderTextColor="#A9A9A9"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#8A2BE2" />
              </TouchableOpacity>
            </View>

            <ImagePickerComponent 
              initialImage={profilepicture} 
              onImagePicked={setProfilePicture} 
              buttonText="Choose Profile Picture" 
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.replace('Login')}>
              <Text style={styles.loginButtonText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 20,
    textAlign: 'center',
  },
  logo: {
    width: 400,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    paddingHorizontal: 10,
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
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
  },
});

export default Register;
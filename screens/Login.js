// screens/Login.js

import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { loginUser } from '../firebase/auth';
import commonStyles from '../styles/styles'; // Import common styles

import loginStyle from '../styles/login';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      // Navigate to the homepage upon successful login
      navigation.navigate('Homepage'); // Ensure 'Homepage' matches the screen name in your navigator
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register'); // Navigate to the Register screen
  };

  return (
    <ImageBackground source={require('../assets/images/backgroundlogin.jpg')} style={commonStyles.backgroundImage}>
      <View style={commonStyles.container}>
        <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={commonStyles.input}
        placeholderTextColor="#aaa" // Optional: Change placeholder text color

      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={commonStyles.input}
        placeholderTextColor="#aaa" // Optional: Change placeholder text color
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleLogin}>
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.button} onPress={handleRegister}>
          <Text style={commonStyles.buttonText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
    </View>
    </ImageBackground>
  );
};


export default Login;
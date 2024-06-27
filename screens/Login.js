// screens/Login.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity, ScrollView, Switch, Pressable } from 'react-native';
import { loginUser } from '../firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../styles/styles'; // Import common styles

import loginStyle from '../styles/login';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.log('Failed to load credentials', error);
      }
    };

    loadCredentials();
  }, []);

  const handleLogin = async () => {
    try {
      await loginUser(email, password);

      if (rememberMe) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
      }

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
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
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
        <View style={styles.rememberMeContainer}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
        </View>
        <TouchableOpacity style={commonStyles.button} onPress={handleLogin}>
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={commonStyles.button} onPress={handleRegister}>
          <Text style={commonStyles.buttonText}>Don't have an account? Register</Text>
        </TouchableOpacity>
        {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'white',
  },
});

export default Login;

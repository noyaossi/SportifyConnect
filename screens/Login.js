// screens/Login.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { loginUser } from '../firebase/auth';
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
    //{ flex: 1, alignItems: 'center', justifyContent: 'center' }
    <View style={loginStyle.container}>
     
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        //{ borderWidth: 1, width: 200, marginVertical: 10, padding: 5 }
        style={{ borderWidth: 1, width: 200, marginVertical: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, width: 200, marginVertical: 10, padding: 5 }}
      />
      <TouchableOpacity style={loginStyle.button} onPress={handleLogin}>
        <Text style={loginStyle.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={loginStyle.button} onPress={handleRegister}>
        <Text style={loginStyle.buttonText}>Don't have an account? Register</Text>
      </TouchableOpacity>
      {error ? <Text style={{ color: 'red' }}>{"Error Loging In"}</Text> : null}
    </View>
  );
};


export default Login;
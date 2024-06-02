// screens/Login.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { loginUser } from '../firebase/auth';

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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, width: 200, marginVertical: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, width: 200, marginVertical: 10, padding: 5 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Don't have an account? Register" onPress={handleRegister} /> 
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
    </View>
  );
};


export default Login;
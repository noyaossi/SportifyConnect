// screens/Login.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Switch, Pressable } from 'react-native';
import { loginUser } from '../firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../styles/styles'; // Import common styles
import ScreenContainer from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation2 = useNavigation();
  
  const navigateToHomepage = () => {
    navigation2.navigate('Homepage'); 
  }


  useEffect(() => {
    const loadCredentials = async () => {
      try {
        // if (rememberMe){
            const savedEmail = await AsyncStorage.getItem('email');
            const savedPassword = await AsyncStorage.getItem('password');
            if (savedEmail && savedPassword) {
              setEmail(savedEmail);
              setPassword(savedPassword);
              setRememberMe(true);
            // }
        }
      } catch (error) {
        console.log('Failed to load credentials', error);
      }
    };

    loadCredentials();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        'Missing Information',
        'Please enter both email and password',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
      return;
    }
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
      //navigation.navigate('Homepage');
      navigateToHomepage();
    } catch (error) {
      setError(error.message);
    }
  };
  const handleRegister = () => {
    navigation.navigate('Register'); 
  };

  
  return (
    <ScreenContainer loading={false} onRefresh={() => {}} navigation={navigation} hideBottomNav>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Log In</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={24} color="#8A2BE2" style={styles.icon} />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                placeholderTextColor="#A9A9A9"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={24} color="#8A2BE2" style={styles.icon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholderTextColor="#A9A9A9"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#8A2BE2" />
              </TouchableOpacity>
            </View>
            <View style={styles.rememberMeContainer}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: "#D8BFD8", true: "#8A2BE2" }}
                thumbColor={rememberMe ? "#FFFFFF" : "#f4f3f4"}
              />
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </Card.Content>
        </Card>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#8A2BE2',
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#8A2BE2',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login;


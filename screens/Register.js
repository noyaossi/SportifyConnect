import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { registerUser } from '../firebase/auth'; // Import registerUser from firebase/auth

const Register = ({ navigation }) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [profilepicture, setProfilePicture] = useState('');
  const [error, setError] = useState('');


  const handleRegister = async () => {
    try {
      const userCredential = await registerUser(email, password);
      const user = userCredential.user;
      Alert.alert('Registration Successful', `Welcome ${user.email}`);
      // לאחר הרישום, נווט לעמוד ה-Login
      navigation.navigate('Login');
    } catch (error) {
      const errorMessage = error.message;
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstName}
        keyboardType="first-name"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={setLastName}
        keyboardType="last-name"
        autoCapitalize="none"
      /><TextInput
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    /><TextInput
    style={styles.input}
    placeholder="Mobile Number"
    value={mobilenumber}
    onChangeText={setMobileNumber}
    keyboardType="mobile-number"
    autoCapitalize="none"
  />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Profile Picture"
        value={profilepicture}
        onChangeText={setProfilePicture}
        keyboardType="profile-picture"
        autoCapitalize="none"
      />
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default Register;

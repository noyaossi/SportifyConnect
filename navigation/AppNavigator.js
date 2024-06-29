// navigation/AppNavigator.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homepage from '../screens/Homepage';
import Events from '../screens/Events';
import CreateEvent from '../screens/CreateEvent';
import Profile from '../screens/Profile';
import EditEvent from '../screens/EditEvent';
import Login from '../screens/Login';
import Register from '../screens/Register';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Homepage" component={Homepage} />
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="CreateEvent" component={CreateEvent} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditEvent" component={EditEvent} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

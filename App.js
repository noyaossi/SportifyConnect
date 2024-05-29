import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from './firebase/firebaseConfig'; // Import firebaseConfig

async function initializeFirebase() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Analytics
  if (await isSupported()) {
    getAnalytics(app);
  }
}

function App() {
  React.useEffect(() => {
    initializeFirebase();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default App;

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from './firebase/firebaseConfig';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { checkLoginStatus } from './firebase/auth';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { RefreshProvider } from './contexts/RefreshContext';



async function initializeFirebase() {
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);

    if (await isSupported()) {
      getAnalytics(app);
    }
  }
}

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    initializeFirebase();

    const initializeAuth = async () => {
      try {
        const user = await checkLoginStatus();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <AuthProvider>
      <NavigationContainer>
      <RefreshProvider>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </RefreshProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
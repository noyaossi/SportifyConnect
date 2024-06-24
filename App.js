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
import BottomNavigationBar from './components/BottomNavigationBar'; // Import your BottomNavigationBar component
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { getFirestore } from 'firebase/firestore';



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
  //check the fonts????????????
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }


  return (
    <AuthProvider>
      <NavigationContainer>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        <BottomNavigationBar />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
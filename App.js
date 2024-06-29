import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from './firebase/firebaseConfig';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider and useAuth
import { RefreshProvider } from './contexts/RefreshContext';

async function initializeFirebase() {
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);

    if (await isSupported()) {
      getAnalytics(app);
    }
  }
}

function AppContent() {
  const { currentUser } = useAuth(); // Access currentUser from AuthContext
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    initializeFirebase();
    setIsLoading(false); // Assuming you handle authentication state changes in AuthContext
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RefreshProvider>
        {currentUser ? <AppNavigator /> : <AuthNavigator />}
      </RefreshProvider>
    </NavigationContainer>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

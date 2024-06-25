import React, { useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, ActivityIndicator, ScrollView, ImageBackground  } from 'react-native';
import BottomNavigationBar from './BottomNavigationBar';
import commonStyles from '../styles/styles';



const ScreenContainer = ({ children, onRefresh, loading, navigation}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  return (
    <ImageBackground source={require('../assets/images/backgroundlogin.jpg')} style={styles.backgroundImage}>
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : children}
      </ScrollView>
      <View style={styles.bottomNavContainer}>
          <BottomNavigationBar navigation={navigation} />
        </View>     
         </View>
      </ImageBackground>

  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60, // Ensure enough space for the bottom navigation bar
  },
  bottomNavContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

});

export default ScreenContainer;

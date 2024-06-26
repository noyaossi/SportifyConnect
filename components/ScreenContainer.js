// components/ScreenContainer.js
import React from 'react';
import { View, ActivityIndicator, RefreshControl, ScrollView, ImageBackground} from 'react-native';
import BottomNavigationBar from '../components/BottomNavigationBar';
import commonStyles from '../styles/styles';

const ScreenContainer = ({ children, loading, onRefresh, navigation }) => {
  return (
    <ImageBackground source={require('../assets/images/backgroundlogin.jpg')} style={commonStyles.backgroundImage}>
      <ScrollView
        contentContainerStyle={commonStyles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          children
        )}
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </ImageBackground>
  );
};

export default ScreenContainer;

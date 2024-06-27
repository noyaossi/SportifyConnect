// components/ScreenContainer.js
import React from 'react';
import { View, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import BottomNavigationBar from '../components/BottomNavigationBar';
import commonStyles from '../styles/styles';

const ScreenContainer = ({ children, loading, onRefresh, navigation, hideBottomNav }) => {
  return (
    <View style={commonStyles.fullScreenContainer}>
      <ScrollView
        contentContainerStyle={commonStyles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" />
        ) : (
          children
        )}
      </ScrollView>
      {!hideBottomNav && <BottomNavigationBar navigation={navigation} />}
    </View>
  );
};

export default ScreenContainer;
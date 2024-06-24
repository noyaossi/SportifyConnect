import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, ActivityIndicator, View } from 'react-native';

const ScreenContainer = ({ children, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await onRefresh();
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        children
      )}
    </ScrollView>
  );
};

export default ScreenContainer;

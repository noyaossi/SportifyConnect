// screens/Homepage.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const Homepage = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Homepage Screen</Text>
      <Button
        title="Go to Events"
        onPress={() => navigation.navigate('Events')}
      />
    </View>
  );
};

export default Homepage;



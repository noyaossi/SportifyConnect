// screens/Events.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const Events = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Events Screen</Text>
      <Button
        title="Go to Create Event"
        onPress={() => navigation.navigate('CreateEvent')}
      />
    </View>
  );
};

export default Events;

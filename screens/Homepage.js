import React from 'react';
import { View} from 'react-native';
import BottomNavigationBar from '../components/BottomNavigationBar'; // Import the BottomNavigationBar component

const Homepage = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Include the bottom navigation bar and pass down the navigation prop */}
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

export default Homepage;

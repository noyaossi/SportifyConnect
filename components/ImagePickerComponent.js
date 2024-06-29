// components/ImagePickerComponent.js

import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = ({ initialImage, onImagePicked, buttonText }) => {
  const [image, setImage] = useState(initialImage);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      onImagePicked(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150, // Increased size
    height: 150, // Increased size
    borderRadius: 75, // Adjust border radius for a round image
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'darkblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 7,
    width: '65%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
});

export default ImagePickerComponent;

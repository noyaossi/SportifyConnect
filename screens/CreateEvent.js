// screens/CreateEvent.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addEvent, createNewEvent } from '../firebase/firestore';
import { uploadImage } from '../firebase/storage';
import { useAuth } from '../contexts/AuthContext'; // Import AuthContext to get current user
import commonStyles from '../styles/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';


const CreateEvent = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [sportType, setSportType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [participants, setParticipants] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState('');
  const { currentUser } = useAuth(); // Get the current user from AuthContext

  const sportOptions = ['Basketball', 'Football', 'Tennis', 'Volleyball', 'Running', 'Cycling', 'Footvolley', 'Handball'];



  const getGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant permission to access the photo library.');
    }
  };

  useEffect(() => {
    getGalleryPermission();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      //console.log('Image picked:', result.assets[0].uri);
      setPicture(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      //console.log('Photo taken:', result.assets[0].uri);
      setPicture(result.assets[0].uri);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const handleSubmit = async () => {
    try {
      // Validate that all fields are filled
    if (!eventName || !sportType || !location || !date || !time || !participants || !description || !picture) {
      setError('All fields are required.');
      return;
    }
      //console.log('Submitting event:', eventName, sportType, location, date, participants, description);

      let pictureUrl = null;
      if (picture) {
        //console.log('Uploading image...');
        pictureUrl = await uploadImage(picture);
        //console.log('Image uploaded, URL:', pictureUrl);
      }

      const newEvent = {
        eventName,
        sportType,
        location,
        date: date.toISOString(),
        time: time.toISOString().split('T')[1].split('.')[0], // Save time in HH:MM:SS format
        participants: Number(participants),
        description,
        picture: pictureUrl,
      };

      //console.log('New event object:', newEvent);

      const eventId = await addEvent(newEvent);
      await createNewEvent(currentUser.uid, eventId); // create new event 

      //console.log('Event created with ID:', eventId);
      // Submit the form (you can add your form submission logic here)
    Alert.alert('Event Created', 'Your event has been created successfully.');
      navigation.navigate('Events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/images/backgroundlogin.jpg')} style={commonStyles.backgroundImage}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Create New Event:</Text>
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={eventName}
          onChangeText={setEventName}
        />
        <Text style={styles.label}>Sport Type</Text>
          <View style={styles.pickerContainer}>
            {sportOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.pickerItem}
                onPress={() => setSportType(option)}
              >
                <Text style={styles.pickerItemText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.selectedSportType}>{sportType}</Text>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateInput}>
            <Text style={styles.dateText}>{time.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        <TextInput
          style={styles.input}
          placeholder="Number Of Participants"
          keyboardType="number-pad"
          value={participants}
          onChangeText={setParticipants}
        />
        <TextInput
          style={styles.input}
          placeholder="Event Description"
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.uploadPictureContainer}>
          {picture && <Image source={{ uri: picture }} style={styles.image} />}
          <Button title="Select from Gallery" onPress={pickImage} />
          <Button title="Take a Photo" onPress={takePhoto} />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Add padding to the bottom to ensure buttons are not covered
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 5,
  },
  pickerItem: {
    padding: 8,
  },
  pickerItemText: {
    fontSize: 16,
  },
  selectedSportType: {
    fontSize: 16,
    marginBottom: 12,
    color: 'gray',
    textAlign: 'center',
  },
  dateInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    justifyContent: 'center',
    paddingLeft: 8,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
  },
  uploadPictureContainer: {
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default CreateEvent;
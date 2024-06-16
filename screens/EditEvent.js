// screens/EditEvent.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView, TouchableOpacity   } from 'react-native';
import { getEvent, updateEvent, handleDeleteEvent } from '../firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { checkLoginStatus } from '../firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../contexts/AuthContext'; // Import AuthContext to get current user
import commonStyles from '../styles/styles';

const EditEvent = ({ route, navigation }) => {
  const { eventId } = route.params;
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
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const event = await getEvent(eventId);
        setEventName(event.eventName);
        setSportType(event.sportType);
        setLocation(event.location);
        setDate(new Date(event.date));
        const [hours, minutes] = event.time.split(':');
        const eventTime = new Date();
        eventTime.setHours(hours, minutes);
        setTime(eventTime);
        setParticipants(event.participants.toString());
        setDescription(event.description);
        setPicture(event.picture);
      } catch (error) {
        console.error('Error fetching event details:', error);
        Alert.alert('Error', 'Failed to fetch event details.');
      }
    };


    fetchEventDetails();
  }, [eventId]);

  const getGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant permission to access the photo library.');
    }
  };
  useEffect(() => {
    getGalleryPermission();
  }, []);
 
  const handleSave = async () => {
    try {
      setLoading(true);

      await updateEvent(eventId, eventDetails);
      alert('Event updated successfully!');
      navigation.goBack();
    } catch (error) {
      setLoading(false);

      console.error('Error updating event:', error);
      alert('Error updating event.');
    }
  };

  const handleDelete = async () => {
    try {
      const user = await checkLoginStatus();
      if (user) {
        await handleDeleteEvent(eventId, user.uid);
        alert('Event deleted successfully!');
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        throw new Error('User not logged in');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Add a new function to handle image picking
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

  const handleUpdateEvent = async () => {
    if (!eventName || !sportType || !location || !date || !time || !participants || !description || !picture) {
      setError('All fields are required.');
      return;
    }

    try {
      const updatedEvent = {
        eventName,
        sportType,
        location,
        date: date.toISOString().split('T')[0], // Save date in YYYY-MM-DD format
        time: time.toTimeString().substr(0, 5), // Save time in HH:MM format
        participants: parseInt(participants, 10), // Ensure participants is a number
        description,
        picture,
      };

      await updateEvent(eventId, updatedEvent);
      Alert.alert('Success', 'Event updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event.');
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.header}>Edit Event</Text>
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
          <Text style={styles.dateText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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
          value={participants}
          keyboardType="numeric"
          onChangeText={text => setParticipants(text)}
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
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button title="Update Event" onPress={handleUpdateEvent} />
        <Button title="Delete Event" onPress={handleDelete} color="red" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  scrollViewContent: {
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

export default EditEvent;
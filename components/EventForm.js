// components/EventForm.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePickerComponent from '../components/ImagePickerComponent';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

const createDateFromTimeString = (timeString) => {
  if (!timeString) {
    return new Date();
  }
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
};

const EventForm = ({ onSubmit, initialData = {} }) => {
  const [eventName, setEventName] = useState(initialData.eventName || '');
  const [sportType, setSportType] = useState(initialData.sportType || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [date, setDate] = useState(initialData.date ? new Date(initialData.date) : new Date());
  const [time, setTime] = useState(createDateFromTimeString(initialData.time));
  const [participants, setParticipants] = useState(String(initialData.participants || ''));
  const [description, setDescription] = useState(initialData.description || '');
  const [picture, setPicture] = useState(initialData.picture || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const sportOptions = [
    { label: 'Basketball', value: 'Basketball' },
    { label: 'Football', value: 'Football' },
    { label: 'Tennis', value: 'Tennis' },
    { label: 'Volleyball', value: 'Volleyball' },
    { label: 'Running', value: 'Running' },
    { label: 'Cycling', value: 'Cycling' },
    { label: 'Footvolley', value: 'Footvolley' },
    { label: 'Handball', value: 'Handball' },
    { label: 'Yoga', value: 'Yoga' }
  ];

  useEffect(() => {
    if (initialData.participants !== undefined) {
      setParticipants(String(initialData.participants));
    }
  }, [initialData.participants]);

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

  const handleSubmit = () => {
    if (!eventName || !sportType || !location || !date || !time || !participants || !description || !picture) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = time.toTimeString().split(' ')[0];
    const eventToSubmit = {
      eventName,
      sportType,
      location,
      date: formattedDate,
      time: formattedTime,
      participants: Number(participants),
      description,
      picture,
    };

    onSubmit(eventToSubmit);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.inputContainer}>
        <Ionicons name="calendar" size={24} color="#8A2BE2" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          placeholderTextColor="#A9A9A9"
          value={eventName}
          onChangeText={setEventName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="basketball" size={24} color="#8A2BE2" style={styles.icon} />
        <RNPickerSelect
          onValueChange={(value) => setSportType(value)}
          items={sportOptions}
          placeholder={{ label: 'Select Sport Type', value: '' }}
          style={pickerSelectStyles}
          value={sportType}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return <Ionicons name="chevron-down" size={24} color="gray" />;
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="location" size={24} color="#8A2BE2" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="#A9A9A9"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputContainer}>
        <Ionicons name="calendar" size={24} color="#8A2BE2" style={styles.icon} />
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

      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.inputContainer}>
        <Ionicons name="time" size={24} color="#8A2BE2" style={styles.icon} />
        <Text style={styles.dateText}>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.inputContainer}>
        <Ionicons name="people" size={24} color="#8A2BE2" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Number of Participants"
          placeholderTextColor="#A9A9A9"
          keyboardType="number-pad"
          value={participants}
          onChangeText={setParticipants}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="document-text" size={24} color="#8A2BE2" style={styles.icon} />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Event Description"
          placeholderTextColor="#A9A9A9"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <ImagePickerComponent initialImage={picture} onImagePicked={setPicture} buttonText="Upload Event Image" />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8A2BE2',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  pickerTouchable: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'center',
  },
  submitButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 15 : 10,
    right: 12,
  },
});

export default EventForm;

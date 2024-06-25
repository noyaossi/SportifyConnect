import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import commonStyles from '../styles/styles';

const EventForm = ({ onSubmit, initialData = {} }) => {
  const [eventName, setEventName] = useState(initialData.eventName || '');
  const [sportType, setSportType] = useState(initialData.sportType || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [date, setDate] = useState(initialData.date ? new Date(initialData.date) : new Date());
  const [time, setTime] = useState(initialData.time ? new Date(`1970-01-01T${initialData.time}Z`) : new Date());
  const [participants, setParticipants] = useState(String(initialData.participants || ''));
  const [description, setDescription] = useState(initialData.description || '');
  const [picture, setPicture] = useState(initialData.picture || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const sportOptions = ['Basketball', 'Football', 'Tennis', 'Volleyball', 'Running', 'Cycling', 'Footvolley', 'Handball'];

  useEffect(() => {
    if (initialData.participants !== undefined) {
      setParticipants(String(initialData.participants));
    }
  }, [initialData.participants]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
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

  const handleSubmit = () => {
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

    if (!eventName || !sportType || !location || !date || !time || !participants || !description || !picture) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    onSubmit(eventToSubmit);
  };

  return (
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <Text style={commonStyles.title}>Event Form:</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Event Name"
          value={eventName}
          onChangeText={setEventName}
        />
        <Text style={commonStyles.label}>Sport Type</Text>
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
          style={commonStyles.input}
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
          style={commonStyles.input}
          placeholder="Number Of Participants"
          keyboardType="number-pad"
          value={participants}
          onChangeText={setParticipants}
        />
        <TextInput
          style={commonStyles.input}
          placeholder="Event Description"
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.uploadPictureContainer}>
          {picture && <Image source={{ uri: picture }} style={commonStyles.profileImage} />}
          <TouchableOpacity style={commonStyles.button} onPress={pickImage}>
            <Text style={commonStyles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
          <Text style={commonStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  
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
});

export default EventForm;

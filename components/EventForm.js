import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePickerComponent from '../components/ImagePickerComponent';

const EventForm = ({ onSubmit, initialData = {} }) => {
  const [eventName, setEventName] = useState(initialData.eventName || '');
  const [sportType, setSportType] = useState(initialData.sportType || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [date, setDate] = useState(initialData.date ? new Date(initialData.date) : new Date());

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

  const [time, setTime] = useState(createDateFromTimeString(initialData.time));
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
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Event Form:</Text>
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
      <ImagePickerComponent initialImage={picture} onImagePicked={setPicture} buttonText="Choose from Gallery" />
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker background
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    color: 'black',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  pickerItem: {
    padding: 8,
  },
  pickerItemText: {
    fontSize: 16,
    color: 'black',
  },
  selectedSportType: {
    fontSize: 16,
    marginBottom: 12,
    color: 'white',
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  dateText: {
    fontSize: 16,
    color: 'black',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 12,
  },
});

export default EventForm;

// screens/CreateEvent.js
import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView, View, Platform } from 'react-native';
import { TextInput, Button, Title, List } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { addEvent, createNewEvent } from '../firebase/firestore';
import { uploadImage } from '../firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import ScreenContainer from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';

const sportOptions = ['Basketball', 'Football', 'Tennis', 'Volleyball', 'Running', 'Cycling', 'Footvolley', 'Handball'];

const CreateEvent = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    eventName: '',
    sportType: '',
    location: '',
    date: new Date(),
    time: new Date(),
    participants: '',
    description: '',
    picture: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let pictureUrl = null;
      if (eventData.picture) {
        pictureUrl = await uploadImage(eventData.picture);
      }
      const eventToSubmit = {
        ...eventData,
        date: eventData.date.toISOString().split('T')[0],
        time: eventData.time.toTimeString().split(' ')[0],
        picture: pictureUrl,
      };
      const eventId = await addEvent(eventToSubmit);
      await createNewEvent(currentUser.uid, eventId);
      Alert.alert('Event Created', 'Your event has been created successfully.');
      navigation.navigate('Events');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'There was an error creating your event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name, icon, placeholder) => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={24} color="#6200EE" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={eventData[name]}
        onChangeText={(text) => setEventData({ ...eventData, [name]: text })}
        theme={{ colors: { primary: '#6200EE' } }}
      />
    </View>
  );

  const renderDateTimePicker = (type, icon, label) => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={24} color="#6200EE" style={styles.icon} />
      <Button
        onPress={() => type === 'date' ? setShowDatePicker(true) : setShowTimePicker(true)}
        style={styles.dateTimeButton}
      >
        {type === 'date' 
          ? eventData.date.toDateString()
          : eventData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Button>
    </View>
  );

  return (
    <ScreenContainer loading={loading} onRefresh={() => {}} navigation={navigation}>
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.title}>Create New Event</Title>
        {renderInput('eventName', 'calendar', 'Event Name')}
        <View style={styles.inputContainer}>
          <Ionicons name="football" size={24} color="#6200EE" style={styles.icon} />
          <Picker
            selectedValue={eventData.sportType}
            style={styles.picker}
            onValueChange={(itemValue) => setEventData({ ...eventData, sportType: itemValue })}
          >
            <Picker.Item label="Select Sport Type" value="" />
            {sportOptions.map((sport) => (
              <Picker.Item key={sport} label={sport} value={sport} />
            ))}
          </Picker>
        </View>
        {renderInput('location', 'location', 'Location')}
        {renderDateTimePicker('date', 'calendar', 'Date')}
        {renderDateTimePicker('time', 'time', 'Time')}
        {renderInput('participants', 'people', 'Number of Participants')}
        {renderInput('description', 'document-text', 'Description')}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Create Event
        </Button>
        
        {showDatePicker && (
          <DateTimePicker
            value={eventData.date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setEventData({ ...eventData, date: selectedDate });
              }
            }}
          />
        )}
        
        {showTimePicker && (
          <DateTimePicker
            value={eventData.time}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (selectedTime) {
                setEventData({ ...eventData, time: selectedTime });
              }
            }}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 24,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F3E5F5',
    borderRadius: 8,
    elevation: 2,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    backgroundColor: '#6200EE',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    flex: 1,
    color: '#6200EE',
  },
  dateTimeButton: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 0,
  },
});

export default CreateEvent;
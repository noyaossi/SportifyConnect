// screens/Homepage.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { getEvents, registerForEvent } from '../firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import * as Location from 'expo-location';
import { OPENWEATHERMAP_API_KEY } from '@env';
import ScreenContainer from '../components/ScreenContainer';
import { useIsFocused } from '@react-navigation/native';
import { Card, Button, Chip, Divider } from 'react-native-paper';

const sportOptions = ['All Events', 'Basketball', 'Football', 'Tennis', 'Volleyball', 'Running', 'Cycling', 'Footvolley', 'Handball', 'Events on Selected Date'];

const Homepage = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedSport, setSelectedSport] = useState('All Events');
  const [selectedDate, setSelectedDate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const isFocused = useIsFocused();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      await fetchWeatherData();
    } catch (error) {
      console.error('Error fetching events or weather data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      onRefresh();
    }

    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        await fetchWeatherData();
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [currentUser, isFocused]);

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(currentUser.uid, eventId);
      alert('Registered successfully!');
      onRefresh();
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Error registering for event.');
    }
  };

  const fetchWeatherData = async () => {
    try {
      setLoadingWeather(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoadingWeather(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPENWEATHERMAP_API_KEY}`
      );
      setWeatherData(response.data);
      setError(null);  // Clear any previous errors
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error.message);
    } finally {
      setLoadingWeather(false);
    }
  };

  const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2);
  const kelvinToFahrenheit = (temp) => ((temp - 273.15) * 9/5 + 32).toFixed(2);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    if (!timeString) {
      return 'Invalid time';
    }
    const [hour, minute] = timeString.split(':');
    if (hour === undefined || minute === undefined) {
      return 'Invalid time';
    }
    return hour + ':' + minute;
  };

  const filterEvents = () => {
    let filtered = events;
    if (selectedSport === 'Events on Selected Date') {
      if (selectedDate) {
        filtered = filtered.filter(event => new Date(event.date).toDateString() === new Date(selectedDate).toDateString());
      } else {
        filtered = [];
      }
    } else {
      if (selectedSport && selectedSport !== 'All Events') {
        filtered = filtered.filter(event => event.sportType.toLowerCase() === selectedSport.toLowerCase());
      }
      if (selectedDate && selectedSport !== 'All Events') {
        filtered = filtered.filter(event => new Date(event.date).toDateString() === new Date(selectedDate).toDateString());
      }
    }
    setFilteredEvents(filtered);
  };

  useEffect(() => {
    filterEvents();
  }, [selectedSport, selectedDate, events]);

  const renderEventItem = ({ item }) => (
    <Card style={styles.eventCard}>
      {item.picture && <Card.Cover source={{ uri: item.picture }} style={styles.eventImage} />}
      <Card.Content>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Chip style={styles.sportChip}>{item.sportType}</Chip>
        <Text style={styles.eventDetails}>{item.location}</Text>
        <Text style={styles.eventDetails}>{formatDate(item.date)} at {formatTime(item.time)}</Text>
        <Text style={styles.eventDetails}>Participants: {item.participants}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.eventDescription}>{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => handleRegister(item.id)}>
          Register
        </Button>
      </Card.Actions>
    </Card>
  );
  return (
    <ScreenContainer loading={refreshing} onRefresh={onRefresh} navigation={navigation}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.weatherCard}>
          <Card.Title title="Current Weather" />
          <Card.Content>
            {loadingWeather ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : error ? (
              <Text style={styles.errorText}>Error fetching weather data: {error}</Text>
            ) : weatherData ? (
              <View>
                <Text style={styles.weatherText}>Location: {weatherData.name}</Text>
                <Text style={styles.weatherText}>Description: {weatherData.weather[0].description}</Text>
                <Text style={styles.weatherText}>Temperature: {kelvinToCelsius(weatherData.main.temp)}°C / {kelvinToFahrenheit(weatherData.main.temp)}°F</Text>
                <Text style={styles.weatherText}>Feels Like: {kelvinToCelsius(weatherData.main.feels_like)}°C / {kelvinToFahrenheit(weatherData.main.feels_like)}°F</Text>
                <Text style={styles.weatherText}>Humidity: {weatherData.main.humidity}%</Text>
              </View>
            ) : (
              <Text>No weather data available at the moment.</Text>
            )}
          </Card.Content>
        </Card>

        <Calendar
          style={styles.calendar}
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#007AFF' }
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#007AFF',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#007AFF',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#007AFF',
            selectedDotColor: '#ffffff',
            arrowColor: '#007AFF',
            monthTextColor: '#2d4150',
            indicatorColor: '#007AFF',
          }}
        />

        <View style={styles.sportFilterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sportOptions.map(option => (
              <Chip
                key={option}
                style={styles.sportFilterChip}
                selected={selectedSport === option}
                onPress={() => {
                  setSelectedSport(option);
                  if (option === 'All Events' || option === 'Events on Selected Date') {
                    setSelectedDate(null);
                  }
                }}
              >
                {option}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.header}>Explore Events</Text>
        {filteredEvents.length === 0 ? (
          <Text style={styles.noEventsText}>No events available at the moment.</Text>
        ) : (
          <FlatList
            data={filteredEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.eventList}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginVertical: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherCard: {
    marginBottom: 16,
    elevation: 2,
  },
  calendar: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sportFilterContainer: {
    marginBottom: 16,
  },
  sportFilterChip: {
    marginRight: 8,
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden', // This ensures the image doesn't overflow the card's rounded corners
  },
  eventImage: {
    height: 200, // Adjust this value as needed
    resizeMode: 'cover',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sportChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  divider: {
    marginVertical: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  weatherText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  eventList: {
    paddingBottom: 20,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Homepage;

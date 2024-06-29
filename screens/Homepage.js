// screens/Homepage.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView,  ActivityIndicator } from 'react-native';
import { getEvents, registerForEvent, isUserRegisteredForEvent } from '../firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import * as Location from 'expo-location';
import { OPENWEATHERMAP_API_KEY } from '@env';
import ScreenContainer from '../components/ScreenContainer';
import { useIsFocused } from '@react-navigation/native';
import { Card, Button, Chip, Divider, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const sportOptions = ['All Events', 'Events on Selected Date', 'Basketball', 'Football', 'Tennis', 'Volleyball', 'Running', 'Cycling', 'Footvolley', 'Handball', 'Yoga'];

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
  const [registrationStatus, setRegistrationStatus] = useState({});
  


  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (currentUser) {
      const eventsData = await getEvents();
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      await fetchWeatherData();
      }
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
    if (currentUser) {
    const eventsData = await getEvents();
    setEvents(eventsData);
    setFilteredEvents(eventsData);
    await fetchWeatherData();
    }
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
      alert('Error registering for event');
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
      setError(null);  
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

  const checkRegistration = async (userId, eventId) => {
    try {
      const isRegistered = await isUserRegisteredForEvent(userId, eventId);
      setRegistrationStatus(prev => ({ ...prev, [eventId]: isRegistered }));
    } catch (error) {
      console.error('Error checking registration:', error);
      
    }
  };
 
  useEffect(() => {
    if (currentUser) {
    
    events.forEach(event => {
      checkRegistration(currentUser.uid, event.id);
    });
    }
  }, [events, currentUser]);

  useEffect(() => {
    filterEvents();
  }, [selectedSport, selectedDate, events]);

  const renderEventItem = ({ item }) => {
    const isUserRegistered = registrationStatus[item.id] || false;
  
    return (
      <Card style={styles.eventCard}>
        {item.picture && <Card.Cover source={{ uri: item.picture }} style={styles.eventImage} />}
        <Card.Content>
          <Text style={styles.eventName}>{item.eventName}</Text>
          <Chip icon="tag" style={styles.sportChip}>{item.sportType}</Chip>
          <View style={styles.eventDetailsContainer}>
            <Ionicons name="location" size={16} color="#8A2BE2" style={styles.icon} />
            <Text style={styles.eventDetails}>{item.location}</Text>
          </View>
          <View style={styles.eventDetailsContainer}>
            <Ionicons name="calendar" size={16} color="#8A2BE2" style={styles.icon} />
            <Text style={styles.eventDetails}>{formatDate(item.date)} at {formatTime(item.time)}</Text>
          </View>
          <View style={styles.eventDetailsContainer}>
            <Ionicons name="people" size={16} color="#8A2BE2" style={styles.icon} />
            <Text style={styles.eventDetails}>Participants: {item.participants.length}</Text>
          </View>
          <Divider style={styles.divider} />
          <Text style={styles.eventDescription}>{item.description}</Text>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained" 
            onPress={() => handleRegister(item.id)}
            disabled={isUserRegistered}
            icon={({size, color}) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            )}
          >
            {isUserRegistered ? 'Registered' : 'Register'}
          </Button>
        </Card.Actions>
      </Card>
    );
  };
  

  return (
    <ScreenContainer loading={refreshing} onRefresh={onRefresh} navigation={navigation}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.weatherCard}>
        <View style={styles.weatherDetailsContainer}>
          <IconButton icon="weather-partly-cloudy" />
          <Text style={styles.weatherHeader}>Current Weather</Text>
        </View>
          <Card.Content>
            {loadingWeather ? (
              <ActivityIndicator size="small" color="#8A2BE2" />
            ) : error ? (
              <Text style={styles.errorText}>Error fetching weather data: {error}</Text>
            ) : weatherData ? (
              <View>
                <View style={styles.weatherDetailsContainer}>
                  <Ionicons name="location" size={16} color="#8A2BE2" style={styles.icon} />
                  <Text style={styles.weatherText}>Location: {weatherData.name}</Text>
                </View>
                <View style={styles.weatherDetailsContainer}>
                  <Ionicons name="cloud" size={16} color="#8A2BE2" style={styles.icon} />
                  <Text style={styles.weatherText}>Description: {weatherData.weather[0].description}</Text>
                </View>
                <View style={styles.weatherDetailsContainer}>
                  <Ionicons name="thermometer" size={16} color="#8A2BE2" style={styles.icon} />
                  <Text style={styles.weatherText}>Temperature: {kelvinToCelsius(weatherData.main.temp)}°C / {kelvinToFahrenheit(weatherData.main.temp)}°F</Text>
                </View>
                <View style={styles.weatherDetailsContainer}>
                  <Ionicons name="body" size={16} color="#8A2BE2" style={styles.icon} />
                  <Text style={styles.weatherText}>Feels Like: {kelvinToCelsius(weatherData.main.feels_like)}°C / {kelvinToFahrenheit(weatherData.main.feels_like)}°F</Text>
                </View>
                <View style={styles.weatherDetailsContainer}>
                  <Ionicons name="water" size={16} color="#8A2BE2" style={styles.icon} />
                  <Text style={styles.weatherText}>Humidity: {weatherData.main.humidity}%</Text>
                </View>
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
            [selectedDate]: { selected: true, selectedColor: '#8A2BE2' }
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#8A2BE2',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#8A2BE2',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#8A2BE2',
            selectedDotColor: '#ffffff',
            arrowColor: '#8A2BE2',
            monthTextColor: '#2d4150',
            indicatorColor: '#8A2BE2',
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
                icon={option === 'All Events' ? 'all-inclusive' : 'tag'}
              >
                {option}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <View style={styles.header}>
          <Ionicons name="search" size={24} color="#8A2BE2" style={styles.headerIcon} />
          <Text style={styles.header}>Explore Events</Text>
        </View>
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
  },
  header: {
    fontSize: 24,
    marginVertical: 16,
    fontWeight: 'bold',
    color: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
    paddingLeft: 7,
  },
  weatherCard: {
    marginBottom: 16,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  weatherHeader: {
    fontSize: 20,
  },
  calendar: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  sportFilterContainer: {
    marginBottom: 16,
  },
  sportFilterChip: {
    marginRight: 8,
    backgroundColor: '#D8BFD8',
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  eventImage: {
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 8,
    marginTop: 10,
  },
  sportChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#E6E6FA',
  },
  eventDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  weatherDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
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
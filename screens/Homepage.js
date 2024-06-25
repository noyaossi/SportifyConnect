import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl, ActivityIndicator  } from 'react-native';
import { getEvents, registerForEvent } from '../firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { Ionicons } from '@expo/vector-icons';
import { useRefresh } from '../contexts/RefreshContext';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import * as Location from 'expo-location';
import { OPENWEATHERMAP_API_KEY } from '@env';


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
  const { refreshing: contextRefreshing } = useRefresh();

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
  }, [currentUser]);

  useEffect(() => {
    if (contextRefreshing) {
      onRefresh();
    }
  }, [contextRefreshing]);


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
      //console.log('Location:', location);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPENWEATHERMAP_API_KEY}`
      );
      //console.log('API Response:', response.data);
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
    //console.log("time in homepage:", timeString);
    if (!timeString) {
      return 'Invalid time2';
    }
    // Split the time string into parts
    const [hour, minute] = timeString.split(':');
    // Check if hour and minute are defined
    if (hour === undefined || minute === undefined) {
      return 'Invalid time2';
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

    //TODO: add to filter by date
    setFilteredEvents(filtered);
  };
  useEffect(() => {
    filterEvents();
  }, [selectedSport, selectedDate, events]);

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDetails}>{item.sportType}</Text>
        <Text style={styles.eventDetails}>{item.location}</Text>
        <Text style={styles.eventDetails}>{formatDate(item.date)}</Text>
        <Text style={styles.eventDetails}>{formatTime(item.time)}</Text>
        <Text style={styles.eventDetails}>Participants: {item.participants}</Text>
        <Text style={styles.eventDetails}>{item.description}</Text>
      </View>
      {item.picture && <Image source={{ uri: item.picture }} style={styles.eventImage} />}
      <Button title="Register" onPress={() => handleRegister(item.id)} />
    </View>
  );

  return (
    <View style={styles.maincontainer}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      > 
        <View style={styles.container}>
        <Text style={styles.header}>Current Weather:</Text>
          {loadingWeather ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text style={styles.errorText}>Error fetching weather data: {error}</Text>
          ) : weatherData ? (
            <View style={styles.weatherContainer}>
              <Text style={styles.weatherText}>Location: {weatherData.name}</Text>
              <Text style={styles.weatherText}>Description: {weatherData.weather[0].description}</Text>
              <Text style={styles.weatherText}>Temperature: {kelvinToCelsius(weatherData.main.temp)}°C / {kelvinToFahrenheit(weatherData.main.temp)}°F</Text>
              <Text style={styles.weatherText}>Feels Like: {kelvinToCelsius(weatherData.main.feels_like)}°C / {kelvinToFahrenheit(weatherData.main.feels_like)}°F</Text>
              <Text style={styles.weatherText}>Humidity: {weatherData.main.humidity}%</Text>
            </View>
          ) : (
            <Text>No weather data available at the moment.</Text>
          )}
        <Calendar
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: 'blue' }
            }}
          />
          <View style={styles.sportFilterContainer}>
            {sportOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sportFilterButton,
                  selectedSport === option && styles.sportFilterButtonSelected
                ]}
                onPress={() => {
                  setSelectedSport(option);
                  if (option === 'All Events' || option === 'Events on Selected Date') {          
                       setSelectedDate(null); // Reset date when "All Events" or "Events on Selected Date" is selected
                  }
                }}              >
                <Text style={styles.sportFilterButtonText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.header}>Explore Events:</Text>
          {filteredEvents.length === 0 ? (
            <Text>No events available at the moment.</Text>
          ) : (
            <FlatList
              data={filteredEvents}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
         
        </View>
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    marginVertical: 10,
  },
  eventItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDetailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDetails: {
    fontSize: 16,
    color: '#888',
  },
  eventImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  sportFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  sportFilterButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    padding: 10,
    margin: 5,
  },
  sportFilterButtonSelected: {
    backgroundColor: 'blue',
  },
  sportFilterButtonText: {
    color: 'black',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#1E90FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  weatherContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  weatherText: {
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Homepage;
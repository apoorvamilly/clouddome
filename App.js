import React from "react";
import { StyleSheet, View, Text, ImageBackground, ToastAndroid, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native'
import { API_KEY } from "./utils/WeatherAPIKey";
import Weather from "./components/Weather";
import ForecastCard from "./components/HourlyWeather/ForecastCard";
import HourlyWeather from "./components/HourlyWeather/HourlyWeather";
import WeeklyWeather from "./components/WeeklyWeather/WeeklyWeather";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.fetchWeatherWithCoords = this.fetchWeatherWithCoords.bind(this);
    this.fetchLocationAndWeather = this.fetchLocationAndWeather.bind(this);
  }
  state = {
    isLoading: true,
    temperature: 0,
    weatherCondition: null,
    error: null,
    id: 0,
    place: null,
    foreCast: []
  };

  componentDidMount() {
    this.fetchLocationAndWeather();
  }

  showToast() {
    ToastAndroid.show("Please enter a valid city name", 2000);
  }

  fetchLocationAndWeather() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.fetchWeatherWithCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        this.showToast("Error Getting Weather Condtions")
        this.setState({
          error: "Error Getting Weather Condtions",
        });
      }
    );
  }

  onSearch(city) {
    this.setState({
      isLoading: true,
    });
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          isLoading: false,
          id: json.id,
          place: json.name,
        });
      })
      .catch((error) => {
        this.showToast("Please enter a valid city name")
        this.setState({
          error: error,
          isLoading: false,
        });
      });
  }

  fetchWeatherWithCoords(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState((prevState, props) => ({
          forecast: json,
          isLoading: false
        }));
      })
      .catch(err => console.log('error', err))
  }
  render() {
    const Tab = createMaterialBottomTabNavigator();
    return (
        <NavigationContainer>
          <Tab.Navigator shifting>  {/*shifting - animation on bottom nav */}
            <Tab.Screen
              options={{
                tabBarLabel: 'Home',
                tabBarColor: '#303133',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
              name="Home"
              component={Weather} />
            <Tab.Screen
              options={{
                tabBarLabel: 'Hourly',
                tabBarColor: '#2470a0',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="timer-sand" color={color} size={26} />
                ),
              }}
              name="Hourly"
              component={HourlyWeather} />
            <Tab.Screen
              options={{
                tabBarLabel: 'Weekly',
                tabBarColor: '#272343',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="calendar-week" color={color} size={26} />
                ),
              }}
              name="Weekly"
              component={WeeklyWeather} />
          </Tab.Navigator>
        </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#FFFDE4",
  },
  loadingText: {
    fontSize: 30,
  },
  locationIcon: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:60,
    height:60,
    backgroundColor:'#ee6e73',
    borderRadius:50,
    position: 'absolute',                                          
    bottom: 70,                                                    
    right: 15, 
    shadowColor: 'black',
    shadowOpacity: 0.78,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
  }
});

import React, { useState, useEffect, Component } from "react";
import { View, Text, StyleSheet, ToastAndroid, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API_KEY } from "../utils/WeatherAPIKey";
import { weatherConditions } from "../utils/WeatherConditions";
import { SearchBar } from "react-native-elements";
import LocationIcon from './shared/LocationIcon'
import HomeCard from './HomeCard'

export default class Weather extends Component {
  constructor(props){
    super(props)
    this.onSearch = this.onSearch.bind(this);
    this.fetchWeatherWithCoords = this.fetchWeatherWithCoords.bind(this);
    this.fetchLocationAndWeather = this.fetchLocationAndWeather.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }
  state = {
    isLoading: true,
    temperature: 0,
    weatherCondition: null,
    error: null,
    id: 0,
    place: null,
    search: ''
  };
  componentDidMount() {
    this.fetchLocationAndWeather();
  }

  showToast(message) {
    ToastAndroid.show(message, 2000);
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
        this.showToast("Location Unavailable")
        this.setState({
          error: "Location Unavailable",
        });
      }
    );
  }

  updateSearch(searchKey) {
    this.setState({
      search: searchKey
    })
  }

  onSearch() {
    this.setState({
      isLoading: true,
    });
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${this.state.search}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          isLoading: false,
          id: json.id,
          place: json.name,
          json: json
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
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          isLoading: false,
          id: json.id,
          place: json.name,
          json: json
        });
      })
      .catch(err => {
        this.showToast("Error getting the weather details")
        this.setState({
          error: err,
        })
      })
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <View
          style={[
            styles.weatherContainer,
            { backgroundColor: '#e1e8ee' },
          ]}
        >
          <SearchBar
            placeholder="Enter a city name"
            onChangeText={this.updateSearch}
            value={this.state.search}
            containerStyle={{
              marginTop: 40,
              borderBottomWidth: 0,
              borderTopWidth: 0,
              backgroundColor: '#e1e8ee'
          }}
            onEndEditing={this.onSearch}
            round
          />

          <HomeCard detail={this.state.json}/>
          {/* <View style={styles.headerContainer}>
            <MaterialCommunityIcons
              size={72}
              name={weatherConditions[this.state.weatherCondition].icon}
              color={"#fff"}
            />
            <Text style={styles.tempText}>{this.state.temperature}˚</Text>
          </View>
          <View style={styles.bodyContainer}>
            <MaterialCommunityIcons
              onPress={()=>this.fetchLocationAndWeather()}
              size={34}
              name="map-marker-radius"
              color={"#fff"}
            />
            <Text style={styles.subtitle}>{this.state.place}</Text>
            <Text style={styles.title}>{weatherConditions[this.state.weatherCondition].title}</Text>
            <Text style={styles.subtitle}>
              {weatherConditions[this.state.weatherCondition].subtitle}
            </Text>
          </View> */}
          <LocationIcon getLocation={this.fetchLocationAndWeather} color='#303133'/>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
  },
  headerContainer: {
    flex: 0.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tempText: {
    fontSize: 72,
    color: "#fff",
  },
  bodyContainer: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingLeft: 25,
    marginBottom: 40,
  },
  title: {
    fontSize: 60,
    color: "#fff",
  },
  subtitle: {
    fontSize: 24,
    color: "#fff",
  },
});


import React, { Component } from 'react'
import { Text, View, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, ToastAndroid } from 'react-native'
import ForecastCard from './ForecastCard'
import { MaterialCommunityIcons } from 'react-native-elements'
import { SearchBar } from "react-native-elements";
import { API_KEY } from '../../utils/WeatherAPIKey'
import { Button, Avatar } from 'react-native-paper'
import LocationIcon from '../shared/LocationIcon'

export default class WeeklyWeather extends Component {
    constructor(props){
        super(props)
        this.fetchWeatherWithCoords = this.fetchWeatherWithCoords.bind(this);
        this.fetchLocationAndWeather = this.fetchLocationAndWeather.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }
    state={
        forecast: [],
        isLoading: true,
        search: ''
    }
    componentDidMount() {
        this.fetchLocationAndWeather()
    }

    updateSearch(searchKey) {
        this.setState({
            search: searchKey
        })
    }

    showToast(message) {
        ToastAndroid.show(message, 2000)
    }

    onSearch(){
        this.setState({
            isLoading: true
        })
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${this.state.search}&appid=${API_KEY}&units=metric`)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    place: json.name
                })
                this.fetchWeatherWithCoords(json.coord.lat, json.coord.lon)
            }).catch(err => {
                this.showToast("Please enter a valid city name")
                this.setState({
                    isLoading: false,
                    error: err
                })
            })
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

    fetchCityName(lat, lon){
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    place: json.name
                })
                return json.name
            })
    }

    fetchWeatherWithCoords(lat, lon) {
        
        fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely&units=metric&appid=${API_KEY}`
        )
        .then((res) => res.json())
        .then((json) => {
            this.setState((prevState, props) => ({
                forecast: json,
                isLoading: false
            })
        );
        })
        .then(() => {
            this.fetchCityName(lat, lon)
        })
        .catch(err => console.log('error', err))
    }
    render() {
        return !this.state.isLoading ? (
            <SafeAreaView style={{paddingBottom: 100}}>
                <SearchBar
                    placeholder="Enter a city name"
                    onChangeText={this.updateSearch}
                    value={this.state.search}
                    containerStyle={{
                        marginTop: 40,
                        borderBottomWidth: 0,
                        borderTopWidth: 0,
                        backgroundColor: '#f7f7f7'
                    }}
                    lightTheme
                    onEndEditing={this.onSearch}
                    round
                />
                <FlatList data={this.state.forecast.daily} style={{marginTop:20}} keyExtractor={item => item.dt} renderItem={({item}) => (<ForecastCard detail={item} location={this.state.place} />)} />
                <LocationIcon bottom={120} getLocation={this.fetchLocationAndWeather} color='#241663'/>
            </SafeAreaView>
        ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
}

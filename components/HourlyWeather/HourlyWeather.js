import React, { Component } from 'react'
import { Text, View, FlatList, ToastAndroid, ActivityIndicator, SafeAreaView } from 'react-native'
import ForecastCard from './ForecastCard'
import { SearchBar } from "react-native-elements";
import { API_KEY } from '../../utils/WeatherAPIKey'
import LocationIcon from '../shared/LocationIcon'


export default class HourlyWeather extends Component {
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
            isLoading: true,
        })
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${this.state.search}&units=metric&appid=${API_KEY}`
        )
        .then((res) => res.json())
        .then((json) => {
            this.setState((prevState, props) => ({
                forecast: json,
                isLoading: false
            })
        );
        })
        .catch(err => {
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

    fetchWeatherWithCoords(lat, lon) {
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        )
        .then((res) => res.json())
        .then((json) => {
            this.setState((prevState, props) => ({
                forecast: json,
                isLoading: false
            })
        );
        })
        .catch(err => {
            this.showToast("Error getting weather details")
            this.setState({
                isLoading: false,
                error: err
            })
        })
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
                <FlatList data={this.state.forecast.list} style={{marginTop:20}} keyExtractor={item => item.dt_txt} renderItem={({item}) => (<ForecastCard detail={item} location={this.state.forecast.city.name} />)} />
                <LocationIcon bottom={120} getLocation={this.fetchLocationAndWeather} color='#008b8b'/>
            </SafeAreaView>
        ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
}

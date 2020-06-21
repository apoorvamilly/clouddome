import React, { Component } from 'react'
import { View, StyleSheet, Image, Dimensions } from 'react-native'
import { weatherConditions } from "../utils/WeatherConditions";
import { Text, Card, Divider } from 'react-native-elements';
import { MaterialCommunityIcons } from "@expo/vector-icons";



export default class HomeCard extends Component {
    render() {
        let time;

        var date = new Date(this.props.detail.dt*1000);

		// Hours part from the timestamp
		var hours = date.getHours();
		
		// Minutes part from the timestamp
		var minutes = "0" + date.getMinutes();

		time = hours + ':' + minutes.substr(-2);
        return (
			<Card containerStyle={{...styles.card, backgroundColor: weatherConditions[this.props.detail.weather[0].main].color}}>
				
				<View style={{alignItems:'center'}}>
					<MaterialCommunityIcons
						size={100}
						name={weatherConditions[this.props.detail.weather[0].main].icon}
						color={"#fff"}
					/>
					<Text style={styles.temp}>{Math.round( this.props.detail.main.temp * 10) / 10 }&#8451;</Text>
				</View>
				<Text style={styles.temp}>{this.props.detail.name}</Text>

				<Divider style={{ backgroundColor: '#dfe6e9', marginVertical:20}} />
				
				<View style={{flexDirection:'row', justifyContent:'space-between', paddingTop: 32}}>
					<Text style={styles.notes}>{this.props.detail.weather[0].main}</Text>
				</View>
				<View style={{flexDirection:'row', justifyContent:'space-between'}}>
					<Text style={styles.notes}>{weatherConditions[this.props.detail.weather[0].main].subtitle}</Text>
				</View>
			</Card>
		);
    }
}

const styles = StyleSheet.create({
	card:{
		// backgroundColor:'rgba(56, 172, 236, 1)',
		alignItems: "center",
		justifyContent: "space-around",
		borderWidth:0,
		borderRadius:20,
		paddingBottom: 25,
		paddingTop: 25,
		maxHeight: Dimensions.get("window").height *3/2
	},
	temp:{
		fontSize:38,
		color:'#fff',
		textAlign: "center",
	},
	notes: {
		textAlign: "center",
		fontSize: 18,
		color:'#fff',
		textTransform:'capitalize'
	}
});
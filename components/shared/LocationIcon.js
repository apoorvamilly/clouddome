import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { Button, Avatar } from 'react-native-paper'

export default class LocationIcon extends Component {
    render() {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={this.props.getLocation} style={{...styles.locationIcon, bottom: this.props.bottom || 30}}>
                <Avatar.Icon size={60} backgroundColor={this.props.color} color="#fff" icon="map-marker-radius" />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
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
        right: 15, 
        shadowColor: 'black',
        shadowOpacity: 0.78,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 10,
        elevation: 3,
      }
})

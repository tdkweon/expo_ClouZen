import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
    },
    buttonGrad: {
        hight: 160,
        width: 160,
        borderRadius: 20,
        position: 'absolute',
        bottom: 3,
        alignItems: 'center'
    },
    buttonParent: {
        height: 162,
        width: 161,
        borderRadius: 20,
    },
    imageBox: {
        height: 80,
        width: 80,
        marginTop: 20,
        marginBottom: 5,
    },
    image: {
        flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: 'stretch',
    },    
    textName: {
        color: 'black',
        fontWeight: '600',
        fontSize: 20,
    },
    textDesc: {
        color: 'darkgrey',
    },
    textSize: {
        color: 'black',
    }
})
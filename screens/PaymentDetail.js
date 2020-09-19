import React, { Component, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button, ScrollView, Image} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {createBottomTabNavigator} from "react-navigation-tabs";
import Chat from "./Chat";
import MyPosts from "./MyPosts";
import Purchased from "./Purchased";
import {createAppContainer} from "react-navigation";
import Feed from "./Feed";
import axios from "axios";




class PaymentDetail extends Component {
    static navigationOptions = {
        title: 'Payment Detail',
    };
    constructor(props) {
        super(props);
    }





    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{alignItems:'center', marginHorizontal:30}}>
                        <Image style={styles.productImg} source={{uri: this.props.navigation.state.params.itemData.imageURL}}/>
                        <Text style={styles.name}>{this.props.navigation.state.params.itemData.name}</Text>
                        <Text style={styles.price}>$ {this.props.navigation.state.params.itemData.price}</Text>
                        <Text style={styles.description}>
                            {this.props.navigation.state.params.itemData.details}
                        </Text>
                    </View>

                    <View style={styles.separator}></View>
                    <View style={styles.addToCarContainer}>
                        <TouchableOpacity style={styles.shareButton} onPress={()=> this.props.navigation.navigate("PaymentTransaction", {itemData : this.props.navigation.state.params.itemData})}>
                            <Text style={styles.shareButtonText}>Pay Now!</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        marginTop:20,
    },
    productImg:{
        width:200,
        height:200,
    },
    name:{
        fontSize:28,
        color:"#696969",
        fontWeight:'bold'
    },
    price:{
        marginTop:10,
        fontSize:18,
        color:"green",
        fontWeight:'bold'
    },
    description:{
        textAlign:'center',
        marginTop:10,
        color:"#696969",
    },
    star:{
        width:40,
        height:40,
    },
    btnColor: {
        height:30,
        width:30,
        borderRadius:30,
        marginHorizontal:3
    },
    btnSize: {
        height:40,
        width:40,
        borderRadius:40,
        borderColor:'#778899',
        borderWidth:1,
        marginHorizontal:3,
        backgroundColor:'white',

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    starContainer:{
        justifyContent:'center',
        marginHorizontal:30,
        flexDirection:'row',
        marginTop:20
    },
    contentColors:{
        justifyContent:'center',
        marginHorizontal:30,
        flexDirection:'row',
        marginTop:20
    },
    contentSize:{
        justifyContent:'center',
        marginHorizontal:30,
        flexDirection:'row',
        marginTop:20
    },
    separator:{
        height:2,
        backgroundColor:"#eeeeee",
        marginTop:20,
        marginHorizontal:30
    },
    shareButton: {
        marginTop:10,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:30,
        backgroundColor: "#00BFFF",
    },
    shareButtonText:{
        color: "#FFFFFF",
        fontSize:20,
    },
    addToCarContainer:{
        marginHorizontal:30
    }
});


export default PaymentDetail;
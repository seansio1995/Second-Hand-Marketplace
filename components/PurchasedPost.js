import React, { Component, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button, FlatList, Image} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {withNavigation} from "react-navigation";
import Purchased from "../screens/Purchased";

class PurchasedPost extends Component {
    constructor(props) {
        super(props);

    }



    render() {
        let {data} = this.props;
        return (
            <View>
                <Image
                    style={{width: 400, height: 200}}
                    source={{uri: data.imageURL}}
                />
                <Text style = {styles.mytext}>Name : {data.name}</Text>
                <Text style = {styles.mytext}>Price : {data.price}</Text>
                <Text style = {styles.mytext}>Location : {data.location}</Text>
                <Text style = {styles.mytext}>Details : {data.details}</Text>
                <Text style = {styles.mytext}>Seller: {data.postUser} </Text>

                <View style = {styles.buttonGroup}>
                    <TouchableOpacity
                        style = {styles.chatButtonStyle}
                    >
                        <Text style = {styles.textColor}>Chat💬</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style = {styles.buyButtonStyle}
                        onPress = {() => this.props.navigation.navigate("Review", {data : data})}
                    >
                        <Text style = {styles.textColor}>Review⭐</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonGroup : {
        flexDirection : "row"
    },
    chatButtonStyle : {
        marginTop : 10,
        marginRight : 90,
        marginBottom : 20,
        paddingTop:10,
        paddingBottom:10,
        width : 100,
        backgroundColor:'#F39C12',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#E67E22',
        alignItems : "center",
    },
    buyButtonStyle : {
        marginTop : 10,
        marginBottom : 20,
        marginLeft:100,
        paddingTop:10,
        paddingBottom:10,
        width : 100,
        backgroundColor:'#A569BD',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#6C3483',
        alignItems : "center"
    },
    mytext :{
        fontFamily:"Georgia-BoldItalic",
        fontSize: 15
    },
    textColor : {
        color : "#fff"
    }
});


export default withNavigation(PurchasedPost);

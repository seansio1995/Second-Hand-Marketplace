import React, { Component, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button, FlatList, Image} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {withNavigation} from "react-navigation";

class Post extends Component {
    constructor(props) {
        super(props);

    }



    render() {
        let {data} = this.props;
        return (
            <View>
                <Image
                    style={{width: 330, height: 200}}
                    source={{uri: data.imageURL}}
                />
                <Text style = {styles.mytext}>Name : {data.name}</Text>
                <Text style = {styles.mytext}>Price : {data.price}</Text>
                <Text style = {styles.mytext}t>Location : {data.location}</Text>
                <Text style = {styles.mytext}>Details : {data.details}</Text>
                <TouchableOpacity
                    onPress = {() => this.props.navigation.navigate("SellerDetail", {data : data})}
                >
                    <Text style = {{color : "blue" , fontStyle: 'italic', fontSize:15}}>About Seller</Text>
                </TouchableOpacity>
                <View style = {styles.buttonGroup}>
                    <TouchableOpacity
                        onPress = {() => this.props.navigation.navigate("OneChat", {receiverId : data.postUserId, receiverName : data.name})}
                        style = {styles.chatButtonStyle}
                    >
                        <Text style = {styles.textColor}>Chat💬</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style = {styles.buyButtonStyle}
                        onPress = {() => this.props.navigation.navigate("PaymentDetail", {itemData : data})}
                    >
                        <Text style = {styles.textColor}>Buy💰</Text>
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
        marginRight : 80,
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
        marginLeft:55,
        paddingTop:10,
        paddingBottom:10,
        width : 100,
        backgroundColor:'#EC7063',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#E74C3C',
        alignItems : "center"
    },
    mytext :{
        fontFamily:"Georgia-BoldItalic",
        fontSize: 15
    },
    textColor : {
        color : "#fff",
        fontSize : 15
    }
});


export default withNavigation(Post);

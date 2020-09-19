import React, { Component, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button, FlatList, Image} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {withNavigation} from "react-navigation";
import {AirbnbRating} from "react-native-ratings";

class ReviewComp extends Component {
    constructor(props) {
        super(props);

    }



    render() {
        let {data} = this.props;
        return (
            <View>
                <AirbnbRating
                    count={5}
                    reviews={["Terrible", "Bad", "OK", "Good", "Unbelievable"]}
                    defaultRating={data.rating}
                    size={20}
                    isDisabled={true}
                />
                <Image
                    style={{width: 250, height: 250, alignSelf : "center"}}
                    source={{uri: data.imageURL}}
                />
                <View style = {{marginLeft : 30}}>
                    <Text style = {styles.mytext}>Name : {data.name}</Text>
                    <Text style = {styles.mytext}>Price : {data.price}</Text>
                    <Text style = {styles.mytext}>Location : {data.location}</Text>
                    <Text style = {styles.mytext}>Details : {data.details}</Text>
                    <Text style = {styles.mytext}>Comment : {data.comment}</Text>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    mytext :{
        fontFamily:"Georgia-BoldItalic",
        fontSize: 15
    },
});


export default ReviewComp;

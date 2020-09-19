import React, { Component, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button, FlatList, Image, ScrollView} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {withNavigation} from "react-navigation";
import {AirbnbRating} from "react-native-ratings";
import {firebaseClient} from "../config/FirebaseConfig";

class Review extends Component {
    static navigationOptions = {
        title: 'Review',
    };

    constructor(props) {
        super(props);
        this.state = {
            data : this.props.navigation.state.params.data,
            reviewComment : "",
            rating : 0
        }
    }

    handleRating = (val) => {
        console.log(val);
        this.setState({rating : val});
    }


    onChangeComment = (comment) => {
        this.setState({reviewComment : comment})
    }

    handleSubmit = () => {
        let reviewData = {
            productData : this.state.data,
            rating : this.state.rating,
            comment : this.state.reviewComment,
            sellerId : this.state.data.postUserId
        };
        var newPostKey = firebaseClient.database().ref("reviews/" + this.state.data.postUserId).push(reviewData);

        this.props.navigation.navigate('Purchased');
    }

    render () {
        let {data} = this.state;
        return (
            <ScrollView>
                <Text style = {styles.header}>Product Review</Text>
                <View style = {styles.productDetail}>
                    <Image
                        style={{width: 250, height: 250}}
                        source={{uri: data.imageURL}}
                    />
                    <Text>Name : {data.name}</Text>
                    <Text>Price : {data.price}</Text>
                    <Text>Location : {data.location}</Text>
                    <Text>Details : {data.details}</Text>
                    <Text>Seller : {data.postUser} </Text>
                </View>
                <AirbnbRating
                    count={5}
                    reviews={["Terrible", "Bad", "OK", "Good", "Unbelievable"]}
                    defaultRating={5}
                    size={20}
                    onFinishRating={this.handleRating}
                />
                <Text style = {{marginLeft: 40}}>Comment: </Text>
                <TextInput
                    style={{ height: 120, width : "60%", borderColor: 'gray', borderWidth: 1, marginBottom : 20, alignSelf : "center" }}
                    onChangeText={text => this.onChangeComment(text)}
                    value={this.state.reviewComment}
                    multiline = {true}
                    numberOfLines = {5}
                    scrollEnabled = {true}
                />

                <TouchableOpacity
                    style = {styles.submitButton}
                    onPress={() => this.handleSubmit()}
                >
                    <Text style={styles.submitText}>Submit Review</Text>

                </TouchableOpacity>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
   header : {
     fontSize : 30,
     alignSelf : "center"
   },
   productDetail : {
       alignSelf : "center"
   },
    submitButton : {
        marginTop : 20,
        paddingTop:10,
        paddingBottom:10,
        width : "50%",
        backgroundColor:'red',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        alignSelf : "center"
    },
    submitText:{
        color:'#fff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
    }
});
export default Review;
import React, { Component, useState } from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Text, Button, ScrollView, Alert} from 'react-native';
import {AntDesign, Feather} from '@expo/vector-icons';
import uuid from "uuid";
import {firebaseClient} from "../config/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

class EditPost extends Component {
    static navigationOptions = {
        title: 'Edit Post',
    };

    constructor(props) {
        super(props);
        this.state = {
            name : this.props.navigation.state.params.postData.name,
            price : this.props.navigation.state.params.postData.price,
            location : this.props.navigation.state.params.postData.location,
            details : this.props.navigation.state.params.postData.details,
            postImageURL : this.props.navigation.state.params.postData.imageURL,
            currentPostId : this.props.navigation.state.params.postData.postId
        }
    }


    onChangeName = (name) => {
        this.setState({name : name})
    }

    onChangePrice = (price) => {
        this.setState({price : price});
    }

    onChangeLocation = (location) => {
        this.setState({location : location})
    }

    onChangeDetails = (details) => {
        this.setState({details : details})
    }

    //handle upload image
    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    handleUploadImage = async () => {
        await this.askPermissionsAsync();
        //its granted.
        let result = await ImagePicker.launchCameraAsync();
        //let result = await ImagePicker.launchImageLibraryAsync();

        if (!result.cancelled) {
            let imageName = uuid.v1();
            await this.uploadImage(result.uri, imageName )
                .then(() => {

                })
                .catch((error) => {

                });
            console.log("Success");
            firebaseClient.storage().ref().child("postImages/" + imageName).getDownloadURL().then(

                url => {
                    console.log("edit post image");
                    console.log(url);
                    this.setState({postImageURL: url});
                    Alert.alert(
                        'Success',
                        'Image Upload Success',
                        [
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        {cancelable: false},
                    );
                }
            );
        }

    }

    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebaseClient.storage().ref().child("postImages/" + imageName);
        return ref.put(blob);
    }

    handleSubmit = () => {
        console.log("Click Edit Post");
        firebaseClient.database().ref("posts/" + this.state.currentPostId).update({
            itemName: this.state.name,
            price : this.state.price,
            location : this.state.location,
            details : this.state.details,
            imageURL : this.state.postImageURL
        }, function(error) {
            if (error) {
                console.log("Edit Post Failed!");
                Alert.alert(
                    'Failure',
                    'Update is unsuccessful',
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                );
            } else {
                Alert.alert(
                    'Success',
                    'Update Successfully',
                    [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                );
            }
        });


        this.props.navigation.navigate('MyPosts');
    }

    render() {
        return (
            <ScrollView>
                <View style = {styles.form}>
                    <Text>Item Name</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.onChangeName(text)}
                        value={this.state.name}
                    />

                    <Text>Price</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.onChangePrice(text)}
                        value={this.state.price}
                    />

                    <Text>Location</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.onChangeLocation(text)}
                        value={this.state.location}
                    />

                    <Text>Details</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.onChangeDetails(text)}
                        value={this.state.details}
                        multiline = {true}
                        numberOfLines = {5}
                        scrollEnabled = {true}
                    />

                    <Text style = {{marginTop : 40, marginLeft : "37%", fontSize:12}}>Upload Image</Text>
                    <TouchableOpacity
                        onPress = {() => this.handleUploadImage()}
                    >
                        <AntDesign style = {styles.uploadButton }name = "clouduploado" size = {50}/>
                    </TouchableOpacity>



                    <TouchableOpacity
                        style = {styles.submitButton}
                        onPress={() => this.handleSubmit()}
                    >
                        <Text style={styles.submitText}>Update Post</Text>

                    </TouchableOpacity>
                </View>

            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    header: {
        fontSize : 30
    },
    form : {
        marginTop : "10%",
        marginLeft: 6,
    },
    uploadButton : {
        padding: 0,
        marginLeft: "40%",
        marginTop: 10,
    },
    textInput:{
        height: 40,
        borderWidth: 1,
        marginBottom : 10,
        fontSize: 16,
        paddingRight: 45,
        paddingLeft: 8,
        marginLeft: 2,
        borderColor: 'grey',
        borderRadius: 5,
        width: '95%',
        padding: 2,
        marginTop: 8,
        backgroundColor:'#ebedef',
    },
    submitButton : {
        marginTop : 30,
        paddingTop:10,
        paddingBottom:10,
        width : "50%",
        backgroundColor:'pink',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        marginLeft: "25%",
    },
    submitText:{
        color:'#fff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
    }
});

export default EditPost;
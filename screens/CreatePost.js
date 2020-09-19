import React, { Component, useState } from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Text, Button, ScrollView, Alert} from 'react-native';
import {AntDesign, Feather} from "@expo/vector-icons";
import {firebaseClient} from "../config/FirebaseConfig";
import uuid from "uuid";
import FileUploader from "react-firebase-file-uploader";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

class CreatePost extends Component {
    static navigationOptions = {
        title: 'Create Post',
        headerStyle: {
            backgroundColor: '#ebedef',
            color: '#000000',
        },
    };
    constructor(props) {
        super(props);
        this.state = {
            name : "",
            price : 0,
            location : "",
            details : "",
            postImageURL : "",
            currentUser : firebaseClient.auth().currentUser
        }
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
    // image file upload

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
        console.log("Click");
        var postData = {
            uid: uuid.v1(),
            itemName: this.state.name,
            price : this.state.price,
            location : this.state.location,
            details : this.state.details,
            imageURL : this.state.postImageURL,
            user : this.state.currentUser.email,
            userUid : this.state.currentUser.uid
        };

        var newPostKey = firebaseClient.database().ref("posts").push(postData);

        this.props.navigation.navigate('Feed');
    }





    render() {
        return (
            <ScrollView>
                <View style = {styles.form}>

                    <TextInput
                        placeholder="Item Name"
                        style={styles.textInput}
                        onChangeText={text => this.onChangeName(text)}
                        value={this.state.name}
                    />


                    <TextInput
                        placeholder="Price"
                        style={styles.textInput}
                        onChangeText={text => this.onChangePrice(text)}
                        value={this.state.price}
                    />


                    <TextInput
                        placeholder="Location"
                        style={styles.textInput}
                        onChangeText={text => this.onChangeLocation(text)}
                        value={this.state.location}
                    />


                    <TextInput
                        placeholder="Details"
                        style={styles.textInput}
                        onChangeText={text => this.onChangeDetails(text)}
                        value={this.state.details}
                        multiline = {true}
                        numberOfLines = {5}
                        scrollEnabled = {true}
                    />

                    <Text style = {{marginTop : 40, fontSize: 16, padding: 0}}>Upload Image</Text>
                    <TouchableOpacity
                        onPress = {() => this.handleUploadImage()}
                    >
                        <AntDesign style = {styles.uploadButton }name = "clouduploado" size = {60}/>
                    </TouchableOpacity>



                    <TouchableOpacity
                        style = {styles.submitButton}
                        onPress={() => this.handleSubmit()}
                    >
                    <Text style={styles.submitText}>Create Post</Text>

                    </TouchableOpacity>
                </View>

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    form : {
        marginTop: "25%",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
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
    uploadButton : {
        padding: 0,
        marginTop : 5,
    },
    submitButton : {
        marginTop : 30,
        paddingTop:10,
        paddingBottom:10,
        width : "95%",
        backgroundColor:'red',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    submitText:{
        color:'#fff',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10
    }
});

export default CreatePost;
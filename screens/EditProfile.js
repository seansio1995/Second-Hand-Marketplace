import React, { Component, useState } from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity, Text, Button, ScrollView, Alert, Image} from 'react-native';
import {AntDesign, Feather} from '@expo/vector-icons';
import uuid from "uuid";
import {firebaseClient} from "../config/FirebaseConfig";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';


class EditProfile extends Component {
    static navigationOptions = {
        title: 'Update Profile',
        headerStyle: {
            backgroundColor: '#ebedef',
            color: '#000000',
        },
    };


    constructor(props) {
        super(props);
        this.state = {
            displayName : "",
            email : "",
            password : "",
            bio : "",
            image : null,
            currentUser : firebaseClient.auth().currentUser,
            error:false
        }
    }

    onChangeName = (name) => {
        this.setState({"displayName" : name});
    }

    onChangeEmail = (email) => {
        this.setState({"email" : email});
    }

    onChangePassword = (password) => {
        this.setState({"password" : password});
    }

    onChangeBio = (bio) => {
        this.setState({"bio" : bio});
    }

    handleUpdate =() =>{
        this.handleNameSubmit();
        if(this.state.error === true){
            Alert.alert(
                'Failure',
                'Update Name is unsuccessful',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
            this.state.error = false;
        }

        this.handleEmailSubmit();
        if(this.state.error === true) {
            Alert.alert(
                'Failure',
                'Update Email is unsuccessful',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
            this.state.error = false;
        }

        this.handlePasswordSubmit();
        if(this.state.error === true) {
            Alert.alert(
                'Failure',
                'Update Password is unsuccessful',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
            this.state.error = false;
        }
        this.handleBioSubmit();

        Alert.alert(
            'Success',
            'Update done successfully',
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
        );
    }

    handleNameSubmit = () => {
        if (this.state.displayName!=="") {
            var user = firebaseClient.auth().currentUser;
            user.updateProfile({
                displayName: this.state.displayName
            }).then(function () {
                // Update successful.
               console.log("Display Name updated successfully");
            }).catch(function (error) {
                // An error happened.
                console.log("Display Name update unsuccessful");
                this.state.error = true;
            });
        }
    }

    handleEmailSubmit = () => {
        if (this.state.email!=="") {
            var user = firebaseClient.auth().currentUser;
            user.updateEmail(this.state.email).then(function () {
                // Update successful.
                console.log("Email address updated successfully");
            }).catch(function (error) {
                // An error happened.
                console.log("Email address update unsuccessful");
                this.state.error = true;

            });
        }
    }

    handlePasswordSubmit = () => {
        if (this.state.password!=="") {
            var user = firebaseClient.auth().currentUser;
            user.updatePassword(this.state.password).then(function () {
                // Update successful.
                console.log("Password updated successfully");
            }).catch(function (error) {
                // An error happened.
                console.log("Password update unsuccessful");
                this.state.error = true;
            });
        }
    }

    handleBioSubmit = () => {
        if (this.state.bio!=="") {
            firebaseClient.database().ref("userBios/" + this.state.currentUser.uid).set({
                bio: this.state.bio
            });
            this.props.navigation.navigate("Feed");
        }
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
            const response = await fetch(result.uri);
            const blob = await response.blob();

            var ref = firebaseClient.storage().ref().child("userAvatars/" + this.state.currentUser.uid);
            ref.put(blob);
        }

    };

    render() {
        let { image } = this.state;
        return (
            <ScrollView>
                <View style = {styles.form}>

                    <TextInput
                        placeholder="Full name"
                        style={styles.textInput}
                        onChangeText={text => this.onChangeName(text)}
                        value={this.state.name}
                    />

                    <TextInput
                        placeholder="username/ email"
                        style={styles.textInput}
                        onChangeText={text => this.onChangeEmail(text)}
                        value={this.state.email}
                    />

                    <TextInput
                        secureTextEntry
                        placeholder="Password"
                        autoCapitalize="none"
                        style={styles.textInput}
                        onChangeText={text => this.onChangePassword(text)}
                        value={this.state.password}
                    />

                    <TextInput
                        placeholder="Bio"
                        style={styles.textInput}
                        onChangeText={text => this.onChangeBio(text)}
                        value={this.state.bio}
                    />

                    <TouchableOpacity
                        style = {styles.submitButton}
                        onPress={() => this.handleUpdate()}
                    >
                        <Text style={styles.submitText}>Update</Text>
                    </TouchableOpacity>


                    <Text style = {styles.avatarText}>Upload Avatar</Text>
                    <TouchableOpacity
                        style = {styles.uploadButton}
                        onPress={this._pickImage}
                    >
                        <AntDesign name="pluscircle" size={65} color="black" />
                    </TouchableOpacity>
                    {image &&
                    <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}


                </View>
            </ScrollView>

        );
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
    submitButton : {
        marginTop : 10,
        marginBottom : 20,
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
    },
    uploadButton : {
        padding:0
    },
    avatarText : {
        marginTop : 20,
        marginBottom : 20
    }
});

export default EditProfile;
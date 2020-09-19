import React, { Component, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button, Image} from 'react-native';
import {firebaseClient} from "../config/FirebaseConfig";
import firebase from "firebase";
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import SellPalImageLogo from './SellPalImageLogo.js';

class Login extends  Component {
    static navigationOptions = {
        title: 'Login',
        headerStyle: {
            backgroundColor: '#ebedef',
            color: '#000000',
        },
    };
    constructor(props) {
        super(props);
        this.state = {
            email : "",
            password : "",
            errorMessage : null
        }
    }

    componentDidMount() {
        firebaseClient.auth().onAuthStateChanged(user => {
            if (user != null) {
                console.log(user);
            }
        });
    }

    handleLogin = () => {
        console.log("Handle Login");
        let {email, password} = this.state;
        firebaseClient
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('Feed'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }

    onSignIn = (googleUser) => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
                unsubscribe();
                // Check if we are already signed-in Firebase with the correct user.
                if (!this.isUserEqual(googleUser, firebaseUser)) {
                    // Build Firebase credential with the Google ID token.
                    var credential = firebase.auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    );
                    // Sign in with credential from the Google user.
                    firebase
                        .auth()
                        .signInWithCredential(credential).then(function(){
                        console.log('user logged in')
                    })
                        .catch(function(error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            // The email of the user's account used.
                            var email = error.email;
                            // The firebase.auth.AuthCredential type that was used.
                            var credential = error.credential;
                            // ...
                        });
                } else {
                    console.log('User already signed-in Firebase.');
                    this.props.navigation.navigate('Feed').catch(error => {
                        console.log(error);
                    });
                }
            }.bind(this)
        );
    }



    googleLogin =async () =>{
        try {
            const result = await Google.logInAsync({
                expoClientId:'',
                androidClientId: '',
                iosClientId: '',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                this.onSignIn(result);

                this.props.navigation.navigate('Feed').catch(error => {
                    console.log(error);
                });
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }




    facebookLogin = async () => {
        const {
            type,
            token
        } = await Facebook.logInWithReadPermissionsAsync('983512395337999', {
            permissions: ['public_profile'],
        });
        if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const credential =
                firebase
                    .auth
                    .FacebookAuthProvider
                    .credential(token);
            firebaseClient
                .auth().signInWithCredential(credential).then(() => this.props.navigation.navigate('Feed')).catch(error => {
                console.log(error);
            });
        } else {
            // type === 'cancel'
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <SellPalImageLogo />

        <TextInput
                    placeholder="username/ email"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={email => this.setState({email})}
                    value={this.state.email}
                />

                {this.state.errorMessage &&
                <Text style={{color: 'red'}}>
                    {this.state.errorMessage}
                </Text>}

                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={password => this.setState({password})}
                    value={this.state.password}
                />

                <TouchableOpacity onPress={this.handleLogin}>
                    <Text style={styles.login}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                    <Text style={styles.sign}>Don't have an account? Sign up</Text>
                </TouchableOpacity>


                <Text style={styles.socialLoginLabel}>Third Party Login</Text>

                <View style = {styles.socialLogin}>
                    <TouchableOpacity onPress={()=> this.facebookLogin()}>
                        <Image
                            style={{width: 50, height: 50, margin: 10}}
                            source={require("./facebook-login.jpg")}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=> this.googleLogin()}>
                        <Image
                            style={{width: 50, height: 50, margin: 10}}
                            source={require("./google-login.jpg")}
                        />
                    </TouchableOpacity>
                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '95%',
        borderWidth: 1,
        marginTop: 8,
        fontSize: 16,
        paddingRight: 45,
        paddingLeft: 8,
        marginLeft: 2,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 2,
        backgroundColor:'#ebedef',

    },
    login:{
        padding: 10,
        paddingRight:150,
        paddingLeft:150,
        marginTop: 10,
        backgroundColor: '#ff0000',
        color: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 'bold',
        overflow: 'hidden',
        textAlign:'center',
    },
    sign:{
        padding: 0,
        paddingTop: 10,
        color: "#0053a0",
    },
    socialLogin : {
        flexDirection : "row"
    },
    socialLoginLabel : {
        marginTop : 30
    }
});

export default Login;
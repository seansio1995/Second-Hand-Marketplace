import React, { Component, useState } from 'react';
import {  View, StyleSheet, TextInput, TouchableOpacity, Text, Image} from 'react-native';
import {firebaseClient} from "../config/FirebaseConfig";
import SellPalImageLogo from './SellPalImageLogo.js';


class SignUp extends  Component {
    static navigationOptions = {
        title: 'Signup',
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
            errorMessage : null,
        }
    }

    handleSignUp = () => {
        console.log("Handle Signup");
        firebaseClient
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => this.props.navigation.navigate('Login'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }



    render() {
        return (
            <View style={styles.container}>
                <SellPalImageLogo />

                <TextInput
                    placeholder="username/ email"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}

                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style = { styles.textInput }
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />


                <TouchableOpacity onPress={this.handleSignUp}>
                    <Text style={styles.sign}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={styles.login}>Already have an account? Login</Text>
                </TouchableOpacity>

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
        fontSize: 16,
        paddingRight: 45,
        paddingLeft: 8,
        borderWidth: 1,
        marginLeft: 2,
        borderColor: 'grey',
        borderRadius: 5,
        height: 40,
        width: '95%',
        padding: 2,
        marginTop: 8,
        backgroundColor:'#ebedef',
    },
    sign:{
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
    login:{
        padding: 0,
        paddingTop: 10,
        color: "#0053a0",
    }
});
export default SignUp;
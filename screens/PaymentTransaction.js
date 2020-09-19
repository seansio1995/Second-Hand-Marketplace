import React, { Component, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
var stripe = require('stripe-client')('pk_test_VrppDsaaqFYTpBaol8lyIr4R00nYM3Cejy');
import axios from "axios";
import {firebaseClient} from "../config/FirebaseConfig";


class PaymentTransaction extends Component {
    static navigationOptions = {
        title: 'Payment Transaction',
    };

    constructor(props) {
        super(props);
        this.state = {
            number : "",
            expMonth : "",
            expYear : "",
            cvc : "",
            name : "",
            postData :this.props.navigation.state.params.itemData
        }
    }


    handleOnChange = (form) => {
        console.log(form);
        if (form.values.expiry.length === 5) {
            this.setState({
                number : form.values.number,
                cvc : form.values.cvc,
                expMonth : form.values.expiry.substring(0,2),
                expYear : form.values.expiry.substring(3,5)
            });
            console.log(this.state.expMonth);
            console.log(this.state.expYear)
        }

    }

    makePayment = async () => {
        var information = {
            card: {
                number: this.state.number,
                exp_month: this.state.expMonth,
                exp_year: this.state.expYear,
                cvc: this.state.cvc,
                name: 'Billy Joe'
            }
        };

        var card = await stripe.createToken(information);
        var stripeToken = card.id;

        const body = {
            amount: this.state.postData.price * 100,
            tokenId: stripeToken,
        };
        console.log(stripeToken);
        const headers = {
            'Content-Type': 'application/json',
        };
        return axios
            .post('http://localhost:8000/', body, { headers })
            .then(({ data }) => {
                console.log(data);
                return data;
            })
            .catch(error => {
                return Promise.reject('Error in making payment', error);
            }).then(() => {
                let data = this.state.postData;
                let purchasedData = {
                    itemName: data.name,
                    price : data.price,
                    location : data.location,
                    details : data.details,
                    imageURL :data.imageURL,
                    postUser : data.postUser,
                    postUserId : data.postUserId,
                    productUid : data.productUid,
                    purchasedBy : firebaseClient.auth().currentUser.email
                };
                firebaseClient.database().ref("purchased").push(purchasedData);
                this.props.navigation.navigate("PaymentSuccess")
            });
    }

    render() {
        return (
            <View>
                <CreditCardInput onChange={this.handleOnChange} />

                <TouchableOpacity style={styles.shareButton} onPress={()=> this.makePayment()}>
                    <Text style={styles.shareButtonText}>Make Payment</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    shareButton: {
        marginTop: 30,
        marginLeft : "20%",
        height: 45,
        width : "50%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    }
});
export default PaymentTransaction;
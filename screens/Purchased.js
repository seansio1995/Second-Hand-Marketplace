import React, { Component, useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Button,
    ScrollView,
    SafeAreaView,
    FlatList
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {firebaseClient} from "../config/FirebaseConfig";
import Feed from "./Feed";
import Image from "react-native-web/dist/exports/Image";
import Post from "../components/Post";
import PurchasedPost from "../components/PurchasedPost";
import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack";


class Purchased extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        return {

            headerLeft: firebaseClient.auth().currentUser !== null ?
                <Button
                    title = "Home"
                    onPress={() => navigation.goBack(null)}
                /> :
                <Button
                    title = "Back"
                    onPress={() => navigation.navigate("Login")}
                />

        };

    };

    constructor(props) {
        super(props);
        this.state = {
            purchased: [
            ],
            currentUser : firebaseClient.auth().currentUser
        };
    }

    componentDidMount() {
        firebaseClient.auth().onAuthStateChanged(user => {
            if (!user) {
                this.setState({currentUser : null});
                return;
            } else {
                // 获取数据setState
                this.setState({currentUser : firebaseClient.auth().currentUser});
                var storageRef = firebaseClient.database().ref("purchased");
                storageRef.on("value", (snapshot) => {
                    let data = snapshot.val();
                    let newState = [];
                    for (let index in data) {
                        if (data[index]["purchasedBy"] === this.state.currentUser.email) {
                            let tmpData = {
                                name: data[index]["itemName"],
                                price: data[index]["price"],
                                location: data[index]["location"],
                                details: data[index]["details"],
                                imageURL: data[index]["imageURL"],
                                postUser: data[index]["postUser"],
                                postUserId: data[index]["postUserId"],
                                productUid: data[index]["productUid"]
                            }
                            newState.push(tmpData);
                        }

                    }
                    this.setState({purchased: newState});
                });

                var user = firebaseClient.auth().currentUser;
                console.log(user.uid);
            }
        });
    }

    render() {
        const {purchased} = this.state;
        if (firebaseClient.auth().currentUser !== null) {
            return (
                <View>
                    <ScrollView style={{backgroundColor:'#EBF5FB'}}>
                        <Text style={styles.headerStyle}>Purchased List</Text>
                        <SafeAreaView style={styles.page_container}>
                            <FlatList
                                data={purchased}
                                renderItem={({item}) =>
                                    <PurchasedPost
                                        data={item}
                                    />
                                }
                                keyExtractor={item => item.id}
                                style={styles.container}
                            />
                        </SafeAreaView>
                    </ScrollView>
                </View>

            )
        } else {
            return (
                <View style = {{justifyContent : "center", alignItems: 'center',
                    flex:1}}>
                    <Text style={{fontSize : 35}}>User not login in</Text>
                </View>
            )
        }
    }

}
const styles = StyleSheet.create({
    headerStyle : {
      marginTop : 40,
      fontSize : 30,
      alignSelf: "center"
    },
    container : {
        marginTop : 30,
    },
    page_container : {
        alignSelf: "center"
    }
});

const navigator = createStackNavigator({
    Purchased: { screen: Purchased }}
);

const purchased = createAppContainer(navigator);

export default purchased;

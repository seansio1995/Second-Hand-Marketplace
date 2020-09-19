import React, { Component, useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Button,
    FlatList,
    Image,
    ScrollView,
    SafeAreaView
} from 'react-native';
import {AntDesign, Feather} from '@expo/vector-icons';
import {firebaseClient} from "../config/FirebaseConfig";
import Post from "../components/Post";
import EditPostComp from "../components/EditPostComp";
import {createStackNavigator} from "react-navigation-stack";
import { createAppContainer } from 'react-navigation';

class MyPosts extends Component {
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
            currentUser :  firebaseClient.auth().currentUser,
            posts : []
        }
    }

    componentDidMount= () => {
        firebaseClient.auth().onAuthStateChanged(user => {
            if (!user) {
                this.setState({currentUser : null});
                return;
            } else {
                console.log("hi there");
                var storageRef = firebaseClient.database().ref("posts");
                this.setState({currentUser : firebaseClient.auth().currentUser});
                storageRef.on("value", (snapshot) => {
                    let data = snapshot.val();
                    let newState = [];
                    for (let index in data) {
                        console.log(index);
                        if (data[index]["user"] === this.state.currentUser.email) {
                            let tmpData = {
                                postId: index,
                                name: data[index]["itemName"],
                                price: data[index]["price"],
                                location: data[index]["location"],
                                details: data[index]["details"],
                                imageURL: data[index]["imageURL"]
                            }
                            newState.push(tmpData);
                        }

                    }
                    this.setState({posts: newState});
                });
            }
        });

    }

    render() {
        if (firebaseClient.auth().currentUser !== null) {
            return (
                <ScrollView style={{backgroundColor:'#EBF5FB'}}>
                    <Text style={styles.headerStyle}>My Posts</Text>

                    <SafeAreaView style={styles.container}>
                        <FlatList
                            data={this.state.posts}
                            renderItem={({item}) =>
                                <EditPostComp
                                    data={item}
                                />
                            }
                            keyExtractor={item => item.postId}
                        />
                    </SafeAreaView>
                </ScrollView>
            )
        } else {
            return (
                <ScrollView>
                    <View style = {{justifyContent : "center", alignItems: 'center',
                        flex:1}}>
                        <Text style={{fontSize : 35, marginTop:"80%"}}>User not login in</Text>
                    </View>
                </ScrollView>
            )
        }
    }
}

const navigator = createStackNavigator({
    MyPosts: { screen: MyPosts }}
);

const styles = StyleSheet.create({
    headerStyle : {
        marginTop : 40,
        fontSize : 30,
        alignSelf: "center"
    },
    createButton: {
        alignSelf : "flex-end"
    },
    container : {
        flex: 1,
        marginTop: 20,
        marginLeft : "20%"
    }
});

const myPosts = createAppContainer(navigator);
export default myPosts;

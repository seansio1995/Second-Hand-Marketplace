import React, { Component, useState } from 'react';
import {View, ScrollView, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Text, Button, Image, FlatList} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {createTabNavigator} from "react-navigation-tabs";
import Chat from "./Chat";
import {AntDesign, Feather} from "@expo/vector-icons";
import MyPosts from "./MyPosts";
import Purchased from "./Purchased";
import {firebaseClient} from "../config/FirebaseConfig";
import Post from "../components/Post";
import SignUp from "./SignUp";
import Login from "./Login";
import CreatePost from "./CreatePost";
import PaymentDetail from "./PaymentDetail";
import PaymentTransaction from "./PaymentTransaction";
import EditPost from "./EditPost";
import PaymentSuccess from "./PaymentSucess";
import EditProfile from "./EditProfile";
import Review from "./Review";
import GroupChat from "./GroupChat";
import OneChat from "./OneChat";
import ChatTab from "./ChatTab";
import SellerDetail from "./SellerDetail";


class Feed extends  Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerRight: firebaseClient.auth().currentUser !== null ?
                        <Button
                            title = "Log out"
                            onPress={() => params.handleSignout()}
                        /> :
                        <Button
                            title = "Back"
                            onPress={() => navigation.navigate("Login")}
                        />
        };
    };
    constructor(props) {
        super(props);
        this.state= {
            posts : [],
            currentUser : null,
            userName : "",
            avatarURL : ""
        }
    }

    componentDidMount= () => {
        firebaseClient.auth().onAuthStateChanged(user => {
            if (!user) {
                this.props.navigation.navigate('Login');
                return;
            } else {
                this.props.navigation.setParams({ handleSignout: this.signOut });
                if (firebaseClient.auth().currentUser.displayName !== "") {
                    this.setState({userName : firebaseClient.auth().currentUser.displayName});
                } else {
                    this.setState({userName : firebaseClient.auth().currentUser.email});
                }

                var user = firebaseClient.auth().currentUser;
                console.log("user");
                console.log(user.uid);
                this.setState({currentUser : user});
                //console.log(user.uid);

                //get avatar
                firebaseClient.storage().ref().child("userAvatars/" + user.uid).getDownloadURL().then(
                    url => this.setState({avatarURL : url})
                ).catch(err => console.log("Not exist"));
            }
        });
        // update displayname

        var storageRef = firebaseClient.database().ref("posts");
        storageRef.on("value", (snapshot) => {
            let data = snapshot.val();
            let newState = [];
            for(let index in data) {
                let tmpData = {
                    name : data[index]["itemName"],
                    price : data[index]["price"],
                    location : data[index]["location"],
                    details : data[index]["details"],
                    imageURL :  data[index]["imageURL"],
                    postUser : data[index]["user"],
                    postUserId : data[index]["userUid"],
                    productUid : data[index]["uid"]
                }
                newState.push(tmpData);
            }
            this.setState({posts : newState});
        });

    }

    signOut= async () => {
        try {
            await firebaseClient.auth().signOut();
            this.setState({currentUser : null});
            this.props.navigation.navigate('Login');
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (this.state.currentUser !== null) {
            return (
                <ScrollView style={{backgroundColor:'#EBF5FB'}}>
                    <Text style={styles.hello_name}>Hello, {this.state.userName}😁</Text>
                    {this.state.avatarURL !== "" &&
                    <Image source={{uri: this.state.avatarURL}} style={styles.avatarStyle}/>}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.editProfileButton}
                            onPress={() => this.props.navigation.navigate('EditProfile')}>
                            <Text style={{color: '#fff'}}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.editProfileButton2}
                            onPress={() => {this.props.navigation.navigate("Chat");}}>
                            <Text style={{color: '#fff'}}>My Chats</Text>
                        </TouchableOpacity>
                    </View>
                    <SafeAreaView style={styles.container}>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={() => this.props.navigation.navigate('CreatePost')}>
                            <AntDesign name="pluscircle" size={35} color="black"/>
                        </TouchableOpacity>
                        <FlatList
                            data={this.state.posts}
                            renderItem={({item}) =>
                                <Post
                                    data={item}
                                />
                            }
                            keyExtractor={item => item.uid}
                        />
                    </SafeAreaView>
                </ScrollView>
            )
        } else {
            return (
                <ScrollView>
                    <View style = {{justifyContent : "center", alignItems: 'center',
                        flex:1}}>
                        <Text style={{fontSize : 35, marginTop : "80%"}}>User not login in</Text>
                    </View>
                </ScrollView>
            )
        }
    }
}


const navigator = createStackNavigator({
  SignUp: { screen: SignUp },
  Login : {screen : Login},
  Chat: { screen: Chat },
  GroupChat : {screen : GroupChat},
  OneChat : {screen : OneChat},
  ChatTab : {screen : ChatTab},
  Feed: { screen : Feed},
  MyPosts : {screen : MyPosts},
  CreatePost : {screen : CreatePost},
  EditPost : {screen : EditPost},
  EditProfile : {screen : EditProfile},
  PaymentDetail : {screen : PaymentDetail},
  PaymentTransaction : {screen : PaymentTransaction},
  PaymentSuccess : {screen : PaymentSuccess},
  Review : {screen : Review},
  SellerDetail : {screen : SellerDetail}
}, {
  initialRouteName : "Feed",
  defaultNavigationOptions :{
    title : "Home"
  }
});

const styles = StyleSheet.create({
    createButton: {
        position: 'absolute',
        top:"0%",
        right:5,
    },
    editProfileButton : {
        //alignSelf : "flex-start",
        position: 'absolute',
        top:0,
        left:"56%",
        paddingTop:10,
        paddingBottom:10,
        width : 80,
        backgroundColor:'#85C1E9',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#5DADE2',
        alignItems : "center"
    },
    editProfileButton2 : {
        //alignSelf : "flex-start",
        position: 'absolute',
        top:0,
        left:"78%",
        paddingTop:10,
        paddingBottom:10,
        width : 80,
        backgroundColor:'#F39C12',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#E67E22',
        alignItems : "center"
    },
    buttonContainer : {
        flex : 1,
        flexDirection :"row",
        justifyContent : "space-between"
    },
    texColor : {
        color : "#000"
    },
    container : {
        flex: 1,
        marginTop: "15%",
        marginLeft : "0%",
        //backgroundColor:"#D6EAF8",
        alignItems : "center"
    },
    avatarStyle : {
        position: 'absolute',
        top:5,
        left:5,
        height:68,
        width: 68,
        borderRadius: 34
    },
    hello_name : {
        //fontsize:10,
        //marginLeft: "50%",
        color: "#000",
        left:80,
        top:30,
        fontSize : 15,
        fontFamily:"Georgia-BoldItalic"
    }
});

const feed = createAppContainer(navigator);

export default feed;

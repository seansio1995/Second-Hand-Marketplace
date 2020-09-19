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
    FlatList, Image
} from 'react-native';
import { Avatar } from 'react-native-elements';
import {Feather} from "@expo/vector-icons";
import EditPostComp from "../components/EditPostComp";
import {firebaseClient} from "../config/FirebaseConfig";
import ChatTab from "./ChatTab";
import {createStackNavigator} from "react-navigation-stack";
import { createAppContainer } from 'react-navigation';
import SignUp from "./SignUp";
import Login from "./Login";
import GroupChat from "./GroupChat";
import MyPosts from "./MyPosts";

class Chat extends  Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        return {
            headerRight: (
                <Button
                    title = "Log out"
                    onPress={() => params.handleSignout()}
                />
            ),
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
            chats : [],
            currentUser : firebaseClient.auth().currentUser
        }
    }

    componentDidMount= () => {
        //console.log(typeof this.state.currentUser.uid);
        firebaseClient.auth().onAuthStateChanged(user => {
            if (user != null) {
                this.props.navigation.setParams({ handleSignout: this.signOut });
                this.setState({currentUser : firebaseClient.auth().currentUser})
                var storageRef = firebaseClient.database().ref("chats");
                storageRef.on("value", (snapshot) => {
                    let data = snapshot.val();
                    let newState = [];
                    for (let index in data) {
                        console.log(index);
                        let tmpSenderId = index.split(":")[0];
                        let tmpReceiverId = index.split(":")[1];
                        if (tmpReceiverId === this.state.currentUser.uid || tmpSenderId === this.state.currentUser.uid) {
                            let tmpData = {
                                chatId: index,
                                receiverId: index.split(":")[0]
                            }
                            newState.push(tmpData);
                        }

                    }
                    this.setState({chats: newState});
                    console.log("current chats");
                    console.log(this.state.chats);
                });
            } else {
                this.props.navigation.setParams({ handleSignout: () => this.props.navigation.navigate("Login") });
                this.setState({currentUser : null});
            }
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
        if (firebaseClient.auth().currentUser !== null) {

            return (
                <View style={{backgroundColor:'#EBF5FB'}}>
                    <Text style={styles.chatListHeading}>My Chat List</Text>
                    <ScrollView>
                        <SafeAreaView style={styles.container}>
                            <FlatList
                                data={this.state.chats}
                                renderItem={({item}) =>
                                    <ChatTab
                                        data={item}
                                    />
                                }
                                keyExtractor={item => item.chatId}
                            />
                        </SafeAreaView>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => {
                            this.props.navigation.navigate("GroupChat");
                        }}
                    >
                        <Text style={styles.submitText}>Group Chat</Text>

                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style = {{justifyContent : "center", alignItems: 'center',
                    flex:1,backgroundColor:'#EBF5FB'}}>
                    <Text style={{fontSize : 35}}>User not login in</Text>
                </View>
            )
        }
    }
}

const navigator = createStackNavigator({
        Chat : {screen : Chat},
    MyPosts: { screen: MyPosts }
    }
);

const styles = StyleSheet.create({
    container : {
        flex: 1,
        marginTop: 40
    },
    chatListHeading : {
        marginTop : 10,
        fontSize : 30,
        alignSelf: "center"
    },
    submitText:{
        color:'#fff',
        textAlign:'center',
        fontSize : 20,
       // paddingLeft : 10,
      //  paddingRight : 10,
    },
    submitButton : {
        marginTop : 60,
        marginBottom : 20,
        paddingTop:10,
        paddingBottom:10,
        width : "40%",
        backgroundColor:'#E67E22',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        alignSelf : "center"
    },
    avatarStyle : {
        position: 'absolute',
        top:5,
        right:5,
        height:58,
        width: 58,
        borderRadius: 29
    },
    avatarStyle2 : {
        position: 'absolute',
        top:105,
        right:5,
        height:58,
        width: 58,
        borderRadius: 29
    },
    avatarStyle3 : {
        position: 'absolute',
        top:205,
        right:5,
        height:58,
        width: 58,
        borderRadius: 29
    },
    avatarStyle4 : {
        position: 'absolute',
        top:305,
        right:5,
        height:58,
        width: 58,
        borderRadius: 29
    },
    notLogin : {
        fontSize : 30
    }
});

const chat = createAppContainer(navigator);
export default chat;

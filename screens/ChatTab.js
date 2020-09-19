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
import {Feather} from "@expo/vector-icons";
import EditPostComp from "../components/EditPostComp";
import {firebaseClient} from "../config/FirebaseConfig";
import { withNavigation } from 'react-navigation';
import {GiftedChat} from "react-native-gifted-chat";

class ChatTab extends  Component {
    constructor(props) {
        super(props);
        this.state = {
            receiver : "",
            latestMessage : "",
            timestamp : ""
        }
    }

    get ref() {
        return firebaseClient.database().ref('chats/' + this.props.data.chatId);
    }

    refOn = callback => {
        this.ref
            .limitToLast(1)
            .on('value', snapshot => callback(this.parse(snapshot)));
    }

    parse = snapshot => {
        const {timestamp: numberStamp, text, user} = snapshot.val();
        return text;
    }

    componentDidMount() {
        let [first, second] = this.props.data.chatId.split(":");
        let user = firebaseClient.auth().currentUser;
        if (first === user.uid) {

        }
        this.ref.limitToLast(1).on("value", (snapshot) => {
          for(let index in snapshot.val()) {
              let {text, createdAt} = snapshot.val()[index];
              this.setState({latestMessage : text, timestamp : new Date(createdAt)});
          }

        });
    }

    render() {
        let {latestMessage, timestamp} = this.state;
        return (
            <View>
                <TouchableOpacity
                    style = {styles.chatContainer}
                    onPress = {() => this.props.navigation.navigate("OneChat", {chatId : this.props.data.chatId})}
                >
                    <Text style = {styles.chatHeading}>Chat with Anonymous</Text>
                    <Text style = {styles.chatMessage}>{latestMessage}</Text>
                    <Text style = {styles.timeStyle}>{timestamp.toString()}</Text>
                    <Image source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}} style={styles.avatarStyle}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    chatTabStyle : {

    },
    chatHeading : {
      fontSize : 20,
      fontFamily:"Georgia-BoldItalic"
    },
    chatContainer : {
        width : "100%",
        height : 100,
        borderColor: "black",
        borderWidth: 2
    },
    chatMessage : {
        marginTop : 15,
        marginLeft : 15,
        fontSize : 15,
        color : "grey",
        fontStyle: 'italic'
    },
    timeStyle : {
        position : "absolute",
        right : 5,
        bottom : 5,
        fontSize : 10
    },
    avatarStyle : {
        position: 'absolute',
        top:5,
        right:5,
        height:58,
        width: 58,
        borderRadius: 29
    },
});
export default withNavigation(ChatTab);

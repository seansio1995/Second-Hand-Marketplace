import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, StyleSheet, TextInput, TouchableOpacity, Text} from 'react-native';
import {firebaseClient} from "../config/FirebaseConfig";


class GroupChat extends React.Component{

    static navigationOptions = {
        title: 'Group Chat',
    };

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            currentUser : firebaseClient.auth().currentUser
        };
    }



    get ref() {
        return firebaseClient.database().ref('messages');
    }

    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: id } = snapshot;
        const { key: _id } = snapshot; //needed for giftedchat
        const timestamp = new Date(numberStamp);

        const message = {
            id,
            _id,
            timestamp,
            text,
            user,
        };
        return message;
    };

    refOn = callback => {
        this.ref
            .limitToLast(20)
            .on('child_added', snapshot => callback(this.parse(snapshot)));
    }

    send = messages => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
                text,
                user,
                createdAt: new Date(),
            };
            this.ref.push(message);
        }
    };

    get user() {
        return {
            name: this.state.currentUser.displayName,
            email: this.state.currentUser.email,
            id: this.state.currentUser.uid,
            _id: this.state.currentUser.uid, // need for gifted-chat
        };
    }

    componentDidMount() {
        //console.log(this.state.currentUser);
        this.refOn(message =>
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            }))
        );
    }


    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={this.send}
                user={this.user}
            />
        );
    }
}

export default GroupChat;
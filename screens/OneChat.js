import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View, StyleSheet, TextInput, TouchableOpacity, Text} from 'react-native';
import {firebaseClient} from "../config/FirebaseConfig";
import Firebase from 'firebase';

class OneChat extends React.Component{

    static navigationOptions = {
        title: 'One to One Chat',
    };

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            currentUser : firebaseClient.auth().currentUser,
            avatarURL : ""
        };
    }



    get ref() {
        if (this.props.navigation.state.params.chatId != null) {
            let chatId = this.props.navigation.state.params.chatId;
            return firebaseClient.database().ref('chats/' + chatId);
        }
        let receiverId = this.props.navigation.state.params.receiverId;
        let senderId = this.state.currentUser.uid;
        let chatId;
        if (senderId > receiverId) {
            chatId = senderId + ":" + receiverId;
        } else {
            chatId = receiverId + ":" + senderId;
        }

        return firebaseClient.database().ref('chats/' + chatId);
    }

    get timestamp() {
        return Firebase.database.ServerValue.TIMESTAMP;
    }

    parse = snapshot => {
        const { createdAt: numberStamp, text, user } = snapshot.val();
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
                createdAt: this.timestamp,
            };
            this.ref.push(message);
        }
    };

    get user() {
        return {
            name: this.state.currentUser.displayName,
            email: this.state.currentUser.email,
            avatar : this.state.avatarURL,
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

        var user = firebaseClient.auth().currentUser;
        //console.log(user.uid);

        //get avatar
        firebaseClient.storage().ref().child("userAvatars/" + user.uid).getDownloadURL().then(
            url => this.setState({avatarURL : url})
        ).catch(err => console.log("Not exist"));
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

export default OneChat;
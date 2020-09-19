import React, { Component, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button, FlatList, Image} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {withNavigation} from "react-navigation";
import {firebaseClient} from "../config/FirebaseConfig";

class EditPostComp extends Component {
    constructor(props) {
        super(props);

    }

    deleteCurrentPost = (postId) => {
        firebaseClient.database().ref("posts/" + postId).remove();
    }

    render() {
        let {data} = this.props;
        return (
            <View>
                <Image
                    style={{width: 250, height: 200}}
                    source={{uri: data.imageURL}}
                />
                <Text style = {styles.mytext}>Name : {data.name}</Text>
                <Text style = {styles.mytext}>Price : {data.price}</Text>
                <Text style = {styles.mytext}>Location : {data.location}</Text>
                <Text style = {styles.mytext}>Details : {data.details}</Text>
                <View style = {styles.buttonGroup}>
                    <TouchableOpacity
                        style = {styles.chatButtonStyle}
                        onPress = {() => this.props.navigation.navigate("EditPost", {postData : data})}
                    >
                        <Text style = {styles.textColor}>Edit Post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style = {styles.buyButtonStyle}
                        onPress = {() => this.deleteCurrentPost(data.postId)}
                    >
                        <Text style = {styles.textColor}>Delete Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonGroup : {
        flexDirection : "row"
    },
    chatButtonStyle : {
        marginTop : 10,
        marginRight : 30,
        marginBottom : 20,
        paddingTop:10,
        paddingBottom:10,
        width : 100,
        backgroundColor:'#85C1E9',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#5DADE2',
        alignItems : "center",
    },
    buyButtonStyle : {
        marginTop : 10,
        marginBottom : 20,
        marginLeft:20,
        paddingTop:10,
        paddingBottom:10,
        width : 100,
        backgroundColor:'#EC7063',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#E74C3C',
        alignItems : "center"
    },
    mytext :{
        fontFamily:"Georgia-BoldItalic",
        fontSize: 15
    },
    textColor : {
        color : "#fff"
    }
});


export default withNavigation(EditPostComp);

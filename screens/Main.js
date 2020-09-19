import React, { Component, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button} from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {createTabNavigator} from "react-navigation-tabs";
import Chat from "./Chat";
import Feed from "./Feed";
import {Feather} from "@expo/vector-icons";

class Main extends  Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View>
                <Text>Main Page</Text>
                <Button
                    title = "Group Chat"
                    onPress = {() => {
                        this.props.navigation.navigate("Chat");
                    }}
                />
            </View>
        )
    }
}

Main.navigationOptions = () => {
    return {
        headerRight: (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CreatePost')}>
                <Feather name="plus" size={30} />
            </TouchableOpacity>
        ),

    };
};

const tabNavigator = createMaterialBottomTabNavigator({
    Feed : {screen : Feed},
    Chat : {screen : Chat}
}, {
    initialRouteName: 'Feed',
    activeColor: '#F44336',
})

const main = createAppContainer(tabNavigator);

export default main;
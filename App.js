// Import the screens
// npx expo-cli install react-native-gesture-handler react-native-reanimated react-navigation-stack
import SignUp from './screens/SignUp';
import Chat from './screens/Chat';
// Import React Navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from "./screens/Login";
import Feed from "./screens/Feed";
import CreatePost from "./screens/CreatePost";
import PaymentDetail from "./screens/PaymentDetail";
import {createBottomTabNavigator} from "react-navigation-tabs";
import MyPosts from "./screens/MyPosts";
import Purchased from "./screens/Purchased";
import {Feather} from "@expo/vector-icons";
import React from "react";

const tabNavigator = createBottomTabNavigator(
    {
      Feed : Feed,
      Chat : Chat,
      MyPosts : MyPosts,
      Purchased : Purchased
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'Feed') {
            iconName = "rss";
          } else if (routeName === 'Chat') {
            iconName = "message-square";
          } else if (routeName === "MyPosts") {
            iconName = "briefcase"
          } else if (routeName === "Purchased") {
            iconName = "shopping-cart"
          }

          // You can return any component that you like here! We usually use an
          // icon component from react-native-vector-icons
          return <Feather name={iconName} size={25} color={"red"} />;


        },
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        showIcon: true
      },
    }
)
export default createAppContainer(tabNavigator)
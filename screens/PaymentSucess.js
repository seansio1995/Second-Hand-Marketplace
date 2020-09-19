import React, {Component} from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button, Image} from 'react-native';


class PaymentSuccess extends Component {
    static navigationOptions = {
        title: 'Payment Detail',
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style = {styles.head}>Payment Successful</Text>
                <Image
                    style={{width: 150, height: 150}}
                    source={require("./success.png")}
                    style = {styles.logo}
                />

            <TouchableOpacity onPress={()=> this.props.navigation.navigate("Feed")} style = {styles.backButton}>
                <Text>Back to Home Page</Text>
            </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    head : {
        fontSize : 30,
        marginTop : 150,
        marginLeft : 80
    },

    logo : {
        marginTop : 100,
        marginLeft : 100
    },
    backButton : {
        marginTop: 30,
        marginLeft : "25%",
        height: 45,
        width : "50%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    }
})

export default PaymentSuccess;
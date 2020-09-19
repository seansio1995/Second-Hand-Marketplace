import React, { Component, useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Button,
    Image,
    FlatList,
    ScrollView,
    SafeAreaView
} from 'react-native';
import {Feather} from "@expo/vector-icons";
import {firebaseClient} from "../config/FirebaseConfig";
import Post from "../components/Post";
import ReviewComp from "../components/ReviewComp";
import {AirbnbRating} from "react-native-ratings";

class SellerDetail extends  Component {
    static navigationOptions = {
        title: 'About Seller',
    };

    constructor(props) {
        super(props);
        this.state = {
            avatarURL : "",
            sellerName : "",
            bio : "",
            sellerReviews : [],
            allReviews : [],
            averageRating : 0,
            reviewsText : "All Reviews"
        }
    }

    componentDidMount() {
        firebaseClient.storage().ref().child("userAvatars/" + this.props.navigation.state.params.data.postUserId).getDownloadURL().then(
            url => {
                console.log("URL " + url);
                this.setState({avatarURL : url})
            }
        ).catch(err => console.log("Not exist"));
        this.setState({sellerName : this.props.navigation.state.params.data.postUser});

        //bio
        var bioRef = firebaseClient.database().ref("userBios/" + this.props.navigation.state.params.data.postUserId);
        bioRef.on("value", (snapshot) => {
            if (!snapshot.exists()) return;
           let data = snapshot.val();
           this.setState({bio : data.bio});
        });
        //rating calculation
        let totalRating = 0;
        let count = 0;

        var storageRef = firebaseClient.database().ref("reviews/" + this.props.navigation.state.params.data.postUserId);
        storageRef.on("value", (snapshot) => {
            let data = snapshot.val();
            let newState = [];
            for(let index in data) {
                    let tmpData = {
                        name : data[index]["productData"]["name"],
                        price : data[index]["productData"]["price"],
                        location : data[index]["productData"]["location"],
                        details : data[index]["productData"]["details"],
                        imageURL :  data[index]["productData"]["imageURL"],
                        rating : data[index]["rating"],
                        comment : data[index]["comment"],
                        productUid : data[index]["productData"]["productUid"]
                    }
                    totalRating += data[index]["rating"];
                    count++;
                    newState.push(tmpData);
            }
            if (this.state.sellerReviews.length === 0) {
                this.setState({sellerReviews : newState});
            }
            this.setState({allReviews : newState});
            let avg = Math.round(totalRating / count);
            this.setState({averageRating : avg});
        });
    }

    ratingFilter = async (rating) => {
            let { allReviews } = this.state;
            let tmpReviews = [];
            if (rating === 6) {
                tmpReviews = this.state.allReviews;
            } else {
                for(let index in allReviews) {
                    if (allReviews[index]["rating"] === rating) {
                        tmpReviews.push(allReviews[index]);
                        //console.log(allReviews[index]);
                    }
                }
            }

            let currReviewText;
            switch (rating) {
                case 1:
                    currReviewText = "One Star Reviews";
                    break;
                case 2:
                    currReviewText = "Two Stars Reviews";
                    break;
                case 3:
                    currReviewText = "Three Stars Reviews";
                    break;
                case 4:
                    currReviewText = "Four Stars Reviews";
                    break;
                case 5:
                    currReviewText = "Five Stars Reviews";
                    break;
                case 6:
                    currReviewText = "All Reviews";
                    break;
            }
            await this.setState({sellerReviews : tmpReviews, reviewsText : currReviewText});
            console.log("filter");
            console.log(this.state.sellerReviews);
    }

    render() {
        let {sellerReviews} = this.state;
        console.log("render");
        console.log(sellerReviews);
        return (
            <View style={{flex: 1}}>
                <Text style = {styles.headerStyle}>Seller Detail</Text>
                <View style = {styles.sellerInfo}>
                    <Image source={{ uri:  this.state.avatarURL}} style={styles.avatarStyle} />
                    <View style = {styles.content}>
                        <Text style = {styles.textStyle}>Seller Name : {this.state.sellerName}</Text>
                        <Text style = {styles.textStyle}>Bio: {this.state.bio} </Text>
                    </View>
                    <View>
                        <Text style = {{fontSize : 25, alignSelf : "center"}}>Average Rating</Text>
                        <AirbnbRating
                            count={5}
                            reviews={["Terrible", "Bad", "OK", "Good", "Unbelievable"]}
                            defaultRating={this.state.averageRating}
                            size={20}
                            isDisabled={true}
                        />
                    </View>
                </View>
                <View>
                    <Text style = {{fontSize : 20, alignSelf : "center"}}>Filter by Ratings</Text>
                    <TouchableOpacity
                        onPress={() => this.ratingFilter(6)}
                        style = {{alignSelf : "center"}}
                    >
                        <Text style = {{color : "#e6ac00"}}>All Reviews</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.ratingFilter(1)}
                    >
                        <AirbnbRating
                            count={5}
                            defaultRating={1}
                            size={12}
                            isDisabled={true}
                            showRating={false}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.ratingFilter(2)}
                    >
                        <AirbnbRating
                            count={5}
                            defaultRating={2}
                            size={12}
                            isDisabled={true}
                            showRating={false}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.ratingFilter(3)}
                    >
                        <AirbnbRating
                            count={5}
                            defaultRating={3}
                            size={12}
                            isDisabled={true}
                            showRating={false}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.ratingFilter(4)}
                    >
                        <AirbnbRating
                            count={5}
                            defaultRating={4}
                            size={12}
                            isDisabled={true}
                            showRating={false}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.ratingFilter(5)}
                    >
                        <AirbnbRating
                            count={5}
                            defaultRating={5}
                            size={12}
                            isDisabled={true}
                            showRating={false}
                        />
                    </TouchableOpacity>
                </View>
                    <Text style = {{fontSize : 25, alignSelf : "center"}}>{this.state.reviewsText}</Text>
                    <ScrollView style = {{flex : 1}}>
                        <SafeAreaView>
                        <FlatList
                            data={sellerReviews}
                            renderItem={({ item }) =>
                                <ReviewComp
                                    data = {item}
                                />
                            }
                            keyExtractor={item => item.uid}
                        />
                        </SafeAreaView>
                    </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerStyle : {
        fontSize:30,
        alignSelf: "center"
    },
    avatarStyle : {
        height:68,
        width: 68,
        borderRadius: 34,
        alignSelf : "center"
    },
    sellerInfo : {
        marginTop : 30,
        borderColor: 'black',
        borderWidth: 1,
        width : "80%",
        alignSelf : "center",
        paddingVertical : 20
    },
    content : {
        alignSelf : "center"
    },
    textStyle : {
        fontSize : 20
    },
    reviewWall : {
        alignSelf : "center"
    }
});
export default SellerDetail;
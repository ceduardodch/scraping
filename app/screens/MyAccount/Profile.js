import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import * as firebase from "firebase";
import ProfileGuest from "../../components/Profile/ProfileGuest"
import ProfileUser from "../../components/Profile/ProfileUser"

export default class Profile extends Component {
    
    constructor(){
        super();
        this.state = {
            login:false
        };
    }
  async componentDidMount() {
    await firebase.auth().onAuthStateChanged(user => {
        if(user){
            this.setState({
            login:true});
        }else{
            this.setState({
                login:false});
        }
      
    });
  }
  goToScreen = nameScreen => {
    this.props.navigation.navigate(nameScreen);
  };

  logout = () =>{
      firebase.auth().signOut();
  };

  render() {
    const { login } = this.state;
    if (login) {
      return (
      <ProfileUser></ProfileUser>
        );
    } else {
      return (
          <ProfileGuest goToScreen={this.goToScreen} />      
      );
    }
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  }
});

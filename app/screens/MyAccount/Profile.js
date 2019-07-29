import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import * as firebase from "firebase";

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
  gotoScreen = nameScreen => {
    this.props.navigation.navigate(nameScreen);
  };

  logout = () =>{
      firebase.auth().signOut();
  };

  render() {
    const { login } = this.state;
    if (login) {
      return (
      <View style={styles.viewBody}>
      <Text>Estas logeado</Text>
      <Button title="Cerrar sesión" onPress={()=> this.logout()}></Button>
      </View>);
    } else {
      return (
        <View style="styles.viewBody">
          <Text>Profile Screen</Text>
          <Button
            title="Registro"
            onPress={() => this.gotoScreen("Registration")}
          />
          <Button title="Login" onPress={() => this.gotoScreen("Login")} />
        </View>
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

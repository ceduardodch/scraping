import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import * as firebase from "firebase";
import ProfileGuest from "../../components/Profile/ProfileGuest"
import ProfileUser from "../../components/Profile/ProfileUser"

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("Factura.db");
export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login: false
    };
  }
  async componentDidMount() {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM table_user_datos", [], (tx, results) => {
        console.log("itembusqueda", results.rows.length)
        if (results.rows.length) {
          this.props.navigation.navigate("Home");
          console.log("Y existe un usuario");
        }
      });
    });
  }
  goToScreen = nameScreen => {
    this.props.navigation.navigate(nameScreen);
  };

  logout = () => {
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

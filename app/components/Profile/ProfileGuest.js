import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native"
import { Button, Image } from "react-native-elements"
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("Factura.db");
export default class ProfileGuest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { goToScreen } = this.props;
    return (
      <View style={styles.viewBody}>
        <View style={styles.viewBodyCon}>
          <Image
            source={require("../../../assets/icon.png")}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
            resizeMode="contain"
          />
          <Text style={styles.title}>DISGAS</Text>
          <Text style={styles.description}>La forma más de fácil de facturar</Text>
        </View>

        <Button
          buttonStyle={styles.btnViewProfile}
          title="Ver tú perfil"
          onPress={() => goToScreen("Login")}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewBodyCon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
 
  },
  description: {
    textAlign: "center",
    marginBottom: 10
  },
  btnViewProfile: {
    borderRadius:0,
    backgroundColor: "#00a680",
  },


});
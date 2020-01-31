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
        <Image
          source={require("../../../assets/icon.png")}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
          resizeMode="contain"
        />
        <Text style={styles.title}>Consulta tú perfil</Text>
        <Text style={styles.description}>La forma más de fácil de facturar</Text>
        <Button
          buttonStyle={styles.btnViewProfile}
          title="Ver tu perfil"
          onPress={() => goToScreen("Login")}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30
  },
  image: {
    height: 300,
    marginBottom: 40
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10
  },
  description: {
    textAlign: "center",
    marginBottom: 20
  },
  btnViewProfile: {
    backgroundColor: "#00a680",
    marginTop: 20,
    paddingTop: 10,
    marginHorizontal: 10,
    paddingBottom: 10
  },


});
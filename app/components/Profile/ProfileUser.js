import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native"
import { Button, Image } from "react-native-elements"

export default class ProfileUser extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { goToScreen } = this.props;
    return (
      <View style={styles.viewBody}>
        <Text>user</Text>
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
    width: "100%",
    backgroundColor: "#00a680",
  }
});
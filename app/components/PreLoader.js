import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

export default class PreLoader extends Component {
  render() {
    return( 
    <View style={styles.preLoaderView}>
          <ActivityIndicator color="#00a680" size="large"></ActivityIndicator>
        </View>
    );
  }
}

const styles = StyleSheet.create(
{
  preLoaderView:{
    flex: 1,
    flexDirection:"column", 
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "#FFFFFF80"
  }
});


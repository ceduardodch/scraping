import React from "react";
import { StyleSheet, View } from "react-native";
import UserNavigation from "./app/navigations/User"
import firebaseconfig from "./app/utils/FireBase"
import * as firebase from "firebase"
firebase.initializeApp(firebaseconfig)
export default class App extends React.Component {

  render() {
    
      return (
        <View style={styles.container}>
            <UserNavigation></UserNavigation>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

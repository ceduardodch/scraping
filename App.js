import React from "react";
import { StyleSheet, View } from "react-native";
import UserNavigation from "./app/navigations/User"
import firebaseconfig from "./app/utils/FireBase"
import * as firebase from "firebase"
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("Factura.db");
firebase.initializeApp(firebaseconfig)
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT,user_cedula VARCHAR(20),user_name VARCHAR(40), user_lastname VARCHAR(40), user_monto VARCHAR(10),user_cantidad VARCHAR(20),user_total VARCHAR(20))',
              []
            );
          }
        }, (err) => {
          console.log("e" + err)
        }
      );
    });
  }
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

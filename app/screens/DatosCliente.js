import React, { Component } from "react";
import { StyleSheet, View, Text, AsyncStorage, ScrollView, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, } from "react-native"
import Odoo from 'react-native-odoo-promise-based'
import * as SQLite from 'expo-sqlite';
import { Button, Input, Card, Divider } from "react-native-elements";
import PreLoader from "../components/PreLoader"
import { FacturaStruct, FacturaOptions } from "../forms/ConnectClient";
import t from "tcomb-form-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Toast, { DURATION } from "react-native-easy-toast";
const Form = t.form.Form;
const db = SQLite.openDatabase("Factura.db");

export default class DatosCliente extends Component {

  constructor(props) {
    super(props)
    this.state = {
      FlatListItems: [],
      facturaStruct: FacturaStruct,
      facturaOptions: FacturaOptions,
      facturaRegistro: {
        url: "",
        valor: "",
        subsidio: ""
      },
      url: "",
      name: "",
      password: "",
      myKey: null,

    };
  }

  async componentDidMount() {

    this.view_user();
    this.getKey();
  }
  async guardarKey(value) {
    console.log("va", value)
    /* try {
       await AsyncStorage.setItem('@MySuperStore:key', value);
     } catch (error) {
       console.log("Error saving data" + error);
     }*/
    this.setState({ myKey: value });

  }
  async guardarKeyUno() {

    try {
      await AsyncStorage.setItem('@MySuperStore:key', this.state.myKey);
      this.refs.toast.show("Dato almacenado", 1500);
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }

  async getKey() {
    console.log("en el guardar ")
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:key');
      console.log("el ", value)
      this.setState({ myKey: value });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }
  view_user = () => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM table_user_datos", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        console.log("etststst");
        this.setState({
          FlatListItems: temp
        });

      });
    });

  };

  deleteUser = () => {
    console.log("volver")
    db.transaction(function (txn) {
      txn.executeSql('DROP TABLE IF EXISTS table_user', []);
      txn.executeSql('DROP TABLE IF EXISTS table_user_datos', []);

    })
    this.props.navigation.navigate("Login")

  };
  onChangeFormFactura = facturaValue => {

    this.setState({
      facturaRegistro: facturaValue
    });
  };

  ListViewItemSeparator = () => {
    return (
      <View
        style={{ height: 0.3, width: "100%", backgroundColor: "#808080" }}
      />
    );
  };

  render() {
    const {
      facturaOptions,
      facturaStruct,
      facturaRegistro,
      myKey
    } = this.state

    return (
      <View style={styles.viewBody}>

        <Toast
          ref="toast"
          position="center"
          positionValue={320}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <TextInput
              style={styles.formInput}
              placeholder="  Valor sugerido  " 
              value={myKey}
              onChangeText={(value) => this.guardarKey(value)}
            />
            <TouchableOpacity
              onPress={this.guardarKeyUno.bind(this)}
            >
              <Text style={styles.btnRegister} >Almacenar</Text>
            </TouchableOpacity>
          </View>
          {
            /*
              <View style={styles.register}>
            <TouchableOpacity
              onPress={this.view_user}
            >
              <Text style={styles.btnRegister} >Ver datos</Text>
            </TouchableOpacity>
          </View>
            */
          }

          <View>
            <FlatList
              data={this.state.FlatListItems}
              ItemSeparatorComponent={this.ListViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  key={item.user_id}
                  style={{
                    backgroundColor: "#f2f2f2",
                    padding: 15,
                    marginBottom: 10,
                    marginLeft: 14,
                    marginTop: 10,
                    marginRight: 14
                  }}
                >
                  <Text style={styles.name}>
                    URL: <Text style={styles.label}>{item.user_url_datos}</Text>
                  </Text>
                  <Divider style={styles.divider}></Divider>
                  <Text style={styles.name}>
                    USUARIO: <Text style={styles.label}>{item.user_usuario_datos}</Text>
                  </Text>
                  <Divider style={styles.divider}></Divider>
                  <Text style={styles.name}>
                    VALOR: <Text style={styles.label}> {item.user_valor_datos}</Text>
                  </Text>
                  <Divider style={styles.divider}></Divider>
                  <Text style={styles.name}>
                    SUBSIDIO: <Text style={styles.label}>{item.user_subsidio_datos}</Text>
                  </Text>
                  <Divider style={styles.divider}></Divider>

                </View>
              )}
            />

          </View>
          <Button
            buttonStyle={styles.buttonLoginContainer}
            title="Salir"
            onPress={() => this.deleteUser()}
          />
        </ScrollView>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 20,
    marginLeft: 25,
    marginTop: 15,
    marginRight: 25
  },
  inputBox: {
    width: 300,
    backgroundColor: 'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#ffffff',
    marginVertical: 10,
    marginLeft: 15,
    marginTop: 15,
    marginRight: 15
  },
  register: {
    alignContent: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: "white"
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold",
    marginTop: 5,
  },
  button: {
    width: 300,
    // backgroundColor: '#1c313a',
    backgroundColor: "#00a680",
    color: "#00a680",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    marginLeft: 15,
    marginTop: 15,
    marginRight: 15
  },
  name: {
    fontWeight: "bold"
  },
  label: {
    fontWeight: "normal",
    fontSize: 14
  },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  divider: {
    backgroundColor: "#00a680",
    marginBottom: 20,
    marginTop: 5
  },
  formInput: {
    paddingLeft: 5,
    borderWidth: 1,
    height: 35,
    borderColor: "#555555",
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
})
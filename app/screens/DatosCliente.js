import React, { Component } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Alert, FlatList } from "react-native"
import Odoo from 'react-native-odoo-promise-based'
import * as SQLite from 'expo-sqlite';
import { Button, Input, Card } from "react-native-elements";
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
      facturaStruct: FacturaStruct,
      facturaOptions: FacturaOptions,
      formRegistro: {
        url: '',
        valor: '',
        subsidio: ''
      },
      FlatListItems: [],

    };

  }
  componentDidMount() {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user_datos'",
        [],
        function (tx, res) {
          console.log('itemdatos:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user_datos', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user_datos(user_id_datos INTEGER PRIMARY KEY AUTOINCREMENT,user_url_datos VARCHAR(30),user_valor_datos VARCHAR(40), user_subsidio_datos VARCHAR(20))',
              []
            );
          }
        }, (err) => {
          console.log("e" + err)
        }
      );
    });
  }

  register_userDatos = () => {
    console.log("en el guardAR ")
    const {
      formRegistro,
    } = this.state
    var user_url = formRegistro.url;
    var user_valor = formRegistro.valor;
    var user_subsidio = formRegistro.subsidio;
    console.log("luego en traccasion")
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user_datos (user_url_datos,user_valor_datos,user_subsidio_datos) VALUES (?,?,?)',
        [user_url, user_valor, user_subsidio],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log("correcto datos")
          } else {
            alert('Registro fallido');
          }
        }, (err) => {
          console.log("e", err)
        }
      )
    }, (error) => {
      console.log("error en la base: " + error)
    }, (success) => {
      console.log("Ingreso correcto")
      this.refs.toast.show("Información ingresada", 1500);
    }
    );
  }
  view_user = val => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM table_user_datos", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp
        });
        if (val) {
          this.refs.toast.show("Mirar Información", 1500);
        }
      });
    });
  };
  updateUsers() {
    alert("hh")

  }
  onChangeFormFactura = facturaValue => {
    this.setState({
      facturaRegistro: facturaValue
    });
    console.log(facturaValue);
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
    } = this.state

    return (

      <View style={styles.viewBody}>
        <Toast
          ref="toast"
          position="bottom"
          positionValue={320}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />

        <Form
          ref="facturaForm"
          type={facturaStruct}
          options={facturaOptions}
          value={facturaRegistro}
          onChange={facturaValue => this.onChangeFormFactura(facturaValue)}
        />
        <Button style={styles.button} title="Ingresar" onPress={() => this.register_userDatos()}></Button>
        <ScrollView style={styles.scrollView}>
          <View style={styles.register}>
            <Text style={styles.btnRegister} onPress={() => this.updateUsers()}>Modificar datos</Text>
          </View>
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
                    URL: <Text style={styles.label}>{item.user_url_datos}</Text>{" "}
                  </Text>
                  <Text style={styles.name}>
                    Valor: <Text style={styles.label}> {item.user_valor_datos}</Text>
                  </Text>
                  <Text style={styles.name}>
                    Subsidio: <Text style={styles.label}>{user_subsidio_datos}</Text>
                  </Text>
                </View>
              )}
            />
          </View>
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
  text: { margin: 6 }
})
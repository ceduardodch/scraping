import React, { Component } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Alert, FlatList, TouchableOpacity } from "react-native"
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

    };
  }
  async componentDidMount() {
    const { navigation } = this.props;

    this.setState({
      name: navigation.state.params.log,
      password: navigation.state.params.pass,
      url: navigation.state.params.urlBase,
    }
    )
    this.view_user();

  }

  register_userDatos = () => {
    console.log("en el guardAR ")
    const {
      facturaRegistro
    } = this.state
    var user_url_datos = facturaRegistro.url;
    var user_valor_datos = facturaRegistro.valor;
    var user_subsidio_datos = facturaRegistro.subsidio;
    var user_id_datos = 1;
    var user_contrasena_datos = this.state.password;
    var user_usuario_datos = this.state.name;
    console.log("probar",this.state.url)
    console.log("luego en traccasion", user_url_datos, "gg", user_valor_datos, "gf", user_subsidio_datos);
    console.log("con",user_contrasena_datos,"uu",user_usuario_datos)
    user_usuario_datos="contra"
    if (user_url_datos && user_valor_datos && user_subsidio_datos) {
      if (this.state.FlatListItems.length === 0) {
        db.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO table_user_datos (user_contrasena_datos,user_usuario_datos,user_url_datos,user_valor_datos,user_subsidio_datos) VALUES (?,?,?,?,?)',
            [user_contrasena_datos, user_usuario_datos, user_url_datos, user_valor_datos, user_subsidio_datos],
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log("correcto datos")
              } else {
                alert('Registro fallido');
              }
            }, (err) => {
              console.log("error", err)
            }
          )
        }, (error) => {
          console.log("error en la base: " + error)
        }, (success) => {
          console.log("Ingreso correcto")
          this.refs.toast.show("Información ingresada", 1500);
        }
        );

      } else {
        db.transaction((tx) => {
          tx.executeSql(
            'UPDATE table_user_datos set user_valor_datos=?, user_subsidio_datos=? where user_id_datos=?',
            [user_valor_datos, user_subsidio_datos, user_id_datos],
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log("modificado")
                this.refs.toast.show("Información ingresada", 1500);
              } else {
                console.log("no se puede modificar");
              }
            }
          );
        });
      }
    } else {
      alert('Ingresar todos los campos');
    }

    /*
        db.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO table_user_datos (user_url_datos,user_valor_datos,user_subsidio_datos) VALUES (?,?,?)',
            [user_url_datos, user_valor_datos, user_subsidio_datos],
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log("correcto datos")
              } else {
                alert('Registro fallido');
              }
            }, (err) => {
              console.log("error", err)
            }
          )
        }, (error) => {
          console.log("error en la base: " + error)
        }, (success) => {
          console.log("Ingreso correcto")
          this.refs.toast.show("Información ingresada", 1500);
        }
        );*/
  };
  view_user = () => {
    console.log("ddddggggggggg")
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM table_user_datos", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
          console.log("waq")
        }
        console.log("etststst");
        this.setState({
          FlatListItems: temp
        });

      });
    });

  };

  onChangeFormFactura = facturaValue => {

    this.setState({
      facturaRegistro: facturaValue
    });
    console.log(facturaValue);
    console.log("qaaaa" + this.state.facturaRegistro.url)
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
        <ScrollView style={styles.scrollView}>
          <Text> {this.state.url}</Text>
          <Form
            ref="connectClientForm"
            type={facturaStruct}
            options={facturaOptions}
            value={facturaRegistro}
            onChange={facturaValue => this.onChangeFormFactura(facturaValue)}
          />
          <Button style={styles.button} title="Ingresar" onPress={() => this.register_userDatos()}></Button>

          <View style={styles.register}>
            <TouchableOpacity
              onPress={this.view_user}
            >
              <Text style={styles.btnRegister} >Modificar datos</Text>
            </TouchableOpacity>
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
                    URL: <Text style={styles.label}>{item.user_url_datos}</Text>
                  </Text>
                  <Text style={styles.name}>
                    Valor: <Text style={styles.label}> {item.user_valor_datos}</Text>
                  </Text>
                  <Text style={styles.name}>
                    Subsidio: <Text style={styles.label}>{item.user_subsidio_datos}</Text>
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
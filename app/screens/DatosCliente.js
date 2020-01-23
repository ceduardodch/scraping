import React, { Component } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Alert, NetInfo, Platform, TouchableOpacity } from "react-native"
import Odoo from 'react-native-odoo-promise-based'
import * as SQLite from 'expo-sqlite';
import { Button, Input, Card } from "react-native-elements";
import PreLoader from "../components/PreLoader"
import { FacturaStruct, FacturaOptions } from "../forms/Factura";
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
      facturaData: {
        cedula: "",
        cantidad: "",
        monto: ""
      },
      formRegistro: {
        names: '',
        lastnames: '',
        cedula: ''
      },

    };

  }

  onChangeFormFactura = facturaValue => {
    this.setState({
      facturaData: facturaValue
    });
    console.log(facturaValue);
  };
  confirmationInsert = () => {
    console.log("confirmacion");
  }


  render() {
    const {

      facturaOptions,
      facturaStruct,
      facturaData,
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
          <Form
            ref="facturaForm"
            type={facturaStruct}
            options={facturaOptions}
            value={facturaData}
            onChange={facturaValue => this.onChangeFormFactura(facturaValue)}
          />
          <Button style={styles.button} title="Facturar" onPress={() => this.confirmationInsert()}></Button>

          )}
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
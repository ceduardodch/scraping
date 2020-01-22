import React, { Component } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Alert } from "react-native"
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

export default class Home extends Component {
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
      facturaErrorMessage: "",

      formRegistro: {
        names: '',
        lastnames: '',
      },
      tableHead: ['Descripción', 'Cantidad', 'Total'],
      tableData: "",

      formDetalle: {
        cantidad: '',
        monto: '',
        total: '',
        subsidio: ''
      },
      formTitulos: [],
      loaded: true,
      visible: false,
    };

  }
  async facturar() {

  }
  async buscarPersona(cantidad, monto) {
    this.setState({
      loaded: false, tableData: [
        ['Gas', cantidad, Number(cantidad * 1.6).toFixed(2)],
        ['Transporte', '1', Number(cantidad * monto - cantidad * 1.6).toFixed(2)],
        ['', 'IVA %', Number(cantidad * 1.6 * 0.12).toFixed(2)],
        ['', 'Total', Number(cantidad * monto).toFixed(2)],
        ['', 'Subsidio', Number(cantidad * 0.51122 * 15).toFixed(2)],],
    }
    );
    const { formRegistro, facturaData: { cedula } } = this.state;
    const odoo = new Odoo({
      host: 'scraping.fractalsoft.ec',
      port: 8069, /* Defaults to 80 if not specified */
      database: 'scraping',
      username: 'ceduardodch@gmail.com', /* Optional if using a stored session_id */
      password: 'CarlosDiaz2013', /* Optional if using a stored session_id */
      protocol: 'http' /* Defaults to http if not specified */
    })
    await odoo.connect()
      .then(response => { console.log(response); })
      .catch(e => { console.log(e); })
    /* Get partner from server example */
    console.log(cedula);
    const params = {
      domain: [["identity", "=", cedula]],
      fields: ["names", "lastnames"],
    }
    const context = {
      domain: [["id", "=", 1]],
    }
    await odoo.search_read('scraping.registro.civil', params, context)
      .then(response => {
        this.setState({
          formRegistro: {
            names: response.data[0].names,
            lastnames: response.data[0].lastnames,
          },
          loaded: true,
          visible: true,
        }
        )
      })
      .catch(e => {
        alert(e)
        this.setState({
          loaded: true,
        })
      });
  }

  onChangeFormFactura = facturaValue => {
    this.setState({
      facturaData: facturaValue
    });
    console.log(facturaValue);
  };

  confirmationInsert = () => {
    console.log("confirmacion");
    Alert.alert(
      'Ingreso',
      'Desea ingresar factura',
      [
        {
          text: 'Ok',
          onPress: () => this.register_user()
        }
      ],
      { cancelable: false }
    );
  }


  register_user = () => {
    console.log("en el guardAR ")
    const {
      formRegistro,
      facturaData,
    } = this.state
    var user_name = formRegistro.names;
    var user_lastname = formRegistro.lastnames;
    var user_monto = facturaData.monto;
    var user_cedula = facturaData.cedula;
    var user_cantidad = facturaData.cantidad;
    var user_total = Number(user_monto * user_cantidad).toFixed(2);
    var user_transporte = Number(user_cantidad * user_monto - user_cantidad * 1.6).toFixed(2);
    var user_iva = Number(user_cantidad * 1.6 * 0.12).toFixed(2);
    var user_subsidio = Number(user_cantidad * 0.51122 * 15).toFixed(2);
    db.transaction(function (tx) {
      console.log("en elasss")
      tx.executeSql(
        'INSERT INTO table_user (user_cedula,user_name,user_lastname,user_monto,user_cantidad,user_total,user_subsidio,user_transporte,user_iva) VALUES (?,?,?,?,?,?,?,?,?)',
        [user_cedula, user_name, user_lastname, user_monto, user_cantidad, user_total, user_subsidio, user_transporte, user_iva],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            this.refs.toast.show(
              "Información actualizada",
              1500
            );

          } else {
            alert('Registro fallido');
          }
        }, (err) => {
          console.log("e", err)

        }
      )
    });
  }
  closeTable() {
    console.warn("i made it here")
    /* this.setState({
       visible: false
     })*/
  }

  render() {
    const { loaded,
      facturaOptions,
      facturaStruct,
      facturaData,
      visible,
      tableHead, tableData } = this.state

    if (!loaded) {
      return (<PreLoader />);
    } else {
      return (

        <View style={styles.viewBody}>
          <View>
            <Toast
              ref="toast"
              position="Center"
              positionValue={320}
              fadeInDuration={1000}
              fadeOutDuration={1000}
              opacity={0.8}
              textStyle={{ color: "#fff" }}
            />
          </View>

          <ScrollView style={styles.scrollView}>
            <Form
              ref="facturaForm"
              type={facturaStruct}
              options={facturaOptions}
              value={facturaData}
              onChange={facturaValue => this.onChangeFormFactura(facturaValue)}
            />

            <Button title="Buscar" onPress={() => this.buscarPersona(this.state.facturaData.cantidad, this.state.facturaData.monto)}></Button>
            {visible && (
              <View>
                <Card title="DATOS BÁSICOS" containerStyle={{ marginBottom: 15 }}>
                  <Text style={styles.name}>Nombres: <Text style={styles.label}>{this.state.formRegistro.names}</Text></Text>
                  <Text style={styles.name}>Apellidos: <Text style={styles.label}>{this.state.formRegistro.lastnames}</Text></Text>
                </Card>
                <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff', marginBottom: 15 }}>
                  <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                  <Rows data={tableData} textStyle={styles.text} />
                </Table>
                <Button style={styles.button} title="Facturar" onPress={() => this.confirmationInsert()}></Button>
              </View>
            )
            }
          </ScrollView>
        </View>
      );
    }
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
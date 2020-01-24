import React, { Component } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Alert, NetInfo, Platform } from "react-native"
import Odoo from 'react-native-odoo-promise-based'
import * as SQLite from 'expo-sqlite';
import { Button, Input, Card } from "react-native-elements";
import PreLoader from "../components/PreLoader"
import { FacturaStruct, FacturaOptions } from "../forms/Factura";
import t from "tcomb-form-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Toast, { DURATION } from "react-native-easy-toast";
import UpdateName from "../components/Elements/UpdateName"
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
        cedula: ''
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
      overlayComponent: null,
    };

  }
  CheckConnectivity = () => {
    // For Android devices
    if (Platform.OS === "android") {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          Alert.alert("You are online!");
        } else {
          Alert.alert("You are offline!");
        }
      });
    } else {
      // For iOS devices
      NetInfo.isConnected.addEventListener(
        "connectionChange",
        this.handleFirstConnectivityChange
      );
    }
  };

  handleFirstConnectivityChange = isConnected => {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );

    if (isConnected === false) {
      Alert.alert("You are offline!");
    } else {
      Alert.alert("You are online!");
    }
  };

  async buscarPersona(cantidad, monto) {
    console.log("buscar")
    this.setState({
      loaded: false,
      tableData: [
        ['Gas', cantidad, Number(cantidad * 1.6).toFixed(2)],
        ['Transporte', '1', Number(cantidad * monto - cantidad * 1.6).toFixed(2)],
        ['', 'IVA %', Number(cantidad * 1.6 / 1.12 -1.6).toFixed(2)],
        ['', 'Total', Number(cantidad * monto).toFixed(2)],
        ['', 'Subsidio', Number(cantidad * 0.51122 * 15).toFixed(2)],],
    }
    );
    const { formRegistro, facturaData: { cedula } } = this.state;
    console.log("sw")
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM table_user where user_cedula = ?',
        [cedula],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            this.setState({
              formRegistro: {
                names: results.rows.item(0).user_name,
                lastnames: results.rows.item(0).user_lastname,
                cedula: results.rows.item(0).user_cedula,
              },
              loaded: true,
              visible: true
            }
            )
          } else {
            console.log("no se encuentra")
            this.buscarOdoo();
          }
        }
      );
    }, (error) => {
      console.log("error en la base: " + error);
    }, (success) => {
      console.log("correcto");
    }
    );
    console.log("sss")
  }
  buscarOdoo() {
    this.buscarPersonaOdoo();
  }

  async buscarPersonaOdoo() {
    console.log("dddddxaz")
    const { formRegistro, facturaData: { cedula } } = this.state;
    const odoo = new Odoo({
      host: 'scraping.fractalsoft.ec',
      port: 8069,
      database: 'scraping',
      username: 'ceduardodch@gmail.com',
      password: 'CarlosDiaz2013',
      protocol: 'http'
    })
    await odoo.connect()
      .then(response => { console.log(response); })
      .catch(e => { console.log(e); })
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
            cedula: response.data[0].identity,
          },
          loaded: true,
          visible: true
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
  close = () => {
    this.setState({ overlayComponent: null })
  };
  updateInfo = () => {
    this.refs.toast.show("Datos modificados", 1500);
  }
  updateClient = async (name,lastname,cedula)=> {
    console.log("entr"+name,"h",lastname)
   this.setState({
      formRegistro: {
        names: name,
        lastnames: lastname,
        cedula:cedula
      }
    }
    )
  }


  updateUsers = (close, updateInfo, cedula) => {
    console.log("modificar");
    this.setState({
      overlayComponent: (
        <UpdateName
          isVisibleOverlay={true}
          inputValueOne=""
          inputValueTwo=""
          inputValueThree=""
          close={close}
          insertData={updateInfo}
          cedula={cedula}
          updateClient={this.updateClient}
        />)
    });
    console.log("nn")
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
      '¿Desea ingresar factura?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Aceptar',
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
    var user_iva = Number(user_cantidad * 1.6 /1.12-1.6).toFixed(2);
    var user_subsidio = Number(user_cantidad * 0.51122 * 15).toFixed(2);
    console.log("luego en traccasion")
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user (user_cedula,user_name,user_lastname,user_monto,user_cantidad,user_total,user_subsidio,user_transporte,user_iva) VALUES (?,?,?,?,?,?,?,?,?)',
        [user_cedula, user_name, user_lastname, user_monto, user_cantidad, user_total, user_subsidio, user_transporte, user_iva],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log("correcto")
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
      this.refs.toast.show("Factura generada", 1500);
      this.setState({
        visible: false
      });
    }
    );


  }

  render() {
    const {
      loaded,
      facturaOptions,
      facturaStruct,
      facturaData,
      visible,
      overlayComponent,
      tableHead, tableData
    } = this.state

    if (!loaded) {
      return (<PreLoader />);
    } else {
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
            <Button title="Buscar" onPress={() => this.buscarPersona(this.state.facturaData.cantidad, this.state.facturaData.monto)}></Button>
            {visible && (<View>

              <Card title="DATOS BÁSICOS" containerStyle={{ marginBottom: 15 }}>
                <Text style={styles.name}>Identificación: <Text style={styles.label}>{this.state.formRegistro.cedula}</Text></Text>
                <Text style={styles.name}>Nombres: <Text style={styles.label}>{this.state.formRegistro.names}</Text></Text>
                <Text style={styles.name}>Apellidos: <Text style={styles.label}>{this.state.formRegistro.lastnames}</Text></Text>
                <Text style={styles.name}>Correo: <Text style={styles.label}>{""}</Text></Text>
                <View style={styles.register}>
                  <Text style={styles.btnRegister} onPress={() => this.updateUsers(this.close, this.updateInfo, this.state.facturaData.cedula)}>Modificar datos</Text>
                </View>


              </Card>
              <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                <Rows data={tableData} textStyle={styles.text} />
              </Table>

              {/*  <Button title="Facturar" onPress={() => this.facturar(this.state.formRegistro.names + ' ' + this.state.formRegistro.lastnames, this.state.formRegistro.cedula)}></Button> */}
              <Button style={styles.button} title="Facturar" onPress={() => this.confirmationInsert()}></Button>
            </View>
            )}
            {overlayComponent}
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
  register: {
    alignContent: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end"
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
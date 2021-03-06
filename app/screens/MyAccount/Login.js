import React, { Component } from "react";
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, SliderComponent, Alert } from "react-native";
import { Image, Button } from "react-native-elements";
import t from "tcomb-form-native";
import { LoginStruct, LoginOptions } from "../../forms/Login";
import Toast, { DURATION } from "react-native-easy-toast";
import Odoo from "react-native-odoo-promise-based";
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("Factura.db");
const Form = t.form.Form;

export default class Map extends Component {
  constructor() {
    super();
    this.state = {
      loginStruct: LoginStruct,
      loginOptions: LoginOptions,
      loginData: {
        url: "",
        usuario: "",
        password: ""
      },
      loginErrorMessage: "",
      existe: false,
    };
  }
  async componentDidMount() {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user_datos'",
        [],
        function (tx, res) {
          console.log('item datos:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user_datos', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user_datos(user_id_datos INTEGER PRIMARY KEY AUTOINCREMENT,user_contrasena_datos VARCHAR(30),user_usuario_datos VARCHAR(30) ,user_url_datos VARCHAR(30),user_valor_datos VARCHAR(40), user_subsidio_datos VARCHAR(20))',
              []
            );
          }
        }, (err) => {
          console.log("e_r: " + err)
        }
      );
    });
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        function (tx, res) {
          console.log('item user:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT,user_cedula VARCHAR(20),user_name VARCHAR(40), user_lastname VARCHAR(40),user_email VARCHAR(40),user_phone VARCHAR(40), user_monto VARCHAR(10),user_cantidad VARCHAR(20),user_total VARCHAR(20),user_subsidio VARCHAR(20),user_transporte VARCHAR(20),user_iva VARCHAR(20))',
              []
            );
          }
        }, (err) => {
          console.log("error 1: " + err)
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM table_partner WHERE type='table' AND name='table_partner'",
        [],
        function (tx, res) {
          console.log('item p:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_partner', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_partner(partner_id INTEGER PRIMARY KEY AUTOINCREMENT,partner_cedula VARCHAR(20),partner_name VARCHAR(40), partner_lastname VARCHAR(40),partner_email VARCHAR(40), partner_phone VARCHAR(40))',
              []
            );
          }
        }, (err) => {
          console.log("e" + err)
        }
      );
    });

    db.transaction(tx => {
      tx.executeSql("SELECT * FROM table_user_datos", [], (tx, results) => {
        if (results.rows.length) {
          this.setState({
            existe: true
          })
          this.props.navigation.navigate("Datos");
        }
      }, (error) => {
        console.log("error", error)
      });
    });
  }

  async buscarPersona() {
    const { password, url, usuario } = this.state.loginData;
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM table_user_datos where user_contrasena_datos = ? and user_usuario_datos= ? and user_url_datos = ?',
        [password, usuario, url],
        (tx, results) => {

          var len = results.rows.length;
          if (len > 0) {

            this.props.navigation.navigate("Home");

          } else {
            this.buscarOdoo();
          }
        }
      );
    }, (error) => {
      alert("buscarPersona==>" + error)
    }, (success) => {
    }
    );
  }

  buscarOdoo() {
    if (!this.state.existe) {
      this.buscarPersonaOdoo();

    } else {
      Alert.alert(
        'Fallo en el login',
        'Usuario o clave incorrectos',
        [
          {
            text: 'Aceptar',
            onPress: () => console.log("ok")
          }
        ],
        { cancelable: false }
      );
    }

  }
  async buscarPersonaOdoo() {
    const { password, url, usuario } = this.state.loginData;
    prot = url.split('://');
    datab = prot[1].split('.');
    const odoo = new Odoo({
      host: prot[1],
      port: 80,
      database: datab[0],
      username: usuario,
      password: password,
      protocol: prot[0]
    });

    await odoo.connect()
      .then(response => {
        if (response.success) {
          this.register_userDatos();
          this.props.navigation.navigate("Datos");
        }
        else {

          Alert.alert(
            'Fallo en el login',
            'Usuario o clave incorrectos',
            [
              {
                text: 'Aceptar',
                onPress: () => console.log("ok")
              }
            ],
            { cancelable: false }
          );
        }
      })
      .catch(e => { alert(e); })
  }
  register_userDatos = () => {
    const { password, url, usuario } = this.state.loginData;
    var user_valor_datos = "1.60";
    var user_subsidio_datos = "7.66";
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user_datos (user_contrasena_datos,user_usuario_datos,user_url_datos,user_valor_datos,user_subsidio_datos) VALUES (?,?,?,?,?)',
        [password, usuario, url, user_valor_datos, user_subsidio_datos],
        (tx, results) => {
          if (results.rowsAffected > 0) {
          } else {
            alert('Registro fallido 0');
          }
        }, (err) => {
          alert('Registro fallido tx');
        }
      )
    }, (error) => {
      alert("error en la base sqllite: " + error)
    },
    );
  };

  onChangeFormLogin = loginValue => {
    this.setState({
      loginData: loginValue
    });
    console.log(loginValue);
  };

  render() {
    const {
      loginOptions,
      loginStruct,
      loginData,
    } = this.state;
    return (
      <KeyboardAvoidingView style={styles.viewBodyKeyboar} behavior="padding" enabled>
        <View style={styles.viewBody}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.viewLogin}>
              <Image
                source={require("../../../assets/icon.png")}
                containerStylestyle={styles.containerLogo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Toast
              ref="toast"
              position="bottom"
              positionValue={250}
              fadeInDuration={1000}
              fadeOutDuration={1000}
              opacity={0.8}
              textStyle={{ color: "#fff" }}
            />


            <Form
              ref="loginForm"
              type={loginStruct}
              options={loginOptions}
              value={loginData}
              onChange={loginValue => this.onChangeFormLogin(loginValue)}
            />
            <Button
              buttonStyle={styles.buttonLoginContainer}
              title="Ingresar"
              onPress={() => this.buscarPersona()}
            />

          </ScrollView>

        </View>
      </KeyboardAvoidingView>
    );

  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20
  },
  viewBodyKeyboar: {
    flex: 1,
  },
  containerLogo: {
    alignItems: "center",
  },

  logo: {
    width: 250,
    height: 125
  },
  buttonLoginContainer: {
    backgroundColor: "#00a680",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  loginErrorMessage: {
    color: "#ff0000",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20
  },
  divider: {
    backgroundColor: "#00a680",
    marginBottom: 20
  },
  textRegister: {
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold"

  },
  viewLogin: {
    marginBottom: 5,
    alignItems: "center",
  },

});

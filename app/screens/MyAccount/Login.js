import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Image, Button, Divider, SocialIcon } from "react-native-elements";
import t from "tcomb-form-native";
import { LoginStruct, LoginOptions } from "../../forms/Login";
import * as firebase from "firebase";
import firebaseconfig from "../../utils/FireBase";
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
      loginErrorMessage: ""
    };
  }

  async buscarPersona() {
    console.log("buscar")
    const { password, url, usuario } = this.state.loginData;
    console.log("sw")
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM table_user_datos where user_contrasena_datos = ? and user_usuario_datos= ? and user_url_datos = ?',
        [password, usuario, url],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            this.refs.toast.show("Usuario correcto", 100, () => {
              this.props.navigation.navigate("Home");
            });
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
    const { password, url, usuario } = this.state.loginData;
    console.log("p:", password, "u", url, "u", usuario)
    const odoo = new Odoo({
      host: "alfredos.far.ec",
      port: 80,
      database: "alfredos",
      username:
        "carlos.diaz@fractalsoft.ec",
      password: "1111",
      protocol: "http"
    });
    await odoo.connect()
      .then(response => { console.log(response); })
      .catch(e => { console.log(e); })
    const params = {
      // domain: [["identity", "=", cedula]],
      fields: ["login", "password", "company_id"],
    }
    const context = {
      domain: [["id", "=", 1]],
    }
    await odoo.search_read('res.users', params, context)
      .then(response => {
        const arrayMarkers = [];
        response.data.map((element, i) => {
          arrayMarkers.push("id:", i, element)
        })
        if (arrayMarkers.length === 0) {
          this.refs.toast.show("No existe usuario", 1500);
        } else {
          this.refs.toast.show("Usuario correcto", 75, () => {
            this.props.navigation.navigate("Datos");
          });
          this.register_userDatos(response.data[0].login)
        }
      })
      .catch(e => {
        alert(e)
      });

  }
  register_userDatos = (log) => {
    console.log("en el guardAR ", log)
    const { password, url, usuario } = this.state.loginData;
    var user_valor_datos = "0";
    var user_subsidio_datos = "0";
    var contra = "contra"
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user_datos (user_contrasena_datos,user_usuario_datos,user_url_datos,user_valor_datos,user_subsidio_datos) VALUES (?,?,?,?,?)',
        [contra, usuario, url, user_valor_datos, user_subsidio_datos],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log("se ingreso")
          } else {
            alert('Registro fallido');
          }
        }, (err) => {
          console.log("error", err)
        }
      )
    }, (error) => {
      console.log("error en la base: " + error)
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
      loginErrorMessage
    } = this.state;

    return (
      <View style={styles.viewBody}>
        <Image
          source={require("../../../assets/hacker-icon.png")}
          containerStylestyle={styles.containerLogo}
          style={styles.logo}
          resizeMode="contain"
        />
        <Toast
          ref="toast"
          position="bottom"
          positionValue={250}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />
     
        <ScrollView style={styles.scrollView}>
          <View style={styles.viewLogin}>
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
            <Divider style={styles.divider}></Divider>
          </View>


        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30
  },
  viewLogin: {
    marginTop: 10
  },
  containerLogo: {
    alignItems: "center",
  },

  logo: {
    width: 300,
    height: 150
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

  }
});

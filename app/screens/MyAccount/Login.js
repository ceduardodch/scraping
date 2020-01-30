import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import { Image, Button, Divider} from "react-native-elements";
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
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM table_user_datos", [], (tx, results) => {
        if (results.rows.length) {
          this.props.navigation.navigate("Home");
          console.log("Y existe un usuario");
          this.setState({
            existe: true
          })
        }
      });
    });
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
    if (!this.state.existe) {
      this.buscarPersonaOdoo();

    } else {
      

      this.refs.toast.show("Datos incorrectos");
    }

  }
  async buscarPersonaOdoo() {
    console.log("dddddxaz")
    const { password, url, usuario } = this.state.loginData;
    console.log("p:", password, "u", url, "u", usuario)
    prot = url.split('://');
    datab = prot[1].split('.');

    console.log(prot)
    const odoo = new Odoo({
      host: prot[1],
      port: 80,
      database: datab[0],
      username: usuario,
      password: password,
      protocol: prot[0]
    });
    await odoo.connect()
      .then(response => { console.log(response); 
        this.refs.toast.show("Usuario correcto", 75, () => {
          this.props.navigation.navigate("Datos");
        });
        this.register_userDatos();
      })
      .catch(e => { console.log(e); })    
    /*
    const context = {
      domain: [["id", "=", 1]],
    }
    await odoo.search_read('res.users', params, context)
      .then(response => {
        const arrayMarkers = [];
        response.data.map((element, i) => {
          console.log(element)
          arrayMarkers.push("id:", i, element)
        })
        if (arrayMarkers.length === 0) {
          this.refs.toast.show("No existe usuario", 1500);
        } else {
          this.refs.toast.show("Usuario correcto", 75, () => {
            this.props.navigation.navigate("Datos");
          });
          this.register_userDatos();
        }
      })
      .catch(e => {
        alert(e)
      });
*/

  }
  register_userDatos = () => {
    console.log("en el guardAR ")
    const { password, url, usuario } = this.state.loginData;
    var user_valor_datos = "1.60";
    var user_subsidio_datos = "7.66";
  
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user_datos (user_contrasena_datos,user_usuario_datos,user_url_datos,user_valor_datos,user_subsidio_datos) VALUES (?,?,?,?,?)',
        [password, usuario, url, user_valor_datos, user_subsidio_datos],
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
      <KeyboardAvoidingView style={styles.viewBodyKeyboar} behavior="padding" enabled>
        <View style={styles.viewBody}>
          <View style={styles.viewLogin}>
            <Image
              source={require("../../../assets/hacker-icon.png")}
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

          <ScrollView style={styles.scrollView}>
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
    marginTop: 2,
    alignItems: "center",
  },

});

import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Image, Button, Divider, SocialIcon } from "react-native-elements";
import t from "tcomb-form-native";
import { LoginStruct, LoginOptions } from "../../forms/Login";
import * as firebase from "firebase";
import firebaseconfig from "../../utils/FireBase";
import Toast, { DURATION } from "react-native-easy-toast";
import Odoo from "react-native-odoo-promise-based";

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

  async buscarPersonaOdoo() {
    console.log("dddddxaz")
    const { password, url, usuario } = this.state.loginData;
    console.log("p:", password, "u", url, "u", usuario)
    const odoo = new Odoo({
      host: "alfredos.far.ec",
      port: 80 /* Defaults to 80 if not specified */,
      database: "alfredos",
      username:
        "carlos.diaz@fractalsoft.ec" /* Optional if using a stored session_id */,
      password: "1111" /* Optional if using a stored session_id */,
      protocol: "http" /* Defaults to http if not specified */
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
        console.log(response.data[0])
        console.log("otro")
        console.log(response.data[1])
        response.data.map((element, i) => {
          arrayMarkers.push(element)
        })
        if (arrayMarkers.length === 0) {
          this.refs.toast.show("No existe usuario", 1500);
        } else {
          console.log("jdjdjd"+arrayMarkers[0].login,"bvc",arrayMarkers[0].password)
          this.refs.toast.show("Usuario correcto", 100, () => {
            this.props.navigation.navigate("Datos", {
              log: arrayMarkers.data[0].login, urlBase: url, pass: arrayMarkers.data[0].password
            });
          });
        }
      })
      .catch(e => {
        alert(e)
      });

  }

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
          /*  PlaceholderContent={<ActivityIndicator />}*/
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
              onPress={() => this.buscarPersonaOdoo()}
            />
            { /* <Text style={styles.textRegister}>¿Aún no tienes una cuenta?
                 <Text style={styles.btnRegister}
                   onPress={() => this.props.navigation.navigate("Registration")}> Registrate</Text>
               </Text> */
            }

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

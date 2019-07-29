import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Image, Button,Divider, SocialIcon } from "react-native-elements";
import t from "tcomb-form-native";
import { LoginStruct, LoginOptions } from "../../forms/Login";
import * as firebase from "firebase";
import firebaseconfig from "../../utils/FireBase";
import Toast, { DURATION } from "react-native-easy-toast";
import {FacebookApi} from "../../utils/Social"
import * as Facebook from "expo-facebook";

const Form = t.form.Form;

export default class Map extends Component {
  constructor() {
    super();
    this.state = {
      loginStruct: LoginStruct,
      loginOptions: LoginOptions,
      loginData: {
        email: "",
        password: ""
      },
      loginErrorMessage: ""
    };
  }
  login = () => {
    const { password } = this.state.loginData;

    const validate = this.refs.loginForm.getValue();
    if (validate) {
      this.setState({ formErrorMessage: "" });
      firebase
        .auth()
        .signInWithEmailAndPassword(validate.email, validate.password)
        .then(resolve => {
          this.refs.toast.show("Registro correcto", 200, () => {
            this.props.navigation.navigate("Profile");
          });
        })
        .catch(err => {
          const errorCode = err.code;
          if (errorCode === "auth/wrong-password") {
            this.refs.toast.show("Contraseña incorrectos", 1500);
          }
          if (errorCode === "auth/user-not-found") {
            this.refs.toast.show("Usuario no existe", 1500);
          } else {
            this.refs.toast.show("Contraseña o email incorrectos", 1500);
          }
        });
    } else {
      this.setState({
        loginErrorMessage: "Introduzca formulario correctamente"
      });
    }
  };

  loginFacebook= async ()=>{
    const {type, token} = await Facebook.logInWithReadPermissionsAsync(
      FacebookApi.application_id,
      {permissions:FacebookApi.permissions}
    );
    console.log(type);
    console.log(token);
  }
  onChangeFormLogin = loginValue => {
    this.setState({
      loginData: loginValue
    });
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
          PlaceholderContent={<ActivityIndicator />}
          ResizeMode="contain"
        />

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
            onPress={() => this.login()}
          />
          <Text style={styles.loginErrorMessage}>{loginErrorMessage}</Text>
          <Divider style={styles.divider}></Divider>
          <SocialIcon title="Iniciar con Facebook" button type="facebook"
          onPress={() => this.loginFacebook()} />
          <Toast
            ref="toast"
            position="bottom"
            positionValue={250}
            fadeInDuration={1000}
            fadeOutDuration={1000}
            opacity={0.8}
            textStyle={{ color: "#fff" }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 40
  },
  viewLogin: {
    marginTop: 20
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
    marginTop: 20
  },
  divider:{
 backgroundColor: "#00a680",
 marginBottom:20
  }
});

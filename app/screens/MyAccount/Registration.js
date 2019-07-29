import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import t from "tcomb-form-native";
import { Button } from "react-native-elements";
import * as firebase from "firebase";
import firebaseconfig from "../../utils/FireBase"
import Toast, {DURATION} from 'react-native-easy-toast'

const Form = t.form.Form;

import { RegisterStruct, RegisterOptions } from "../../forms/Register";

export default class Registration extends Component {
  constructor() {
    super();
    this.state = {
      registerStruct: RegisterStruct,
      registerOptions: RegisterOptions,
      formData: {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: ""
      },
      formErrorMessage: ""
    };
  }

  register = () => {
    
    const { password, passwordConfirmation } = this.state.formData;

    if (password === passwordConfirmation) {
      const validate = this.refs.registerForm.getValue();
      if (validate) {
        this.setState({ formErrorMessage: "" });
        firebase
          .auth()
          .createUserWithEmailAndPassword(validate.email, validate.password)
          .then(resolve => {
            this.refs.toast.show('Registro correcto', 200, () => {
              this.props.navigation.navigate("Profile")
          });
          })
          .catch(err => {
            this.refs.toast.show('El email ya esta en uso', 1500);
          });
      } else {
        this.setState({ formErrorMessage: "Formulario incorrecto" });
      }
    } else {
      this.setState({ formErrorMessage: "Las contraseñas no son iguales" });
    }

    console.log(this.state.formData);
  };

  onChangeFormRegister = formValue => {
    this.setState({
      formData: formValue
    });
    console.log(this.state.formData);
  };

  render() {
    const {
      registerOptions,
      registerStruct,
      formData,
      formErrorMessage
    } = this.state;
    return (
      <View style={styles.viewBody}>
        <Form
          ref="registerForm"
          type={registerStruct}
          options={registerOptions}
          value={formData}
          onChange={formValue => this.onChangeFormRegister(formValue)}
        />
        <Button
          buttonStyle={styles.buttonRegisterContainer}
          title="Unirse"
          onPress={() => this.register()}
        />
        <Text style={styles.formErrorMessage}>{formErrorMessage}</Text>
        <Toast
                    ref="toast"            
                    position="bottom"
                    positionValue={250}
                    fadeInDuration={1000}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 40,
    marginRight: 40
  },
  buttonRegisterContainer: {
    backgroundColor: "#00a680",
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  formErrorMessage: {
    color: "#ff0000",
    textAlign: "center",
    marginTop: 20
  }
});

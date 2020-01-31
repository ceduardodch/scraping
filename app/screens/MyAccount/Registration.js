import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import t from "tcomb-form-native";
import Odoo from 'react-native-odoo-promise-based'
import { Button } from "react-native-elements";

import Toast, { DURATION } from 'react-native-easy-toast'

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
        password: "",
        url: "",
        valor: "",
        subsidio: ""
      },

    };
  }
/*
  async buscarUsuario() {
    console.log("dddddxaz")
   
    const odoo = new Odoo({
      host: "alfredos.far.ec",
      port: 80 
      database: "alfredos",
      username:
        "carlos.diaz@fractalsoft.ec" 
      password: "1111" 
      protocol: "http" 
    });
    console.log("fsfsfzaq1")
    await odoo.connect()
      .then(response => { console.log(response); })
      .catch(e => { console.log(e); })
    const params = {
      fields: ["login", "password","company_id"],
    }
    const context = {
      domain: [],
    }
    await odoo.search_read('res.users', params, context)
      .then(response => {
        console.log("entra");
        console.log(response.data[0])
        console.log(response.data[1])
        this.setState({
          formRegistro: {
            name: response.data[0].login,
            lastnames: response.data[0].password, 
          }
        }
      )
      .catch(e => {
        alert(e)
        this.setState({
          loaded: true,
        })
      });
  }
}
  
*/

  register = () => {
    console.log("en el guardAR ")
    const {
      formData
    } = this.state
    var user_usuario_datos = formData.name;
    var user_contrasena_datos = formData.password;
    var user_url_datos = formData.url;
    var user_valor_datos = formData.valor;
    var user_subsidio_datos = formData.subsidio;
    console.log("luego en traccasion", user_url_datos, "gg", user_valor_datos, "gf", user_subsidio_datos)
    console.log("gggfrds", user_contrasena_datos, "hdhhdzq1", user_usuario_datos)

    db.transaction(function (tx) {
      console.log("entra")
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

    } = this.state;
    return (
      <View style={styles.viewBody}>
        <ScrollView style={styles.scrollView}>
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
            onPress={() => this.buscarUsuario()}
          />
        </ScrollView>

        <Toast
          ref="toast"
          position="bottom"
          positionValue={250}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: '#fff' }}
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

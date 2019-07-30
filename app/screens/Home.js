import React, {Component} from "react";
import {StyleSheet,View, Text} from  "react-native"
import Odoo from 'react-native-odoo-promise-based'
import { Button, Input, Card  } from "react-native-elements";
import PreLoader from "../components/PreLoader"

export default class Home extends Component
{
    constructor(props) {
        super(props)
        this.state = {
          formRegistro:{
          cedula: '',
          names: '',
          lastnames: '',
          sex: '',
          birthdate: '',
          deceased: ''},
          loaded:true
        };
        
    }
    async buscarPersona() {
        this.setState({loaded:false});
        const { cedula, names, lastnames, sex, birthdate, deceased } = this.state;        
        const odoo = new Odoo({
          host: 'scraping.fractal-soft.com',
          port: 8069, /* Defaults to 80 if not specified */
          database: 'scraping',
          username: 'ceduardodch@gmail.com', /* Optional if using a stored session_id */
          password: 'CarlosDiaz2013', /* Optional if using a stored session_id */
          protocol: 'http' /* Defaults to http if not specified */
        })
    
        await odoo.connect()
          .then(response => { /* ... */ })
          .catch(e => { /* ... */ })
        /* Get partner from server example */
        const params = {
          domain: [["identity", "=", cedula]],
          fields: ["names", "lastnames", "sex", "birthdate", "deceased"],
        }
        const context = {
          domain: [["id", "=", 1]],
        }
    
        await odoo.search_read('scraping.registro.civil', params, context)
          .then(response => {
            this.setState({
                formRegistro:{
              names: response.data[0].names,
              lastnames: response.data[0].lastnames,
              sex: response.data[0].sex,
              birthdate: response.data[0].birthdate,
              deceased: response.data[0].deceased}
            })          
          })
          .catch(e => { alert(e) });

        this.setState({loaded:true});
      }
      

    render(){
        const {loaded, search} = this.state

        if(!loaded)
        {
            return(<PreLoader/>);
            }else{
        return(
        
      <View style={styles.viewBody}>
        <Input style={styles.inputBox}        
          placeholder="Ingrese su cédula"
          value={this.state.cedula}
          onChangeText={(text) => { this.setState({ cedula: text }) }}          
        />
        <Button title="Buscar" onPress={()=> this.buscarPersona()}></Button>
      <Card title="DATOS BÁSICOS">
      <Text style={styles.name}>Nombres: <Text style={styles.label}>{this.state.formRegistro.names}</Text></Text>
      <Text style={styles.name}>Apellidos: <Text style={styles.label}>{this.state.formRegistro.lastnames}</Text></Text>
      <Text style={styles.name}>Sexo: <Text style={styles.label}>{this.state.formRegistro.sex}</Text></Text>
      <Text style={styles.name}>Fecha nacimiento: <Text style={styles.label}>{this.state.formRegistro.birthdate}</Text></Text>
      <Text style={styles.name}>Fallecido?: <Text style={styles.label}>{this.state.formRegistro.deceased}</Text></Text>
      </Card>
</View>
    );}}
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,        
        backgroundColor:"#fff",
        marginBottom:20,
        marginLeft:25,
        marginTop:15,
        marginRight:25
    },
    inputBox: {
        width: 300,
        backgroundColor: 'rgba(255, 255,255,0.2)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 10,
        marginLeft:15,
        marginTop:15,
        marginRight:15
      },
    
      button: {
        width: 300,
        backgroundColor: '#1c313a',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
        marginLeft:15,
        marginTop:15,
        marginRight:15
      },
      name:{
        fontWeight: "bold"
      },
      label:{
        fontWeight: "normal",
        fontSize:14
      }
})
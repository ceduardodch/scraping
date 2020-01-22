import React, { Component } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Alert } from "react-native"
import Odoo from 'react-native-odoo-promise-based'
import * as SQLite from 'expo-sqlite';
import { Button, Input, Card } from "react-native-elements";
import PreLoader from "../components/PreLoader"
import { FacturaStruct, FacturaOptions } from "../forms/Factura";
import t from "tcomb-form-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


const Form = t.form.Form;
<<<<<<< HEAD
export default class Home extends Component
{
    constructor(props) {
        super(props)
        this.state = {

          
          partner_id:"", invoice_id:"",
          facturaStruct: FacturaStruct,
          facturaOptions: FacturaOptions,
          facturaData: {
            cedula: "",
            cantidad: "",
            monto: ""
          },
          facturaErrorMessage: "",
      
          formRegistro:{
          cedula:"",
          names: '',
          lastnames: ''
        }, 
        tableHead: ['Descripción', 'Cantidad', 'Total'],
        tableData: "",

        formDetalle:{
          cantidad: '',
          monto: '',
          total:'',
          subsidio:''
        }, 
          formTitulos:[],
          loaded:true
        };
        
    }
    async facturar(nombre, cedula)
    {
      this.setState({ loaded:false})
      const odoo = new Odoo({
        host: 'pruebasproserinfo.far.ec',
        port: 80, /* Defaults to 80 if not specified */
        database: 'pruebasproserinfo',
        username: 'carlos.diaz@fractalsoft.ec', /* Optional if using a stored session_id */
        password: 'CarlosDiaz2013', /* Optional if using a stored session_id */
        protocol: 'http' /* Defaults to http if not specified */
      })

      await odoo.connect()
      .then(response => {  console.log(response);})
      .catch(e => { console.log(e); })
  
    const context = {
      domain: [["id", "=", 1]],
    }
    /* Crear partner */
    await odoo.create('res.partner', {
                      name: nombre,
                      vat: cedula
    }, context)
      .then(response => { console.log(response);
        this.setState({ loaded:true,partner_id: response.data })})
      .catch(e => { console.log(e); this.setState({ loaded:true});})
      

    /* Crear factura */
    console.log("Crear cabecera");
      await odoo.create('account.invoice', {
        'partner_id': this.state.partner_id,
        'type': 'out_invoice'
      }, context)
      .then(response => { console.log(response); this.setState({ loaded:true,invoice_id: response.data })})
      .catch(e => { console.log(e);this.setState({ loaded:true}); })
      
      console.log("Traer Invoice");
      console.log(this.state.partner_id);



      await odoo.search_read('res.partner', {
        domain: [["id", "=", this.state.partner_id]]
      }, context)
      .then(response => {
        {console.log(response.data);}       
      })
      .catch(e => { alert(e) });

      console.log("Creacr lineas");


      await odoo.create('account.invoice.line', {
        'invoice_id': this.state.formRegistro.invoice_id,
        'name': 'GAS',
        'product_id': '2',
        'quantity':'1',
        'price_unit':'1.6'
            }, context)
      .then(response => { console.log(response);this.setState({ loaded:true}) })
      .catch(e => { console.log(e);this.setState({ loaded:true}); })
    
    }
    
    async buscarPersona(cantidad, monto) {
        this.setState({loaded:false, tableData: [
          ['Gas', cantidad, Number(cantidad*1.6).toFixed(2)],        
          ['Transporte', '1', Number(cantidad*monto - cantidad*1.6).toFixed(2) ],        
          ['',  'IVA', Number(cantidad*1.6*0.12).toFixed(2)],        
          ['',  'Total', Number(cantidad*monto).toFixed(2)],        
          ['',  'Subsidio', Number(cantidad*0.51122*15).toFixed(2)],         ],} 
        );
        const { formRegistro, facturaData:{cedula}} = this.state;        
        const odoo = new Odoo({
          host: 'scraping.fractalsoft.ec',
          port: 8069, /* Defaults to 80 if not specified */
          database: 'scraping',
          username: 'ceduardodch@gmail.com', /* Optional if using a stored session_id */
          password: 'CarlosDiaz2013', /* Optional if using a stored session_id */
          protocol: 'http' /* Defaults to http if not specified */
        })
    
        await odoo.connect()
          .then(response => {  console.log(response);})
          .catch(e => { console.log(e); })
        /* Get partner from server example */
        console.log(cedula);
        const params = {
          domain: [["identity", "=", cedula]],
          fields: [ "names", "lastnames", "identity"],
=======
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
      loaded: true
    };

  }
  async facturar() {

  }
  async buscarPersona(cantidad, monto) {
    this.setState({
      loaded: false, tableData: [
        ['Gas', cantidad, Number(cantidad * 1.6).toFixed(2)],
        ['Transporte', '1', Number(cantidad * monto - cantidad * 1.6).toFixed(2)],
        ['', 'IVA', Number(cantidad * 1.6 * 0.12).toFixed(2)],
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
          loaded: true
>>>>>>> 25d50d1488a4b556aa56c5d93c93d02a063dbb32
        }
        )
      })
      .catch(e => { alert(e) });


  }

  onChangeFormFactura = facturaValue => {
    this.setState({
      facturaData: facturaValue
    });
    console.log(facturaValue);
  };
  register_user = () => {
    console.log("en el guardAR ")
    const {
      formRegistro,
      facturaData
    } = this.state
    console.log(formRegistro);
    console.log(facturaData);
    var user_name = formRegistro.names;
    var user_lastname = formRegistro.lastnames;
    var user_monto = facturaData.monto;
    var user_cedula = facturaData.cedula;
    var user_cantidad = facturaData.cantidad;
    var user_total = Number(user_monto * user_cantidad).toFixed(2)
    db.transaction(function (tx) {
      console.log("en elasss")
      tx.executeSql(
        'INSERT INTO table_user (user_cedula,user_name,user_lastname,user_monto,user_cantidad,user_total) VALUES (?,?,?,?,?,?)',
        [user_cedula, user_name, user_lastname, user_monto, user_cantidad, user_total],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Registered Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () =>
                    console.log("usususus"),
                },
              ],
              { cancelable: false }
            );
          } else {
            alert('Registration Failed');
          }
        }, (err) => {
          console.log("e", err)

        }
<<<<<<< HEAD
    
        await odoo.search_read('scraping.registro.civil', params, context)
          .then(response => {
            this.setState({
                formRegistro:{
              names: response.data[0].names,
              lastnames: response.data[0].lastnames,  
              cedula: response.data[0].identity,  
            }, 
            loaded:true       
            }
            )        
          })
          .catch(e => { alert(e) });
      
=======
      )
    });
>>>>>>> 25d50d1488a4b556aa56c5d93c93d02a063dbb32

  }
  render() {
    const { loaded,
      facturaOptions,
      facturaStruct,
      facturaData,
      tableHead, tableData } = this.state

    if (!loaded) {
      return (<PreLoader />);
    } else {
      return (

        <View style={styles.viewBody}>
          <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
              <Form
                ref="facturaForm"
                type={facturaStruct}
                options={facturaOptions}
                value={facturaData}
                onChange={facturaValue => this.onChangeFormFactura(facturaValue)}
              />

              <Button title="Buscar" onPress={() => this.buscarPersona(this.state.facturaData.cantidad, this.state.facturaData.monto)}></Button>
              <Card title="DATOS BÁSICOS" containerStyle={{marginBottom: 15}}>
                <Text style={styles.name}>Nombres: <Text style={styles.label}>{this.state.formRegistro.names}</Text></Text>
                <Text style={styles.name}>Apellidos: <Text style={styles.label}>{this.state.formRegistro.lastnames}</Text></Text>

              </Card>
              <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff',marginBottom: 15}}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                <Rows data={tableData} textStyle={styles.text} />
              </Table>
        
<<<<<<< HEAD
      <View style={styles.viewBody}>
        <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
          <Form
            ref="facturaForm"
            type={facturaStruct}
            options={facturaOptions}
            value={facturaData}
            onChange={facturaValue => this.onChangeFormFactura(facturaValue)}
          />


      <Button title="Buscar" onPress={()=> this.buscarPersona(this.state.facturaData.cantidad, this.state.facturaData.monto)}></Button>
      <Card title="DATOS BÁSICOS">
      <Text style={styles.name}>Identificación: <Text style={styles.label}>{this.state.formRegistro.cedula}</Text></Text>
      <Text style={styles.name}>Nombres: <Text style={styles.label}>{this.state.formRegistro.names}</Text></Text>
      <Text style={styles.name}>Apellidos: <Text style={styles.label}>{this.state.formRegistro.lastnames}</Text></Text>
     
      </Card>
      <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={tableData} textStyle={styles.text}/>
        </Table>

        <Button title="Facturar" onPress={()=> this.facturar(this.state.formRegistro.names+ ' ' +this.state.formRegistro.lastnames, this.state.formRegistro.cedula)}></Button>
        </ScrollView>
    </SafeAreaView>
</View>
    );}}
=======
              <Button style={styles.button} title="Facturar" onPress={() => this.register_user()}></Button>
            </ScrollView>
          </SafeAreaView>
        </View>
      );
    }
  }
>>>>>>> 25d50d1488a4b556aa56c5d93c93d02a063dbb32
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
    backgroundColor: '#1c313a',
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
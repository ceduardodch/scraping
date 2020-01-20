import React, {Component} from "react";
import {StyleSheet,View, Text,SafeAreaView, ScrollView } from  "react-native"
import Odoo from 'react-native-odoo-promise-based'
import { Button, Input, Card  } from "react-native-elements";
import PreLoader from "../components/PreLoader"
import { FacturaStruct, FacturaOptions } from "../forms/Factura";
import t from "tcomb-form-native";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


const Form = t.form.Form;
export default class Home extends Component
{
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
      
          formRegistro:{
          names: '',
          lastnames: '',
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
    async facturar()
    {

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
          fields: [ "names", "lastnames"],
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
            }, 
            loaded:true       
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
    render(){
        const {loaded,
          facturaOptions,
          facturaStruct,
          facturaData,
          tableHead,tableData } = this.state

        if(!loaded)
        {
            return(<PreLoader/>);
            }else{
        return(
        
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
      <Text style={styles.name}>Nombres: <Text style={styles.label}>{this.state.formRegistro.names}</Text></Text>
      <Text style={styles.name}>Apellidos: <Text style={styles.label}>{this.state.formRegistro.lastnames}</Text></Text>
     
      </Card>
      <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={tableData} textStyle={styles.text}/>
        </Table>

        <Button title="Facturar" onPress={()=> this.facturar()}></Button>
        </ScrollView>
    </SafeAreaView>
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
      },
      head: { height: 40, backgroundColor: '#f1f8ff' },
      text: { margin: 6 }
})
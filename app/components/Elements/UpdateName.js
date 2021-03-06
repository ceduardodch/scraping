import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Overlay, Input, Button, Icon } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("Factura.db");
export default class UpdateName extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props,
        };
    }

    onChangeInputOne = inputData => {
        this.setState({
            inputValueOne: inputData
        });
    };
    onChangeInputTwo = inputData => {
        this.setState({
            inputValueTwo: inputData
        });
    };
    onChangeInputThree = inputData => {
        this.setState({
            inputValueThree: inputData
        });
    };
    onChangeInputFour = inputData => {
        this.setState({
            inputValueFour: inputData
        });
    };


    updateClient = () => {
        console.log("gsgsgs")
        let names = this.state.inputValueOne;
        let lastnames = this.state.inputValueTwo;
        let email = this.state.inputValueThree;
        let phone = this.state.inputValueFour
        let cedula = this.state.cedula;
        
        if (names && lastnames && email) {
            /*  db.transaction((tx) => {
                  tx.executeSql(
                      'UPDATE table_user set user_name=?, user_lastname=? where user_cedula=?',
                      [names, lastnames, cedula],
                      (tx, results) => {
                          console.log('Results', results.rowsAffected);
                          if (results.rowsAffected > 0) {
                              console.log("modificado")
                              this.state.insertData()
                          } else {
                              console.log("no se puede modificar");
                          }
                      }
                  );
              });*/

            this.close();
            this.state.updateClient(names, lastnames, cedula, email, phone);
            this.state.insertData()

        } else {
            this.refs.toast.show("Ingresar todos los campos", 1500);
        }

    }

    close = () => {
        this.setState({
            isVisibleOverlay: false
        });
        this.state.close();
    };

    render() {
        const {
            isVisibleOverlay,
            inputValueOne,
            inputValueTwo,
            inputValueThree,
            inputValueFour,
        } = this.state;

        return (
            <Overlay
                isVisible={isVisibleOverlay}
                overlayBackgroundColor="transparent"
                overlayStyle={styles.overlayStyle}
                fullScreen={true}
            >

                <View style={styles.viewOverlay}>

                    <Text style={styles.fareTitleText}>Ingresar Datos</Text>
                    <Input
                        containerStyle={styles.inputContainer}
                        placeholder="Nombres"
                        onChangeText={value => this.onChangeInputOne(value)}
                        value={inputValueOne}
                    />
                    <Input
                        containerStyle={styles.inputContainer}
                        placeholder="Apellidos"
                        onChangeText={value => this.onChangeInputTwo(value)}
                        value={inputValueTwo}
                    />
                    <Input
                        containerStyle={styles.inputContainer}
                        placeholder="Correo"
                        onChangeText={value => this.onChangeInputThree(value)}
                        keyboardType="email-address"
                        value={inputValueThree}
                    />
                    <Input
                        containerStyle={styles.inputContainer}
                        placeholder="Télefono"
                        onChangeText={value => this.onChangeInputFour(value)}                        
                        value={inputValueFour}
                    />
                    <Button
                        buttonStyle={styles.buttonUpdate}
                        title="Modificar"
                        onPress={() => this.updateClient()}
                    />
                    <Icon
                        containerStyle={styles.containerIconClose}
                        type="material-community"
                        name="close-circle-outline"
                        size={40}
                        onPress={() => this.close()}
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
                </View>

            </Overlay>
        );
    }

}

const styles = StyleSheet.create({
    overlayStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    viewOverlay: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 10,
        borderColor: "#f2f2f2",
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2
    },
    inputContainer: {
        marginBottom: 10
    },
    buttonUpdate: {
        marginTop: 4,
        backgroundColor: "#00a680"
    },
    containerIconClose: {
        position: "absolute",
        right: -16,
        top: -16
    },
    fareTitleText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10
    },
});

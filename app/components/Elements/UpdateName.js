import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Overlay, Input, Button, Icon } from "react-native-elements";
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


    updateClient =  () => {
        let names = this.state.inputValueOne;
        let lastnames = this.state.inputValueTwo;
        let cedula= this.state.cedula;
        if (names && lastnames) {
            db.transaction((tx) => {
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
            });
        } else {
            alert('Ingresar todos los campos');
        }
        this.close();
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
        backgroundColor: "#00a680"
    },
    containerIconClose: {
        position: "absolute",
        right: -16,
        top: -16
    },
    fareTitleText: {
        fontSize: 18,
        color: "Black",
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10
    },
});

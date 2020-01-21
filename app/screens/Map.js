import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, Alert } from "react-native"
import { Icon } from "react-native-elements";
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("Factura.db");

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            FlatListItems: [],
        };
        this.view_user();
    }
    async componentDidMount() {
        console.log("hdhdhdhd");
        this.view_user();
    }

    view_user = () => {
        console.log("DDDDDdd");
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }
                this.setState({
                    FlatListItems: temp,
                });
            });
        });
    }
    ListViewItemSeparator = () => {
        return (
            <View style={{ height: 0.3, width: '100%', backgroundColor: '#808080' }} />
        );
    };
    render() {
        return (
            <View style={styles.viewBody}>

                <FlatList
                    data={this.state.FlatListItems}
                    ItemSeparatorComponent={this.ListViewItemSeparator}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View key={item.user_id} style={{ backgroundColor: '#f2f2f2', padding: 20,  marginBottom: 10,
                        marginLeft: 10,
                        marginTop: 10,
                        marginRight: 10
                     }}>
                            <Text>Id: {item.user_id}</Text>
                            <Text>Cédula: {item.user_cedula}</Text>
                            <Text>Nombre: {item.user_name}</Text>
                            <Text>Apellido: {item.user_lastname}</Text>
                            <Text>Monto: {item.user_monto}</Text>
                            <Text>Cantidad: {item.user_cantidad}</Text>
                            <Text>Total: {item.user_total}</Text>
                        </View>
                    )}
                />
                <Icon
                    type="material-community"
                    name="cached"
                    size={50}
                    containerStyle={styles.containerIconClose}
                    onPress={() => this.view_user()}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "White",
        marginBottom: 10,
        marginLeft: 10,
        marginTop: 10,
        marginRight: 10
    },
    containerIconClose: {
        position: "absolute",
        bottom: 13,
        right: 13,
        backgroundColor: "#fff",
        borderRadius: 25
    },

})
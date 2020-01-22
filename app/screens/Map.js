import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, Alert } from "react-native"
import { Icon } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("Factura.db");

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            FlatListItems: [],
        };
        this.view_user(false);
    }
    async componentDidMount() {
        console.log("hdhdhdhd");
        this.view_user();
    }

    view_user = (val) => {
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
                if (val) {
                    this.refs.toast.show(
                        "Información actualizada",
                        1500
                    );
                }
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
                        <View key={item.user_id} style={{
                            backgroundColor: '#f2f2f2', padding: 20, marginBottom: 10,
                            marginLeft: 10,
                            marginTop: 10,
                            marginRight: 10
                        }}>
                            <Text style={styles.name}>Cédula: <Text style={styles.label}>{item.user_cedula}</Text> </Text>
                            <Text style={styles.name}>Nombres: <Text style={styles.label}> {item.user_name}</Text></Text>
                            <Text style={styles.name}>Apellidos: <Text style={styles.label}>{item.user_lastname}</Text></Text>
                            <Text style={styles.name}>Iva:<Text style={styles.label}>{item.user_iva} </Text> </Text>
                            <Text style={styles.name}>Total:<Text style={styles.label}>{item.user_total} </Text> </Text>
                            <Text style={styles.name}>Subsidio:<Text style={styles.label}>{item.user_subsidio} </Text> </Text>
                        </View>
                    )}
                />
                <Icon
                    type="material-community"
                    name="cached"
                    size={50}
                    containerStyle={styles.containerIconClose}
                    onPress={() => this.view_user(true)}
                />
                <Toast
                    ref="toast"
                    position="bottom"
                    positionValue={320}
                    fadeInDuration={1000}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{ color: "#fff" }}
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
        borderRadius: 25,
        borderWidth:2,
        borderColor:"#f2f2f2"
    },
    name: {
        fontWeight: "bold"
    },
    label: {
        fontWeight: "normal",
        fontSize: 14
    },

})
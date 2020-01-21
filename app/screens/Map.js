import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text,Alert } from "react-native"
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
    view_user = () => {
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
            <View style={{ height: 0.2, width: '100%', backgroundColor: '#808080' }} />
        );
    };
    render() {
        return (
            <View style="styles.viewBody">
                <Icon
                    type="material-community"
                    name="cached"
                    size={50}
                    containerStyle={styles.containerIconClose}
                    onPress={() => this.view_user()}
                />
                <FlatList
                    data={this.state.FlatListItems}
                    ItemSeparatorComponent={this.ListViewItemSeparator}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View key={item.user_id} style={{ backgroundColor: 'white', padding: 20 }}>
                            <Text>Id: {item.user_id}</Text>
                            <Text>Name: {item.user_name}</Text>
                            <Text>LastName: {item.user_lastname}</Text>
                        </View>
                    )}
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
        backgroundColor: "#fff"
    },
    containerIconClose: {
        position: "absolute",
        bottom: 13,
        right: 13,
        backgroundColor: "#fff",
        borderRadius:25
      },
    
})
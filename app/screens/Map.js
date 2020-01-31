import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, Alert } from "react-native";
import Odoo from "react-native-odoo-promise-based";
import { Icon } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";
import ActionButton from "react-native-action-button";
import * as SQLite from "expo-sqlite";
import PreLoader from "../components/PreLoader";
const db = SQLite.openDatabase("Factura.db");

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
      partner_id: "",
      invoice_id: "",
      loaded: true,
      product1_id: "",
      product2_id: "",
      partner_flag: false,
      taxes1_id: [],
      taxes2_id: [],
      account_id: "",
      url: "",
      user: "",
      pwd: ""
    };
    this.view_user(false);
  }
  async componentDidMount() {
    this.view_user();
  }

  async facturar(user_cedula, user_name, user_lastname, user_monto, user_cantidad, user_total, user_subsidio, user_transporte, user_iva) {
    try {
      user_subtotal = Number(user_transporte) + user_cantidad * 1.6
      console.log(user_cedula);
      console.log(user_name);
      console.log(user_lastname);
      this.setState({ loaded: false });
      prot = this.state.url.split('://');
      datab = prot[1].split('.');
      const odoo = new Odoo({

        host: prot[1],
        port: 80 /* Defaults to 80 if not specified */,
        database: datab[0],
        username: this.state.user /* Optional if using a stored session_id */,
        password: this.state.pwd /* Optional if using a stored session_id */,
        protocol: prot[0]/* Defaults to http if not specified */
      });

      await odoo
        .connect()
        .then(response => { console.log(response); })
        .catch(e => {
          console.log(e);
        });

      const context = {
        domain: [["id", "=", 1]]
      };

      await odoo
        .search_read(
          "account.account",
          {
            domain: [["code", "=", "10.01.011"]]
          },
          context
        )
        .then(response => {
          {
            console.log(response.data[0].id);
            this.setState({ account_id: response.data[0].id });
          }
        })
        .catch(e => {
        });

      await odoo
        .search_read(
          "res.partner",
          {
            domain: [["vat", "=", user_cedula]]
          },
          context
        )
        .then(response => {
          {
            console.log(response.data[0].id);
            this.setState({ loaded: true, partner_id: response.data[0].id });
          }
        })
        .catch(e => {
          this.setState({ partner_flag: false })
        });
      console.log("partner_id ========>" + this.state.partner_id)
      /* Crear partner */
      if (this.state.partner_id == "") {
        await odoo.create('res.partner', {
          name: user_name + ' ' + user_lastname,
          vat: user_cedula
        }, context)
          .then(response => {
            console.log(response);
            this.setState({ loaded: true, partner_id: response.data })
          })
          .catch(e => { console.log(e); this.setState({ loaded: true }); })
      }

      /* Crear factura */
      //console.log(this.state.partner_id);
      console.log("Crear cabecera");
      await odoo
        .create(
          "account.invoice",
          {
            partner_id: this.state.partner_id,
            type: "out_invoice",
            total: user_total,
            montoiva: user_iva,
            baseimpgrav: user_cantidad * 1.6,
            baseimponible: user_transporte,
            subtotal: user_subtotal
          },
          context
        )
        .then(response => {
          console.log(response);
          this.setState({ loaded: true, invoice_id: response.data });
        })
        .catch(e => {
          console.log(e);
          this.setState({ loaded: true });
        });




      console.log("Crear lineas");
      await odoo
        .search_read(
          "product.product",
          {
            domain: [["default_code", "=", "01"]]
          },
          context
        )
        .then(response => {
          {
            console.log(response.data[0]);
            this.setState({ loaded: true, product1_id: response.data[0].id, taxes1_id: response.data[0].taxes_id });
          }
        })
        .catch(e => {
          alert(e);
        });





      console.log("Productos");
      await odoo
        .search_read(
          "product.product",
          {
            domain: [["default_code", "=", "02"]]
          },
          context
        )
        .then(response => {
          {
            console.log(response.data[0].taxes_id);
            this.setState({ loaded: true, product2_id: response.data[0].id, taxes2_id: response.data[0].taxes_id });
          }
        })
        .catch(e => {

        });

      await odoo
        .create(
          "account.invoice.line",
          {
            invoice_id: this.state.invoice_id,
            name: "[01] GLP DOMÉSTICO 15 KL",
            account_id: "563",
            product_id: this.state.product1_id,
            quantity: user_cantidad,
            price_unit: "1.6",
            invoice_line_tax_ids: [[6, 0, this.state.taxes1_id]],
          },
          context
        )
        .then(response => {

          this.setState({ loaded: true });
        })
        .catch(e => {

          this.setState({ loaded: true });
        });

      await odoo
        .create(
          "account.invoice.line",
          {
            invoice_id: this.state.invoice_id,
            name: "[02] TRANSPORTE A DOMICILIO",
            account_id: "563",
            product_id: this.state.product2_id,
            quantity: "1",
            price_unit: user_transporte,
            invoice_line_tax_id: [[6, 0, this.state.taxes2_id]],
          },
          context
        )
        .then(response => {
          console.log(response);
          this.setState({ loaded: true });
          this.deleteUser(user_cedula);
          this.refs.toast.show("Información facturada", 1500);
        })
        .catch(e => {
          console.log(e);
          this.setState({ loaded: true });
        });
      await odoo
        .create(
          "account.invoice.tax",
          {
            name: "407 12%",
            invoice_id: this.state.invoice_id,
            invoice_line_tax_ids: [[6, 0, this.state.taxes1_id]],
            account_id: this.state.account_id,
            amount: user_iva
          },
          context
        )
        .then(response => {
          console.log(response);
          this.setState({ loaded: true, invoice_id: response.data });
        })
        .catch(e => {
          console.log(e);
          this.setState({ loaded: true });
        });
    } catch (e) { }
  }

  deleteUser = (cedula) => {
    console.log("eliminar ==========> " + cedula);
    db.transaction(tx => {
      tx.executeSql('DELETE FROM  table_user where user_cedula=?', [cedula], (tx, results) => {
        console.log("Results ==========>", results.rowsAffected);
        if (results.rowsAffected > 0) {
          this.refs.toast.show("Información enviada a odoo", 1500);
          this.view_user();
        } else {
          alert("Error al enviar");
        }
      });
    });
  };
  view_user = val => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM table_user", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp
        });
        if (val) {
          this.refs.toast.show("Información actualizada", 1500);
        }
      });
    });
  };

  view_config() {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM table_user_datos", [], (tx, results) => {
        console.log("====> viewconfig1");
        var temp1 = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp1.push(results.rows.item(i));
          console.log("====> temp ===>" + temp1);
          this.setState({
            url: temp1[0].user_url_datos,
            user: temp1[0].user_usuario_datos,
            pwd: temp1[0].user_contrasena_datos,

          });
        }
      });
    });
  };


  sincronizar() {
    console.log("Sincronizar");
    this.view_config();
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM table_user", [], (tx, results1) => {
        var temp1 = [];
        for (let i = 0; i < results1.rows.length; ++i) {
          temp1.push(results1.rows.item(i));
          this.facturar(temp1[0].user_cedula, temp1[0].user_name, temp1[0].user_lastname, temp1[0].user_monto, temp1[0].user_cantidad, temp1[0].user_total, temp1[0].user_subsidio, temp1[0].user_transporte, temp1[0].user_iva)

        }
      });
    });
  };


  ListViewItemSeparator = () => {
    return (
      <View
        style={{ height: 0.3, width: "100%", backgroundColor: "#808080" }}
      />
    );
  };
  render() {
    const { loaded } = this.state;
    if (!loaded) {
      return <PreLoader />;
    } else {
      return (
        <View style={styles.viewBody}>
          <FlatList
            data={this.state.FlatListItems}
            ItemSeparatorComponent={this.ListViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                key={item.user_id}
                style={{
                  backgroundColor: "#f2f2f2",
                  padding: 15,
                  marginBottom: 10,
                  marginLeft: 14,
                  marginTop: 10,
                  marginRight: 14
                }}
              >
                <Text style={styles.name}>
                  Cédula: <Text style={styles.label}>{item.user_cedula}</Text>{" "}
                </Text>
                <Text style={styles.name}>
                  Nombres: <Text style={styles.label}> {item.user_name}</Text>
                </Text>
                <Text style={styles.name}>
                  Apellidos: <Text style={styles.label}>{item.user_lastname}</Text>
                </Text>
                <Text style={styles.name}>
                  Iva: <Text style={styles.label}>{item.user_iva} </Text>{" "}
                </Text>
                <Text style={styles.name}>
                  Total: <Text style={styles.label}>{item.user_total} </Text>{" "}
                </Text>
                <Text style={styles.name}>
                  Subsidio: <Text style={styles.label}>{item.user_subsidio} </Text>{" "}
                </Text>
              </View>
            )}
          />
          <ActionButton buttonColor="#3CA4BF">
            <ActionButton.Item
              buttonColor="#007aff"
              title="Actualizar"
              onPress={() => this.view_user(true)}
            >
              <Icon name="cached" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#8ec4e6"
              title="Sincronizar"
              onPress={() => this.sincronizar()}
            >
              <Icon name="cloud-upload" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
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
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#fff",
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
    borderWidth: 2,
    borderColor: "#f2f2f2"
  },
  name: {
    fontWeight: "bold"
  },
  label: {
    fontWeight: "normal",
    fontSize: 14
  }
});

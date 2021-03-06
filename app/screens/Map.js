import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, Alert, NetInfo, AsyncStorage } from "react-native";
import Odoo from "react-native-odoo-promise-based";
import { Button, Icon } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";
import ActionButton from "react-native-action-button";
import * as SQLite from "expo-sqlite";
import PreLoader from "../components/PreLoader";
const db = SQLite.openDatabase("Factura.db");

export default class Map extends Component {
  constructor(props) {
    super(props);
    let f = new Date()
    let month = f.getMonth() + 1;
    if (month < 10) {
      month = "0" + month
    }
    let date_invoice = f.getFullYear() + "-" + month + "-" + f.getDate();
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
      pwd: "",
      user_id: "",
      trans: false,
      online: false,
      date: ""
    };
    this.view_user(false);
  }

  CheckConnectivity = () => {
    NetInfo.isConnected.fetch().then(isConnected => {
      isConnected
        ? this.setState({ online: true })
        : this.setState({ online: false });
    });
  };

  async componentDidMount() {
    this.CheckConnectivity();
    // this.view_user();
  }

  async facturar(
    user_cedula,
    user_name,
    user_lastname,
    user_email,
    user_phone,
    user_monto,
    user_cantidad,
    user_total,
    user_subsidio,
    user_transporte,
    user_iva,
    user_id
  ) {
    try {
      let account_id
      let account_id_c
      let account_id_p
      let partner_id
      let invoice_id

      user_subtotal = Number(user_transporte) + user_cantidad * 1.6;
      console.log(user_cedula);
      console.log(user_name);
      console.log(user_lastname);
      prot = this.state.url.split("://");
      datab = prot[1].split(".");
      const odoo = new Odoo({
        host: prot[1],
        port: 80 /* Defaults to 80 if not specified */,
        database: datab[0],
        username: this.state.user /* Optional if using a stored session_id */,
        password: this.state.pwd /* Optional if using a stored session_id */,
        protocol: prot[0] /* Defaults to http if not specified */
      });

      await odoo
        .connect()
        .then(response => {
          console.log(response.success);
          this.setState({ trans: true });
        })
        .catch(e => {
          console.log(e);
          this.setState({ trans: false });
        });
      console.log("trans==========>" + this.state.trans);
      //if (this.state.trans) {
      try {
        const context = {
          lang: 'es_EC',
          tz: 'America/Lima'
        };
        await odoo
          .search_read(
            "account.account",
            {
              domain: [["code", "=", "21.04.01"]]
            },
            context
          )
          .then(response => {
            {
              console.log(response.data[0].id);
              account_id = response.data[0].id;
            }
          })
          .catch(e => {
            this.setState({ trans: false });
          });
        await odoo
          .search_read(
            "account.account",
            {
              domain: [["code", "=", "11.03.01.01"]]
            },
            context
          )
          .then(response => {
            {
              console.log(response.data[0].id);
              account_id_c = response.data[0].id;
            }
          })
          .catch(e => {
            this.setState({ trans: false });
          });
        await odoo
          .search_read(
            "account.account",
            {
              domain: [["code", "=", "21.01.02.03"]]
            },
            context
          )
          .then(response => {
            {
              console.log(response.data[0].id);
              account_id_p = response.data[0].id;
            }
          })
          .catch(e => {
            this.setState({ trans: false });
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
              partner_id = response.data[0].id;
            }
          })
          .catch(e => {
            this.setState({ partner_flag: false, trans: false });

          });
        console.log("partner_id ========>" + partner_id);
        /* Crear partner */
        if (!partner_id) {
          await odoo
            .create(
              "res.partner",
              {
                name: user_name + " " + user_lastname,
                vat: user_cedula,
                phone: user_phone,
                email: user_email,
                property_account_receivable_id: account_id_c,
                property_account_payable_id: account_id_p,

              },
              context
            )
            .then(response => {
              console.log(response);
              partner_id = response.data
            })
            .catch(e => {
              console.log(e);
              this.setState({ trans: false });
            });

        }

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
              console.log("Taxes1==>" + response.data[0]);
              product1_id: response.data[0].id,
                this.setState({
                  //loaded: true,
                  taxes1_id: response.data[0].taxes_id
                });
            }
          })
          .catch(e => {
            this.setState({ trans: false });
          });


        /* Crear factura */
        //console.log(this.state.partner_id);

        /*  console.log("Crear cabecera");
          let f = new Date()
          let month = f.getMonth() + 1;
          if (month < 10) {
            month = "0" + month
          }*/
        try {
          const value = await AsyncStorage.getItem('@MySuperDate:key');
          console.log("el fff ", value)
          this.setState({
            date: value
          })

        } catch (error) {
          console.log("Error retrieving data" + error);
        }
        //  await getKey();
        const dataFact = {
          partner_id: partner_id,
          type: "out_invoice",
          //date_invoice: f.getFullYear() + "-" + month + "-" + f.getDate(),
          date_invoice: this.state.date,
          total: user_total,
          montoiva: user_iva,
          baseimpgrav: user_cantidad * 1.6,
          baseimponible: user_transporte,
          subtotal: user_total - user_iva,

        }
        await odoo
          .create(
            "account.invoice",
            dataFact,
            context
          )
          .then(response => {
            console.log(response);
            invoice_id = response.data;
          })
          .catch(e => {
            console.log(e);
            this.setState({ trans: false });
          });

        console.log("Invoiceid ===>" + invoice_id);
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
              console.log("Taxes1==>" + response.data[0]);
              this.setState({
                // loaded: true,
                product1_id: response.data[0].id,
                taxes1_id: response.data[0].taxes_id
              });
            }
          })
          .catch(e => {
            this.setState({ trans: false });
          });

        console.log("Producto1");
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
              console.log("Taxes2==>" + response.data[0].taxes_id);
              this.setState({
                product2_id: response.data[0].id,
                taxes2_id: response.data[0].taxes_id
              });
            }
          })
          .catch(e => {
            console.log(e)
            this.setState({ trans: false });
          });

        await odoo
          .create(
            "account.invoice.line",
            {
              invoice_id: invoice_id,
              name: "[01] GLP DOMÉSTICO 15 KL",
              account_id: account_id,
              product_id: this.state.product1_id,
              quantity: user_cantidad,
              price_unit: 1.6,              
              invoice_line_tax_ids: [[6, 0, this.state.taxes1_id]]
            },
            context
          )
          .then(response => {
            console.log(response)
          })
          .catch(e => {
            console.log(e)
            this.setState({ trans: false });
          });

          
          /*
          await odoo
          .create(
            "account.invoice.tax",
            [
              {
                name: "401",
                invoice_id: invoice_id,
                invoice_line_tax_ids:  this.state.taxes1_id,
                account_id: account_id,
                amount: user_iva,
                sequence:"200",
                manual: 1,
                base: 100
              },
              {
                name: "405 0%",
                invoice_id: invoice_id,
                invoice_line_tax_ids: [[6, 0, this.state.taxes2_id]],
                account_id: account_id,
                amount: 0
              }
            ],
            context
          )
          .then(response => {
          })
          .catch(e => {
            console.log(e);
            this.setState({ trans: false });

          });*/
        await odoo
          .create(
            "account.invoice.line",
            {
              invoice_id: invoice_id,
              name: "[02] TRANSPORTE A DOMICILIO",
              account_id: account_id,
              product_id: this.state.product2_id,
              quantity: "1",
              price_unit: user_transporte,
              invoice_line_tax_ids: [[6, 0, this.state.taxes2_id]]
            },
            context
          )
          .then(response => {

            this.deleteUserOdoo(user_id);

          })
          .catch(e => {
            console.log(e);
            this.setState({ loaded: true, trans: true });
          });
          var par = {
            model: 'account.invoice',
            method: 'compute_taxes',
            args: [invoice_id],
            kwargs: {},
        };//params

          await odoo.rpc_call('/web/dataset/call_kw', par)
          .then(response => { /* ... */ })
          .catch(e => { /* ... */ })
       

        this.refs.toast.show("Información facturada", 1500);

      } catch (e) {
        this.setState({ loaded: true });
      }
    } catch (e) {
      this.setState({ loaded: true });
    }

  }

  async getKey() {
    try {
      const value = await AsyncStorage.getItem('@MySuperDate:key');
      console.log("el ", value)
      this.setState({
        date: value
      })

    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }
  deleteUser = cedula => {
    db.transaction(tx => {
      tx.executeSql(
        "DELETE FROM  table_user where user_id=?",
        [cedula],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            this.view_user();
            this.refs.toast.show("Factura eliminada", 1500);

          } else {
            alert("Error al enviar");
          }
        }
      );
    });
  };
  deleteUserOdoo = cedula => {
    db.transaction(tx => {
      tx.executeSql(
        "DELETE FROM  table_user where user_id=?",
        [cedula],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log("factura eliminada")
            this.view_user();
          } else {
            alert("Error al enviar");
          }
        }
      );
    });
  };
  view_user = val => {
    console.log("agggggggggggggggggggggggggggggggggggggggggggggg")
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
        var temp1 = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp1.push(results.rows.item(i));
          this.setState({
            url: temp1[0].user_url_datos,
            user: temp1[0].user_usuario_datos,
            pwd: temp1[0].user_contrasena_datos
          });
        }
      });
    });
  }

  async sincronizar() {
    var temp1 = [];
    this.setState({
      loaded: false,
    })
    this.CheckConnectivity();
    if (this.state.online) {
      this.view_config();
      db.transaction(tx => {
        tx.executeSql("SELECT * FROM table_user", [], (tx, results1) => {
          let ultimo = results1.rows.length;
          if (results1.rows.length > 0) {
            for (let i = 0; i < results1.rows.length; ++i) {
              temp1.push(results1.rows.item(i));
              this.facturar(
                temp1[i].user_cedula,
                temp1[i].user_name,
                temp1[i].user_lastname,
                temp1[i].user_email,
                temp1[i].user_phone,
                temp1[i].user_monto,
                temp1[i].user_cantidad,
                temp1[i].user_total,
                temp1[i].user_subsidio,
                temp1[i].user_transporte,
                temp1[i].user_iva,
                temp1[i].user_id,
              );
            }

          } else {
            this.setState({
              loaded: true,
            })
          }
        });
      });

    } else {
      Alert.alert(
        'Sin conexión',
        [
          {
            text: 'Aceptar',
            onPress: () => console.log("ok")
          }
        ],
        { cancelable: false }
      );
      this.setState({
        loaded: true,
      })
    }
  }


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
      return (<PreLoader />);
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
                  Apellidos:{" "}
                  <Text style={styles.label}>{item.user_lastname}</Text>
                </Text>
                <Text style={styles.name}>
                  Iva: <Text style={styles.label}>{item.user_iva} </Text>{" "}
                </Text>
                <Text style={styles.name}>
                  Total: <Text style={styles.label}>{item.user_total} </Text>{" "}
                </Text>
                <Text style={styles.name}>
                  Subsidio:{" "}
                  <Text style={styles.label}>{item.user_subsidio} </Text>{" "}
                </Text>
                <Button
                  buttonStyle={styles.buttonLoginContainer}
                  title="Eliminar"
                  onPress={() => this.deleteUser(item.user_id)}
                />
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

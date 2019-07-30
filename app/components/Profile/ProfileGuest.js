import React, {Component} from "react";
import {StyleSheet,View, Text, ActivityIndicator} from  "react-native"
import {Button, Image} from "react-native-elements"

export default class ProfileGuest extends Component
{
    constructor(props){
        super(props);
    }
    render(){
        const { goToScreen } = this.props;
        return(
<View style={styles.viewBody}>
    <Image
    source={require("../../../assets/image-my-account-guest-01.jpg")}
    style={styles.image}
    PlaceholderContent={<ActivityIndicator/>}
    resizeMode="contain"
    />
    <Text style={styles.title}>Consulta tu perfil</Text>
    <Text style={styles.description}>¿Como describirías el uso de los datos públicos? Crees que 
    podemos hacer uso de estos datos desde una appcentralizada</Text>
    <Button 
        buttonStyle={styles.btnViewProfile} 
        title="Ver tu perfil" 
        onPress={() => goToScreen("Login")}
        />
</View>
    );}
}
const styles = StyleSheet.create({
    viewBody: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 30,
      paddingRight: 30
    },
    image: {
      height: 300,
      marginBottom: 40
    },
    title: {
      fontWeight: "bold",
      fontSize: 19,
      marginBottom: 10
    },
    description: {
      textAlign: "center",
      marginBottom: 20
    },
    btnViewProfile: {
      width: "100%",
      backgroundColor: "#00a680",
      }
  });
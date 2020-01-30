import React from "react";
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
} from "react-navigation";

import HomeScreen from "../screens/Home";
import MapScreen from "../screens/Map";
import DatosClienteScreen from "../screens/DatosCliente";
import ProfileScreen from "../screens/MyAccount/Profile";
import RegistrationScreen from "../screens/MyAccount/Registration";
import { Icon } from "react-native-elements";
import LoginScreen from "../screens/MyAccount/Login"

const homeScreenStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Facturación"
    })
  }
});

const mapScreenStack = createStackNavigator({
  Map: {
    screen: MapScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Resumen"
    })
  }
});
const DatosClienteScreenStack = createStackNavigator({
  Datos: {
    screen: DatosClienteScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Ingreso Datos"
    })
  }
});

const profileScreenStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Mi cuenta",
    
    })
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Login",

    })
  }
});




const RootStack = createBottomTabNavigator(
  {
    Home: {
      screen: homeScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Facturar",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="file-account"
            type="material-community"
            size={22}
            color={tintColor}
          />
        )
      })
    },
   /* Profile: {
      screen: profileScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Mi cuenta",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="face-profile"
            type="material-community"
            size={22}
            color={tintColor}
          />
        )
      })
    },*/
    Mapa: {
      screen: mapScreenStack,
      navigationOptions: ({ navigation }) => ({
        header: null,
        tabBarLabel: "Resumen",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="clipboard-text"
            type="material-community"
            size={22}
            color={tintColor}
          />
        )
      })
    },
    Datos: {
      screen: DatosClienteScreenStack,
      navigationOptions: ({ navigation }) => ({
        header: null,
        tabBarLabel: "Datos",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="account-convert"
            type="material-community"
            size={22}
            color={tintColor}
          />
        )
      })
    }

  },
  {
    order: ['Home', 'Mapa', 'Datos'],
    tabBarOptions: {
      inactiveTintColor: "#6464",
      activeTintColor: "#00a680"
    }
  }

);
const AppNavigator = createSwitchNavigator({
  Auth: profileScreenStack,
  Home: RootStack ,
});

export default createAppContainer(AppNavigator);

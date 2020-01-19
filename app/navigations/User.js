import React from "react";
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from "react-navigation";

import HomeScreen from "../screens/Home";
import MapScreen from "../screens/Map";
import ProfileScreen from "../screens/MyAccount/Profile";
import RegistrationScreen from "../screens/MyAccount/Registration";
import { Icon } from "react-native-elements";
import LoginScreen from "../screens/MyAccount/Login"

const homeScreenStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Inicio"
    })
  }
});

const mapScreenStack = createStackNavigator({
  Map: {
    screen: MapScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Mapa"
    })
  }
});

const profileScreenStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Mi cuenta"
    })
  },
  Registration: {
    screen: RegistrationScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Registro"
    })
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Login"
    })
  }
});


const RootStack = createBottomTabNavigator(
  {
    Home: {
      screen: homeScreenStack,
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: "Inicio",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="home"
            type="material-community"
            size={22}
            color={tintColor}
          />
        )
      })
    },
    Profile: {
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
    },
      Mapa: {
        screen: mapScreenStack,
        navigationOptions: ({ navigation }) => ({
          header: null,
          tabBarLabel: "Resumen",
          tabBarIcon: ({ tintColor }) => (
            <Icon
              name="google-maps"
              type="material-community"
              size={22}
              color={tintColor}
            />
          )
        })
    }
  },
  {
    order:['Profile','Home','Mapa'],
    tabBarOptions: {
      inactiveTintColor: "#6464",
      activeTintColor: "#00a680"
    }
  }

);

export default createAppContainer(RootStack);

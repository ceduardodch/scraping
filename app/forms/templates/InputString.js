import React, { Fragment } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";

export default (inputTemplate = locals => {
  return (
    <View style={styles.view}>
      <Input
        placeholder={locals.config.placeholder}
        password={locals.config.password}
        secureTextEntry={locals.config.password}
        leftIcon={{ type: locals.config.iconType, name: locals.config.iconName, size: 24 }}
        leftIconContainerStyle={styles.iconContainer}
        onChangeText={value => locals.onChange(value)}
        keyboardType={'default'}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  view: {
    marginBottom: 20
  },
  iconContainer: {
    paddingRight: 20
  }
});

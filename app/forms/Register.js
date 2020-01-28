import React from "react";
import t from "tcomb-form-native";
import formValidation from "../utils/Validation";
import inputTemplate from "../forms/templates/Input"
import inputTempString from "./templates/InputString"

export const RegisterStruct = t.struct({
    name: t.String,
    password: formValidation.password,
    url: formValidation.url,
    valor: t.Number,
    subsidio: t.Number,

});

export const RegisterOptions = {
    fields: {
        name: {
            label: "Usuario(*)",
            template: inputTempString,
            config: {
                placeholder: "Escribe usuario",
                iconType: "material-community",
                iconName: "account-outline"
            }
        },
        password: {
            label: "Contraseña(*)",
            template: inputTempString,
            config: {
                placeholder: "Escribe contraseña",
                iconType: "material-community",
                iconName: "lock-outline"
            }
        },
        url: {
            label: "URL(*)",
            template: inputTempString,
            config: {
                placeholder: "Ingrese la URL",
                iconType: "material-community",
                iconName: "internet-explorer"
            }
        },
        valor: {
            label: "Valor(*)",
            template: inputTemplate,
            config: {
                placeholder: "Escribe la valor",
                iconType: "material-community",
                iconName: "currency-usd"
            }
        },
        subsidio: {
            label: "Subsidio(*)",
            template: inputTemplate,
            config: {
                placeholder: "Escribe el subsidio",
                iconType: "material-community",
                iconName: "scale-balance"

            }
        },
    }
};
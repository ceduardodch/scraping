import React  from "react";
import t from "tcomb-form-native";
import formValidation from "../utils/Validation";
import inputTemplate from "../forms/templates/Input"
import inputTempString from "./templates/InputString"


export  const LoginStruct = t.struct({
url: formValidation.url,
usuario: formValidation.email,
password: formValidation.password,
});

export const LoginOptions = {
    fields:{     
        url:{
            label:"URL(*)",                        
            template: inputTempString,
            config:{
                placeholder:"Ingrese la URL",
                iconType:"material-community",
                iconName:"internet-explorer"
            }
        },   
        usuario:{
            label:"Usuario(*)",                        
            template: inputTempString,
            config:{
                placeholder:"Escribe tu usuario",
                iconType:"material-community",
                iconName:"account-outline"
            }
        },
        password:{
            label:"Contraseña(*)",                        
            template: inputTempString,
            config:{
                placeholder:"Escribe tu contraseña",
                password:true,
                secureTextEntry:true,
                iconType:"material-community",
                iconName:"lock-outline"
               
            }
        },        
        
    }
};
import React  from "react";
import t from "tcomb-form-native";
import formValidation from "../utils/Validation";
import inputTemplate from "../forms/templates/Input"


export  const RegisterStruct = t.struct({
name: t.String,
email: formValidation.email,
password: formValidation.password,
passwordConfirmation: formValidation.password
});

export const RegisterOptions = {
    fields:{
        name:{
            label:"Nombre(*)",                        
            template: inputTemplate,
            config:{
                placeholder:"Escribe tu nombre y apellido",
                iconType:"material-community",
                iconName:"account-outline"
            }
        },
        email:{
            label:"Email(*)",                        
            template: inputTemplate,
            config:{
                placeholder:"Escribe tu email",
                iconType:"material-community",
                iconName:"at"
            }
        },
        password:{
            label:"Contraseña(*)",                        
            template: inputTemplate,
            config:{
                placeholder:"Escribe tu contraseña",
                password:true,
                secureTextEntry:true,
                iconType:"material-community",
                iconName:"lock-outline"
               
            }
        },
        passwordConfirmation:{
            label:"Contraseña(*)",                               
            template: inputTemplate,
            config:{
                placeholder:"Repite tu contraseña",
                password:true,
                secureTextEntry:true,
                iconType:"material-community",
                iconName:"lock-reset"
            }
        }
    }
};
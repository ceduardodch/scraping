import React  from "react";
import t from "tcomb-form-native";
import formValidation from "../utils/Validation";
import inputTemplate from "../forms/templates/Input"


export  const LoginStruct = t.struct({
email: formValidation.email,
password: formValidation.password,
});

export const LoginOptions = {
    fields:{        
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
        
    }
};
import React  from "react";
import t from "tcomb-form-native";
import formValidation from "../utils/Validation";
import inputTemplate from "./templates/Input"




export  const FacturaStruct = t.struct({
    cedula: formValidation.cedula,
    cantidad: t.Number,
    monto: t.Number,
    

});

export const FacturaOptions = {
    fields:{        
        cedula:{
            label:"Cédula(*)",                        
            template: inputTemplate,
            config:{
                placeholder:"Ingrese la cédula",
                iconType:"material-community",
                iconName:"account-arrow-right"
            }
        },
        cantidad:{
            label:"Cantidad(*)",                        
            template: inputTemplate,
            config:{
                placeholder:"Escribe la cantidad",
                iconType:"material-community",
                iconName: "battery-unknown"
            }
        },        
        monto:{
            label:"Monto(*)",                        
            template: inputTemplate,
            config:{
                placeholder:"Escribe el monto",
                iconType:"material-community",                
                iconName:"currency-usd"
               
            }
        },        
        
    }
};
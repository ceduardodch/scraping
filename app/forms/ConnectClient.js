import React  from "react";
import t from "tcomb-form-native";
import formValidation from "../utils/Validation";
import inputTemplate from "./templates/Input"
import inputTempString from "./templates/InputString"


export  const FacturaStruct = t.struct({
    url: formValidation.url,
    valor: t.Number,
    subsidio: t.Number,
    

});

export const FacturaOptions = {
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
        valor:{
            label:"Valor(*)",                        
            template: inputTemplate,
            config:{
                placeholder:"Escribe la valor",
                iconType:"material-community",
                iconName: "currency-usd"
            }
        },        
        subsidio:{
            label:"Subsidio(*)",                        
            template: inputTemplate,
            config:{
                placeholder:"Escribe el subsidio",
                iconType:"material-community",                
                iconName:"scale-balance"
   
            }
        },        
        
    }
};
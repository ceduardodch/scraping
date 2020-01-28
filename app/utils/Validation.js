import t from "tcomb-form-native"

export default (formValidation ={
    email: t.refinement(t.String, value => {return /@/.test(value);}), 
    password: t.refinement(t.String, value=> {return value.length>=6;}),
    cedula: t.refinement(t.String, value=> {return value.length=10;}),
    cantidad: t.refinement(t.String, value=> {return value > 0;}),
    monto: t.refinement(t.String, value=> {return value > 1;}),
    url: t.refinement(t.String,value=>{return /./.test(value)}),
    valor: t.refinement(t.String, value=> {return value > 1;}),
    subsidio: t.refinement(t.String, value=> {return value > 1;}),

});
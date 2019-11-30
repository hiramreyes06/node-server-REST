//importamos
const mongoose= require('mongoose');

//Para validar que alguna propiedad no se repita en la base de datos
const uniqueValidator= require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
nombre:{
type: String,
unique:true,
required:[true,' Nombre es obligatorio']
},
cantidad:{
type: Number,
required:[true, 'La cantidad es requerida']
},
tipo:{
    type:String,
    required:[true, 'EL tipo es requerido']
},
estado:{
    type: Boolean,
    default: true
},
quien:{
    type: String,
    required:[true, 'La persona es requerida'],
    //De esta forma podemos hacer referencia con el populate de una coleccion a otra
    ref:'Usuario'
}


});


//Asi le añadimos plugins a los schemas
categoriaSchema.plugin( uniqueValidator, {message:'{PATH} debe de ser unico'});

//Asi se exporta el modelo del usuario para mongoose
//Primero se le agrega el nombre y despues el Schema
module.exports= mongoose.model('Categoria', categoriaSchema);


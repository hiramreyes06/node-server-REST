
const mongoose= require('mongoose');

const propUnicas= require('mongoose-unique-validator');

let Schema= mongoose.Schema;

let Producto = new Schema ({
nombre:{
    type:String,
    required: [true,' El nombre es requerido'],
    unique:true
},
img:{
    type: String,
    required:false
},
codigo:{
    type:String,
    required:[true, 'Codigo obligatorio'],
    unique:true
},
precio:{
    type:Number,
    required:[true, 'Precio requerido']
},
marca:{
    type:String,
    required:[true, 'Marca necesaria'],

},
usuario:{
    type: String,
    required:[true,'Usuario necesario'],
    ref:'Usuario'
},
categoria:{
type: String,
required: [true, 'Categoria necesaria'],
ref:'Categoria'
},
disponible:{
type: Boolean,
required:[true, 'Estado del producto']
},
descripcion:{
    type: String,
    required:[true, 'Descripcion necesaria']
}

});

//Asi le añadimos plugins a los schemas
Producto.plugin( propUnicas, {message:'{PATH} debe de ser unico'});

//Asi se exporta el modelo del usuario para mongoose
//Primero se le agrega el nombre y despues el Schema
module.exports= mongoose.model('Producto', Producto);
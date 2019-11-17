
//importamos
const mongoose= require('mongoose');

//Para validar que alguna propiedad no se repita en la base de datos
const uniqueValidator= require('mongoose-unique-validator');

//Asi creamos opciones con valores definidos para alguna propiedad 
let rolesValidos ={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
};

//Para crear el cascaron para crear esquemas en mongoose
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
    type:String,
    //Para regresar si una condicion no se cumple
    required: [true, 'El nombre es necesario']        
    },
    email:{
        type: String,
        //Asi para que la propiedad sea unica en la base de datos
        unique:true,
        required:[true,' El correo es necesario'],

    },
    password:{
        type: String,
        required:[true,'Contraseña obligatoria']
    },
    img:{
        type:String,
        required: false
    }, //No es obligatoria
    role:{
        //Asi asgnamos un valor por defecto
        type:String,
        default: 'USER_ROLE',
        //ASi se agregan las opciones definidas
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }


});


//Asi al antes de convertir el objeto en json quitamos la contraseña
//De esta forma eliminamos la propiedad password de la respuesta JSON en la API
//Asi se modifica cuando se imprima
usuarioSchema.methods.toJSON = function(){
    let user = this;
    //Asi obtenemos todas las propiedades y todos los metodos
    let userObject= user.toObject();


    delete userObject.password;

    return userObject;
}


//Asi le añadimos plugins a los schemas
usuarioSchema.plugin( uniqueValidator, {message:'{PATH} debe de ser unico'});

//Asi se exporta el modelo del usuario para mongoose
//Primero se le agrega el nombre y despues el Schema
module.exports= mongoose.model('Usuario', usuarioSchema);
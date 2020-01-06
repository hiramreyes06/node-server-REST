require('./config/config');

const express = require('express');

//Coneccion a base de datos mongoose
const mongoose = require('mongoose');

const app = express();

const fs = require('fs')

const path = require('path');





const bodyParser = require('body-parser')

//Middleware para subir archivos
//const fileUpload = require('express-fileupload');




//Express Permite procesar la informacion y la serializa en objeto json 
//Y para obtener el payload que tiene la peticion post 
//Cada peticion pasa por estas lineas debodyparser




// Permitir uso y acceso a la api desde cualquier lugar
 const cors= require('cors');

app.use( cors( { origin:true, credentials:true }) )
console.log('Cors configurado');

//Creamos las carpetas para subir archivos en el servidor
crearCarpetas();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());

//File upload
//app.use( fileUpload() );

//Usar la configuracion global de rutas del index.
app.use(require('./routes/index'));

//Conectar a base de datos ATLAS o al localhost automaticamente
//Warnings evitados por los objetos
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) =>{

    if (err) throw err;
    
    console.log('Base de datos ONLINE');

});

//De esta forma se verifica si estan las carpetas si no las crea
function crearCarpetas(){
//El __dirname contendra la direccion en la que se encuentra en el sistema
urlSystem=path.resolve(__dirname,'../uploads');

console.log(urlSystem );

if(!fs.existsSync(urlSystem ) ){

console.log('Create perro');

fs.mkdirSync(urlSystem);

fs.mkdirSync(urlSystem+'/usuarios');
fs.mkdirSync(urlSystem+'/productos');


}else{
    console.log('La carpeta uploads ya existe');
}

}

app.listen( process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
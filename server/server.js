require('./config/config');

const express = require('express');

//Coneccion a base de datos mongoose
const mongoose = require('mongoose');

const app = express();

const cors= require('cors');

const bodyParser = require('body-parser')


//Express Permite procesar la informacion y la serializa en objeto json 
//Y para obtener el payload que tiene la peticion post 
//Cada peticion pasa por estas lineas debodyparser


//Permitir uso y acceso a la api desde cualquier lugar
app.use(cors({ origin :'*' , credentials:true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());

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

app.listen( process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
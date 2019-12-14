require('./config/config');

const express = require('express');

//Coneccion a base de datos mongoose
const mongoose = require('mongoose');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

//const cors= require('cors');

const bodyParser = require('body-parser')


//Express Permite procesar la informacion y la serializa en objeto json 
//Y para obtener el payload que tiene la peticion post 
//Cada peticion pasa por estas lineas debodyparser

// const options={
//     origin :'http://localhost:8100' ,
//     credentials:true, 
//     Access-Control-Allow-Origin: '*',
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//    allowedHeaders: 'Content-Type,Authorization'
// }


// Permitir uso y acceso a la api desde cualquier lugar
// app.use(cors( corsOptions ));







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
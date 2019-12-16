//Necesita ejecutar express y app 
const express = require('express');

//Para encriptar strings
const bcrypt = require('bcrypt');

//Para crear y configurar json web tokens
const jwt = require('jsonwebtoken');

//El schema 
const Usuario = require('../models/usuario');

const app = express();

// Permitir uso y acceso a la api desde cualquier lugar
// const cors= require('cors');
// // app.use(cors( { origin:true , credentials:true } ));

// var corsOptions = {
//     origin: '*',
//     methods: ['POST, GET, PUT, DELETE, OPTIONS'],
//     allowedHeaders: ['Origin', 'X-Requested-With', 'contentType', 'Content-Type', 'Accept', 'Authorization'],
//     credentials: true,
//     optionsSuccessStatus: 200
//     }

// app.use( cors(corsOptions) )
// console.log('Cors configurado');


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



app.post('/login', (req, res) =>{

    let body = req.body;

    //De esta forma creamos una busqueda la cual busca un objeto que
    //cumpla con la condicion 
    Usuario.findOne({ email: body.email } , (err, usuarioDB) =>{

        //Asi atrapamos una excepcion desde el servidor
        if(err){
            return res.status(500).json({
                 ok: false,
                 err
             });
         }

         //ASi controlamos el error si no existe el email en la ND
         if( !usuarioDB){

             return res.status(400).json({
                ok:false,
                err: {
                    message:'USUARIO o contraseña incorrecto'
                }

             });
           
         }

        //Asi encriptamos la contraseña obtenida del payload y la comparamos
        //Con una contra de la BD
        if( bcrypt.compareSync( body.password , usuarioDB.password ) === false ){

            return res.status(400).json({
                ok:false,
                err: {
                    message:'usuario o CONTRASEñA incorrecto'
                }

             });


        }

        let token= jwt.sign({
            //Asi le enviamos como payload todo el usuario, al token
            usuario: usuarioDB
            //Asi el token expira en 30 dias , se establece en config.js
        }, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN} );
        
        //Esto retornamos si hace match la contrasena
        res.json({
         ok: true,
         usuario: usuarioDB,
         token  

        });

    });

    
});


module.exports= app;
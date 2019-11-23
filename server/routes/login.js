//Necesita ejecutar express y app 
const express = require('express');

//Para encriptar strings
const bcrypt = require('bcrypt');

//Para crear y configurar json web tokens
const jwt = require('jsonwebtoken');

//El schema 
const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) =>{

    let body= req.body;

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
        if( !bcrypt.compareSync( body.password, usuarioDB.password ) ){

            return res.status(400).json({
                ok:false,
                err: {
                    message:'usuario o CONTRASEñA incorrecto'
                }

             });


        }

        let token= jwt.sign({
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
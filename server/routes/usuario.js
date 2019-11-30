
//Necesita ejecutar express y app 
const express = require('express');

//Para encriptar strings
const bcrypt = require('bcrypt');

//Para bloquear una propiedad de los puts y no se actualice
const _= require('underscore');

//El schema para mongoose
const Usuario = require('../models/usuario');

//Middleware
const { verificarToken, verificarRolAdmin } = require('../middlewares/autenticacion');

const app = express();


//ASi podemos retornar cierta cantidad de objetos de la Base de datos desde/
//Cierto numero de objeto, desde el http get
//http://localhost:3000/usuario?limite=3&desde=0
app.get('/usuario', verificarToken ,  (req, res) => {

//De esta forma obtenemos el payload que tenga el middleware del verificarToken
//Tambien de esta forma sabemos quien hizo la peticion   
//return res.json({
       // usuario: req.usuario,
        //nombre: req.usuario.nombre,
       // email: req.usuario.email
    //});

    //Asi definimos en que numero de objeto empezar
    let desde= req.query.desde || 0;
    desde= Number(desde);

    //Asi definimos la cantidad de objetos a regresar en base al desde
    let limite= req.query.limite || 5;
    limite = Number(limite);


    //Para buscar en la coleccion con condicion o criterio establecido 
    //Usuario.find({ google: true, estado: false } )

    //Asi para buscar en TOOS los documentos de la condicion 
    //En el segundo parametro se especifica que propiedades va a mostrar la busqueda
    Usuario.find({ estado: true },'nombre email role estado google img' )
    //Metodo para saltar objetos
    .skip(desde)
    //Metodo para obtener la cantidad definida de objetos
    .limit(limite)
    .exec( (err, usuarios) =>{

        if(err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }

         // Contar los documentos con condicion o criterio establecido         
        //Usuario.countDocuments({ google:true }, (err, cantidad) =>{

         //De esta forma contamos los documentos que tiene una coleccion en mongoose
        Usuario.countDocuments({ estado: true }, (err, uActivos) =>{

            //ASi retornamos la respuesta para la api
            res.json({
                ok:true,
                usuarios,
                uActivos,
                //Data del payload del middlware
                quien: req.usuario.nombre,
                hizo: req.usuario.email
            });

        });

            

         
        

    });

});

//Crear usuario en la base de datos

app.post('/usuario', [verificarToken, verificarRolAdmin], (req, res) => {

let body= req.body;

//Asi creamnos un objeto con esas propiedades y campos para mongoose
let usuario= new Usuario({
nombre: body.nombre,
email: body.email,
//Asi encriptamos la constraseña del usario, strings 
password: bcrypt.hashSync(body.password, 10), 
role: body.role
});


//PARA GUARDAR EN LA BASE DE DATOS
//Asi capturamos el error
usuario.save( ( err, usuariosDB) => {
    if(err){
       return res.status(400).json({
            ok: false,
            err
        });
    }

    //Asi retornamos el usuario creado correctamente
    res.json({
        ok:true,
        usuario: usuariosDB
    });

});


});



app.put('/usuario/:id', verificarToken , (req, res) => {

    txt='data cualquiera dog';
    let id= req.params.id;

    //Para especificar que proopiedades SI pueden modificarse con put
    let body= _.pick( req.body, ['nombre','img','role','estado']);

    Usuario.findByIdAndUpdate(id, body, { new : true, runValidators:true }, (err, usuarioDB ) =>{

        if(err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }

         //Esto es lo que retornara usando la api 
    res.json({
        ok:true,
       usuario: usuarioDB,
        txt
    });


    });

    

});


//Para borrar documentos de mongoose fisicamente
app.delete('/usuario/:id', verificarToken, (req, res)=>{
    
    let id= req.params.id;

    //De esta forma creamos un cuerpo para cambiar alguna propiedad de un documento
    //en la base de datos
    let cuerpoCambio={
        estado:false
    };

    //ASi actualzamos una propiedad de un objeto de la base de datos
    Usuario.findByIdAndUpdate(id, cuerpoCambio , { new : true }, (err, usuarioDB ) =>{

        if(err){
            return res.status(400).json({
                 ok: false,
                 err
             });
         }

         //Esto es lo que retornara usando la api 
    res.json({
        ok:true,
       usuario: usuarioDB,
       quien: req.usuario.nombre
    });


    });

    

});

//Asi exportamos el archivo app, con las rutas
module.exports = app;

//Necesita ejecutar express y app 
const express = require('express');


//Para bloquear una propiedad de los puts y no se actualice
const _= require('underscore');

//modelo
const Categoria = require('../models/categoria');

//Middleware
const { verificarToken, verificarRolAdmin } = require('../middlewares/autenticacion');

const app = express();


app.get('/categoria', verificarToken, ( req, res ) =>{

Categoria.find({ estado:true })
//Asi ordenamos la busqueda en forma ascendente
.sort('nombre')
//Revisa el id o de la coleccion que estoy buscando
//quien es una propiedad que tiene la referencia de la coleccion Usuarios
.populate('quien', 'nombre email')
.exec( (err, categorias) =>{

    if(err){
       return res.status(500).json({
            ok:false,
            message: err
        });
    }

    Categoria.countDocuments({ estado:true }, (err, cActivos) =>{
console.log('Tafak bro');
        res.json({
            categorias,
            nmCategorias: cActivos
        });


    });
    


});

});


app.get('/categoria/:id', verificarToken , (req, res) =>{

    //El .params sirve para tomar el valor que venga por el url
    let id= req.params.id;

    Categoria.findById(id, (err, categoria) =>{

        if(err){
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        if(!categoria){
            return res.json({
                ok:true,
                message:'La categoria no existe'
            });
        }


        res.json({
            ok:true,
            categoria
        });

    });


});

app.post('/categoria',[ verificarToken, verificarRolAdmin], (req, res) => {
 
    let body= req.body;
    

    //Asi creamnos un objeto con esas propiedades y campos para mongoose
let categoria= new Categoria({
    
    nombre: body.nombre,
    cantidad: body.cantidad,
    tipo: body.tipo,

    //De esta forma _ guardamos el id que nos da el middleware del token
    quien: req.usuario._id
    });

//PARA GUARDAR EN LA BASE DE DATOS
//Asi capturamos el error
categoria.save( ( err, categoria) => {
    if(err){
       return res.status(400).json({
            ok: false,
            err
        });
    }

    //Asi retornamos la categoria creado correctamente y quien la subio
    res.json({
        ok:true,
        categoria: categoria
    });

});



});

app.delete('/categoria/:id',[verificarToken, verificarRolAdmin], (req, res) =>{

    

    let id= req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) =>{

        if(err){
            return res.status(400).json({
                ok: false,
                message: err
            });
        }


        res.json({
            ok:true,
            categoria,
            message:'La categoria fue borrada'
        });

    });

});

app.put('/categoria/:id', verificarToken , (req, res) =>{

    let id= req.params.id;

    //Para especificar que proopiedades SI pueden modificarse con put
    let body= _.pick( req.body, ['cantidad','estado']);

    Categoria.findByIdAndUpdate(id,body, { new: true, runValidators: true }, (err, categoria) =>{

        if(err){
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        if(!categoria){
            return res.status(400).json({
                ok: false,
                message: 'La categoria no existe'
            });
        }


        res.json({
            ok:true,
            categoria: categoria,
            seActualizo:' correctamente'
        });

    });

});

module.exports =app;


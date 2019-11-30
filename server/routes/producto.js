const express= require('express');

const { verificarToken}= require('../middlewares/autenticacion');

const Producto = require('../models/producto');





const app = express();

console.log('nmssss');

app.get('/productos/buscar/:termino', verificarToken, (req, res) =>{

    let termino= req.params.termino;

    //Asi creamos una expresion regular, para busqueda flexible
    //La i es para que ingore las mayusculas
    let regex= new RegExp(termino, 'i');

Producto.find({ nombre: regex })
.populate('categoria', 'nombre')
.exec( (err, productos) =>{

   

    if(err){
        return res.status(500).json({
             ok: false,
             err
         });
     }

    res.json({
        ok:true,
        productos
    });

});

});

app.get('/producto',verificarToken, ( req, res ) =>{

    let desde= req.query.desde;
    let limite= req.query.limite;
    desde= Number(desde);
    limite= Number(limite);
    


    Producto.find({ disponible:true })
    .skip( desde || 0)
    .limit(limite || 5)
    //Asi rellenamos espacios de una propiedad con datos de otra coleccion
    .populate('usuario','nombre email')
    .exec( (err, productos) =>{

        if(err){
            return res.status(500).json({
                 ok: false,
                 err
             });
         }

         res.json({
             ok:true,
             productos
         });
    });



});

app.get('/producto/:id', verificarToken , (req, res) =>{
let id= req.params.id;

Producto.findById(id, (err, producto) =>{

    if(err){
        return res.status(400).json({
             ok: false,
             err
         });
     }

     if(!producto){
         return res.json({
             ok:true,
             message:'El producto no existe'
         });
     }

     res.json({
         ok:true,
         producto: producto
     });

    
});


});

app.post('/producto', verificarToken ,(req, res) =>{

let body= req.body;

let producto = new Producto({
    nombre: body.nombre,
    codigo :body.codigo,
    precio:body.precio ,
    marca:body.marca,
    usuario: req.usuario._id,
    categoria:body.categoria,
    disponible:body.disponible,
    descripcion:body.descripcion,

    
});


producto.save( (err, producto)=>{

    if(err){
        return res.status(400).json({
             ok: false,
             err
         });
     }
 
     //Asi retornamos la categoria creado correctamente y quien la subio
     res.json({
         ok:true,
         producto: producto
     });
});


});

app.put('/producto/:id',verificarToken, (req, res) =>{

    let id= req.params.id;

    

    let cambios={
        nombre: req.body.nombre,
        precio: req.body.precio,
        categoria: req.body.categoria,
        disponible: req.body.disponible,
        descripcion: req.body.descripcion

    }

    Producto.findByIdAndUpdate(id, cambios,{ new:true} ,( err, producto)=>{

        if(err){
            if(err){
                return res.status(500).json({
                     ok: false,
                     err
                 });
             }
        }

        if(!producto){
            return res.json({
                ok:true,
                message:'El producto no existe'
            });
        }

        res.json({
            ok:true,
            producto
        });

    } );

});


app.delete('/producto/:id',verificarToken, (req, res) =>{

let id= req.params.id;



Producto.findByIdAndUpdate(id, {disponible: false} ,{ new: true}, (err, producto) =>{

    if(err){
        return res.status(400).json({
            ok: false,
            err
        });
    }

    if(!producto){
        return res.json({
            ok:true,
            message:'El producto no existe'
        });
    }

    res.json({
        ok:true,
        producto,
        mensaje:'Producto borrado'
    });

});


});






module.exports= app;
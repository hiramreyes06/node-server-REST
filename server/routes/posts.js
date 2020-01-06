//Necesita ejecutar express y app 
const express = require('express');

const { verificarToken, verificarRolAdmin } = require('../middlewares/autenticacion');

const Posts= require('../models/posts')

const app = express();


app.post('/post',[verificarToken], (req,res)=>{

let body=req.body;

let userId=req.usuario._id;

let post= new Posts({
    fecha: body.fecha,
    texto: body.texto,
    imgs:['eje1','eje2','eje3'],
    coords: body.coords,
    usuario: userId
});

post.save( (err, post) =>{

    if(err){
        res.status(400).json({
            ok:false,
            err
        });
    }

    res.json({
        ok:true,
        post
    });

});


} );

app.get('/posts',[verificarToken], (req, res)=>{

    let pagina= Number(req.query.pagina) || 1;
    let desde= pagina -1;

    desde= desde *10;

    Posts.find({})
    .skip(desde)
    .limit(10)
    .populate('usuario','nombre email')
    .exec( (err,posts)=>{

        if(err){

           return res.status(400).json({
                ok:false,
                err
            });
        }
        

        res.json({
            posts,
           pagina
            });
            
    
    } 
       
    );

   

    


});


//Asi exportamos el archivo app, con las rutas
module.exports = app;
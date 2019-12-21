const express = require('express');

const fileUpload = require('express-fileupload');

const app= express();

const Usuario= require('../models/usuario')
const Producto= require('../models/producto')

//Para verificar si es la misma imagen del usuario
const fs= require('fs');
const path= require('path');

//Opciones por default
app.use(fileUpload({ useTempFiles: true }) );

//Es del tipo put para poder ubicar una respectiva carpeta
app.put('/upload/:tipo/:id', (req,res) =>{

    let tipo= req.params.tipo;
    let id= req.params.id;


    if(!req.files){
        return res.status(400).json({
            ok:true,
            message:'No se ha seleccionado ningun archivo'
        });
    }

    //Validar tipo por medio de params url
    //Deben tener el mismo nombre que en las carpetas de uploads
    let tiposValidos=['productos','usuarios'];

    //Asi validamos el tipo mandado por url
    if(tiposValidos.indexOf( tipo) <0){
       return res.status(400).json({
            ok:false,
            err:{
                message:'El tipo del archivo es invalido, solo: '+ tiposValidos.join(', ')
            }
        });
    }

    //Asi le asignamos un nombre al input '.archivo', se usa en la peticion http
    let archivo= req.files.archivo;

    //obtener nombre y extension del archivo
    let datosArchivo= archivo.name.split('.');

    //console.log(datosArchivo[0]+'.'+ datosArchivo[1]);

    let extension = datosArchivo[ datosArchivo.length -1];

    //Establecer extensiones permitidas
    let extensionesValidas=['png','jpg','gif','jpeg'];

//Asi verificamos la extension con las validas
    if(extensionesValidas.indexOf(extension) <0 ){

        return res.status(400).json({
            ok:true,
            message:'Tipo de archivo no admitido solo:' + extensionesValidas.join(', ')
        });
    }

    //Asi creamos una estructura para el nombre de las fotos 
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;

    //Asi se almacena el archivo con un path en un directorio
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err)=> {

        if (err){
            return res.status(500).json({
                ok:false,
                error: err
            });

        }
          
        if(tipo === tiposValidos[0] ){

            imagenProducto(id, res, nombreArchivo);

        }else{
            imagenUsuario(id, res, nombreArchivo);
        }
          //Asi actualizamos la propiedad img del usuario
          
    
        // res.json({
        //     ok:true,
        //     message:`${datosArchivo[0]+'.'+ datosArchivo[1]} Se subio correctamente`
        // });
      });


});

//Asi actualizamos la propiedad img del usuario
function imagenUsuario (id, res, nombreArchivo){

Usuario.findById(id, (err, usuario) =>{

    if (err){

         //Tenemos que borrar la foto, por que se sube primero
        borrarFoto(nombreArchivo,'usuarios')
          return res.status(500).json({
          
              ok:false,
              error: err
          });
    }

          if(!usuario){
            //Tenemos que borrar la foto, por que se sube primero  
            borrarFoto(nombreArchivo,'usuarios')
            return res.status(500).json({
                ok:false,
                error: 'El usuario no existe'
            });
          }

          //De esta forma actualizamos una foto de la carpeta uploads
          borrarFoto(usuario.img,'usuarios');
          

        usuario.img= nombreArchivo;
        usuario.save( (err, usuario) =>{
            res.json({
                ok:true,
                usuario,
                img: nombreArchivo +' fue actualizada'
    
            });


        });

         

});

}



function imagenProducto (id, res, nombreArchivo){

Producto.findById(id , (err, producto) =>{

if(err){

    borrarFoto(producto.img,'productos');

    return res.status(500).json({    
        ok:false,
        err
    });
}

else if(!producto){

    borrarFoto(producto.img,'productos');

    return res.status(500).json({    
        ok:false,
        err:'El producto no existe'
    });
}

else{

    borrarFoto(producto.img,'productos');
    producto.img= nombreArchivo;
    producto.save( (err, producto) =>{


        return res.json({
            ok:true,
            producto,
            img: nombreArchivo +' fue actualizada'
        });
    });

}


});


}

//Asi verificamos que el usuario solo pueda actualizar su foto y borrar las anteriores
function borrarFoto(nombreImg, tipo){

    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImg}`);

          if(fs.existsSync(pathImagen)){
              fs.unlinkSync(pathImagen);
          }

}

// BLOQUEADO PARA PROBAR OTRO METODO CON IONIC
//module.exports= app;
//Necesita ejecutar express y app 
const express = require('express');

const uniqid= require('uniqid');

//Middleware
const { verificarToken, verificarRolAdmin } = require('../middlewares/autenticacion');

const fs = require('fs')

const path = require('path');

const urlUploads = path.resolve(__dirname,'../../uploads');

const Posts= require('../models/posts')

const app = express();

app.get('/imagen/:img',[verificarToken], (req, res)=>{

const userID= req.usuario._id;
const img=req.params.img

if(fs.existsSync(`${urlUploads}/${userID}/posts/${img}`) ){

res.sendFile(`${urlUploads}/${userID}/posts/${img}`);


}else{
    return res.status(404).json({
        ok:false,
        message:'La imagen no fue encontrada'
    })
}

} );

app.post('/post',[ verificarToken] ,(req,res)=>{

    //faltaria atrapar los request de cada propiedad

 const userId=req.usuario._id;   
 
 //Debe ser igual al que tenga la pripiedad en el modelo
 const imgs= tempToPosts(userId);

let post= new Posts({
 fecha: new Date().toISOString(),
 texto:'Texto de hardcore',   
imgs:imgs,
cords:'444,98498.89464,644',
usuario: userId

});

post.save( (err, post)=>{

    if(err){
       return res.status(400).json({
           ok:false,
           err
       });
    }


    res.json({
        ok:true,
        imgs,
        userid:userId
   
    });

} );

 


} );

//El async es para la funcion mover arch a tempo que regresa una promesa
app.post('/archivos', [verificarToken], async(req, res)=>{



if( !req.files ){
    return res.status(400).json({
        ok:false,
        mensaje:'No se subio ningun archivo'
    });
}
                        //El ultimo significa el nombre de la propieddad
const file= req.files.image;

if( !file ){
    return res.status(400).json({
        ok:false,
        mensaje:'No se subio ningun archivo - image'
    });
}

//Asi validamos lo que tenga el mimetype
if( ! file.mimetype.includes('image') ){
    return res.status(400).json({
        ok:false,
        mensaje:'Solo imagenes - image'
    });
}


//Tenemos que agregarle el awit para que espere la promesa resuelta
await guardarArchTemporal(file, req.usuario._id);


console.log(req.usuario._id);

res.json({
    ok:true,
    archivo: file.mimetype
})

} );


//Crear una interface para typescript
// export interface FileUpload{
//     name:string;
//     data:String;
//     encoding:String;
//     tempFilePath:String;
//     truncated: Boolean;
//     mimetype:String;
// }

function tempToPosts( userId ){

    if(! fs.existsSync(`${urlUploads}/${userId}/temp`) ) {
        //Esto regresa un arreglo vacio por que no existe la carpeta
        return [];
    }

    //Nombre de todas las img en /temp
    const tempImagenes= getTempImagenes(userId);

    tempImagenes.forEach( imagen =>{
        //Asi movemos todos los archivos de temp a posts
        fs.renameSync(`${urlUploads}/${userId}/temp/${imagen}`,
        `${urlUploads}/${userId}/posts/${imagen}`);
    });

    //Se retorna una coleccion con los nombres de las imagenes
    return tempImagenes;

}

function getTempImagenes( userId ) {

    //Esto retorna un arreglo con todos los nombres que tenga temp
    return fs.readdirSync(`${urlUploads}/${userId}/temp`) || [];
    
}


 function  guardarArchTemporal (file, userId){

    //
    return new Promise( (resolve, reject) =>{

        //Esto guarda el path de la carpeta unica del usuario
        const userPath=usuarioCarpeta(userId);

        console.log('Ya esta la careta del usuario: ', userPath);

        const idUnico=crearIdUnico(file.name);
    console.log('Nombre original: '+file);
    console.log('Nombre unico del arch', idUnico);

    file.mv(`${userPath}/temp/${idUnico}`, err=>{

        if(err){
            reject(err);
        }
        
        resolve();

    });

    });

    


}

function usuarioCarpeta(userId ){

    const userDir= path.resolve(urlUploads+'/'+userId);
    

    console.log('Nuevo', userDir);
    

    if(! fs.existsSync(userDir) ){

        fs.mkdirSync(urlUploads+`/${userId}`);
        fs.mkdirSync(urlUploads+`/${userId}`+'/temp');
        fs.mkdirSync(urlUploads+`/${userId}`+'/posts');
        console.log('Carpetas creadas');
        return userDir;

    }else{
        console.log('La carpeta del usuario ya existe');
        return userDir;
    }

}

function crearIdUnico(nombreOriginal){

const datosArch=nombreOriginal.split('.');

//Asi creamos un id unico con la libreria
const idUnico= uniqid();
return `${idUnico}.${datosArch[datosArch.length-1]}`


}



//Asi exportamos el archivo app, con las rutas
module.exports = app;
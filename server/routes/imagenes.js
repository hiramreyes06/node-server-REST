
const express= require('express');

const fs= require( 'fs');

const path= require('path');

const {verificarTokenImg}= require('../middlewares/autenticacion');

let app= express();

//Es recomendable enviar el token por el url ya que si la imagen no lo valida
//cualquier persona que tenga el url completo podra acceder a al archivo
app.get('/imagen/:tipo/:img', verificarTokenImg , (req,res) =>{

    let tipo= req.params.tipo;
    let img= req.params.img;

    

    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);


    if(fs.existsSync(pathImagen)){

        res.sendFile(pathImagen);

    }else{

       //La carpeta assets puede contener archivos que estaran staticos en el servidor
    //La carpeta assets esta protegida 
    //El path ocupa ser absoluto par ala funcion sendFile
    let noImgPath= path.resolve(__dirname,'../assets/no-image.jpg')

    //Para retornar una imagen 
    //send file lee el archivo y retorna el mismo tipo de archivo
    res.sendFile(noImgPath);
    }

    
});

module.exports= app;
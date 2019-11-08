require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser')


//Express Permite procesar la informacion y la serializa en objeto json 
//Y para obtener el payload que tiene la peticion post 
//Cada peticion pasa por estas lineas debodyparser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function (req, res) {
    res.json('Get usuario');

});

app.post('/usuario', function (req, res) {

let body= req.body;

//De esta forma , retornamos algun error atrapado
if(body.nombre === undefined ){
    //Existen varios codigos de respuestas http ya establecidos
    res.status(400).json({
        ok:false,
        mensaje:'El nombre es necesario'
    });
}else{

    //Retorna lo que viene en el payload
    res.json({
        estructura:body
    });

}



});

app.put('/usuario/:id', function (req, res) {

    txt='data cualquiera dog'
    let id= req.params.id;

    //Esto es lo que retorara usando la api 
    res.json({
        id,
        txt
    });

});

app.delete('/usuario', function (req, res) {
    res.json('Delete usuario');

});

app.listen( process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
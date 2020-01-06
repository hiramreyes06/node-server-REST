//De esta forma definimos todas las rutas que ocupamos de forma global
//para que sean utilizadas desde el server.js

//ASi iniciamos expres
const express = require('express');

const app = express();



//De esta forma usamos las rutas que tenga el archivo usuario.js
app.use(require('./usuario' ) );


app.use(require('./categorias'));

app.use(require('./login' ) );

app.use(require('./producto'));

//BLOQUEADO PARA PROBAR OTRA MANERTA CON IONIC
//app.use(require('./upload'));

app.use(require('./archivos'));

app.use(require('./posts'));

app.use(require('./imagenes'));


module.exports= app;

//De esta forma definimos todas las rutas que ocupamos de forma global
//para que sean utilizadas desde el server.js

//ASi iniciamos expres
const express = require('express');

const app = express();



//De esta forma usamos las rutas que tenga el archivo usuario.js
app.use(require('./usuario' ) );

app.use(require('./login' ) );

module.exports= app;

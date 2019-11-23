//PUERTO

//De esta forma configuramos el servidor para modo desarrollo o modo produccion
//es un objeto global que se ejecuta siempre en node.js actualizado dependeiento del environment -entrorno
process.env.PORT = process.env.PORT || 3000;

//Elegir el entorno o puerto
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Vencimiento del token
//60 segundos
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//Seed para jwt
process.env.SEED = process.env.SEED || 'esta-es-la-seed-de-desarrollo';


//PARA PODER CORRER EN MODO PRODUCCION Y EN MODO DESARROLLO
let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB= 'mongodb://localhost:27017/cafe';
}else{
    //Asi agregamos el link con el que se va a conectar mongoose
    urlDB= process.env.MONGO_URI;
}

//Asi creamos una variable para en desarrollo con el links
process.env.URLDB= urlDB;





//
//
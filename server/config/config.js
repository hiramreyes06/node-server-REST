//PUERTO

//De esta forma configuramos el servidor para modo desarrollo o modo produccion
//es un objeto global que se ejecuta siempre en node.js actualizado dependeiento del environment -entrorno
process.env.PORT = process.env.PORT || 3000;
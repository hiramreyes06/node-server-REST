
const jwt = require('jsonwebtoken');


//Verificar token

//Asi para crear un middleware
let verificarToken= ( req, res, next ) =>{

let token= req.get('token');

//De esta forma evualuamos el token en base a la seed que este en el 
//entorno de heroku y regresa el payload desifrado
jwt.verify( token, process.env.SEED, (err, decoded) =>{

    if( err ){
        return res.status(401).json({
            ok:false,
            err:{
                message:'Token no valido'
            }
        });
    }

    //Asi guardamos lo que venga en el payload, y donde se usa 
    req.usuario= decoded.usuario;

    //Asi terminamos el proceso del middleware, OBLIGATORIO
    next();

});

//console.log(token);

};

//ASi verficamos alguna propiedad del usuario con un middleware
let verificarRol = (req,res,next)=>{

let usuario= req.usuario;

if( usuario.role === 'ADMIN_ROLE') {
    //El next significa que el middlware aprovo la validacion, 
    //necesario para continuar
next();

}else{

    return res.json({
        ok:false,
        err:{
            message:'Solo pueden los administradores '
        }
    });

}
    




};


module.exports= {verificarToken, verificarRol };
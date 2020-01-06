const mongoose= require('mongoose');

let Schema = mongoose.Schema;

 const postsSchema = new Schema({
     fecha:{
         type:Date
     },
     texto:{
         type:String
     },
     imgs:[{
        type:String
     }],
     coords:{
         type:String
     },
     usuario:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'Usuario',
         required:[true,'Datos del usuario necesarios']
         //Que pedo raza
        
     }

 });

//Esto guarda y identifica el id generado por mongo,en el type:
 //





module.exports= mongoose.model('Posts', postsSchema);
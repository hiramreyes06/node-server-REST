const mongoose= require('mongoose');

 const postsSchema = new mongoose.Schema({
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
     }

 });






module.exports= mongoose.model('Posts', postsSchema);
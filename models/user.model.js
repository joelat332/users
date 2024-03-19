const { string } = require('joi');
const mongoose= require('mongoose');

const userSchema= mongoose.Schema(
    {
       username:{
        type : String,        
        unique:true,
        required:[true]
       },
       id:{
        type : Number,
        unique:true,
        required:[true]
       },
       password:{
        type : String,
        required:[true]
       },
       Permission:[{
        type:String
    }]
},{ timestamps: true }
)

const User=mongoose.model('User',userSchema);

module.exports=User;
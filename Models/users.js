const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new Schema({

name:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
phoneNo:{
    type:Number
},
otp:{
    type:Number
},
token:{
 type:String
},
isDeleted : {
    type:Boolean,
    default:false
},
createdAt : {
    type : Date,
    default:  new Date()
},
updatedAt : {
    type : Date,
    default : new Date()
},
isVerified : {
    type : Boolean,
    default : false
}

});

module.exports = mongoose.model('users',users);
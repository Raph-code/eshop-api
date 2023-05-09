const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    },
    passwordHash: {
        type:String,
        required:true,
    },
    phone: {
        type:String,
        requred:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    street: {
        type: String,
        default:'',
    },
    apartment: {
        type:String,
        default:'',
    },
    Zip: {
        type:String,
        default:'',
    },
    city: {
        type: String,
        default:'',
    },
    country: {
        type:String,
        default:'',
    }

})
const User = mongoose.model('User',userSchema);

module.exports = {
    User

}
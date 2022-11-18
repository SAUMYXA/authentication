const mongooose = require('mongoose');

const userSchema = new mongooose.Schema({
    username: {
        type: String,
        required:true,
        unique:true
    },
    email: {
         type: String,
        required:true,
        unique:true
    },
    mobile: {
        type: Number,
        required:true,
        unique:true
    },
    
    password: {
         type: String,
        required:true
    },
    cpassword: {
         type: String,
        required:true
    },
    rollno: {
        type: Number,
        required:true,
        unique:true
    },
    year: {
        type: Number,
        required:true
    },
    branch: {
        type: String,
        required:true
    },
    gender: {
        type: String,
       required:true
   },
    

})

const User = mongooose.model('USER', userSchema);

module.exports = User;
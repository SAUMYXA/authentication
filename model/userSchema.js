// const mongooose = require('mongoose');

// const userSchema = new mongooose.Schema({
//     username: {
//         type: String,
//         required:true,
//         unique:true
//     },
//     email: {
//          type: String,
//         required:true,

//     },
//     mobile: {
//         type: Number,
//         required:true
//     },

//     password: {
//          type: String,
//         required:true
//     },
//     cpassword: {
//          type: String,
//         required:true
//     },
//     rollno: {
//         type: Number,
//         required:true,
//         unique:true
//     },
//     year: {
//         type: Number,
//         required:true
//     },
//     branch: {
//         type: String,
//         required:true
//     },
//     gender: {
//         type: String,
//        required:true
//    },

// })

// const User = mongooose.model('USER', userSchema);

// module.exports = User;
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("username is not Valid");
      }
    },
  },
  rollnum: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  phone: {
    type: Number,
    min: 10,
    unique: true,
    required: true,
  },
  
  year: {
    type: Number,
    required: true,
    min: 1,
    max:4,
  },
  branch: {
    type: String,
    required: true,
  },
  gen: { type: String, required: true },
  confirmpassword: {
    type: String,
    required: true,
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  originalpassword: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

/// generate token
UserSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.JWT_SECRET
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();

    const userverify = await jwt.verify(token, process.env.JWT_SECRET);
    const token_obj = {
      id: userverify,
      token: token,
    };
    return token_obj;
  } catch (err) {
    res.send(err);
  }
};

// authenticate password
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.confirmpassword = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});
const User = new mongoose.model("User", UserSchema);
module.exports = User;

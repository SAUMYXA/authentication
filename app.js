//  dotenv = require("dotenv");
// const express = require("express");
// const mongoose = require("mongoose");
// const app = express();
// const
// dotenv.config({ path: "./config.env" });
// require("./db/conn");

// app.use(express.json());

// // const User = require("./model/userSchema");

// app.use(require('./model/userSchema'))

// // const DB =
// //   "mongodb+srv://saumyxa:auth@cluster0.cydzejp.mongodb.net/mernstack?retryWrites=true&w=majority";

// // mongoose
// //   .connect(DB, {
// //     useNewUrlParser: true,
// //     useCreateIndex: true,
// //     useUnifiedTopology: true,
// //     useFindAndModify: false,
// //   })
// //   .then(() => {
// //     console.log("connection successful");
// //   })
// //   .catch((err) =>{ console.log("no connection")});

// // const DB=   "mongodb+srv://saumyxa:root@cluster0.qpakkuq.mongodb.net/?retryWrites=true&w=majority";

// // mongoose.connect(DB
// // ,{ useNewUrlParser: true,
// //       useCreateIndex: true,
// //        useUnifiedTopology: true,
// //         useFindAndModify: false,
// // });

// //   mongoose.connection.on("error", (err) => {
// //     console.log("connection failed");
// //   });

// //   mongoose.connection.on("connected", (err) => {
// //     console.log("connected with database");
// //   });
// // const DB = process.env.DATABASE;
// const PORT = process.env.PORT;

// // mongoose.connect(DB);
// // mongoose.connection.on("error", (err) => {
// //   console.log("connection failed");
// // });

// // mongoose.connection.on("connected", (err) => {
// //   console.log("connected with database");
// // });

// //middleware

// const middleware = (req, res, next) => {
//   console.log("hello from middleware");
// };
// middleware();

// app.get("/", (req, res) => {
//   res.send("hello");
// });

// app.get("/signin", (req, res) => {
//   res.send("hello");
// });

// app.get("/signup", (req, res) => {
//   res.send("hello");
// });

// app.get("/about", middleware, (req, res) => {
//   res.send("hello");
// });

// app.listen(PORT, () => {
//   console.log("server is running");
// });

//

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("./db/conn");
const User = require("./model/userSchema");
const auth = require("./router/auth");
const nodemailer = require("nodemailer");

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());


app.use(cors());
app.use((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  
})

app.get("/register", async (req, res) => {
  try {
    const Usersdata = await User.find();
    res.send(Usersdata);
  } catch (e) {
    res.send(e);
  }
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    const otp_random = Math.floor(1000 + Math.random() * 9000);
    const checkpassword =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (checkpassword.test(password)) {
      if (password === confirmpassword) {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          rollnum: req.body.rollnum,
          password: password,
          phone: req.body.phone,
          year: req.body.year,
          branch: req.body.branch,
          gen: req.body.gen,
          confirmpassword: confirmpassword,
          isverified: false,
          otp: otp_random,
          resetpassword: password,
        });
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "saumya2113061@akgec.ac.in",
            pass: "qsaqrwepjlvbeqyy",
          },
        });
        const eeeeemail = req.body.email;
        const mailOptions = {
          from: "saumya2113061@akgec.ac.in",
          to: eeeeemail,
          subject: "VERIFY YOUR EMAIL",
          text: "OTP is\n" + otp_random,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("OTP has been sent");
          }
        });
        const creatUser = await newUser.save();
        res.status(201).send({
          _id: creatUser._id,
          email: creatUser.email,
          phone: creatUser.phone,
          rollnum: creatUser.rollnum,
          branch: creatUser.branch,
          year: creatUser.year,
          gen: creatUser.gen,
          otp: creatUser.otp,
        });
      } else {
        res.send("password are not matching");
      }
    } else {
      res.send("password formate is not correct");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await User.findOne({ email: email });
    if (!useremail) {
      return res.status.send("Email or password is not valid");
    }

    const matchPassword = await bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();

    //  //add cookie
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 800000),
      httpOnly: true,
    });
    if (!matchPassword) {
      //     return    res.status(400).json({error: "Incorrect Credentials of your password "});

      // } else {

      //        res.send({ "User signed in successfully"});
      //      }
      //   }

      //   catch (err) {
      //      console.log(err);
      //  }
      //  });
      return res.status(201).send(token);
      res.send("signed in successfully");
    } else {
      res.send("Wrong password");
    }
  } catch (err) {
    res.status(400).send("Invalid details");
  }
});

// app.post('/login' , async (req , res)=> {
//   try{
//       let token;
//       const { email , password } = req.body;

//       if(!email || !password) {
//           return res.status(400).json({error:"Please fill all the fields"});

//       }

//       const useremail = await User.findOne({ email : email });

//       // console.log(userLogin);

//       if (useremail) {
//           const isMatch = await bcrypt.compare(password , useremail.password);
//           const token  =  await useremail.generateAuthToken();
//           console.log(token);

//           res.cookie("jwtoken" , token , {
//               expires: new Date(Date.now() + 25892000000),
//               httpOnly:true
//           });

//       if (!isMatch) {
//           res.status(400).json({error: "Incorrect Credentials of your password "});

//       } else {

//           res.json({ message: "User signed in successfully"});
//       }
//    } else {
//       res.status(400).json({ error : "Email does not match with each other"});
//    }
//    }

//    catch (err) {
//       console.log(err);
//   }
//   });

//  password forgot 

app.get("/forgotpassword", (req, res, next) => {
  res.send("password forgot ");
});
app.post("/forgotpassword", async (req, res, next) => {
  try {
    // const email = req.body.email;
    const useremail = await User.findOne({ email: req.body.email });
    if (!useremail) {
      return res.status(400).send("Email is not found");
    } else if (useremail) {
      const changepassword = useremail.resetpassword;
      console.log(changepassword);
      const eeemail = req.body.email;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "saumya2113061@akgec.ac.in",
          pass: "qsaqrwepjlvbeqyy",
        },
      });
      const mailOptions = {
        from: "saumya2113061@akgec.ac.in",
        to: eeemail,
        subject: "FORGOT PASSWORD",
        text:
          
          "Your password is  \n" +
          changepassword,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Password sent");
        }
      });
      res
        .status(201)
        .send("Your  password has been sent to your email");
    }
  } catch (err) {
    res.status(400).send("User details are correct");
  }
});

app.post("/otp-send", async (req, res, next) => {
  const useremail = await User.findOne({ email: req.body.email });
  const eeeemail = req.body.email;
  if (useremail) {
    try {
      console.log(useremail.otp);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "saumya2113061@akgec.ac.in",
          pass: "qsaqrwepjlvbeqyy",
        },
      });
      const mailOptions = {
        from: "saumya2113061@akgec.ac.in",
        to: eeeemail,
        subject: "CSI-2nd-year-team-work",
        text:
          "Welcome in CSI-2nd Year....coders\n" +
          "Your new password is below \n" +
          useremail.otp,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("OTP sent");
        }
      });
      res.status(201).send("OTP has been sent to your related email");
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.send("valid email");
  }
});

// if(useremail.otp==otp){
//   res.sent("valid email")
// }else{
//   res.send("Invalid email");

// }
// });

// app.use(cors());

let port = process.env.PORT || 3000;
// if (port == null || port == "") {
//   port = 3000;
// }
app.listen(port, () => {
  console.log("server is running at port 3000");
});

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// const DB =
//   "mongodb+srv://saumyxa:auth@cluster0.cydzejp.mongodb.net/mernstack?retryWrites=true&w=majority";

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   })
//   .then(() => {
//     console.log("connection successful");
//   })
//   .catch((err) =>{ console.log("no connection")});

// const DB=   "mongodb+srv://saumyxa:root@cluster0.qpakkuq.mongodb.net/?retryWrites=true&w=majority";

// mongoose.connect(DB
// ,{ useNewUrlParser: true,
//       useCreateIndex: true,
//        useUnifiedTopology: true,
//         useFindAndModify: false,
// });

//   mongoose.connection.on("error", (err) => {
//     console.log("connection failed");
//   });

//   mongoose.connection.on("connected", (err) => {
//     console.log("connected with database");
//   });

mongoose.connect("mongodb+srv://saumyxa:auth@cluster0.cydzejp.mongodb.net/mernstack?retryWrites=true&w=majority");
mongoose.connection.on("error", (err) => {
    console.log("connection failed");
  });
  
  mongoose.connection.on("connected", (err) => {
    console.log("connected with database");
  });

//middleware

const middleware = (req, res, next) => {
  console.log("hello from middleware");
};
middleware();

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/signin", (req, res) => {
  res.send("hello");
});

app.get("/signup", (req, res) => {
  res.send("hello");
});

app.get("/about", middleware, (req, res) => {
  res.send("hello");
});

app.listen(5000, () => {
  console.log("server is running");
});

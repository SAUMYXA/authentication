const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.connect(DB);
mongoose.connection.on("error", (err) => {
  console.log("connection failed");
});

mongoose.connection.on("connected", (err) => {
  console.log("connected with database");
});

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://saumyxa:root@cluster0.qpakkuq.mongodb.net/?retryWrites=true&w=majority",{
  useNewUrlParser: true,
}).then(()=>{
  console.log("Connection with database is successfully")
}).catch((err)=>{
  console.log("no connection")
})
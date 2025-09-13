const express = require("express");

const app = express();

app.use(express.json());

app.use("/home",(req,res)=>{
    res.send("Hello From Server run on port 3001");
})

app.use("/test",(req,res)=>{
    res.send("Testing on another routes")
})

app.listen(3001,()=>{
    console.log("Server is running on port 3001");
})
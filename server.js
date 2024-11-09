const express = require("express");
const app = express();

app.use(express.json());

app.get("/",(req, res)=>{
    console.log( "basic api request is working");
    return res.status(200).json({ msg : "project is working fine"})
})

app.listen(port, (err)=>{
    if(err)
    {
        console.log("error in project",err);
    }
})
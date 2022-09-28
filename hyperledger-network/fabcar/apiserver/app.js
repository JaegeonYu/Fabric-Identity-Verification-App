const express = require('express')
const app = express();
const routerMain = require('./route')
app.use("/",routerMain);
app.listen(8080, ()=>{
    console.log("app.js server open")
})

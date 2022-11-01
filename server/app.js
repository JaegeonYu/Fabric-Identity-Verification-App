const express = require('express')
const app = express();
const addInfoRouter = require('./routes/addInfo');
const queryFingerRouter = require('./routes/queryFinger');
const uploadRouter = require('./routes/upload');
const queryAuthRouter = require(`./routes/queryAuth`);
const querySchoolAuth = require('./routes/querySchoolAuth');


app.use("/api/addinfo/",addInfoRouter);
app.use("/api/query/",queryFingerRouter);
app.use("/api/upload",uploadRouter);
app.use("/api/queryauth/",queryAuthRouter);
app.use("api/querySchoolAuth",querySchoolAuth);
app.listen(8080, ()=>{
    console.log("app.js server open")
})
